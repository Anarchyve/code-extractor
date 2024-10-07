let fileList = [];  // 선택된 파일을 저장할 배열

function addFolderInput() {
    const folderInput = document.createElement('input');
    folderInput.type = 'file';
    folderInput.webkitdirectory = true;
    folderInput.multiple = true;
    folderInput.addEventListener('change', handleFolderUpload);
    document.getElementById('folder-upload-container').appendChild(folderInput);
}

function addFileInput() {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.multiple = true;
    fileInput.addEventListener('change', handleFileUpload);
    document.getElementById('file-upload-container').appendChild(fileInput);
}

function handleFolderUpload(event) {
    const files = Array.from(event.target.files);
    fileList = fileList.concat(files);
    console.log('폴더에서 선택된 파일:', fileList);
}

function handleFileUpload(event) {
    const files = Array.from(event.target.files);
    fileList = fileList.concat(files);
    console.log('추가 선택된 파일:', fileList);
}

async function combineFiles() {
    if (fileList.length === 0) {
        alert('폴더 또는 파일을 선택하세요!');
        return;
    }

    let combinedContent = '';

    // 파일을 병합하는 작업을 비동기적으로 처리하기 위해 Promise.all을 사용
    const fileReadPromises = fileList.map(file => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = function(event) {
                const fileContent = `\n\n--- ${file.webkitRelativePath || file.name} ---\n${event.target.result}`;
                resolve(fileContent);
            };
            reader.onerror = function() {
                reject(new Error(`Failed to read file: ${file.name}`));
            };
            reader.readAsText(file);
        });
    });

    // 모든 파일의 내용을 읽은 후에 병합
    try {
        const allFileContents = await Promise.all(fileReadPromises);
        combinedContent = allFileContents.join('');
        createDownloadLink(combinedContent);
    } catch (error) {
        console.error('Error reading files:', error);
        alert('파일을 읽는 중 오류가 발생했습니다.');
    }
}

function createDownloadLink(content) {
    const blob = new Blob([content], { type: 'text/plain' });
    const link = document.getElementById('download-link');
    link.href = URL.createObjectURL(blob);
    link.download = 'combined_output.txt';
    link.style.display = 'block';
    link.textContent = '합쳐진 파일 다운로드';
}

// 기본 파일 업로드 이벤트 리스너 추가
document.querySelector('#folder-upload-container input').addEventListener('change', handleFolderUpload);
document.querySelector('#file-upload-container input').addEventListener('change', handleFileUpload);

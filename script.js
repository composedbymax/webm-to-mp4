document.addEventListener('DOMContentLoaded', () => {
    const dropZone = document.getElementById('drop-zone');
    const fileSelector = document.getElementById('file-selector');
    const selectButton = document.getElementById('select-button');
    const convertAllButton = document.getElementById('convert-all-button');
    const clearAllButton = document.getElementById('clear-all-button');
    const errorMessage = document.getElementById('error-message');
    const successMessage = document.getElementById('success-message');
    const fileInfo = document.getElementById('file-info');
    const videosGrid = document.getElementById('videos-grid');
    const batchInfo = document.getElementById('batch-info');
    let selectedFiles = [];
    selectButton.addEventListener('click', () => fileSelector.click());
    fileSelector.addEventListener('change', handleFileSelection);
    convertAllButton.addEventListener('click', convertAllFiles);
    clearAllButton.addEventListener('click', clearAllFiles);
    dropZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropZone.classList.add('highlight');
    });
    dropZone.addEventListener('dragleave', () => {
        dropZone.classList.remove('highlight');
    });
    dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropZone.classList.remove('highlight');
        if (e.dataTransfer.files.length) {
            handleFiles(e.dataTransfer.files);
        }
    });
    function handleFileSelection(e) {
        if (e.target.files.length) {
            handleFiles(e.target.files);
        }
    }
    function handleFiles(files) {
        clearMessages();
        const webmFiles = Array.from(files).filter(file => file.type.includes('webm'));
        if (webmFiles.length === 0) {
            showError('Please select WebM files only.');
            return;
        }
        selectedFiles = [...selectedFiles, ...webmFiles];
        updateBatchInfo();
        renderVideoItems();
        convertAllButton.disabled = selectedFiles.length === 0;
        clearAllButton.disabled = selectedFiles.length === 0;
    }
    function updateBatchInfo() {
        batchInfo.textContent = `${selectedFiles.length} WebM files selected (${formatFileSize(getTotalSize())})`;
    }
    function getTotalSize() {
        return selectedFiles.reduce((total, file) => total + file.size, 0);
    }
    function renderVideoItems() {
        videosGrid.innerHTML = '';
        selectedFiles.forEach((file, index) => {
            const videoItem = createVideoItem(file, index);
            videosGrid.appendChild(videoItem);
        });
    }
    function createVideoItem(file, index) {
        const item = document.createElement('div');
        item.className = 'video-item';
        item.dataset.index = index;
        const title = document.createElement('h3');
        title.textContent = file.name;
        const info = document.createElement('div');
        info.className = 'file-info';
        info.textContent = formatFileSize(file.size);
        const video = document.createElement('video');
        video.className = 'video-preview';
        video.controls = true;
        video.src = URL.createObjectURL(file);
        const status = document.createElement('div');
        status.className = 'video-status';
        const progress = document.createElement('progress');
        progress.className = 'progress-bar';
        progress.value = 0;
        progress.max = 100;
        progress.style.display = 'none';
        const controls = document.createElement('div');
        controls.className = 'video-controls';
        const convertBtn = document.createElement('button');
        convertBtn.textContent = 'Convert';
        convertBtn.addEventListener('click', () => convertFile(index));
        const removeBtn = document.createElement('button');
        removeBtn.textContent = 'Remove';
        removeBtn.addEventListener('click', () => removeFile(index));
        controls.appendChild(convertBtn);
        controls.appendChild(removeBtn);
        item.appendChild(title);
        item.appendChild(info);
        item.appendChild(video);
        item.appendChild(status);
        item.appendChild(progress);
        item.appendChild(controls);
        return item;
    }
    function removeFile(index) {
        selectedFiles.splice(index, 1);
        updateBatchInfo();
        renderVideoItems();
        convertAllButton.disabled = selectedFiles.length === 0;
        clearAllButton.disabled = selectedFiles.length === 0;
        if (selectedFiles.length === 0) {
            showSuccess('All files have been removed.');
        }
    }
    function clearAllFiles() {
        selectedFiles = [];
        videosGrid.innerHTML = '';
        updateBatchInfo();
        convertAllButton.disabled = true;
        clearAllButton.disabled = true;
        showSuccess('All files have been cleared.');
    }
    function convertAllFiles() {
        if (selectedFiles.length === 0) {
            showError('No files to convert.');
            return;
        }
        showSuccess('Starting batch conversion...');
        convertAllButton.disabled = true;
        let currentIndex = 0;
        const processNext = () => {
            if (currentIndex < selectedFiles.length) {
                convertFile(currentIndex, () => {
                    currentIndex++;
                    processNext();
                });
            } else {
                showSuccess('All conversions completed!');
                convertAllButton.disabled = false;
            }
        };
        processNext();
    }
    async function convertFile(index, callback) {
        const file = selectedFiles[index];
        const videoItems = document.querySelectorAll('.video-item');
        const videoItem = videoItems[index];
        if (!videoItem) return;
        const status = videoItem.querySelector('.video-status');
        const progress = videoItem.querySelector('.progress-bar');
        const videoPreview = videoItem.querySelector('.video-preview');
        const convertBtn = videoItem.querySelectorAll('button')[0];
        convertBtn.disabled = true;
        status.textContent = 'Converting...';
        progress.style.display = 'block';
        progress.value = 0;
        try {
            const processingVideo = document.createElement('video');
            processingVideo.className = 'hidden-video';
            processingVideo.muted = true;
            document.body.appendChild(processingVideo);
            const videoBlob = URL.createObjectURL(file);
            processingVideo.src = videoBlob;
            let progressValue = 0;
            const progressInterval = setInterval(() => {
                progressValue += (100 - progressValue) * 0.03;
                progress.value = Math.min(95, progressValue);
            }, 200);
            await new Promise((resolve, reject) => {
                processingVideo.onloadedmetadata = resolve;
                processingVideo.onerror = reject;
            });
            const width = processingVideo.videoWidth;
            const height = processingVideo.videoHeight;
            const canvas = document.createElement('canvas');
            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');
            const stream = canvas.captureStream(30);
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const audioResponse = await fetch(videoBlob);
            const arrayBuffer = await audioResponse.arrayBuffer();
            try {
                const audioBuffer = await audioContext.decodeAudioData(arrayBuffer.slice(0));
                const audioSource = audioContext.createBufferSource();
                audioSource.buffer = audioBuffer;
                const audioDestination = audioContext.createMediaStreamDestination();
                audioSource.connect(audioDestination);
                const audioTracks = audioDestination.stream.getAudioTracks();
                if (audioTracks.length > 0) {
                    stream.addTrack(audioTracks[0]);
                }
                let options = {};
                const mimeTypes = [
                    'video/mp4',
                    'video/webm;codecs=h264',
                    'video/x-matroska;codecs=avc1'
                ];
                for (const type of mimeTypes) {
                    if (MediaRecorder.isTypeSupported(type)) {
                        options = { mimeType: type };
                        break;
                    }
                }
                const mediaRecorder = new MediaRecorder(stream, options);
                const chunks = [];
                mediaRecorder.ondataavailable = (e) => {
                    if (e.data.size > 0) {
                        chunks.push(e.data);
                    }
                };
                mediaRecorder.onstop = () => {
                    clearInterval(progressInterval);
                    progress.value = 100;
                    const outputType = options.mimeType || 'video/mp4';
                    const blob = new Blob(chunks, { type: outputType });
                    const url = URL.createObjectURL(blob);
                    videoPreview.src = url;
                    const downloadBtn = document.createElement('button');
                    downloadBtn.textContent = 'Download MP4';
                    downloadBtn.addEventListener('click', () => {
                        const downloadLink = document.createElement('a');
                        downloadLink.href = url;
                        downloadLink.download = file.name.replace('.webm', '.mp4');
                        downloadLink.click();
                    });
                    const controls = videoItem.querySelector('.video-controls');
                    controls.replaceChild(downloadBtn, convertBtn);
                    status.textContent = 'Conversion complete!';
                    if (audioSource) {
                        audioSource.stop();
                    }
                    if (audioContext && audioContext.state !== 'closed') {
                        audioContext.close();
                    }
                    document.body.removeChild(processingVideo);
                    if (callback) callback();
                };
                mediaRecorder.start(100);
                await processingVideo.play();
                audioSource.start(0);
                const drawFrame = () => {
                    if (processingVideo.ended || processingVideo.paused) {
                        mediaRecorder.stop();
                        return;
                    }
                    ctx.drawImage(processingVideo, 0, 0, canvas.width, canvas.height);
                    requestAnimationFrame(drawFrame);
                };
                drawFrame();
            } catch (audioError) {
                console.error('Audio processing error:', audioError);
                status.textContent += ' (No audio)';
                processVideoWithoutAudio();
            }
            async function processVideoWithoutAudio() {
                const mediaRecorder = new MediaRecorder(stream, { mimeType: 'video/mp4' });
                const chunks = [];
                mediaRecorder.ondataavailable = (e) => {
                    if (e.data.size > 0) {
                        chunks.push(e.data);
                    }
                };
                mediaRecorder.onstop = () => {
                    clearInterval(progressInterval);
                    progress.value = 100;
                    const blob = new Blob(chunks, { type: 'video/mp4' });
                    const url = URL.createObjectURL(blob);
                    videoPreview.src = url;
                    const downloadBtn = document.createElement('button');
                    downloadBtn.textContent = 'Download MP4 (No Audio)';
                    downloadBtn.addEventListener('click', () => {
                        const downloadLink = document.createElement('a');
                        downloadLink.href = url;
                        downloadLink.download = file.name.replace('.webm', '.mp4');
                        downloadLink.click();
                    });
                    const controls = videoItem.querySelector('.video-controls');
                    controls.replaceChild(downloadBtn, convertBtn);
                    status.textContent = 'Conversion complete (no audio)!';
                    document.body.removeChild(processingVideo);
                    if (callback) callback();
                };
                mediaRecorder.start(100);
                await processingVideo.play();
                const drawFrame = () => {
                    if (processingVideo.ended || processingVideo.paused) {
                        mediaRecorder.stop();
                        return;
                    }
                    ctx.drawImage(processingVideo, 0, 0, canvas.width, canvas.height);
                    requestAnimationFrame(drawFrame);
                };
                drawFrame();
            }
        } catch (error) {
            console.error('Conversion error:', error);
            status.textContent = `Error: ${error.message}`;
            progress.style.display = 'none';
            convertBtn.disabled = false;
            if (callback) callback();
        }
    }
    function formatFileSize(bytes) {
        if (bytes < 1024) return bytes + ' bytes';
        else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
        else return (bytes / 1048576).toFixed(1) + ' MB';
    }
    function showError(message) {
        errorMessage.textContent = message;
        errorMessage.style.display = 'block';
        successMessage.style.display = 'none';
    }
    function showSuccess(message) {
        successMessage.textContent = message;
        successMessage.style.display = 'block';
        errorMessage.style.display = 'none';
    }
    function clearMessages() {
        errorMessage.style.display = 'none';
        successMessage.style.display = 'none';
    }
});
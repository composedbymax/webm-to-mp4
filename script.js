document.addEventListener('DOMContentLoaded', () => {
    const dropZone = document.getElementById('drop-zone');
    const fileSelector = document.getElementById('file-selector');
    const selectButton = document.getElementById('select-button');
    const convertButton = document.getElementById('convert-button');
    const progressContainer = document.getElementById('progress-container');
    const progressBar = document.getElementById('progress-bar');
    const errorMessage = document.getElementById('error-message');
    const successMessage = document.getElementById('success-message');
    const fileInfo = document.getElementById('file-info');
    const videoPreview = document.getElementById('video-preview');
    const processingVideo = document.getElementById('processing-video');
    const saveModal = document.getElementById('save-modal');
    const filenameInput = document.getElementById('filename-input');
    const saveButton = document.getElementById('save-button');
    const cancelButton = document.getElementById('cancel-button');
    let selectedFile = null;
    let videoBlob = null;
    let convertedBlob = null;
    let convertedBlobURL = null;
    selectButton.addEventListener('click', () => fileSelector.click());
    fileSelector.addEventListener('change', handleFileSelection);
    convertButton.addEventListener('click', convertFile);
    saveButton.addEventListener('click', saveFile);
    cancelButton.addEventListener('click', () => {
        saveModal.style.display = 'none';
    });
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
        selectedFile = files[0];
        if (!selectedFile.type.includes('webm')) {
            showError('Please select a WebM file.');
            selectedFile = null;
            convertButton.disabled = true;
            fileInfo.textContent = '';
            videoPreview.style.display = 'none';
            return;
        }
        clearMessages();
        fileInfo.textContent = `Selected: ${selectedFile.name} (${formatFileSize(selectedFile.size)})`;
        convertButton.disabled = false;
        videoBlob = URL.createObjectURL(selectedFile);
        videoPreview.src = videoBlob;
        videoPreview.style.display = 'block';
        const suggestedFilename = selectedFile.name.replace('.webm', '');
        filenameInput.value = suggestedFilename;
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
    function saveFile() {
        if (!convertedBlob) {
            showError('No converted file to save.');
            saveModal.style.display = 'none';
            return;
        }
        let filename = filenameInput.value.trim();
        if (!filename) {
            filename = 'converted';
        }
        if (!filename.toLowerCase().endsWith('.mp4')) {
            filename += '.mp4';
        }
        const downloadLink = document.createElement('a');
        downloadLink.href = convertedBlobURL;
        downloadLink.download = filename;
        downloadLink.click();
        saveModal.style.display = 'none';
        showSuccess(`File saved as "${filename}"`);
    }
    async function convertFile() {
        if (!selectedFile) {
            showError('Please select a file first.');
            return;
        }
        try {
            clearMessages();
            convertButton.disabled = true;
            progressContainer.style.display = 'block';
            progressBar.value = 0;
            videoPreview.style.display = 'none';
            let progress = 0;
            const progressInterval = setInterval(() => {
                progress += (100 - progress) * 0.03;
                progressBar.value = Math.min(95, progress);
            }, 200);
            processingVideo.src = videoBlob;
            processingVideo.muted = true;
            await new Promise((resolve, reject) => {
                processingVideo.onloadedmetadata = resolve;
                processingVideo.onerror = reject;
            });
            const width = processingVideo.videoWidth;
            const height = processingVideo.videoHeight;
            const duration = processingVideo.duration;
            const canvas = document.createElement('canvas');
            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');
            const stream = canvas.captureStream(30);
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const audioResponse = await fetch(videoBlob);
            const arrayBuffer = await audioResponse.arrayBuffer();
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
                progressBar.value = 100;
                const outputType = options.mimeType || 'video/mp4';
                convertedBlob = new Blob(chunks, { type: outputType });
                convertedBlobURL = URL.createObjectURL(convertedBlob);
                if (audioSource) {
                    audioSource.stop();
                }
                if (audioContext && audioContext.state !== 'closed') {
                    audioContext.close();
                }
                videoPreview.style.display = 'block';
                progressContainer.style.display = 'none';
                convertButton.disabled = false;
                saveModal.style.display = 'flex';
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
        } catch (error) {
            showError(`Error: ${error.message}`);
            console.error(error);
            progressContainer.style.display = 'none';
            convertButton.disabled = false;
            videoPreview.style.display = 'block';
        }
    }
});
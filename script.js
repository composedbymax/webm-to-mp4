document.addEventListener('DOMContentLoaded', () => {
    const dropZone            = document.getElementById('drop-zone');
    const fileSelector       = document.getElementById('file-selector');
    const selectButton       = document.getElementById('select-button');
    const convertAllButton   = document.getElementById('convert-all-button');
    const clearAllButton     = document.getElementById('clear-all-button');
    const errorMessage       = document.getElementById('error-message');
    const successMessage     = document.getElementById('success-message');
    const fileInfo           = document.getElementById('file-info');
    const videosGrid         = document.getElementById('videos-grid');
    let selectedFiles = [];
    function showError(msg) {
        errorMessage.textContent   = msg;
        errorMessage.style.display = 'block';
        successMessage.style.display = 'none';
    }
    function showSuccess(msg) {
        successMessage.textContent   = msg;
        successMessage.style.display = 'block';
        errorMessage.style.display   = 'none';
    }
    function clearMessages() {
        errorMessage.style.display   = 'none';
        successMessage.style.display = 'none';
    }
    function formatSize(bytes) {
        if (bytes < 1024) return bytes + ' bytes';
        if (bytes < 1048576) return (bytes/1024).toFixed(1) + ' KB';
        return (bytes/1048576).toFixed(1) + ' MB';
    }
    function updateBatchInfo() {
        if (!selectedFiles.length) {
            fileInfo.textContent = '';
        } else {
            const total = selectedFiles.reduce((sum,f)=>sum+f.size,0);
            fileInfo.textContent = `${selectedFiles.length} file(s), ${formatSize(total)} total`;
        }
    }
    selectButton.onclick = () => fileSelector.click();
    fileSelector.onchange = e => handleFiles(e.target.files);
    dropZone.addEventListener('dragover', e => {
        e.preventDefault(); dropZone.classList.add('highlight');
    });
    dropZone.addEventListener('dragleave', () => dropZone.classList.remove('highlight'));
    dropZone.addEventListener('drop', e => {
        e.preventDefault();
        dropZone.classList.remove('highlight');
        handleFiles(e.dataTransfer.files);
    });
    function handleFiles(fileList) {
        clearMessages();
        const arr = Array.from(fileList).filter(f =>
            f.type.includes('webm') || f.type.includes('mp4')
        );
        if (!arr.length) {
            showError('Please select WebM or MP4 files only.');
            return;
        }
        selectedFiles.push(...arr);
        renderAll();
    }
    function renderAll() {
        updateBatchInfo();
        videosGrid.innerHTML = '';
        selectedFiles.forEach((file,i) => videosGrid.appendChild(makeItem(file,i)));
        convertAllButton.disabled = clearAllButton.disabled = !selectedFiles.length;
    }
    function makeItem(file, idx) {
        const isWebm = file.type.includes('webm');
        const item = document.createElement('div');
        item.className = 'video-item';
        const title = document.createElement('h3');
        title.textContent = file.name;
        const vid = document.createElement('video');
        vid.className = 'video-preview';
        vid.controls = true;
        vid.src = URL.createObjectURL(file);
        const status = document.createElement('div');
        status.className = 'video-status';
        const progress = document.createElement('progress');
        progress.max = 100;
        const controls = document.createElement('div');
        controls.className = 'video-controls';
        const convBtn = document.createElement('button');
        convBtn.textContent = isWebm ? 'To MP4' : 'To WebM';
        convBtn.onclick = () => convertOne(idx);
        const removeBtn = document.createElement('button');
        removeBtn.textContent = 'Remove';
        removeBtn.onclick = () => {
            selectedFiles.splice(idx,1);
            renderAll();
            if (!selectedFiles.length) showSuccess('All files cleared.');
        };
        controls.append(convBtn, removeBtn);
        [title, vid, status, progress, controls].forEach(x => item.append(x));
        return item;
    }
    convertAllButton.onclick = () => {
        if (!selectedFiles.length) { showError('Nothing to convert.'); return; }
        clearMessages(); showSuccess('Starting conversions…');
        let i = 0;
        function next() {
            if (i < selectedFiles.length) {
                convertOne(i++, next);
            } else {
                showSuccess('All done!');
            }
        }
        next();
    };
    clearAllButton.onclick = () => {
        selectedFiles = [];
        renderAll();
        clearMessages();
        showSuccess('All cleared.');
    };
    async function convertOne(idx, cb) {
        const file = selectedFiles[idx];
        const item = videosGrid.children[idx];
        const status = item.querySelector('.video-status');
        const progress = item.querySelector('progress');
        const videoEl = item.querySelector('video');
        const convBtn = item.querySelector('button');
        convBtn.disabled = true;
        status.textContent = 'Converting…';
        progress.style.display = 'block';
        progress.value = 0;
        const isWebm = file.type.includes('webm');
        const targetExt = isWebm ? '.mp4' : '.webm';
        const mimeList = isWebm
            ? ['video/mp4','video/webm;codecs=h264','video/x-matroska;codecs=avc1']
            : ['video/webm;codecs=vp8,opus','video/webm;codecs=vp9,opus','video/webm'];

        const hidden = document.createElement('video');
        hidden.className = 'hidden-video';
        hidden.muted = true;
        hidden.src = URL.createObjectURL(file);
        document.body.append(hidden);
        await new Promise(r => hidden.onloadedmetadata = r);
        const w = hidden.videoWidth, h = hidden.videoHeight;
        const canvas = Object.assign(document.createElement('canvas'), { width: w, height: h });
        const ctx = canvas.getContext('2d');
        const stream = canvas.captureStream(30);
        const audioCtx = new (window.AudioContext||window.webkitAudioContext)();
        let buffer = null;
        try {
            const arrayBuffer = await fetch(hidden.src).then(r => r.arrayBuffer());
            const decoded = await audioCtx.decodeAudioData(arrayBuffer);
            if (decoded && decoded.length > 0) buffer = decoded;
            else console.warn('Decoded buffer is empty, skipping audio');
        } catch (e) {
            console.warn('No audio track; recording video only.', e);
        }
        if (buffer) {
            const srcNode = audioCtx.createBufferSource();
            srcNode.buffer = buffer;
            const dest = audioCtx.createMediaStreamDestination();
            srcNode.connect(dest);
            stream.addTrack(dest.stream.getAudioTracks()[0]);
        }
        const options = {};
        for (const m of mimeList) {
            if (MediaRecorder.isTypeSupported(m)) {
                options.mimeType = m;
                break;
            }
        }
        const recorder = new MediaRecorder(stream, options);
        const chunks = [];
        recorder.ondataavailable = e => e.data.size && chunks.push(e.data);
        recorder.start(100);
        hidden.play();
        if (buffer) audioCtx.resume();
        let pct = 0;
        const iv = setInterval(() => {
            pct += (100 - pct) * 0.03;
            progress.value = Math.min(95, pct);
        }, 200);
        function draw() {
            if (hidden.ended || hidden.paused) {
                recorder.stop();
            } else {
                ctx.drawImage(hidden, 0, 0, w, h);
                requestAnimationFrame(draw);
            }
        }
        requestAnimationFrame(draw);
        recorder.onstop = () => {
            clearInterval(iv);
            progress.value = 100;
            const blob = new Blob(chunks, { type: options.mimeType });
            const url = URL.createObjectURL(blob);
            videoEl.src = url;
            const dl = document.createElement('button');
            dl.textContent = `Download ${targetExt.slice(1).toUpperCase()}`;
            dl.onclick = () => {
                const a = document.createElement('a');
                a.href = url;
                a.download = file.name.replace(/\.\w+$/, targetExt);
                a.click();
            };
            item.querySelector('.video-controls').replaceChild(dl, convBtn);
            status.textContent = 'Done!';
            hidden.remove();
            audioCtx.close();
            if (cb) cb();
        };
    }
});
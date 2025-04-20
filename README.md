# WebM ↔ MP4 Converter

**Produced by Max Warren**

Try it live: [https://max.x10.mx/apps/webm-to-mp4/](https://max.x10.mx/apps/webm-to-mp4/)

A lightweight, fully client-side web application that allows batch conversion between WebM and MP4 formats directly in your browser — **no uploads, no privacy concerns, no server load**.

---

## Features

- **Client-Side Conversion**: Convert between WebM and MP4 formats directly in your browser
- **Batch Support**: Convert multiple files at once
- **Drag & Drop Interface**: Easy, intuitive file handling
- **Video Previews**: Watch before and after each conversion
- **Downloadable Output**: Get your converted files instantly
- **No Server Involved**: Your files never leave your device
- **Cross-Browser Compatible**: Works on all modern browsers that support the MediaRecorder API

---

## Technical Implementation

### Core Technologies

- **HTML5 Canvas** – for real-time video frame capture
- **MediaRecorder API** – for encoding video/audio into new formats
- **Web Audio API** – to handle and encode audio tracks
- **Blob URLs** – for efficient video previews and downloads

### Conversion Process

1. Selected file (WebM or MP4) is loaded and previewed using a native `<video>` element
2. A `<canvas>` element captures video frames at 30 FPS
3. Audio is extracted using the Web Audio API (or silently recreated if unavailable)
4. Video + audio are combined into a MediaStream
5. The MediaRecorder API records the stream in the desired format (MP4 or WebM)
6. Chunks are assembled into a new file and offered for download

### File Handling

- Supports both drag & drop and manual file selection
- Displays file count and total size
- Validates file types before conversion
- Displays real-time conversion progress and statuses

---

## Browser Support

This app depends on modern browser APIs, including:

- `MediaRecorder`
- `Canvas.captureStream()`
- `AudioContext`
- `Blob` and `URL.createObjectURL()`

**Tested on:**

- Chrome 76+
- Firefox 70+
- Edge 79+
- Safari 14+

*Note: Some older versions or mobile browsers may have limited compatibility.*

---

## Limitations

- Final video quality is dependent on the browser's built-in encoder
- MP4 encoding via MediaRecorder is not supported in all browsers (e.g., Firefox may default to WebM only)
- Large files may consume significant memory and CPU
- No editing or trimming features (yet!)

---

## Usage

1. Open the web app in a modern browser
2. Drag & drop your `.webm` or `.mp4` files (or click "Select Files")
3. Preview each video as needed
4. Click "Convert All" or convert files one at a time
5. Wait for the conversions to complete
6. Download your new videos using the provided buttons

---

```
▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒
▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒
▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒
▒▒▒▒▒▒▒▒░   ░▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒░   ▒▒▒▒▒   ░▒▒░   ░░░░▒▒▒▒▒▒▒▒  ▒▒▒▒▒▒▒
▒▒▒▒▒░         ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒   ▒▒▒▒▒▒▒▒   ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒     ▒▒▒     ▒▒         ░▒▒▒▒░   ░▒▒▒▒▒▒
▒▒▒▒▒   ▒▒▒▒▒░▒▒▒▒▒     ░▒▒▒        ▒▒   ▒▒▒   ▒▒░     ▒▒▒            ▒▒▒▒▒     ░▒▒      ▒▒▒▒▒▒▒▒     ░▒░     ▒▒   ▒▒▒▒   ▒▒▒     ░▒▒▒▒▒▒
▒▒▒▒   ▒▒▒▒▒▒▒▒▒▒   ▒▓▒   ▒▒   ▒▒▒   ▒▒  ░▒░  ░▒   ▒▒▒  ░▒   ░▒▒▒   ▒▒▒▒▒▒▒▒   ▒▒░  ░▒▒   ░▒▒▒▒▒▒   ░  ▒  ░   ▒▒         ▒▒▒  ░▒  ░▒▒▒▒▒▒
▒▒▒▒░  ░▒▒▒▒▒ ▒▒▒   ▒▒▒▒  ░▒   ▒▒▒   ▒▒░  ▒  ░▒▒         ▒   ▒▒▒▒   ▒▒▒▒▒▒▒▒   ▒▒   ▒▒▒▒   ▒▒▒▒▒▒   ▒     ▒   ▒▒   ▒▒▒▒▒▒▒▒         ▒▒▒▒▒
▒▒▒▒▒    ▒▒    ▒▒   ░▒▒   ▒▒   ▒▒▒   ▒▒▒     ▒▒▒   ▒▒▒  ░▒   ▒▒▒▒   ▒▒▒▒▒▒▒▒   ▒▒░   ▒▒   ▒▒▒▒▒▒▒   ▒░   ░▒   ▒▒   ▒▒▒▒▒▒▒▒░░░░░   ░▒▒▒▒▒
▒▒▒▒▒▒▒░     ░▒▒▒▒▒     ░▒▒▒   ▒▒▒   ▒▒▒▒   ▒▒▒▒▒▒     ▒▒▒   ▒▒▒▒▒    ▒▒▒▒▒▒░   ░▒▒     ░▒▒▒▒▒▒▒▒   ▒▒   ▒▒   ▒▒   ▒▒▒▒▒▒▒▒▒▒▒▒▒  ░▒▒▒▒▒▒
▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒
▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒
▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒
```
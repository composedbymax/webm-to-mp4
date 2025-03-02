# WebM to MP4 Converter

produced by Max Warren

A lightweight, client-side web application that converts WebM video files to MP4 format entirely within your browser. No server uploads required.

## Features

- **Browser-Based Conversion**: Process WebM videos to MP4 format without uploading files to any server
- **Privacy-Focused**: All processing happens locally on your device
- **Video Preview**: Preview your WebM video before conversion
- **Drag & Drop Interface**: Simple and intuitive file handling
- **Progress Tracking**: Real-time conversion progress indicator
- **Cross-Browser Compatible**: Works on modern browsers supporting the MediaRecorder API

## Technical Implementation

### Core Technologies
- HTML5 Canvas for frame capture
- MediaRecorder API for capturing and encoding streams
- Web Audio API for audio processing
- Browser's native video decoding capabilities

### Conversion Process
1. The WebM file is loaded and previewed in a video element
2. A canvas element captures video frames at 30 FPS
3. Audio tracks are extracted from the original video
4. Both video and audio are combined into a single MediaStream
5. The MediaRecorder API encodes the stream to MP4 format in real-time
6. Chunks of encoded data are collected and assembled into a downloadable file

### File Handling
- Direct file selection via file input
- Drag and drop support with visual feedback
- File type verification ensures only WebM files are processed

## Browser Support

This application requires browsers with support for:
- MediaRecorder API
- Canvas.captureStream()
- Video.captureStream()
- Blob URL creation

Supported browsers include:
- Chrome 47+
- Firefox 36+
- Edge 79+
- Safari 13+

## Limitations

- Conversion quality depends on browser's built-in encoders
- Very large files may consume significant memory
- Some older browsers may not support all required APIs
- Mobile devices may have limited performance when processing large videos

## Usage

1. Open the HTML file in a web browser
2. Drag and drop a WebM video or click "Select WebM File"
3. Preview your video to ensure it loaded correctly
4. Click "Convert to MP4"
5. Wait for the conversion to complete
6. The download will start automatically

## Development

The application is built as a single HTML file with inline JavaScript and CSS, making it easy to modify and extend. The code is organized into clear sections:

- **UI Components**: HTML structure and CSS styles
- **Event Handlers**: Input, drag/drop, and conversion triggers
- **File Processing**: WebM loading and MP4 conversion logic
- **Media Handling**: Video frame capture and audio extraction

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
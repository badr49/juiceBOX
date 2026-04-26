# JuiceBOX

A lightweight desktop music player for Juice WRLD's unreleased discography. Built with [Neutralinojs](https://neutralino.js.org/) - a lightweight alternative to Electron.

## Features

- **Audio Streaming** - Stream from juicewrldapi.com with WAV/MP3 quality options
- **Search** - Find specific tracks quickly
- **Radio Mode** - Random playback for endless listening
- **Tray Minimize** - Minimize to system tray with audio continuing to play
  - UI unmounts to save resources when hidden
  - Only audio stream remains active
  - Restore full UI from tray menu

## Frontend

Inspired by [wora](https://github.com/playwora/wora/)

## API Source

Data provided by [juicewrldapi.com](https://juicewrldapi.com/)

## Tech Stack

- **Neutralinojs** - Cross-platform native desktop framework
- **React 18** - UI components (via CDN)

## Development

### Prerequisites

- [Node.js](https://nodejs.org/) (v16+)
- Windows: Edge WebView2 runtime

### Setup

```bash
cd juicebox-app
npm install
```

### Run in Development Mode

```bash
neu run
```

### Build for Production

```bash
neu build --release
```

Output will be in `juicebox-app/dist/`.

## API Source

Data provided by [juicewrldapi.com](https://juicewrldapi.com/)

## License

MIT

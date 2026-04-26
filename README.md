# JuiceBOX

A lightweight desktop music player for Juice WRLD's unreleased discography. Built with [Neutralinojs](https://neutralino.js.org/) - a lightweight alternative to Electron.

## Features

- **Audio Streaming** - Stream from juicewrldapi.com with WAV/MP3 quality options
- **Era Browser** - Browse by Studio, Released, Unreleased, and Unsurfaced eras
- **Search** - Find specific tracks quickly
- **Radio Mode** - Random playback for endless listening
- **Tray Minimize** - Minimize to system tray with audio continuing to play
  - UI unmounts to save resources when hidden
  - Only audio stream remains active
  - Restore full UI from tray menu
- **Persistent Audio Service** - Audio playback survives UI lifecycle using a global service

## Tech Stack

- **Neutralinojs** - Cross-platform native desktop framework
- **React 18** - UI components (via CDN)
- **Vanilla JS Audio Service** - Persistent audio playback outside React lifecycle

## Project Structure

```
juiceBOX-neutralino/
└── juicebox-app/
    ├── resources/
    │   ├── js/
    │   │   ├── app.js          # React App + tray/window logic
    │   │   ├── audioService.js # Persistent audio service
    │   │   └── neutralino.js   # Neutralino client library
    │   ├── index.html          # Main entry
    │   └── styles.css          # App styles
    ├── neutralino.config.json  # App configuration
    ├── package.json            # Dependencies (@neutralinojs/neu)
    └── README.md               # This file
```

## Development

### Prerequisites

- [Node.js](https://nodejs.org/) (v16+)
- Windows: Edge WebView2 runtime (auto-installed on modern Windows)

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

## Configuration

### Window Mode vs Browser Mode

Edit `juicebox-app/neutralino.config.json`:

```json
{
  "defaultMode": "window"  // Native window with tray support
  // OR
  "defaultMode": "browser"  // Opens in default browser (Firefox, Chrome, etc.)
}
```

**Note:** Tray minimize functionality only works in `window` mode.

### DevTools

For development, you can auto-open DevTools by uncommenting in `app.js`:

```javascript
// Neutralino.debug.open();
```

For production builds, set `enableInspector: false` in `neutralino.config.json`.

## Architecture: Tray Minimize with Persistent Audio

The app uses a unique architecture to minimize resource usage when hidden:

1. **AudioService** (`audioService.js`) - Lives outside React as a global singleton
2. **React App** - Conditionally renders based on `isHiddenToTray` state
3. **When minimized to tray:**
   - `window.hide()` is called
   - `isHiddenToTray` becomes `true`
   - React renders minimal placeholder (`display: none`)
   - Audio continues via `AudioService`
4. **When restored:**
   - `isHiddenToTray` becomes `false`
   - Full UI remounts
   - Reconnects to `AudioService` for state sync

## API Source

Data provided by [juicewrldapi.com](https://juicewrldapi.com/)

## License

MIT

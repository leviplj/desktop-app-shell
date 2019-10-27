import { app, BrowserWindow } from 'electron'
import { autoUpdater } from 'electron-updater'
import Log from 'electron-log'

autoUpdater.logger = Log
autoUpdater.logger.transports.file.level = 'info'

const winURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:${process.env.ELECTRON_WEBPACK_WDS_PORT}`
  : `file://${__dirname}/index.html`

let createWindow = ()  => {
  let mainWindow = new BrowserWindow({
    webPreferences: {
      nodeIntegration: true
    },
    height: 563,
    useContentSize: true,
    width: 1000,
    frame: false
  })

  mainWindow.loadURL(winURL)
  mainWindow.webContents.openDevTools()
  
  mainWindow.on("closed", () => {
    mainWindow = null;
  })
}

app.on('ready', () => {
  createWindow()

  autoUpdater.checkForUpdates();
})

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})

// ------------------
// Auto Updates
// ------------------

autoUpdater.on('error', (error) => {
  console.log('Error: ', error == null ? "unknown" : (error.stack || error).toString())
})

autoUpdater.on('update-available', () => {
  console.log('update-available')
})


autoUpdater.on('checking-for-update', () => {
  console.log('checking')
  //mainWindow.webContents.send('message', 'checking')
})
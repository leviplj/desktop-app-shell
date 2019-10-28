import { app, BrowserWindow, dialog } from 'electron'
import { autoUpdater } from 'electron-updater'
import Log from 'electron-log'
import db, {sequelize} from './db/models/index'

autoUpdater.logger = Log
autoUpdater.logger.transports.file.level = 'info'
autoUpdater.autoDownload = false
autoUpdater.autoInstallOnAppQuit = false

const winURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:${process.env.ELECTRON_WEBPACK_WDS_PORT}`
  : `file://${__dirname}/index.html`

let mainWindow

let createWindow = ()  => {
  mainWindow = new BrowserWindow({
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
  sequelize.sync().then(() => {
    createWindow()
  });
  
  autoUpdater.checkForUpdatesAndNotify();
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
  dialog.showMessageBox({
    type: 'info',
    title: 'Found Updates',
    message: 'Found updates, do you want update now?',
    buttons: ['Sure', 'No']
  }, (buttonIndex) => {
    if (buttonIndex === 0) {
      console.log('it may take several minutes')
      autoUpdater.downloadUpdate()
    }
    else {
      console.log('nonono')
      //updater.enabled = true
      //updater = null
    }
  })
})

autoUpdater.on('download-progress', progress => {
  console.log(`Progress: Bps: ${progress.bytesPerSecond}, %: ${progress.percent}, ${progres.transferred} - ${progress.total}`)
})


autoUpdater.on('checking-for-update', () => {
  console.log('checking')
})

autoUpdater.on('update-downloaded', () => {
  dialog.showMessageBox({
    title: 'Install Updates',
    message: 'Updates downloaded, application will be quit for update...'
  }, () => {
    mainWindow.webContents.send('message', 'updated')
    //setImmediate(() => autoUpdater.quitAndInstall())
  })
})
import { app, BrowserWindow, dialog } from 'electron'
import db, {sequelize} from './db/models/index'
import autoUpdater from './updater'

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

    autoUpdater.setWindow(mainWindow)
    autoUpdater.checkForUpdatesAndNotify()
  });
})

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()

    autoUpdater.setWindow(mainWindow)
  }
})
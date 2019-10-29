import { app, BrowserWindow, dialog } from 'electron'
import db, {sequelize} from './db/models/index'
import './api/index'
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

    Array(200).fill(1).map((v, i) => v + i).forEach(v=> {
      new db.product({
        name: `Product ${v}`,
        price: v,
        createdAt: new Date(),
        updatedAt: new Date()
      }).save()
    })

    autoUpdater.setWindow(mainWindow)
    autoUpdater.checkForUpdatesAndNotify()
  }).catch((error) => {
    dialog.showMessageBox({
      title: 'Unable to open the application',
      message: (error).toString()
    }, () => {
      app.quit()
    })
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
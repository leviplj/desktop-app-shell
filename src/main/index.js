import { app, BrowserWindow, dialog } from 'electron'
import {sequelize} from './db/models/index'
import autoUpdater from './updater'
import './api/index'

const isDev = process.env.NODE_ENV === 'development'
const winURL = isDev
  ? `http://localhost:${process.env.ELECTRON_WEBPACK_WDS_PORT}`
  : `file://${__dirname}/index.html`

const loadingURL = isDev
  ? `http://localhost:${process.env.ELECTRON_WEBPACK_WDS_PORT}/loading.html`
  : `file://${__dirname}/loading.html`

let mainWindow

let createWindow = () => {
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

let loadingWindow
let createLoadingWindow = () => {
  loadingWindow = new BrowserWindow({
    width: 400, 
    height: 300
  });

  loadingWindow.loadURL(loadingURL)
  loadingWindow.show();
}

let loadFixtures = () => {
  let req = require.context("./fixtures", false, /^(?!.*index.js)((.*\.(js\.*))[^.]*$)/)
  req.keys().forEach(function(key){
    req(key);
  });
}

app.on('ready', () => {
  sequelize.sync().then(() => {
    if (isDev)
      loadFixtures()

    createWindow()

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
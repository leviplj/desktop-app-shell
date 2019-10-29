import { dialog } from 'electron'
import { autoUpdater } from 'electron-updater'
import Log from 'electron-log'

autoUpdater.logger = Log
autoUpdater.logger.transports.file.level = 'info'
autoUpdater.autoDownload = false
autoUpdater.autoInstallOnAppQuit = false

let sendMessage = (event, data) => {
  if (!! autoUpdater.window) {
    autoUpdater.window.webContents.send(event, data)
  }
}

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
  console.log(`Progress: Bps: ${progress.bytesPerSecond}, %: ${progress.percent}, ${progress.transferred} - ${progress.total}`)
  sendMessage('download-progress', {
    message: 'Downloading updates',
    bps: progress.bytesPerSecond,
    percent: progress.percent,
    transferred: progress.transferred,
    total: progress.total,
  })
})


autoUpdater.on('checking-for-update', () => {
  console.log('checking')
})

autoUpdater.on('update-downloaded', () => {
  dialog.showMessageBox({
    title: 'Install Updates',
    message: 'Updates downloaded, application will be quit for update...'
  }, () => {
    sendMessage('update-downloaded', '')
    //setImmediate(() => autoUpdater.quitAndInstall())
  })
})

autoUpdater.setWindow = function(window) {
  autoUpdater.window = window
}

setTimeout(() => {
  sendMessage('update-downloaded', 's')
}, 5000);

export default autoUpdater
import { autoUpdater } from 'electron-updater'
import Log from 'electron-log'

autoUpdater.logger = Log
autoUpdater.logger.transports.file.level = 'info'
autoUpdater.autoDownload = false
autoUpdater.autoInstallOnAppQuit = false

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
    window.webContents.send('message', 'updated')
    //setImmediate(() => autoUpdater.quitAndInstall())
  })
})

autoUpdater.setWindow = function(window) {
  this.window = window
}

export default autoUpdater
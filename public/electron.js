const path = require('path')
const fs = require('fs')
const { app, shell, BrowserWindow, ipcMain, dialog } = require('electron')

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    },
    autoHideMenuBar: true
  })
//  win.removeMenu()

 const appURL = app.isPackaged
  ? url.format({
    pathname: path.join(__dirname, "index.html"),
    protocol: "file:",
    slashes: true,
  })
  : "http://localhost:3000"

  win.loadURL(appURL)
}

app.whenReady().then(() => {
  createWindow()
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
  ipcMain.handle('dialog', async (event, method, params) => { 
    const res = await dialog[method](params)
    if (!res) return
    if (res.canceled) return
    // Open
    if (method === 'showOpenDialog') {
      const file = res?.filePaths[0]
      if (!file) return
      const read = () => new Promise((resolve, reject) => {
        fs.readFile(file, 'utf-8', function (err, data) {
          if (err) return reject(err)
          resolve(data)
        })
      })
      const content = await read()
      return {
        file: file,
        content: content
      }
    }
    // Save
    if (method === 'showSaveDialog') {
      const file = res?.filePath
      if (!file) return
      const write = () => new Promise((resolve, reject) => {
        fs.writeFile(file, params.payload, function (err) {
          if (err) return reject(err)
          resolve()
        })
      })
      await write()
      return {
        file: file,
        content: params.payload
      }
    }
  })
  ipcMain.handle('link', async (event, url) => {
    shell.openExternal(url)
  }) 
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
})


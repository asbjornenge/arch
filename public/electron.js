const path = require('path')
const fs = require('fs')
const { mdToPdf } = require('md-to-pdf')
const { app, shell, BrowserWindow, ipcMain, dialog } = require('electron')
const languageDetect = require('language-detect')

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
    // Open dialogue
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
    // Save dialogue
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
  ipcMain.handle('save', async (event, file, content) => {
    const write = () => new Promise((resolve, reject) => {
      fs.writeFile(file, content, function (err) {
        if (err) return reject(err)
        resolve()
      })
    })
    await write()
    return true
  }) 
  ipcMain.handle('savemarkdown', async (event, markdown) => {
    const res = await dialog.showSaveDialog({defaultPath: ''})
    if (!res) return
    if (res.canceled) return
    await mdToPdf({ content: markdown }, { dest: res.filePath })
    return true
  })
  ipcMain.handle('exists', async (event, path) => {
    const exists = () => new Promise((resolve, reject) => {
      fs.access(path, fs.F_OK, (err) => {
        if (err) reject(false)
        resolve(true)
      })
    })
    let pathExists = false
    try {
      pathExists = await exists()
    } catch(e) {
      pathExists = false
    }
    return pathExists
  })
  ipcMain.handle('touch', async (event, filepath) => {
    const touch = () => new Promise((resolve, reject) => {
      fs.mkdir(path.dirname(filepath), { recursive: true}, function (err) {
        if (err) return reject(err)
        const time = new Date();
        fs.utimes(filepath, time, time, (err) => {
          if ('ENOENT' !== err.code) {
            return reject(err)
          }
          let fd = fs.open(filepath, 'a', (err, fd) => {
            if (err) return reject(err)
            fs.close(fd)
            return resolve(true)
          })
        })
      })
    })
    let pathExists = false
    try {
      pathExists = await touch()
    } catch(e) {
      pathExists = false
    }
    return pathExists
  })
  ipcMain.handle('read', async (event, path) => {
    const read = () => new Promise((resolve, reject) => {
      fs.readFile(path, 'utf-8', function (err, data) {
        if (err) return reject(err)
        resolve(data)
      })
    })
    const data = await read()
    return data
  })
  ipcMain.handle('filetype', async (event, filename) => {
    return languageDetect.filename(filename)
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
})


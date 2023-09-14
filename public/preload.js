//const { dialog } = require('electron');
//console.log('PRELOAD', dialog)
//window.electron = {};
//window.electron.dialog = dialog;
const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electron', {
  openDialog: (method, config) => ipcRenderer.invoke('dialog', method, config),
  saveFile: (file, content) => ipcRenderer.invoke('save', file, content),
  saveMarkdown: (markdown) => ipcRenderer.invoke('savemarkdown', markdown),
  openExternalLink: (url) => ipcRenderer.invoke('link', url),
  fileExists: (filepath) => ipcRenderer.invoke('exists', filepath),
  touchFile: (filepath) => ipcRenderer.invoke('touch', filepath),
})

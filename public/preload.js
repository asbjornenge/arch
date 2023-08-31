//const { dialog } = require('electron');
//console.log('PRELOAD', dialog)
//window.electron = {};
//window.electron.dialog = dialog;
const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electron', {
  openDialog: (method, config) => ipcRenderer.invoke('dialog', method, config)
})

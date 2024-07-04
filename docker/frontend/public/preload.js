const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
  // You can add any Electron-specific APIs here if needed
  // For example:
  getAppVersion: () => ipcRenderer.invoke('get-app-version'),
  // Add more functions as needed
});
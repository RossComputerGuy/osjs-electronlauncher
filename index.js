const { app, BrowserWindow } = require('electron');

const calcSize = () => {
  const {screen} = require('electron');
  let width = 0;
  let height = 0;
  for(let disp of screen.getAllDisplays()) {
    width += disp.size.width;
    if(height < disp.size.height) height = disp.size.height;
  }
  return { width, height };
};

let win = null;
const createWindow = () => {
  let size = calcSize();
  win = new BrowserWindow({
    width: size.width,
    height: size.height,
    center: true,
    resizable: false,
    minimizable: false,
    maximizable: false,
    fullscreen: true,
    kiosk: true,
    frame: false,
    webPreferences: {
      devTools: false,
      nodeIntegration: false,
      experimentalFeatures: true,
      experimentalCanvasFeatures: true
    }
  });
  win.webContents.session.setUserAgent('Electron/1.0 (X11; OS.js; '+require('os').arch()+') WebKit Electron/1.0.0');
  win.setMenu(null);
  win.loadURL('http://localhost:8000');
  win.on('closed',() => win = createWindow());
};
app.on('ready',() => {
  const {screen} = require('electron');
  screen.on('display-added',() => {
    if(win != null) {
      let size = calcSize();
      win.resize(size.width,size.height);
    }
  });
  screen.on('display-removed',() => {
    if(win != null) {
      let size = calcSize();
      win.resize(size.width,size.height);
    }
  });
  createWindow();
});
app.on('window-all-closed',() => {
  if(process.platform !== 'darwin') app.quit()
});
app.on('activate',() => {
  if(win === null) createWindow();
});

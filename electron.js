// Modules to control application life and create native browser window
const {app, BrowserWindow, ipcMain} = require('electron');
const fs = require('fs/promises');

let mainWindow;

// console.log(process.env.ELECTRON_START_URL, __dirname, path.join(__dirname, '/build/index.html'));
function initialiseElectron(url) {
    function createWindow() {
        // Create the browser window.
        mainWindow = new BrowserWindow({
            backgroundColor: '#121212',
            width: 800,
            height: 600,
            webPreferences: {
                // so IPC works
                nodeIntegration: true,
                enableRemoteModule: true,
                contextIsolation: false,
            },
            show: false,
            frame: false,
        });

        // and load the index.html of the app.
        mainWindow.loadURL(url);
        mainWindow.maximize();
        // mainWindow.loadURL('http://localhost:3000');

        // Open the DevTools.
        // mainWindow.webContents.openDevTools();

        // Emitted when the window is closed.
        mainWindow.on('closed', function () {
            // Dereference the window object, usually you would store windows
            // in an array if your app supports multi windows, this is the time
            // when you should delete the corresponding element.
            mainWindow = null;
        });
    };

    // This method will be called when Electron has finished
    // initialization and is ready to create browser windows.
    // Some APIs can only be used after this event occurs.
    app.on('ready', createWindow);
    app.once('ready-to-show', () => mainWindow.show());

    // Quit when all windows are closed.
    app.on('window-all-closed', function () {
        // On OS X it is common for applications and their menu bar
        // to stay active until the user quits explicitly with Cmd + Q
        if (process.platform !== 'darwin') {
            app.quit();
        }
    });

    app.on('activate', function () {
        // On OS X it's common to re-create a window in the app when the
        // dock icon is clicked and there are no other windows open.
        if (mainWindow === null) {
            createWindow();
        }
    });

    let maximised = true;

    setInterval(() => {
        if (mainWindow && maximised && !mainWindow.isMaximized()) {
            mainWindow.webContents.send('unmaximise');
            maximised = false;
        } else if (mainWindow && !maximised && mainWindow.isMaximized()) {
            mainWindow.webContents.send('maximise');
            maximised = true;
        }
    }, 50);

    ipcMain.on('minimise', function () {
        mainWindow.minimize();
    });
    ipcMain.on('maximise', function () {
        mainWindow.maximize();
    });
    ipcMain.on('unmaximise', function () {
        mainWindow.restore();
    });
    ipcMain.on('close', function () {
        mainWindow.close();
    });
}

module.exports = exports = initialiseElectron;

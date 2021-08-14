// Modules to control application life and create native browser window
const {app, BrowserWindow} = require('electron');
// const fs = require('fs');
const path = require('path');
const url = require('url');

let mainWindow;

// console.log(process.env.ELECTRON_START_URL, __dirname, path.join(__dirname, '/build/index.html'));
function createWindow() {
    // Create the browser window.
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        // webPreferences: {
        //     contextIsolation: true, // protect against prototype pollution
        //     enableRemoteModule: false,
        //     preload: path.join(__dirname, "preload.js"),
        // },
    });

    // and load the index.html of the app.
    const startUrl = process.env.ELECTRON_START_URL || url.format({
        pathname: path.join(__dirname, '/build/index.html'),
        protocol: 'file:',
        slashes: true
    });
    mainWindow.loadURL(startUrl);
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
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

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

// async function getFileSystemTree(filePath) {
//     const tree = {
//         name: path.basename(filePath),
//         type: 'dir',
//         children: []
//     };
//     const stats = await fs.stat(filePath);
//     if (stats.isDirectory()) {
//         const files = await fs.readdir(filePath);
//         files.forEach(file => {
//             const filePath = path.join(filePath, file);
//             tree.children.push(await getFileSystemTree(filePath));
//         });
//     } else {
//         tree.type = 'file';
//     }
//     return tree;
// }

// // In this file you can include the rest of your app's specific main process
// // code. You can also put them in separate files and require them here.
// ipcMain.on('get-locale-files', async (event, _) => {
//     const result = await dialog.showOpenDialog(
//         mainWindow,
//         {
//             title: 'Select locale directory',
//             properties: ['openDirectory'],
//         }
//     );
//     // event.sender.send('get-locale-files-reply', result);
//     const files = await getFileSystemTree(result);
//     console.log(files);
//     event.sender.send('set-locale-files', files);
// });

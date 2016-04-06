// Module to control application life.
const app = require('app');
// Module to create native browser window.
const BrowserWindow = require('electron').BrowserWindow;
// Report crashes to our server.
require('crash-reporter').start();
// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is GCed.
var mainWindow = null;
var session = {};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
app.on('ready', function () {
    // Create the browser window.
    mainWindow = new BrowserWindow({
        width: 1280,
        height: 700
        , 'auto-hide-menu-bar': true//true
    });

    // and load the index.html of the app.
    mainWindow.loadUrl('file://' + __dirname + '/login.html');
    // Emitted when the window is closed.
    mainWindow.on('closed', function () {
        //mainWindow.webContents.session.cookies
        mainWindow = null;
        exit();
    });

});
// Quit when all windows are closed.
app.on('window-all-closed', function () {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    exit();
});




// In main process. Use to message between BrowserWindow.
var ipcMain = require('electron').ipcMain;
/*
 var win = null;
 //这个方法创建窗口，没用
 ipcMain.on('show_print_win', function(event, arg) {
 win = new BrowserWindow({width: 1000,
 height: 700
 ,'auto-hide-menu-bar': true,
 alwaysOnTop :true
 });
 win.setAlwaysOnTop(true);
 win.loadUrl('file://' + __dirname + '/'+arg.url);
 win.on('closed', function() {
 win = null;
 });

 event.returnValue = true;
 });

 ipcMain.on('hide_print_win', function(event, arg) {
 console.log("arg")
 console.log(arg)

 //mainWindow.webContents.executeJavaScript('hide_overlay('+arg+')');
 mainWindow.webContents.send('hide_overlay', arg);

 // ipc2.sendSync("hide_overlay", {})
 //event.sender.send("hide_overlay", {})
 event.returnValue = true;
 });*/


ipcMain.on('jump_to_list', function (event, arg) {
    mainWindow.loadUrl('file://' + __dirname + arg.url);
    event.returnValue = true;
});

/*ipc.on('hide_main_window', function(event,arg) {
 //mainWindow.hide();
 mainWindow.setDocumentEdited(false);
 event.returnValue = true;
 });

 ipc.on('show_main_window', function(event,arg) {
 mainWindow.show();
 event.returnValue = true;
 });*/


ipcMain.on('session', function (event, arg) {  // arg->{opt:'', key:'', value:''}
    var opt = arg.opt;
    if (opt == 'get') {
        // console.log('get')

        var ret = session[arg.key];
        //  console.log('ret'+ret)
        if (typeof(ret) == 'undefined')
            event.returnValue = 'undefined';
        else
            event.returnValue = ret;
    } else if (opt == 'put') {
        session[arg.key] = arg.value;
        event.returnValue = true;

    } else if (opt == 'remove') {
        var bln = false;
//  86         try {
//  87             for (var k in session) {
//  88                 if (session[k] == arg.key) {
//  89                     this.elements.splice(i, 1);
//  90                     return true;
//  91                 }
//  92             }
//  93         } catch (e) {
//  94             bln = false;
//  95         }
// 96
        event.returnValue = bln;
    } else if (opt == 'clear') {
        session = {};
        event.returnValue = 'true';
    }

});


// Exit app.
function exit() {
    if (process.platform != 'darwin') {
        app.quit();
    }
}
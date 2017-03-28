const electron = require('electron');
const path = require('path');
const url = require('url');
const jsdom = require('jsdom');

const {app, BrowserWindow} = electron;

let mainWindow;

function createWindow () {
    mainWindow = new BrowserWindow({width: 800, height: 600});

    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'index.html'),
        protocol: 'file:',
        slashes: true
    }));

    mainWindow.webContents.openDevTools();

    mainWindow.on('closed', function () {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        mainWindow = null
    })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
global.image_list = [];
app.on('ready', function(){
    global.image_list = [];

    jsdom.env({
        url: "http://www.netbian.com/",
        done: function (err, window) {
            let document = window.document;
            let list_node = document.querySelector('div.list');
            let link_node_list = list_node.querySelectorAll('li>a');
            link_node_list.forEach(function(link_node){
                let href = link_node.href;
                jsdom.env({
                    url: href,
                    done: function (err, window) {
                        let image_down_link_node = window.document.querySelector('div.pic-down>a');
                        if(image_down_link_node == null){
                            console.log("error:", href);
                            return;
                        }
                        let href = image_down_link_node.href;
                        jsdom.env({
                            url: href,
                            headers:{
                                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/57.0.2987.98 Safari/537.36'
                            },
                            done: function (err, window) {
                                let document = window.document;
                                let image_node = document.querySelector('table#endimg td>img');
                                if(image_node === null)
                                {
                                    console.log("table#endimg td>img is null", href);
                                    // console.log(window.document.body.innerHTML);
                                    return;
                                }
                                global.image_list.push({
                                    src: image_node.src,
                                    title: image_node.title
                                });
                                console.log("table#endimg td>img is ok", href);
                            }
                        });
                    }
                });
            });
        }
    });
    createWindow();
});

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') {
        app.quit()
    }
});

app.on('activate', function () {
    if (mainWindow === null) {
        createWindow()
    }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

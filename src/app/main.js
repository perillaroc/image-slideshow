const electron = require('electron');
const path = require('path');
const url = require('url');
const fs = require('fs');
const yaml = require('js-yaml');
const jsdom = require('jsdom');

const Datastore = require('nedb');

let url_list = [];
let welcome_background = null;
try {
    let conf_doc = yaml.safeLoad(fs.readFileSync(path.join(__dirname, './conf/conf.yaml'), 'utf8'));
    url_list = conf_doc['wallpaper']['website']['url_list'];
    welcome_background = conf_doc['wallpaper']['welcome']['background'];
} catch (e) {
    console.log(e);
}

let user_data_db = new Datastore({ filename: path.join(__dirname, '../data/user_data_db'), autoload: true });

const {app, BrowserWindow} = electron;

let mainWindow;

function createWindow () {
    mainWindow = new BrowserWindow({width: 1920, height: 1080});
    mainWindow.maximize();

    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'index.html'),
        protocol: 'file:',
        slashes: true
    }));

    //mainWindow.webContents.openDevTools();

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
    global.welcome_background = welcome_background;

    url_list.forEach(function(url){
        jsdom.env({
            url: url,
            done: function (err, window) {
                let document = window.document;
                let list_node = document.querySelector('div.list');
                let link_node_list = list_node.querySelectorAll('li>a');
                link_node_list.forEach(function(link_node, index){
                    let node = link_node;
                    setTimeout(
                        function() {
                            let href = node.href;
                            jsdom.env({
                                url: href,
                                done: function (err, window) {
                                    let image_down_link_node = window.document.querySelector('div.pic-down>a');
                                    if (image_down_link_node === null) {
                                        console.log("error:", href);
                                        return;
                                    }
                                    let image_down_href = image_down_link_node.href;
                                    jsdom.env({
                                        url: image_down_href,
                                        headers: {
                                            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/57.0.2987.98 Safari/537.36'
                                        },
                                        done: function (err, window) {
                                            let document = window.document;
                                            let image_node = document.querySelector('table#endimg td>img');
                                            if (image_node === null) {
                                                console.log("table#endimg td>img is null", href);
                                                // console.log(window.document.body.innerHTML);
                                                return;
                                            }
                                            global.image_list.push({
                                                src: image_node.src,
                                                title: image_node.title
                                            });
                                            //console.log("table#endimg td>img is ok", href);
                                        }
                                    });
                                }
                            });
                        },
                        index*500
                    );
                });
            }
        });
    });

    user_data_db.find({_id: 'welcome'}, function(err, docs) {
        console.log(err, docs);
        global.welcome_background = docs[0].background;
        createWindow();
    });
});

app.on('window-all-closed', function () {
    console.log('window-all-closed');
    let image_count = global.image_list.length;
    if(image_count === 0 ){
        return
    }
    let index = Math.floor(Math.random() * image_count);
    let image_url = global.image_list[index].src;


    console.log('window-all-closed update', image_url);
    user_data_db.update({_id: 'welcome'}, {background: image_url}, { upsert: true }, function(err, numReplaced){
        console.log(err, numReplaced);
        if (process.platform !== 'darwin') {
            app.quit()
        }
    });


});

app.on('activate', function () {
    if (mainWindow === null) {
        createWindow()
    }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

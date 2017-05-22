let electron = require('electron');
global.jQuery = require('jquery');
require('bootstrap-loader');
require('./main.css');

let index = 0;

const welcome_background = electron.remote.getGlobal('welcome_background');

window.addEventListener('load', function(event){
    document.body.style.backgroundImage = "url(" + welcome_background +")";

    document.querySelector('#random_button').addEventListener('click', function(event){
        const image_list = electron.remote.getGlobal('image_list');
        let image_count = image_list.length;
        if(image_count === 0 ){
            return
        }
        index = Math.floor(Math.random() * image_count);
        let image_url = image_list[index].src;
        console.log(image_url);
        let background_image = new Image();
        background_image.onload = function(event){
            document.body.style.backgroundImage = "url("+ this.src +")";
        };
        background_image.src = image_url;
    });
});


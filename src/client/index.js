let electron = require('electron');

let index = 0;

window.addEventListener('load', function(event){
    document.body.style.backgroundImage = "url(http://img.netbian.com/file/2017/0321/a20cef8314d7f53023fb431acf1b9553.jpg)";
});

document.body.addEventListener('click', function(event){
    const image_list = electron.remote.getGlobal('image_list');
    let image_count = image_list.length;
    if(image_count == 0 ){
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
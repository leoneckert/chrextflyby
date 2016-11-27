function init(){
    console.log("running", window.location.href);

    var hostname = window.location.href;

    // console.log(document.getElementsByTagName("img"));
    var images = document.getElementsByTagName("img");
    for(var i = 0; i < images.length; i++){
        if(!images[i].src || images[i].src === "" || !images[i].src == null){
            console.log("no source!!!!");
            console.log(images[i]);
        }

    }


}





function onElementHeightChange(elm, callback){
    var lastHeight = elm.clientHeight, newHeight;
    (function run(){
        newHeight = elm.clientHeight;
        if( lastHeight != newHeight )
            callback();
        lastHeight = newHeight;

        if( elm.onElementHeightChangeTimer )
            clearTimeout(elm.onElementHeightChangeTimer);

        elm.onElementHeightChangeTimer = setTimeout(run, 200);
    })();
}

window.addEventListener("load", init);
onElementHeightChange(document.body,init);

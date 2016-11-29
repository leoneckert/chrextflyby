var chosen_images = [];
function collectImgSources(callback){
    var images = document.getElementsByTagName("img");
    var sources = [];
    chosen_images = [];
    for(var  i = 0; i < images.length; i++){
        if(images[i].width > 100 && images[i].src != null && images[i].src != ""){
            sources.push(images[i].src);
            chosen_images.push(images[i]);
        }
        if(i == images.length - 1){
            callback(sources);
        }
    }
    if(images.length === 0){
        callback(sources);
    }
}

function doTheSwap(callback){
    collectImgSources(function(sources){
        console.log(sources);
        chrome.runtime.sendMessage({header: "sources", sources: sources});
        callback(sources.length)
    });
}

chrome.extension.onMessage.addListener(
    function(request, sender, sendResponse) {
        if(request === "do the swap!"){
            doTheSwap(function(numLinks){
                console.log("sent links" + numLinks);
            });
        }

        if(request.header === "newsrc"){
            console.log("got new sources");
            console.log("chosen_images length" + chosen_images.length);
            console.log("new source length" + request.sources.length);
            for(var  i = 0; i < chosen_images.length; i++){
                chosen_images[i].src = request.sources[i];
            }

        }
    }
);

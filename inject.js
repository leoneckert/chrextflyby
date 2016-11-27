// // function getNewImages(callback){
// //     var images = document.getElementsByTagName("img");
// //     console.log(images);
// //     var newimages = [];
// //     for(var  i = 0; i < images.length; i++){
// //         checkIfElemInArray(allSourcesEver, images[i], function(exists){
// //             if(!exists) newimages.push(images[i]);
// //             else console.log("exists already");
// //         })
// //     }
// //     callback(newimages);
// // }
//
//
// // function filterSources(images, callback){
// //     var data = {};
// //     var data_length = 0;
// //     for(var i = 0; i < images.length; i++){
// //         if(images[i].width > 100 && images[i].src != null && images[i].src != ""){
// //             data[data_length] = {"image": images[i], "source": images[i].src};
// //             data_length += 1;
// //         }
// //     }
// //     callback(data, data_length);
// //
// // }
//
//
function collectImgSources(callback){
    var images = document.getElementsByTagName("img");
    var sources = [];
    // var newimages = [];
    for(var  i = 0; i < images.length; i++){
        if(images[i].width > 100 && images[i].src != null && images[i].src != ""){
            sources.push(images[i].src);
        }
    }
    callback(sources);
}

function doTheSwap(callback){
    collectImgSources(function(sources){
        console.log(sources);
        chrome.runtime.sendMessage({header: "sources", sources: sources});
        callback(sources.length)
    });
}
//


chrome.extension.onMessage.addListener(
    function(request, sender, sendResponse) {
        // console.log(request, sender, sendResponse);
        if(request === "do the swap!"){
            doTheSwap(function(numLinks){
                console.log("sent links" + numLinks);
            });
        }

        if(request.header === "newsrc"){
            console.log(request, sender, sendResponse);
        }
    }
);

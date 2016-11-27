var allSourcesEver = [];

function init(){
    console.log("Hello to imgSwap");


    function checkIfElemInArray(array, elem, callback){
        for(var  j = 0; j < array.length; j++){
            if(array[j] === elem.src) callback(true);
        }
        callback(false);
    }

    function getNewImages(callback){
        var images = document.getElementsByTagName("img");
        console.log(images);
        var newimages = [];
        for(var  i = 0; i < images.length; i++){
            checkIfElemInArray(allSourcesEver, images[i], function(exists){
                if(!exists) newimages.push(images[i]);
                else console.log("exists already");
            })
        }
        callback(newimages);
    }


    function filterSources(images, callback){
        var data = {};
        var data_length = 0;
        for(var i = 0; i < images.length; i++){
            if(images[i].width > 100 && images[i].src != null && images[i].src != ""){
                data[data_length] = {"image": images[i], "source": images[i].src};
                data_length += 1;
            }
        }
        callback(data, data_length);

    }

    function sendToBackground(message, callback){
        chrome.runtime.sendMessage(message, function(res){
            if(callback) callback(res);
        });
    }

    getNewImages(function(newimages){

        filterSources(newimages, function(data, data_length){

            var images = [];
            var sources = [];
            for(var i = 0; i < data_length; i ++){
                images.push(data[i]["image"]);
                sources.push(data[i]["source"]);
                allSourcesEver.push(data[i]["source"]);
            }

            sendToBackground({header: "freshSources", data: sources}, function(response){
                console.log(response);
                for(var i = 0; i < response.length; i++){
                    images[i].src = response[i];
                    // allImagesEver.push(images[i]);
                    allSourcesEver.push(response[i]);
                }

            });
        });
    });



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

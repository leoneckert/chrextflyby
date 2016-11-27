
var sourcePool = [];

function removeSource(source){
    var index = sourcePool.indexOf(source);
    if (index > -1) {
        sourcePool.splice(index, 1);
    }
}

function getRandomSources(num, callback){
    var randomsources = [];
    for(var i = 0; i < num; i++){
        var randomSource = sourcePool[Math.floor(Math.random() * sourcePool.length)];
        randomsources.push(randomSource);
        removeSource(randomSource);
    }
    callback(randomsources);
}

chrome.extension.onMessage.addListener(
    function(message, sender, sendResponse) {
        console.log(message);
        console.log("incoming", message.data);
        console.log(sender);
        console.log("-----");

        if(message.header === "freshSources"){


            //first try to take same amount of random images out the pool
            if(sourcePool.length === 0){
                console.log("no sources yet, returning empty array");
                sendResponse([]);
            }else if(sourcePool.length < message.data.length){
                console.log("can't cover ALL sources, returning what I have");
                sendResponse(sourcePool);
                sourcePool = []; //empty sourcePool
            }else if(sourcePool.length >= message.data.length){
                console.log("enough sources, printing them out");

                // for(var i = 0; i < message.data.length; i++){
                //     var randomSource = sourcePool[Math.floor(Math.random() * sourcePool.length)];
                //     removeSource(randomSource);
                // }
                // message.data.length
                getRandomSources(message.data.length, function(randomsources){
                    sendResponse(randomsources);
                })


            }



            //then add the sources
            sourcePool = sourcePool.concat(message.data);

        }


    }
);

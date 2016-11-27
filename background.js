var pool = [];
var todo = {};

function initTodo(tabs, callback){
    console.log("-----initTodo-----");
    for(var i = 0; i < tabs.length; i++){
        if(tabs[i].url.substring(0,4) === "http"){
            todo[tabs[i].id] = {gotSources: false, numSources: 0, info: tabs[i], sentSources: false};
        }

    }
    console.log("todo");
    console.log(todo);
    callback();
}

function contactTabs(){
    var tabIDs = Object.keys(todo);
    for(var i = 0; i < tabIDs.length; i ++){
        console.log("-----contactTabs-----");
        chrome.tabs.sendMessage(todo[tabIDs[i]].info.id, "do the swap!");
    }
}

function addToPool(sources, callback){
    for(var i = 0; i < sources.length; i++){
        pool.push(sources[i]);
        if(i === sources.length - 1){
            callback();
        }
    }

}
function saveData(message, sender, callback){
    var tabID = sender.tab.id;
    var sources = message.sources;
    if(todo[tabID]){
        addToPool(sources, function(){
            todo[tabID].numSources = sources.length;
            todo[tabID].gotSources = true;
            console.log("saved data");
            console.log("todo");
            console.log(todo);
            console.log("pool");
            console.log(pool);
            callback(true);
        });

    }else{
        callback(false);
    }
}


function shuffle(a) {
    var j, x, i;
    for (i = a.length; i; i--) {
        j = Math.floor(Math.random() * i);
        x = a[i - 1];
        a[i - 1] = a[j];
        a[j] = x;
    }
}



var done = false;
chrome.extension.onMessage.addListener(
    function(message, sender, sendResponse) {

        if(message.header === "orderingSwap"){
            var tabs = message.tabs;
            initTodo(tabs, function(){
                contactTabs();
            });

        }

        if(message.header === "sources"){
            // console.log("got sources");
            // console.log(message, sender, sendResponse);
            saveData(message, sender, function(saved){


            })

        }

    }
);

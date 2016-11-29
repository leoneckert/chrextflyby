var pool = [];
var todo = {};

function initTodo(tabs, callback){
    console.log("-----initTodo-----");
    todo = {};
    pool = [];
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
        console.log(tabIDs.length + " tabs");
        chrome.tabs.sendMessage(todo[tabIDs[i]].info.id, "do the swap!");
    }
}


function saveData(message, sender, callback){
    var tabID = sender.tab.id;
    var sources = message.sources;
    if(todo[tabID]){
        for(var i = 0; i < sources.length; i++){
            pool.push(sources[i]);
        }
        todo[tabID].numSources = sources.length;
        todo[tabID].gotSources = true;
        console.log("-----saved data-----");
        callback(true);
    }
}


function shuffle(a, callback) {
    var j, x, i;
    for (i = a.length; i; i--) {
        j = Math.floor(Math.random() * i);
        x = a[i - 1];
        a[i - 1] = a[j];
        a[j] = x;
        if(i === 1){
            callback();
        }
    }
}

function numReplies(){
    var tabIDs = Object.keys(todo);
    var c = 0;
    for(var i = 0; i < tabIDs.length; i ++){
        if(todo[tabIDs[i]].gotSources){
            c++;
        }
    }
    return c;
}

function numSources(){
    return Object.keys(todo).length;
}

function sendOutNewSources(){
    var tabIDs = Object.keys(todo);
    for(var i = 0; i < tabIDs.length; i ++){

        if(!tabIDs[i].sentSources){
            var toSend = [];
            for (var j = 0; j < todo[tabIDs[i]].numSources; j ++){
                toSend.push( pool.pop() );
                if(j == todo[tabIDs[i]].numSources - 1){
                    console.log("sending");
                    console.log(todo[tabIDs[i]].info.id);
                    chrome.tabs.sendMessage(todo[tabIDs[i]].info.id, {header: "newsrc", sources: toSend });
                    tabIDs[i].sentSources = true;
                }
            }
        }
    }
}


chrome.extension.onMessage.addListener(
    function(message, sender, sendResponse) {

        if(message.header === "orderingSwap"){
            var tabs = message.tabs;
            initTodo(tabs, function(){
                contactTabs();
            });

        }

        if(message.header === "sources"){
            saveData(message, sender, function(saved){
                console.log( numReplies() + "/" + numSources() );
                if( numReplies() === numSources() ){
                    console.log("done");
                    setTimeout(function(){
                        shuffle(pool, function(){
                            console.log("shuffled pool");
                            sendOutNewSources();
                            chrome.runtime.sendMessage({header: "scriptFinished"});
                        });
                    }, 1000);
                }
            });
        }
    }
);

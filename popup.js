function sendToBackground(message, callback){
   chrome.runtime.sendMessage(message, function(res){
       if(callback){
           callback(res);
       }
   });
}

function doTheSwap(){

    chrome.tabs.query({}, function(tabs){
        sendToBackground({header: "orderingSwap", tabs: tabs});
    });
}




function init(){
    document.getElementById('swap_button').addEventListener('click', doTheSwap);
}

window.addEventListener("load", init);

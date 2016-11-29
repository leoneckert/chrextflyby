function hideButton(){
    document.getElementById('swap_button').style.display = "none";
}


function showButton(){
    document.getElementById('swap_button').style.display = "block";
}



chrome.extension.onMessage.addListener(
    function(message, sender, sendResponse) {
        if(message.header === "scriptFinished"){
            showButton();
        }
});



function doTheSwap(){
    chrome.tabs.query({}, function(tabs){
        chrome.runtime.sendMessage({header: "orderingSwap", tabs: tabs});
    });
    hideButton();
}



function init(){
    document.getElementById('swap_button').addEventListener('click', doTheSwap);
}

window.addEventListener("load", init);

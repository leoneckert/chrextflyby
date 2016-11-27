function hideButton(){
    document.getElementById('swap_button').style.display = "none";
}
function showButton(){
    document.getElementById('swap_button').style.display = "block";
}

function doTheSwap(){
    chrome.tabs.query({}, function(tabs){
        chrome.runtime.sendMessage({header: "orderingSwap", tabs: tabs});
    });
    hideButton();
}

chrome.extension.onMessage.addListener(
    function(message, sender, sendResponse) {
        if(message.header === "scriptFinished"){
            showButton();
        }
});

function init(){
    document.getElementById('swap_button').addEventListener('click', doTheSwap);
}

window.addEventListener("load", init);

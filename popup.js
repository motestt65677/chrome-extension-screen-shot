chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    var activeTab = tabs[0];
    chrome.runtime.sendMessage({"message": "update_container_get_items"});
});


let startBtn = document.getElementById('start_btn');
startBtn.onclick = function(element) {
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    var activeTab = tabs[0];
    chrome.tabs.sendMessage(activeTab.id, {"message": "start_issue"});
  });
};

let stopBtn = document.getElementById('stop_btn');
stopBtn.onclick = function(element) {
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    var activeTab = tabs[0];
    chrome.tabs.sendMessage(activeTab.id, {"message": "stop_issue"});
  });
};

let sendCoord = document.getElementById('sendCoord');
sendCoord.onclick = function(element) {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        var activeTab = tabs[0];
        chrome.tabs.sendMessage(activeTab.id, {"message": "clicked_send_coord"});
    });
};
chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        if (request.message === "update_container") {
            if(request.items.length == 0)
                return;
            //  To do something
            let itemsContainer = document.getElementById('itemsContainer');
            if(request.items.length > 0)
                itemsContainer.innerHTML = "";
            for(var i = 0; i < request.items.length; i++){
                var thisItem = request.items[i];
                var thisImage = document.createElement('img');
                thisImage.src = thisItem["image"];
                thisImage.width = 100;
                thisImage.height = 100;
                itemsContainer.appendChild(thisImage);
            }
        }
    }
);


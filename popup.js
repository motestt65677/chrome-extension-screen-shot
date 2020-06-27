chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    var activeTab = tabs[0];
    chrome.tabs.sendMessage(activeTab.id, {"message": "update_container"});
});


let changeColor = document.getElementById('button');
changeColor.onclick = function(element) {
  let color = element.target.value;
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    var activeTab = tabs[0];
    chrome.tabs.sendMessage(activeTab.id, {"message": "clicked_browser_action"});
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
                console.log(thisImage);
                itemsContainer.appendChild(thisImage);
                console.log("qq");
            }
        }
    }
);


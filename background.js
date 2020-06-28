var items = [];

chrome.runtime.onInstalled.addListener(function() {
    chrome.runtime.onMessage.addListener(
        function(request, sender, sendResponse) {
            if( request.message === "screen-capture" ) {
                console.log('screen-capture');
                // console.log(view);
                // console.log('aa');
            } else if (request.message === "clicked_send_coord_to_background"){
                chrome.tabs.captureVisibleTab(null, {}, function (image) {
                    var item = {
                        message: "open_dialog_box", 
                        image: image, 
                        dimension: 
                            {
                                startX: request.startX, 
                                startY:request.startY, 
                                croppedImageWidth: request.croppedImageWidth, 
                                croppedImageHeight:request.croppedImageHeight
                            }
                    };
                    items.push(item);
                    chrome.runtime.sendMessage({message: "update_container", items: items});
                    
                });
            } else if (request.message === "update_container_get_items"){

                chrome.runtime.sendMessage({message: "update_container", items: items});
            } 
        }
    );



});



// This block is new!


// chrome.bookmarks.onCreated.addListener(function() {
//     console.log('open');
// });
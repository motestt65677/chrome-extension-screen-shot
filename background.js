var items = [];

chrome.runtime.onInstalled.addListener(function() {
    chrome.runtime.onMessage.addListener(
        function(request, sender, sendResponse) {
            if( request.message === "screen-capture" ) {
                console.log('screen-capture');
                // console.log(view);
                // console.log('aa');
            } else if (request.message === "clicked_send_coord"){
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
                    // chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
                    //     chrome.tabs.sendMessage(tabs[0].id, {message: "open_dialog_box", image: image, dimension: {startX: request.startX, startY:request.startY, croppedImageWidth: request.croppedImageWidth, croppedImageHeight:request.croppedImageHeight}}, function(response) {});  
                    // });
    
                    // You can add that image HTML5 canvas, or Element.
                    // console.log(image);
                    // console.log(request.startX);
                    // console.log('a');
                    // var image = new Image(),
                    //     canvas = document.createElement('canvas'),
                    //     ctx = canvas.getContext('2d');
                    // console.log('b');
    
                    // image.src = 'image';
    
                    // image.onload = function(){
                    //     ctx.drawImage(image,
                    //         request.startX, request.startY,   // Start at 70/20 pixels from the left and the top of the image (crop),
                    //         request.croppedImageWidth, request.croppedImageHeight,   // "Get" a `50 * 50` (w * h) area from the source image (crop),
                    //         0, 0,     // Place the result at 0, 0 in the canvas,
                    //         100, 100); // With as width / height: 100 * 100 (scale)
                    //     console.log('c');
    
                    // }
                    // return image;
                });
                // chrome.runtime.sendMessage({message: "update_container", items: items}, function(response) {
    
                // });
                // console.log(items);
            } else if (request.message === "update_container"){
                chrome.runtime.sendMessage({message: "update_container", items: items});
            }
        }
    );



});



// This block is new!


// chrome.bookmarks.onCreated.addListener(function() {
//     console.log('open');
// });
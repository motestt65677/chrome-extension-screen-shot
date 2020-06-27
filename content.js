var startX;
var startY;
var croppedImageWidth;
var croppedImageHeight;

document.body.innerHTML = document.body.innerHTML + `<div id="screenshot-screen-shot" class="container-screen-shot" @mousemove="move" @mousedown="mouseDown" @mouseup="mouseUp">
        
        <transition name="screenshot-screen-shot">
            <div class="Flash" v-if="tookScreenShot"></div>
        </transition>
        <div class="overlay-screen-shot" :class="{ 'highlighting' : mouseIsDown }" :style="{ borderWidth: borderWidth }"></div>
        <div class="crosshairs-screen-shot" :class="{ 'hidden' : isDragging }" :style="{ left: crossHairsLeft + 'px', top: crossHairsTop + 'px' }"></div>
        <div class="borderedBox-screen-shot" :class="{ 'hidden': !isDragging }" :style="{ left: boxLeft + 'px', top: boxTop + 'px', width: boxEndWidth + 'px', height: boxEndHeight + 'px' }"></div>
        <span class="tooltip-screen-shot" :class="{ 'hidden': !isDragging }" :style="{ left: toolTipLeft + 'px', top: toolTipTop + 'px'}">{{boxEndWidth}} x {{boxEndHeight}}px</span>
        </div>
        <canvas id="thisCanvas" style="z-index:999;"></canvas>
        `;

var crosshairs,
    overlay,
    tooltip;

var TOOLTIP_MARGIN = +window.getComputedStyle(document.querySelector(".tooltip-screen-shot")).margin.split("px")[0];

var screenshot = new Vue({
    
    el: "#screenshot-screen-shot",

    data: {
        
        mouseIsDown: false,
        isDragging: false, 
        tookScreenShot: false, // After the mouse is released
        
        // Used to calculate where to start showing the dragging area
        startX: 0,
        startY: 0,
        endX: 0,
        endY: 0,
        
        borderWidth: "",
        
        // Handling the positioning of the crosshairs
        crossHairsLeft: 0,
        crossHairsTop: 0,
        
        // The box that contains the border and all required numbers.
        boxTop: 0,
        boxLeft: 0,
        boxEndWidth: 0,
        boxEndHeight: 0,
        
        // The tooltip's required positioning numbers.
        toolTipLeft: 0,
        toolTipTop: 0,
        toolTipWidth: 0,
        toolTipHeight: 0,
        
        windowHeight: 0,
        windowWidth: 0
    },

    mounted: function () {
        
        crosshairs = document.querySelector(".crosshairs-screen-shot");
        overlay = document.querySelector(".overlay-screen-shot");
        tooltip = document.querySelector(".tooltip-screen-shot");
        
        var self = this;
        
        this.windowWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
        this.windowHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
        
        this.toolTipWidth = tooltip.getBoundingClientRect().width;
        
        // To recalculate the width and height if the screen size changes.
        window.onresize = function () {
            self.windowWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
            self.windowHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
        };
    },

    methods: {
        move: function (e) {
        
            this.crossHairsTop = e.clientY;
            this.crossHairsLeft = e.clientX;
            
            var tooltipBoundingRect = tooltip.getBoundingClientRect();
            
            this.toolTipWidth = tooltipBoundingRect.width;
            this.toolTipHeight = tooltipBoundingRect.height;
            
            /* 
            * Change how the borderWidth is being calculated based on the x and y values.
            * Calculate the box with the 1px border's positioning and width 
            * Calculate the positioning of the tooltip */
            if (this.mouseIsDown) {
                
                var endY = this.endY = e.clientY,
                    endX = this.endX = e.clientX,
                    startX = this.startX,
                    startY = this.startY,
                    windowWidth = this.windowWidth,
                    windowHeight = this.windowHeight;
                
                // Calculating the values differently depending on how the user start's dragging.
                if (endX >= startX && endY >= startY) {
                
                this.isDragging = true;
                
                this.borderWidth = startY + "px " + (windowWidth - endX) + "px " + (windowHeight - endY) + "px " + startX + "px";
                
                this.boxTop = startY;
                this.boxLeft = startX;
                this.boxEndWidth = endX - startX;
                this.boxEndHeight = endY - startY;
                
                this.toolTipLeft = endX;
                this.toolTipTop = endY;
                
                if (endX + this.toolTipWidth >= windowWidth) {
                    this.toolTipLeft = windowWidth - this.toolTipWidth - (TOOLTIP_MARGIN * 2);
                }
                
                if (endY + this.toolTipHeight + (TOOLTIP_MARGIN * 2) >= windowHeight) {
                    this.toolTipTop = windowHeight - this.toolTipHeight - (TOOLTIP_MARGIN * 2);
                }
                
                } else if (endX <= startX && endY >= startY) {
                
                this.isDragging = true;
                
                this.borderWidth = startY + "px " + (windowWidth - startX) + "px " + (windowHeight - endY) + "px " + endX + "px";
                
                this.boxLeft = endX;
                this.boxTop = startY;
                this.boxEndWidth = startX - endX;
                this.boxEndHeight = endY - startY;
                
                this.toolTipLeft = endX - this.toolTipWidth;
                this.toolTipTop = endY;
                
                if (endX - this.toolTipWidth <= 0) {
                    this.toolTipLeft = TOOLTIP_MARGIN;
                }
                
                if (endY + this.toolTipHeight + (TOOLTIP_MARGIN * 2) >= windowHeight) {
                    this.toolTipTop = windowHeight - this.toolTipHeight - (TOOLTIP_MARGIN * 2);
                }
                
                } else if (endX >= startX && endY <= startY) {
                
                this.isDragging = true;
                
                this.boxLeft = startX;
                this.boxTop = endY;
                this.boxEndWidth = endX - startX;
                this.boxEndHeight = startY - endY;
                
                this.toolTipLeft = endX;
                this.toolTipTop = endY - this.toolTipHeight;
                
                this.borderWidth = endY + "px " + (windowWidth - endX) + "px " + (windowHeight - startY) + "px " + startX + "px";
                
                if (endX + this.toolTipWidth >= windowWidth) {
                    this.toolTipLeft = windowWidth - this.toolTipWidth - (TOOLTIP_MARGIN * 2);
                }
                
                if (endY - this.toolTipHeight <= 0) {
                    this.toolTipTop = TOOLTIP_MARGIN;
                }
                
                } else if (endX <= startX && endY <= startY) {
                
                this.isDragging = true;
                
                this.boxLeft = endX;
                this.boxTop = endY;
                this.boxEndWidth = startX - endX;
                this.boxEndHeight = startY - endY;
                
                this.borderWidth = endY + "px " + (windowWidth - startX) + "px " + (windowHeight - startY) + "px " + endX + "px";
                
                this.toolTipLeft = endX - this.toolTipWidth;
                this.toolTipTop = endY - this.toolTipHeight;
                
                if (endX - this.toolTipWidth <= 0) {
                    this.toolTipLeft = TOOLTIP_MARGIN;
                }
                
                if (endY - this.toolTipHeight <= 0) {
                    this.toolTipTop = TOOLTIP_MARGIN;
                }
                
                } else {
                this.isDragging = false;
                }
                
            }
        
        },
            
        mouseDown: function (e) {
            this.borderWidth = this.windowWidth + "px " + this.windowHeight + "px"; 
            
            this.startX = e.clientX;
            this.startY = e.clientY;
            
            this.toolTipWidth = tooltip.getBoundingClientRect().width;
            
            this.mouseIsDown = true;
            this.tookScreenShot = false;
        },
            
        mouseUp: function (e) {
            this.borderWidth = 0;
            
            if (this.isDragging) {
                // Don't take the screenshot unless the mouse moved somehow.
                this.tookScreenShot = true;
            }
            
            this.isDragging = false;
            this.mouseIsDown = false;
            // chrome.runtime.sendMessage({"message": "screen-capture"});
            // sendMessage(test);
            startX = this.startX;
            startY = this.startY;
            croppedImageWidth = this.boxEndWidth;
            croppedImageHeight = this.boxEndHeight;
        }
        
    }
});

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        if( request.message === "clicked_browser_action" ) {
            
            // document.getElementById('screenshot-screen-shot').style.display = "inline";
            chrome.runtime.sendMessage({"message": "screen-capture"});
            
        } else if (request.message === "clicked_send_coord") {
            // console.log(startX);
            // console.log(croppedImageWidth);
            chrome.runtime.sendMessage({
                "message": "clicked_send_coord", 
                "startX": startX, 
                "startY": startY,
                "croppedImageWidth": croppedImageWidth,
                "croppedImageHeight": croppedImageHeight
            });
        } else if (request.message === "update_container"){
            chrome.runtime.sendMessage({
                "message": "update_container"
            });
            // var image = new Image(),
            //     canvas = document.getElementById('thisCanvas'),
            //     ctx = canvas.getContext('2d');

            // image.src = request.image;

            // image.onload = function(){
            //     ctx.drawImage(image,
            //         request.startX, request.startY,   // Start at 70/20 pixels from the left and the top of the image (crop),
            //         request.croppedImageWidth, request.croppedImageHeight,   // "Get" a `50 * 50` (w * h) area from the source image (crop),
            //         0, 0,     // Place the result at 0, 0 in the canvas,
            //         100, 100); // With as width / height: 100 * 100 (scale)
            // }
            // document.body.appendChild(image);
            // var link = document.createElement('a');
            // link.download = 'filename.jpeg';
            // link.href = document.getElementById('thisCanvas').toDataURL()
            // link.click();
        }

    }
);


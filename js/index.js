"use strict";

(function()
{
	window.addEventListener("load", main);
}());
/*
var sWidth=window.screen.availWidth; //returns the width of the user's screen, in pixels, minus interface features like the Windows Taskbar.
var wWidth=1000; //1080
var wHeight=765; //750
var wLeft =(sWidth - wWidth)/2;	//center window on the screen
var myWindow=window.open("html/main.html", "mainWindow", "width = " + wWidth + ", height = " + wHeight + ", left = " + wLeft);*/

function main(){
	/*var btn= document.getElementById("logo");
	btn.addEventListener("click",function(){
		document.getElementById("fr").contentWindow.location.reload();
	});*/

  /*load all gameplay images for better performance*/
  preloadImages(["resources/background/0.png","resources/background/1.png","resources/background/2.png","resources/background/3.png","resources/background/4.png","resources/background/5.png","resources/background/6.png","resources/object/animation_male.png","resources/object/animation_female.png","resources/object/ball0.png","resources/object/ball1.png","resources/object/ball2.png","resources/object/ball3.png","resources/object/ball4.png","resources/object/ball5.png","resources/object/ball6.png","resources/object/brick.png","resources/object/bullet0.png","resources/object/bullet1.png","resources/object/bullet2.png","resources/object/bullet3.png","resources/object/perk0.png","resources/object/perk1.png","resources/object/perk1.png","resources/object/perk2.png","resources/object/perk3.png","resources/object/perk4.png","resources/object/perk5.png","resources/object/perk6.png","resources/object/perk7.png","resources/me.png","resources/lotus.png","resources/button/creditsBtn.png"]);
}

function preloadImages(array) {
    if (!preloadImages.list) {
        preloadImages.list = [];
    }
    var list = preloadImages.list;
    for (var i = 0; i < array.length; i++) {
        var img = new Image();
        img.onload = function() {
            var index = list.indexOf(this);
            if (index !== -1) {
                // remove image from the array once it's loaded
                // for memory consumption reasons
                list.splice(index, 1);
            }
        }
        list.push(img);
        img.src = array[i];
    }
}

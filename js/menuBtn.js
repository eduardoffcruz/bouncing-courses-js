"use strict";

(function(){
	window.addEventListener("load", main);
}());

/**/

function main(){
	var backBtn=document.getElementById("menuBtn");
  /*event listener*/
  backBtn.addEventListener("click", backToMenu);
}

function backToMenu(ev){
	parent.postMessage("click",window.location.href); //to make the click sound
	parent.postMessage("pMusic",window.location.href); //to make the click sound
  parent.postMessage("menu",window.location.href);
}

"use strict";

(function(){
	window.addEventListener("load", main);
}());

function main(){
  var btn = document.getElementById("startBtn");
  btn.addEventListener("click", sendMessage); //wait for click on button
}

function sendMessage(ev){
	parent.postMessage("click",window.location.href); //to make the click sound
	var playerName=document.getElementById("name").value;
	if(playerName==""||playerName==undefined||playerName==null) playerName="Estudante";
	parent.postMessage(playerName,window.location.href);
}

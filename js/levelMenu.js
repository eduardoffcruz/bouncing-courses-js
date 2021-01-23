"use strict";

(function()
{
	window.addEventListener("load", main);
}());

function main(){
	document.getElementById("lvlNum").innerHTML=parent.game.player.maxLevel+"/"+parent.game.levelsAvailable;

  //Dynamicly create buttons to choose level depending on the number of levels reached by player
	/*If you want to make all levels available to be played, simply change "parent.game.player.level" to "parent.game.levelsAvailable"*/
  for(var i=1;i<=parent.game.player.maxLevel;i++){
	//for(var i=1;i<=parent.game.levelsAvailable;i++){
    var btn=document.createElement("BUTTON");
    document.getElementById("lvlBtns").appendChild(btn);
    btn.innerHTML=i.toString(); //button text
    btn.id=i.toString();
		/*CSS*/
		btn.style.borderRadius="10px";
		btn.style.textAlign="center";
		btn.style.fontFamily="pixel";
		btn.style.fontWeight="bold";
		btn.style.fontSize="55px";
		btn.style.height="70px";
		btn.style.width="70px";
		btn.style.cursor="pointer";
		btn.style.color="black";
		btn.style.backgroundColor="#FFDA03";
		/**/
    btn.addEventListener("click", sendMessage);
		/*

		border-radius: 10px;
		transition-duration: 0.25s;
		background-color: #FFDA03;
		color: black;
		text-align: center;
		font-family:"pixel";
		font-weight: bold;
		font-size: 55px;
		cursor: pointer;
		top:190px;
		left:15%;
		width:50px;
		height: 50px;


		*/
  }
}

function sendMessage(ev){
	parent.postMessage("click",window.location.href); //to make the click sound
  var level=parseInt(ev.target.id,10); //id from button that triggered the event
  //parent.game.currentLevel=level; //set current level
  //parent.game.mode="arcade";
  parent.postMessage("arcd "+level,window.location.href);
}

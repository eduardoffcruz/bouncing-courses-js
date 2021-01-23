"use strict";
(function()
{
	window.addEventListener("load", main);
}());

function main(){
	var soundBtn=document.getElementById("soundBtn");
	var soundImg=document.getElementById("soundImg");
	var musicBtn=document.getElementById("musicBtn");
	var musicImg=document.getElementById("musicImg");
	var maleSelect=document.getElementById("maleImg");
	var femaleSelect=document.getElementById("femaleImg");
	var soundOn=parent.soundOn,musicOn=parent.musicOn;
	var gender=parent.game.player.gender; //only read from, never write to

	if(soundOn){
		soundImg.src="../resources/button/soundOn.png";
	}
	else{
		soundImg.src="../resources/button/soundOff.png";
	}
	if(musicOn){
		musicImg.src="../resources/button/musicOn.png";
	}
	else{
		musicImg.src="../resources/button/musicOff.png";
	}

	soundBtn.addEventListener("click",function(){
		parent.postMessage("click",window.location.href); //to make the click sound
		var child = soundBtn.childNodes;
		if(soundOn){
			soundImg.src="../resources/button/soundOff.png";
			soundOn=false;
		}
		else{
			soundImg.src="../resources/button/soundOn.png";
			soundOn=true;
		}
		parent.postMessage("snd",window.location.href); //turn on/off sound
	});
	musicBtn.addEventListener("click",function(){
		parent.postMessage("click",window.location.href); //to make the click sound
		var child = musicBtn.childNodes;
		if(musicOn){
			musicImg.src="../resources/button/musicOff.png";
			musicOn=false;
		}
		else{
			musicImg.src="../resources/button/musicOn.png";
			musicOn=true;
		}
		parent.postMessage("msc",window.location.href); //turn on/off soundBtn
		parent.postMessage("pMusic",window.location.href); //ask main to play menu music depending on soundBtn(on/off -> true/false)
	});
	/********************************************/
	if(gender=="male"){ //init
		femaleSelect.style.height="120px";
		maleSelect.style.height="200px";
	}
	else{
		femaleSelect.style.height="200px";
		maleSelect.style.height="120px";
	}
	maleSelect.addEventListener("click",function(){
		parent.postMessage("gndr male");
		femaleSelect.style.height="120px";
		maleSelect.style.height="200px";
	});
	femaleSelect.addEventListener("click",function(){
		parent.postMessage("gndr female");
		femaleSelect.style.height="200px";
		maleSelect.style.height="120px";
	});
}

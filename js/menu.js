"use strict";

(function(){
	window.addEventListener("load", main);
}());

function main(){
	var arcadeBtn=document.getElementById("arcadeBtn");
	var survivalBtn = document.getElementById("survivalBtn");
	var helpBtn = document.getElementById("helpBtn");
	var creditsBtn= document.getElementById("creditsBtn");
  var rankingBtn=document.getElementById("rankingBtn");
	var optionsBtn=document.getElementById("optionsBtn");
  var exitBtn=document.getElementById("exitBtn");
  /*event listeners*/
  arcadeBtn.addEventListener("click", sendMessage);
	survivalBtn.addEventListener("click", sendMessage);
	helpBtn.addEventListener("click", sendMessage);
	creditsBtn.addEventListener("click", sendMessage);
	optionsBtn.addEventListener("click", sendMessage);
  rankingBtn.addEventListener("click", sendMessage);
  exitBtn.addEventListener("click",sendMessage);
}

function sendMessage(ev){
	parent.postMessage("click",window.location.href); //to make the click sound
  var id=ev.target.id; //id from button that triggered the event
  var msg;
  switch(id){
    case "arcadeBtn":
      msg="levelMenu";
      break;
    case "survivalBtn":
      msg="survival";
      break;
    case "helpBtn":
      msg="help";
      break;
    case "rankingBtn":
      msg="ranking";
      break;
    case "exitBtn":
      msg="exit";
      break;
		case "optionsBtn":
		 msg="options";
     break;
		default:
			msg="credits";
			break;
  }
  parent.postMessage(msg,window.location.href);
}

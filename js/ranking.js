"use strict";

(function(){
	window.addEventListener("load", main);
}());

function main(){
	var i, p;
	var a,s;
	var arcadeRank=document.getElementById("arcade");
	var survivalRank=document.getElementById("survival");
	a=parent.getCookie("arcade");
	s=parent.getCookie("survival");
	if(a!=""){
		var arcadeScores=JSON.parse(parent.getCookie("arcade"));
		for(i=0;i<arcadeScores.length;i++){
			p=document.createElement("P");
			p.innerText=(i+1)+"º "+arcadeScores[i].name+" : "+arcadeScores[i].points+" pontos";
			arcadeRank.appendChild(p);
		}
	}
	if(s!=""){
		var survivalScores=JSON.parse(parent.getCookie("survival"));
		for(i=0;i<survivalScores.length;i++){
			p=document.createElement("P");
			p.innerText=(i+1)+"º "+survivalScores[i].name+" : "+survivalScores[i].points+" pontos";
			survivalRank.appendChild(p);
		}
	}
}

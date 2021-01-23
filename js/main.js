"use strict";

(function(){
	window.addEventListener("load", main);
}());

//main.js is the cern of the application

var soundOn=true,musicOn=true;
var sounds=[]; //[menuMusic,clickSound]
var currentPage,flag=0;
var game;
function main(){
	var menuMusic=new Audio('../resources/sound/menu.mp3');
	menuMusic.loop=true;
	menuMusic.volume=0.5;
	sounds.push(menuMusic);
	var clickSound=new Audio('../resources/sound/click.mp3');
	sounds.push(clickSound);

	window.addEventListener("message", messageHandler); //receives messages from children
  showPage("start");
}

function showPage(name){
  var frame=document.getElementsByTagName("iframe")[0];
  if(name=="exit"){
		window.location.reload();
    //window.close();
    return;
  }
  frame.src=name+".html";
  currentPage=name;
}

function hidePage(name){
  var frame = document.getElementsByTagName("iframe")[0];
	frame.src = "";
}

function messageHandler(ev){
  if(ev.origin!=document.location.origin){return;}
	var page=ev.data;
	if(page=="snd"){ //handle sound
		soundOn=!soundOn;
		return;
	}
	else if(page=="msc"){ //handle music
		musicOn=!musicOn;
		return;
	}
	else if(page=="click"){ //clickSound
		if(soundOn){
			sounds[1].play();
		}
		return;
	}
	else if(page=="pMusic"){
		if(musicOn){
			sounds[0].play();
		}
		else{
			sounds[0].pause();
		}
		return;
	}
	else if(page=="ld"){ //life down
		game.player.life--;
		return;
	}
	else if(page=="lu"){ //life up
		game.player.life++;
		return;
	}
	else if(page=="rst"){ //reset: lifes=5 points=0
		game.player.life=5;
		game.player.points=0;
		return;
	}
	else if(page.substring(0,3)=="pts"){ //update points during game && if new highscore is set, update highscore cookies depending on game mode
		game.player.points=parseInt(page.substring(4));
	//	console.log("parsed points:"+game.player.points);
		if(game.mode=="arcade"&&game.player.points>game.player.highScoreArcade){
			game.player.highScoreArcade=game.player.points;
			updateHighScores(game);
		}
		else if(game.mode=="survival"&&game.player.points>game.player.highScoreSurvival){//survival
			game.player.highScoreSurvival=game.player.points;
			updateHighScores(game);
		}
		return;
	}
	else if(page.substring(0,4)=="gndr"){
		game.player.gender=page.substring(5);
		return;
	}
	else if(page=="vrxqw"){ //only useful if we want a progressive unlocking level game
		game.currentLevel++;
		if(game.currentLevel>game.player.maxLevel){
			game.player.maxLevel=game.currentLevel;
			updateLevel(game.player.name,game.currentLevel);
		}
		return;
	}
	if(flag==0){
		sounds[0].play();
		page="menu";
		game=new Game(new Player(ev.data));
		game.player.maxLevel=getLastLevel(game.player.name);
		flag=1;
	}
	else if(page.substring(0,4)=="arcd"){
		sounds[0].pause();
		game.mode="arcade";
		game.currentLevel=parseInt(page.substring(5)); //set current level
		page="gameplay";
	}
	else if(page=="survival"){
		sounds[0].pause();
		game.mode=ev.data;
		game.player.points=0;
		page="gameplay";
	}
  hidePage(currentPage);
  showPage(page);
}

	/* FUNCTIONS bellow ADAPTED FROM: www.w3schools.com/js/js_cookies.asp */
function setCookie(gameMode,scoreArray){
  var expires = "expires=Thu, 31 Dec 9999 12:00:00 UTC"; //stays on browser
  document.cookie = gameMode + "=" + scoreArray + ";" + expires + ";path=/";
}

function getCookie(gameMode){
  var name = gameMode + "=";
  var decodedCookie = decodeURIComponent(document.cookie);
  var ca = decodedCookie.split(';');
  for(var i = 0; i <ca.length; i++){
    var c = ca[i];
    while (c.charAt(0) ==' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length); //return json array
    }
  }
  return "";
}
/*****************************************************************************/
function getLastLevel(playername){
	var i,lvlNum,cookie,parsed,flag=0;
	cookie=getCookie("lvl");
	if(cookie==""||playername=="Estudante"){ //first player or default
		return 1;
	}
	else{
		parsed=JSON.parse(cookie);
		for(i=0;i<parsed.length;i++){ //if player is already registered in cookies
			if(parsed[i].name==playername){
				lvlNum = parseInt(parsed[i].lvl, 10);
				return lvlNum;
			}
		}
	}
	return 1;
}

function updateLevel(playerName,lvlNum){
	var cookie=getCookie("lvl");
	var i,parsed,flag=false;
	if(playerName=="Estudante"){
		return;
	}
	if(cookie==""){
		parsed=[];
		parsed.push({name:playerName,lvl:lvlNum});
	}
	else{
		parsed=JSON.parse(cookie);
		for(i=0;i<parsed.length;i++){
			if(parsed[i].name==playerName){
				parsed[i].lvl=lvlNum;
				flag=true;
			}
		}
		if(!flag){
			parsed.push({name:playerName,lvl:lvlNum});
		}
	}
	cookie=JSON.stringify(parsed);
	setCookie("lvl",cookie); //save scores has json string
}

function updateHighScores(game){
	var jsonScores=getCookie(game.mode);
	//console.log(jsonScores);
	var scores;
	var flag=false;
	var i,highS;
	if(game.mode=="arcade"){
		highS=game.player.highScoreArcade;
	}
	else if(game.mode=="survival"){
		highS=game.player.highScoreSurvival;
	}
	if(jsonScores==""){ //first HighScore update
		scores=[];
		scores.push({name:game.player.name,points:highS});
	}
	else{ //update already existing HighScore array
		scores=JSON.parse(jsonScores);
		for(i=0;i<scores.length;i++){ //check if player score is already registered in cookies, if so checks if current highscore is bigger than registered highscore, if so, updates cookie else stays the same
			if(scores[i].name==game.player.name){
				if(scores[i].points<highS){
					//delete score from array
					scores.splice(i,1);
					//scores[i].points=highS;
				}
				else{
					flag=true;
				}
				break;
			}
		}
		if(!flag){
			for(i=scores.length-1;i>=0;i--){
				if(highS>scores[i].points){
					continue;
				}
				else{
					break;
				}
			}
			scores.splice(i+1,0,{name:game.player.name,points:highS});
			if(scores.length>5){ //array will only save 5 high scores
				scores.splice(5,1); //maintain the array with length 5
			}
		}
	}
	jsonScores=JSON.stringify(scores);
	setCookie(game.mode,jsonScores); //save scores has json string
}

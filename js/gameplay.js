"use strict";
(function()
{
	window.addEventListener("load", main);
}());

//NOTE: game is stored in main (mother of all mains) so that when we reload this document, the information about the game and player isn't lost
//GLOBAL
var levelTime,tVar=0;//levelTime is set in init
var bulletType,lvl=parent.game.currentLevel,points=parent.game.player.points,life=parent.game.player.life; //only read from, not write to
var leftPressed=false,rightPressed=false,shot=false;
var soundOn=parent.soundOn,musicOn=parent.musicOn;
var isPaused=false,flag=false,pauseTime=0;

function main(){
  var canvas = document.getElementById("myCanvas");
	var ctx = canvas.getContext("2d");
	ctx.imageSmoothingEnabled=true;

	/*Buttons & listeners*/
	var pauseBtn=document.getElementById("pauseBtn");
	var backBtn=document.getElementById("backBtn");
	var soundBtn=document.getElementById("soundBtn");
	var soundImg=document.getElementById("soundImg");
	var musicBtn=document.getElementById("musicBtn");
	var musicImg=document.getElementById("musicImg");
	pauseBtn.addEventListener("click",function(){
	parent.postMessage("click",window.location.href); //to make the click sound
	isPaused=!isPaused;
		if(isPaused){
			document.getElementById("pause").style.display="flex";
		}
	});
	backBtn.addEventListener("click",function(){
		parent.postMessage("click",window.location.href); //to make the click sound
		isPaused=false;
		document.getElementById("pause").style.display="none";
	});
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
		parent.postMessage("msc",window.location.href); //turn on/off sound
	});
	/*******/
	//music/sound buttons when entering the game
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
	/*MUSIC AND SOUNDS*/
	var sounds=[]; //[gameplayMusic,overSound,initSound,burstSound,ropeSound,fuckerBulletSound,machineGunSound,gameoverSound,finishSound,perkSound]
	var gameplayMusic=new Audio('../resources/sound/'+parent.game.mode+'.mp3');
	gameplayMusic.loop=true;
	gameplayMusic.volume=0.3;
	sounds.push(gameplayMusic);
	sounds.push(new Audio('../resources/sound/over.mp3'));
	sounds.push(new Audio('../resources/sound/start.mp3'));
	sounds.push(new Audio('../resources/sound/burst.mp3'));
	var ropeSound=new Audio('../resources/sound/rope.mp3');
	ropeSound.loop=true;
	sounds.push(ropeSound);
	sounds.push(new Audio('../resources/sound/bullet1.mp3'));
	sounds.push(new Audio('../resources/sound/bullet0.mp3'));
	sounds.push(new Audio('../resources/sound/gameover.mp3'));
	sounds.push(new Audio('../resources/sound/finish.mp3'));
	sounds.push(new Audio('../resources/sound/perk.mp3'));
	/************************/
	init(ctx,sounds);	//load all initial objects to objectsArray and startGame
}

function init(ctx,sounds){ //load and return components
	var cw = ctx.canvas.width, ch = ctx.canvas.height;
	var bar = document.getElementById("bar");
	document.getElementById("playerName").innerHTML=parent.game.player.name+":";

	bulletType="long"; //default bullet

	var objectsArray=[]; //[student,[balls...],[bullets..],[perks..],[bricks..]]

	//create Student object
	var stHeight=90,stWidth=50;
	var student=new Student(cw/2-stWidth/2,ch-stHeight,stWidth,stHeight,"../resources/object/animation_"+parent.game.player.gender+".png");
	objectsArray[0]=student;

	//balls array (loaded from json file)
	objectsArray[1]=[];

	//bullets array
	objectsArray[2]=[];

	//perks array
	objectsArray[3]=[];

	//bricks array (loaded from json file)
	objectsArray[4]=[];

	//load Level from Json (Balls and Bricks and level config)
	var jsonPath="../levels/";
	if(parent.game.mode=="arcade"){
		document.getElementById("level").innerHTML=lvl.toString(); //display level num in game bar
		bar.style.display="block";
		jsonPath+=lvl.toString()+".json";
	}
	else{
		bar.style.display="none"; //doesnt show time bar
		document.getElementById("level").style.display="none";
		document.getElementById("lifes").style.display="none";
		document.getElementById("lifesNum").style.display="none";
		jsonPath+="survival.json";
	}
	objectsArray=loadFromJson(jsonPath,objectsArray,ctx.canvas);

	startGame(ctx,objectsArray,sounds);
}


function startGame(ctx,objectsArray,sounds){
	if(soundOn){
		sounds[2].play(); //startgame Sound
	}
	if(parent.game.mode=="arcade"){
		writeAlert("Nível: "+lvl,2000);
		var elementsDOM=[document.getElementById("time"),document.getElementById("pointsNum"),document.getElementById("lifesNum")];
	}
	else{
		writeAlert("Preparado?..",2000);
			var elementsDOM=[document.getElementById("time"),document.getElementById("pointsNum")];
	}
	setTimeout(function(){
		if(musicOn){
			sounds[0].play();
		}
		gameLoop(ctx,elementsDOM,objectsArray,sounds,0);},2000);
}

function draw(ctx,objectsArray){ //draw every object in objectsArray
	var i,ballQnt=objectsArray[1].length;

	//draw STUDENT
	if(objectsArray[0].imortal==true){
		ctx.globalAlpha=0.7;
	}
	objectsArray[0].draw(ctx);
	ctx.globalAlpha=1;
	//draw balls(SUBJECTS)
	for(i=0;i<ballQnt;i++){
		objectsArray[1][i].draw(ctx);
	}
	//draw BULLETS
	ctx.save();
	for(i=0;i<objectsArray[2].length;i++){
		objectsArray[2][i].draw(ctx);
	}
	ctx.restore();
	//draw PERKS
	for(i=0;i<objectsArray[3].length;i++){
		if(objectsArray[3][i].on==false){ //only draw inactive perks
			objectsArray[3][i].draw(ctx);
		}
	}
	//draw(&handle) BRICKS
	for(i=0;i<objectsArray[4].length;i++){
		if(objectsArray[4][i].ballLimit==ballQnt){
			objectsArray[4].splice(i,1); //delete brick from array
			i--;
			continue; //next iteration
		}
		else{
		objectsArray[4][i].draw(ctx);
		}
	}
}

function clearCanvas(ctx) {
	ctx.clearRect(0,0,ctx.canvas.width,ctx.canvas.height);
}

function loadFromJson(path,objectsArray,canvas){
	fetch(path)
		.then(function(resp){
			return resp.json();
		})
		.then(function(data){
			for(var i=0;i<data.length;i++){
				if(data[i].type=="Subject"){
					objectsArray[1].push(new Subject(data[i].x-data[i].radius,data[i].y-data[i].radius,2*data[i].radius,2*data[i].radius,data[i].color,data[i].direction));
				}
				else if(data[i].type=="Brick"){
					var brick,x=data[i].x,y=data[i].y,ballLimit=0;
					if(data[i].ballLimit!=undefined){
						ballLimit=data[i].ballLimit;
					}
					if(data[i].pattern=="horizontal"){
							for(var k=0;k<data[i].quantity;k++){
								brick=new Brick(x,y);
								brick.ballLimit=ballLimit;
								objectsArray[4].push(brick);
								x+=brick.width;
							}
					}
					else if(data[i].pattern=="vertical"){
						for(var k=0;k<data[i].quantity;k++){
							brick=new Brick(x,y);
							brick.ballLimit=ballLimit;
							objectsArray[4].push(brick);
							y+=brick.width;
						}
					}
					else{ //none
						brick=new Brick(x,y);
						brick.ballLimit=ballLimit;
						objectsArray[4].push(brick);
					}
				}
				else if(data[i].type=="Config"){
						canvas.style.backgroundImage = "url("+data[i].background+")";
						levelTime=data[i].time;
				}
				else{
					console.log("Error: Unavailable type of object in json file! You can only create new levels based on Subject's and Brick's");
				}
			}
		});
		return objectsArray;
}

function gameLoop(ctx,elementsDOM,objectsArray,sounds,startTime,time){
	var loop=function(time){
		if(startTime==0){
			startTime=time;
		}
		else if(pauseTime!=0&&!isPaused){ //handle paused time
			startTime+=time-pauseTime;
			pauseTime=0;
			flag=false;
			if(musicOn){
				sounds[0].play(); //continue playing music
			}
		}
		gameLoop(ctx,elementsDOM,objectsArray,sounds,startTime,time);
	}
	var reqID = window.requestAnimationFrame(loop);

	if(isPaused){
		sounds[0].pause();
		if(!flag){
			flag=true;
			pauseTime=time;
		}
		return;
	}
	update(ctx,objectsArray,sounds,time-startTime,reqID); //updates game logic
	render(ctx,elementsDOM,objectsArray,time-startTime); //render game state to canvas
}

function update(ctx,objectsArray,sounds,dt,reqID){
	var student=objectsArray[0];
	var balls=objectsArray[1];
	var bullets=objectsArray[2];
	var bricks=objectsArray[4];
	/*CONTROLS*/
	updateControls(objectsArray,sounds);

	/*CHECK IF STUDENT HITS BRICK (If so, he cant get through)*/
	handleStudentBrickCollision(student,objectsArray[4]);

	/*CHECK IF BULLET HITS ANY BALL, top or brick and UPDATES BULLET POSITION*/
	updateBullets(ctx,objectsArray,sounds,dt,reqID);

	if(parent.game.mode=="arcade" && dt>=levelTime*1000){ //checks if max level time has passed. If so, player loses level and loses life
	//	alert("O tempo da prova acabou :(");
		writeAlert("O tempo acabou...",1200);
		levelLost(reqID,ctx,sounds);
		return;
	}

	/*CHECK IF BALL HITS STUDENT and UPDATE BALLS MOVEMENT [BOUNCE]*/
	for(var i=0;i<balls.length;i++){
		if(!student.imortal&&student.intersectsPixel(balls[i])){ /*CHECK IF BALL COLLIDED WITH STUDENT*/
			levelLost(reqID,ctx,sounds);
			return;
		}

		//check if ball hits brick and if so change ball direction
		handleBallBrickCollision(balls[i],objectsArray[4]);

		//updates ball position
		balls[i].bounce(ctx);
	}

	/*UPDATES PERK POSITION && CHECKS IF STUDENT COLLIDES WITH PERK*/
	updatePerks(ctx,objectsArray,sounds[9],dt);

	//add 10points for each second alive in survivalMode
	if(parent.game.mode=="survival"&&dt-tVar>=500){
		tVar+=500;
		points+=5; //each second adds up 10points in the end of the level
	}
}

function render(ctx,elementsDOM,objectsArray,dt){
	//clear all canvas
	clearCanvas(ctx);

	//draw every object in the game
	draw(ctx,objectsArray);

	//updates game bar [points, time and life (DOM)]
	if(parent.game.mode=="arcade"){
		//write lifes
		elementsDOM[2].innerHTML=life.toString(); //lifesNum
		//write remainding time
		timeBar(dt); //draw and update time bar
		if(!isNaN(levelTime-dt/1000)){ //doesnt change time if time isNaN
			var txt = (levelTime-dt/1000).toFixed(1) + " s";
			elementsDOM[0].innerHTML=txt; //time
		}
	}
	else{
		var txt = "Tempo: " + (dt/1000).toFixed(1) + " s";
		elementsDOM[0].innerHTML=txt; //time
	}
	//write points
	elementsDOM[1].innerHTML=points.toString(); //pointsNum
}

function updateControls(objectsArray,sounds){
	var student=objectsArray[0];

	document.onkeydown = function(e) {
		if(e.keyCode == 37) leftPressed = true;
		if(e.keyCode == 39) rightPressed = true;
		if(e.keyCode == 32) shot = true;
	}

	document.onkeyup = function(e) {
		if(e.keyCode == 37) leftPressed = false;
		if(e.keyCode == 39) rightPressed = false;
		if(e.keyCode == 32) shot = false;
	}

	//shotting handler
	if(shot){
		shotHandler(objectsArray,sounds);
	}

	//student moving handler
	if(leftPressed){
		student.moveLeft();
	}
	else if(rightPressed){
		student.moveRight();
	}
	else{
		student.left=false;
		student.right=false;
	}

}

function shotHandler(objectsArray,sounds){
	var len=objectsArray[2].length;
		switch(bulletType){
			case "long":
				if(len==0){
					objectsArray[2].push(new Bullet(objectsArray[0].x+objectsArray[0].width/2,objectsArray[0].y+objectsArray[0].height,bulletType));
					if(soundOn){
						sounds[4].play();
					}
				}
				break;
			case "machineGun":
				if(len<=8){
							objectsArray[2].push(new Bullet(objectsArray[0].x+objectsArray[0].width/2,objectsArray[0].y,bulletType));
							shot=false;
							if(soundOn){
								sounds[6].play();
							}
				}
			 	break;
			case "fucker":
					objectsArray[2]=[]; //clean array
					objectsArray[2].push(new Bullet(objectsArray[0].x+objectsArray[0].width/2,objectsArray[0].y,bulletType));
					shot=false;
					if(soundOn){
						sounds[5].play();
					}
					break;

			case "spikes": /*LIMPAR ARRAY*/
				objectsArray[2]=[]; //clean array
				objectsArray[2].push(new Bullet(objectsArray[0].x+objectsArray[0].width/2,objectsArray[0].y+objectsArray[0].height,bulletType));
				if(soundOn){
					sounds[4].play();
				}
				break;
		}
}

function handleStudentBrickCollision(object,bricks){
	for(var k=0;k<bricks.length;k++){
		if(object.intersectsPixel(bricks[k])){
			if(bricks[k].x<object.x){
				//if object is at the right side of brick
				object.x=Math.round(bricks[k].x+bricks[k].width);
			}
			else{
				//if object is at the left side of brick
				object.x=Math.round(bricks[k].x-object.width);
			}
			break;
		}
	}
}

function handleBallBrickCollision(ball,bricks){
	//reproduce ball collision movement after hitting brick, deppending on the position of the center of gravity of the ball
	//center of gravity=(ball.x+ball.width/2,ball.y+ball.height/2)
	var cx=ball.x+ball.width/2;
	var cy=ball.y+ball.height/2;
	for(var k=0;k<bricks.length;k++){
		if(ball.intersectsPixel(bricks[k])){
			if(cy<=bricks[k].y){
				ball.y=Math.round(bricks[k].y-ball.height);
				ball.vy*=-1;
				return;
			}
			else if(cy>bricks[k].y+bricks[k].height){
				ball.y=Math.round(bricks[k].y+bricks[k].height);
				ball.vy*=-1;
				return;
			}
			if(cx<bricks[k].x){
				ball.x=Math.round(bricks[k].x-ball.width);
				ball.vx*=-1;
			}
			else if(cx>bricks[k].x+bricks[k].width){
				ball.x=Math.round(bricks[k].x+bricks[k].width);
				ball.vx*=-1;
			}
			return;
		}
	}
}

function updateBullets(ctx,objectsArray,sounds,dt,reqID){
	var balls=objectsArray[1];
	var bullets=objectsArray[2],bullet;
	var flg,flg1;

	for(var i=0,len=bullets.length;i<len;i++){
		flg=false;
		flg1=false;
		bullet=bullets[i];
		//remove bullets that reach outside of canvas (spikes stays)
		if(bullet.y<=0||bullet.y>ctx.canvas.height){
			sounds[4].pause(); //stops ropeSound loop
			if(bulletType!="spikes"){
				flg1=true;
				bullets.splice(i,1);//removed from Array
				len--;
				i--;
				continue; //next iteration
			}
		}
		/*CHECK IF BULLET HIT ANY BALL*/
		if(!flg1){
			for(var j=0,ballsQnt=balls.length;j<ballsQnt;j++){
				if(bullet.intersectsPixel(balls[j])){
					if(soundOn){
						sounds[3].play(); //burstSound
					}
					generatePerk(balls[j],objectsArray,dt);
					objectsArray=ballHandler(objectsArray,j); //split ball or deletes ball
					ballsQnt--;
					j--;
					if(objectsArray[1].length==0){
						//NEXT LEVEL
						levelUp(dt,reqID,ctx,sounds);
					}
					if(bulletType!="fucker"){ //fucker type of bullet isn't removed after hitting ball
						/*REMOVE BULLET*/
						sounds[4].pause(); //ropeSound
						bullets.splice(i,1);	//removes bullet from array
						len--;
						i--;
						flg=true;
						break;
					}
				}//if
			}//for
			/*CHECK IF BULLET HITS BRICK*/
			if(!flg){
				for(var k=0;k<objectsArray[4].length;k++){
					if(bullet.intersectsPixel(objectsArray[4][k])){
						sounds[4].pause(); //stops ropeSound loop
						flg=true;
						if(bulletType!="spikes"){
							if(bulletType=="fucker"){ //fucker bullet can be used to destroy bricks
								objectsArray[4].splice(k,1); //delete brick from array
								k--;
							}
							bullets.splice(i,1);//removes bullet from array
							len--;
							i--;
							break;
						}
					}
				}
			}
		}
		/*UPDATES BULLET POSITION*/
		if(!flg){bullet.move();}
	}
}

function levelUp(dt,reqID,ctx,sounds){
	window.cancelAnimationFrame(reqID); //para parar loop
	sounds[0].pause(); //pause music from level
	sounds[4].pause(); //bug fixed
	points+=Math.round((levelTime-(dt/1000))*20); //each remainding second adds up 20points in the end of the level
	parent.postMessage("pts "+points,window.location.href);
	//GO TO THE NEXT LEVEL
	if(parent.game.levelsAvailable==lvl){ //check if player reached the end of the game
		if(soundOn){
			sounds[8].play();
		}
		writeAlert("PARABÉNS! CONCLUÍSTE O CURSO COM SUCESSO!",3000);
		//Back to MENU
		setTimeout(function(){parent.postMessage("menu",window.location.href);parent.postMessage("pMusic",window.location.href);},3000);
		return;
	}
	lvl++;
	parent.postMessage("vrxqw",window.location.href);//lvlup
	init(ctx,sounds); //next level
	return;
}

function levelLost(reqID,ctx,sounds){
	window.cancelAnimationFrame(reqID); //para parar loop
	sounds[0].pause(); //pause music
	sounds[4].pause(); //bug fixed
	/*save higher score*/
	parent.postMessage("pts "+points,window.location.href); //send points to be saved & processed accordingly
	if(parent.game.mode=="arcade"){
		life--; //life down
		parent.postMessage("ld",window.location.href); //life down
		if(life<=0){
			//document.getElementById("alert").style.height="200px";
			if(points>parent.game.player.highScoreArcade){
				writeAlert("As Cadeiras deram cabo do Estudante..Fica p'ró ano!<br>Score: "+points+"<br>New HighScore: "+points,3500);
			}
			else{
				writeAlert("As Cadeiras deram cabo do Estudante..Fica p'ró ano!<br>Score: "+points+"<br>HighScore: "+parent.game.player.highScoreArcade,3500);
			}

			if(soundOn){
				sounds[7].play();
			}
			//VOLTAR PARA O MENU
			parent.postMessage("rst",window.location.href); //0 points | 5 lifes
			setTimeout(function(){parent.postMessage("menu",window.location.href);parent.postMessage("pMusic",window.location.href);},3500); //back to menu after displaying messages
			return;
		}
		else{
			writeAlert("Autch! Essa deve ter doído..",2000);
			if(soundOn){
				sounds[1].play(); //overSound
			}
			//repeat level
			setTimeout(function(){init(ctx,sounds);},2000); //restart level
		}
	}
	else{//survivalMode
		//document.getElementById("alert").style.height="200px";
		if(points>parent.game.player.highScoreSurvival){
			writeAlert("Essa Cadeira deu cabo do Estudante!<br>Score: "+points+"<br>New HighScore: "+points,2300);
		}
		else{
			writeAlert("Essa Cadeira deu cabo do Estudante!<br>Score: "+points+"<br>HighScore: "+parent.game.player.highScoreSurvival,2300);
		}
		points=0;
		if(soundOn){
			sounds[1].play(); //overSound
		}
		setTimeout(function(){init(ctx,sounds);},2300); //restart game
	}
}

function ballHandler(objectsArray,j){ //depends on game mode|decides what happens to ball that was hit by the bullet
	var b=objectsArray[1][j]; //balls=objectsArray[1]
	var radius=b.width/2;

	if(parent.game.mode=="arcade"){
		if(radius<=20){
				objectsArray[1].splice(j,1);//removes ball from array
				points+=65;
		}
		else{ //default sizes that will be used: 80,65,50,35,25,15
			if(radius>=40){radius-=15;points+=35;}
			else{radius-=10;points+=45;}
				objectsArray[1].push(new Subject(b.x+radius,b.y+radius,radius*2,radius*2,b.color,"l"));
				objectsArray[1].push(new Subject(b.x+radius,b.y+radius,radius*2,radius*2,b.color,"r"));
				objectsArray[1].splice(j,1);//removes ball from array
		}
	}

	else{ //game mode==survival
		var ballRadius=[15,25,40,60]; //can add more sizes
		var i=Math.floor(Math.random()*(ballRadius.length-1));
		var colors=["green","red","navy","purple","yellow","grey","blue"];

		var k=Math.floor(Math.random()*(colors.length-1));
		var c=colors[k];
		//randomize size of balls
		if(radius==15){
			points+=35;
			if(objectsArray[1].length==1){
				radius=ballRadius[i];
				objectsArray[1].push(new Subject(b.x+radius,b.y+radius,radius*2,radius*2,c,"l"));
				objectsArray[1].push(new Subject(b.x+radius,b.y+radius,radius*2,radius*2,c,"r"));
			}
			objectsArray[1].splice(j,1);//removes ball from array
		}
		else{
			points+=25;
			radius=ballRadius[i];
			objectsArray[1].push(new Subject(b.x+radius,b.y+radius,radius*2,radius*2,colors[k],"l"));
			objectsArray[1].push(new Subject(b.x+radius,b.y+radius,radius*2,radius*2,colors[k],"r"));
			objectsArray[1].splice(j,1);//removes ball from array
		}
	}
	return objectsArray;
}

function generatePerk(ball,objectsArray,dt){
	//perks go from 0 to 7 inclusive
	var n=Math.floor(Math.random()*50); //generates random number 0 to 50 exclusive
	if(n<=7){ //14% probability a perk is generated when ball gets hit
		var bRadius=ball.width/2;
		if(parent.game.mode=="survival"&&n==2){return;} //fucker bullet isn't available in survival mode
		objectsArray[3].push(new Perk(ball.x+bRadius,ball.y,n,dt));
	}
}

function updatePerks(ctx,objectsArray,sound,dt){
	//each perk only lasts 6seconds before disappearing
	//lasts 10 seconds if activated
	var perk;
	for(var i=0;i<objectsArray[3].length;i++){ //handle each perk
		perk=objectsArray[3][i];
		perk.update(ctx); //move perk
		if(perk.on==false&&dt-perk.time>=6000){ //if perk hasn't been activated and 6 seconds have passed
			//remove perk from array
			objectsArray[3].splice(i,1);
		}
		else if(perk.on==true&&dt-perk.time>=10000){ //if perk is active and 10 seconds have passed since activation
			if(perk.type>=2&&perk.type<=4){ //if perk's changed the bulletType of the game
				//back to default;
				bulletType="long";
			}
			else if(perk.type==6){
				objectsArray[0].imortal=false;
			}
			else if(perk.type==5){
				//back to default
				objectsArray[0].width=50;
				objectsArray[0].height=90;
				objectsArray[0].y=ctx.canvas.height-objectsArray[0].height;
			}
			//remove perk from array
			objectsArray[3].splice(i,1);
		}
		//check if student collides with perk
		if(perk.on==false&&objectsArray[0].intersectsPixel(perk)){
			if(soundOn){
				sound.play();
			}
			perk.on=true; //perk is activated
			perk.time=dt; //time of activation
			switch(perk.type){
				case 0: //fino
					points+=30;
					//remove perk from array
					objectsArray[3].splice(i,1);
					break;
				case 1: //life
					if(parent.game.mode=="arcade"){
						parent.postMessage("lu",window.location.href);
						life++;
					}
					else{
						points+=15;
					}
					//remove perk from array
					objectsArray[3].splice(i,1);
					break;
				case 2: //fucker
					bulletType="fucker";
					break;
				case 3: //machineGun
					bulletType="machineGun";
					break;
				case 4: //spikes
					bulletType="spikes";
					break;
				case 5: //whiskey
					points+=10;
					//doubles dimension of student
					objectsArray[0].height*=2;
					objectsArray[0].width*=2;
					objectsArray[0].y=ctx.canvas.height-objectsArray[0].height;
					break;
				case 6: //books
					//make student imortal
					objectsArray[0].imortal=true;
					break;
				case 7: //time
					levelTime+=8; //adds 8 seconds to levelTime
					//remove perk from array
					objectsArray[3].splice(i,1);
					if(parent.game.mode=="survival"){
						points+=10;
					}
					break;
			}
		}
	}
}

function timeBar(dt){
	var time=levelTime*1000-dt;
	var bar = document.getElementById("timeBar");
  if(time>0){
		bar.style.width=(1/(levelTime*10))*time+"%";
	}
}

function writeAlert(message,duration){
	document.getElementById("alertBackground").style.display="flex";
	document.getElementById("message").innerHTML=message;
	setTimeout(function(){
		document.getElementById("alertBackground").style.display="none";
	},duration);
}

"use strict"

class Object{ //Abstract class
	constructor(x,y,w,h,path){ //coordenadas do objeto, largura,altura e img
		this.x = x;
		this.y = y;
    this.width=w;
    this.height=h;
		this.imgData;
		//this.image=img;

    if(path!=undefined&&path!=null&&path!=""){
      this.image=new Image();
			this.image.onload=function(){console.log("SpriteImage: loaded!")};
      this.image.src=path;
    }
    else{
      console.log("Unable to load image from path");
    }

	}
  /*********/
  draw(ctx){
		ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
	}
  /*********/
	erase(ctx){
		ctx.clearRect(this.x, this.y, this.width, this.height);
	}
  /*********/
	getImageData(){
		var w=this.width,h=this.height;
				var canvas = document.createElement('canvas');
				canvas.height = h;
				canvas.width = w;
				var ctx = canvas.getContext("2d");
				ctx.drawImage(this.image,0,0,w,h);
				return ctx.getImageData(0,0,w,h);
	}
	/*********/
	intersectsBoundingBox(s2){
		return (this.x < s2.x + s2.width &&
			this.x + this.width > s2.x &&
			this.y < s2.y + s2.height &&
			this.y + this.height > s2.y);
	}
  /*********/
	intersectsPixel(s2){
	   if(this.intersectsBoundingBox(s2)){
          var x,y;
   				var xmin=Math.max(this.x,s2.x);
   				var xmax=Math.min(this.x+this.width,s2.x+s2.width);
   				var ymin=Math.max(this.y,s2.y);
   				var ymax=Math.min(this.y+this.height,s2.y+s2.height);
   				//pixeis das imagens
					if(this.imgData==null||this.imgData==undefined){
						this.imgData=this.getImageData();
					}
					if(s2.imgData==null||s2.imgData==undefined){
						s2.imgData=s2.getImageData();
					}
   				var s1Pixels=this.imgData.data;
   				var s2Pixels=s2.imgData.data;
   				for(y=ymin;y<=ymax;y++){
   					for(x=xmin;x<=xmax;x++){
   						var xLocals1=Math.round(x-this.x);
   						var yLocals1=Math.round(y-this.y);
   						var xLocals2=Math.round(x-s2.x);
   						var yLocals2=Math.round(y-s2.y);
   						var s1Index=((xLocals1*(this.width*4))+(yLocals1*4))+3; //alpha=opacity
   						var s2Index=((xLocals2*(s2.width*4))+(yLocals2*4))+3;
   						if((s1Pixels[s1Index]>0)&&(s2Pixels[s2Index]>0)){
   							return true;
   						}
   					}
   				}
   				return false;
		}//if boundingBox intersects
		return false;
	}
}

class Student extends Object{
  constructor(x,y,w,h,path){
    super(x,y,w,h,path);
		this.imortal=false;
		this.left=false;
		this.right=false;
		this.frame=0; //0 or 1
  }

	moveLeft(){
		this.left=true;
		this.right=false;
		if(this.x>0)
			this.x-=5;
	}

	moveRight(){
		this.left=false;
		this.right=true;
		var cw=1000; //
		if(this.x+this.width<cw) //canvas
			this.x+=5;
	}

	draw(ctx){
		if(this.left){
			if(this.frame==0){
					ctx.drawImage(this.image,1494,0,443,913,this.x,this.y,this.width,this.height);
					this.frame=1;
			}
			else if(this.frame==1){
				ctx.drawImage(this.image,1955,0,443,913,this.x,this.y,this.width,this.height);
				this.frame=0;
			}
		}
		else if(this.right){
			if(this.frame==0){
					ctx.drawImage(this.image,519,0,445,913,this.x,this.y,this.width,this.height);
					this.frame=1;
			}
			else if(this.frame==1){
				ctx.drawImage(this.image,1007,0,445,913,this.x,this.y,this.width,this.height);
				this.frame=0;
			}
		}
		else{
			ctx.drawImage(this.image,5,0,483,913,this.x,this.y,this.width,this.height);
		}
	}
}

class Subject extends Object{
  constructor(x,y,w,h,color,dir){
		var path="../resources/object/ball";
		switch(color){
			case "blue":
				path+="0.png";
				break;
			case "navy":
				path+="1.png";
				break;
			case "red":
				path+="2.png";
				break;
			case "grey":
				path+="3.png";
				break;
			case "yellow":
				path+="4.png";
				break;
			case "green":
				path+="5.png";
				break;
			case "purple":
				path+="6.png";
				break;
			default:
				console.log("Error: Color unavailable"); //then choose default color
				path+="0.png";
				break;
		}
    super(x,y,w,h,path);
		this.color=color
    //bounce purposes
    this.dir=dir; //l or r (left/right)
    this.speed=6;
    this.vx=Math.cos(298*Math.PI/180)*this.speed; //positive by default
		this.vy=Math.sin(298*Math.PI/180)*this.speed; //positive by default
    if(dir=="l"){
			this.vx*=-1; //negative
		}
  }

  bounce(ctx){
		var cw=ctx.canvas.width;
		var ch=ctx.canvas.height;
		var x=this.x,y=this.y;
		var gravity=0.1;

		x+=this.vx;
		y+=this.vy;

		//if ball hits the wall change direction
    if (x+this.width>=cw){
			x=cw-this.width;
			this.vx*=-1;
		}
		else if(this.x<0){
			x=0;
    	this.vx*=-1;
    }

		//if ball hits the floor
    if (y+this.height>=ch){
			y=ch-this.height;
			this.vy-=gravity; //to slow down
			this.vy*=-1;
    }

		this.x=x;
		this.y=y;
		this.vy+=gravity;
	}

}

class Bullet extends Object{
	//there are different type of bullets with different types of behavior
	/*spikes: all the way to the top and stays there until ball hits it
	*machineGun: small fast bullets can be shot with little time difference between each other
	*long [default]:all the way to the top, disappears when hits the top or a ball
	*fucker:Burst every ball on it's way. Disappears when hits the top. Can destroy bricks
	*/
	constructor(x,y,type){
		var path="../resources/object/bullet",w,h,s;
		w=10;
		switch(type){
			case "long":
				path+="0.png";
				h=660; //ctx.canvas.height-bar height
				s=8;
				break;

			case "spikes":
				path+="2.png";
				h=660; //ctx.canvas.height
				s=8;
				w=16;
				break;

			case "machineGun":
				path+="1.png";
				h=660/15;
				s=15;
				break;

		  case "fucker":
				path+="3.png";
				h=660/60; //
				s=20;
				break;
		}
		super(x,y,w,h,path);
		this.type=type;
		this.speed=s;
	}

	move(){
		if(this.y>0)
			this.y-=this.speed;
	}
}

class Brick extends Object{
	constructor(x,y){
		var path="../resources/object/brick.png";
		super(x,y,40,40,path);
		this.ballLimit=0; //brick disappear when there's only a ballLimit number of balls in the game (zero by default)
	}
}

class Perk extends Object{ //affects jogability depending on type. For example, applies different type of bullet,+1 life, more time..
	constructor(x,y,type,time){
		var path="../resources/object/perk";
		//w=10;h=16;
		path+=type+".png";
		super(x,y,24,36,path);
		this.type=type;
		this.on=false; //to know if perk is active
		this.time=time; //in miliseconds
		this.speed=3;
	}

	update(ctx){
		if(this.y<ctx.canvas.height-this.height) //falls
			this.y+=this.speed;
	}
}

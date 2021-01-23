"use strict"

class Game{ //stores Game config during game
  constructor(player){
    this.player=player;
    this.mode; //arcade or survival
    this.currentLevel; //level choosen by user to be played
    this.levelsAvailable=18; /*number of levels available to be played! Update this number if you create a new level!*/
  }
}

class Player{ //stores player data during game
  constructor(name){
    this.name=name;
    this.gender="male"; //by default
    this.life=5; //for level mode only, player starts with 5 lifes
    this.maxLevel=1; //max Level user has reached
    this.points=0;
    this.highScoreArcade=0;
    this.highScoreSurvival=0;
  }
}

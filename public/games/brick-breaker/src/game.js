import Paddle from '/src/paddle.js'
import InputHandler from '/src/input.js'
import Ball from '/src/ball.js'
import Brick from '/src/brick.js';
import {buildLevel, level1, level2} from '/src/level.js'

const GAMESTATE = {
    PAUSED: 0,
    RUNNING: 1,
    MENU: 2,
    GAMEOVER: 3,
    NEWLEVEL: 4
  };
export default class Game{
    constructor(GAME_WIDTH,GAME_HEIGHT) {
        this.width = GAME_WIDTH;
        this.height = GAME_HEIGHT;
        this.gameState = GAMESTATE.MENU;
        this.gameObjects = [];
        this.bricks = []
        this.paddle = new Paddle(this);
        this.ball = new Ball(this);
        this.lives = 2;

        this.levels = [level1, level2];
        this.currentLevel = 0;

        new InputHandler(this.paddle, this);
    }
    start(){
        if (
            this.gameState !== GAMESTATE.MENU &&
            this.gameState !== GAMESTATE.NEWLEVEL
          )
            return;
        this.bricks = buildLevel(this,this.levels[this.currentLevel]);
        this.ball.reset();
        this.gameObjects = [this.paddle, this.ball];
        this.gameState = GAMESTATE.RUNNING;
    }
    draw(ctx){
        [...this.gameObjects, ...this.bricks].forEach(obj => obj.draw(ctx));

        if (this.gameState === GAMESTATE.PAUSED) {
            ctx.rect(0, 0, this.width, this.height);
            ctx.fillStyle = "rgba(0,0,0,0.5)";
            ctx.fill();
            ctx.font = "30px Arial";
            ctx.fillStyle = "white";
            ctx.textAlign = "center";
            ctx.fillText("Paused", this.width / 2, this.height / 2);
          }

          if (this.gameState === GAMESTATE.MENU) {
            ctx.rect(0, 0, this.width, this.height);
            ctx.fillStyle = "rgba(0,0,0,1)";
            ctx.fill();
      
            ctx.font = "30px Arial";
            ctx.fillStyle = "white";
            ctx.textAlign = "center";
            ctx.fillText(
              "Press SPACEBAR To Start",
              this.width / 2,
              this.height / 2
            );
          }
          if (this.gameState === GAMESTATE.GAMEOVER) {
            ctx.rect(0, 0, this.width, this.height);
            ctx.fillStyle = "rgba(0,0,0,1)";
            ctx.fill();
      
            ctx.font = "30px Arial";
            ctx.fillStyle = "white";
            ctx.textAlign = "center";
            ctx.fillText("GAME OVER", this.width / 2, this.height / 2);
          }

    }
    update(deltaTime){
        if(this.lives ===0){
            this.gameState = GAMESTATE.GAMEOVER;
        }
        if(this.gameState === GAMESTATE.PAUSED || this.gameState === GAMESTATE.MENU|| this.gameState === GAMESTATE.GAMEOVER) return;
        
        if (this.bricks.length === 0) {
            this.currentLevel++;
            this.gameState = GAMESTATE.NEWLEVEL;
            this.start();
          }
        [...this.gameObjects, ...this.bricks].forEach(obj => obj.update(deltaTime));
        this.bricks = this.bricks.filter(brick => !brick.markedForDeletion);
    }
    togglePause(){
        if(this.gameState === GAMESTATE.PAUSED){
            this.gameState = GAMESTATE.RUNNING;
        }else{
            this.gameState = GAMESTATE.PAUSED;
        }
    }
}
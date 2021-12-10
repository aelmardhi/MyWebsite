import {detectCollision} from '/src/collisionDetection.js'
export default class Ball {
    constructor(game){
        this.GAME_WIDTH = game.width;
        this.GAME_HEIGHT = game.height;
        this.game = game;
        this.image = document.getElementById('imgBall');
        this.size = 16;
        this.reset();
    }
    reset() {
        this.position = { x: 10, y: 400 };
        this.speed = { x: 2, y: -2 };
    }
    draw(ctx){
        ctx.drawImage(
            this.image,
            this.position.x,
            this.position.y ,
            this.size ,
            this.size);
    }
    update(deltaTime){
        this.position.x += this.speed.x;
        this.position.y += this.speed.y;

        if(this.position.x + this.size > this.GAME_WIDTH || this.position.x < 0)
            this.speed.x = -this.speed.x;

        if( this.position.y < 0)
            this.speed.y = - this.speed.y;
        if(this.position.y + this.size> this.GAME_HEIGHT ){
            this.game.lives--;
            this.reset()
        }
       
        if(detectCollision(this,this.game.paddle)){
            this.speed.y = - this.speed.y;
            this.position.y = this.game.paddle.position.y - this.size;
        }
    }
}
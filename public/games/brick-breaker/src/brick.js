import {detectCollision} from '/src/collisionDetection.js'
export default class Brick{
    constructor(game,position){

        this.game = game;
        this.image = document.getElementById('imgBrick');
        this.position = position;
        this.width = 80;
        this.height = 24;

        this.markedForDeletion = false;
    }
    draw(ctx){
        ctx.drawImage(
            this.image,
            this.position.x,
            this.position.y ,
            this.width ,
            this.height);
    }
    update(deltaTime){
        if(detectCollision(this.game.ball, this)>0){
            this.game.ball.speed.y = -this.game.ball.speed.y;
            this.markedForDeletion = true;
            }
        else if(detectCollision(this.game.ball, this)<0){
                this.game.ball.speed.x = -this.game.ball.speed.x;
                this.markedForDeletion = true;
                }
        }
        
}
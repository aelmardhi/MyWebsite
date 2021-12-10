export default class Paddle {
    constructor(game) {
        this.GAME_WIDTH = game.width;
        this.GAME_HEIGHT = game.height;
        this.width = 150;
        this.height = 20;

        this.maxSpeed = 7;
        this.speed = 0;

        this.position = {
            x : this.GAME_WIDTH / 2 - this.width / 2 ,
            y : this.GAME_HEIGHT - this.height - 10 ,
        }
    }

    moveLeft() {
        this.speed = -this.maxSpeed;
    }
    moveRight() {
        this.speed = this.maxSpeed;
    }
    stop() {
        this.speed = 0;
    }

    draw(ctx){
        ctx.fillStyle = '#0ff';
        ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
    }

    update(deltaTime) {

        this.position.x += this.speed;

        if(this.position.x < 0) 
            this.position.x = 0;
        if(this.position.x + this.width > this.GAME_WIDTH)
            this.position.x = this.GAME_WIDTH - this.width;
    }
}
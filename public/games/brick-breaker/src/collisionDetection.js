export function detectCollision(ball, gameObject) {
    let bottomOfBall = ball.position.y + ball.size;
    let topOfBall = ball.position.y;
  
    let topOfObject = gameObject.position.y;
    let leftSideOfObject = gameObject.position.x;
    let rightSideOfObject = gameObject.position.x + gameObject.width;
    let bottomOfObject = gameObject.position.y + gameObject.height;
  
    if (
      bottomOfBall >= topOfObject &&
      topOfBall <= bottomOfObject &&
      ball.position.x >= leftSideOfObject &&
      ball.position.x + ball.size <= rightSideOfObject
    ) {
      if (
        bottomOfBall - ball.speed.y >= topOfObject &&
        topOfBall - ball.speed.y <= bottomOfObject &&
        ball.position.x >= leftSideOfObject &&
        ball.position.x + ball.size <= rightSideOfObject
      ) {
        return -1
      }else{
        return 1
      }
    } else {
      return 0;
    }
  }
  
import { generateFilledArrayBoard, printBoard } from "./helpers.js";

export class PredictorBoard {
  getBoard() {
    return this.boardArray;
  }

  constructor(gameState) {
    this.height = gameState.board.height;
    this.width = gameState.board.width;
    this.boardArray = generateFilledArrayBoard(this.height, this.width, ' ');
    // console.log("JSON.stringify(gameState)");
    // console.log(JSON.stringify(gameState));
    // printBoard(this.boardArray);

    gameState.board.snakes.forEach((snake) => {
      // console.log(String(snake.health));
      if (snake.health > 0) {
        this.populateSnake(snake);
      }
      // console.log(snake.body.length);
    });
  }

  placePoint(x, y, value, snakeId) {
  this.boardArray[x][y][0] = value;
  this.boardArray[x][y][1] = snakeId;
}


    populateSnake(snake) {
        // for (let j = snake.body.length - 1; j >= 0; j--) {
        for (let j = 0; j < snake.body.length; j++) {
        const bodyPoint = snake.body[j];
        this.placePoint(bodyPoint.x, bodyPoint.y, snake.body.length-j-1, snake.id);
      }
    }

    
}

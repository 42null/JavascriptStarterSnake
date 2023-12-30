// Welcome to
// __________         __    __  .__                               __
// \______   \_____ _/  |__/  |_|  |   ____   ______ ____ _____  |  | __ ____
//  |    |  _/\__  \\   __\   __\  | _/ __ \ /  ___//    \\__  \ |  |/ // __ \
//  |    |   \ / __ \|  |  |  | |  |_\  ___/ \___ \|   |  \/ __ \|    <\  ___/
//  |________/(______/__|  |__| |____/\_____>______>___|__(______/__|__\\_____>
//
// This file can be a nice home for your Battlesnake logic and helper functions.
//
// To get you started we've included code to prevent your Battlesnake from moving backwards.
// For more info see docs.battlesnake.com

import runServer from "./server.js";
import { generateFilledArrayBoard, printBoard } from "./helpers.js";

import { PredictorBoard } from './predictor.js';

// Game items set at start
let _boardMaxX = -1,
  _boardMaxY = -1;

// info is called when you create your Battlesnake on play.battlesnake.com
// and controls your Battlesnake's appearance
// TIP: If you open your Battlesnake URL in a browser you should see this data
function info() {
  console.log("INFO");

  // Color code generator from https://www.geeksforgeeks.org/javascript-generate-random-hex-codes-color/
  let letters = "0123456789ABCDEF";
  // HTML color code starts with #
  let color = "#";
  // Generating 6 times as HTML color code
  // consist of 6 letter or digits
  for (let i = 0; i < 6; i++) color += letters[Math.floor(Math.random() * 16)];

  console.log(`Choosen color is ${color}`);
  return {
    apiversion: "1",
    author: "", // TODO: Your Battlesnake Username
    color: color, // TODO: Choose color
    head: "default", // TODO: Choose head
    tail: "default", // TODO: Choose tail
  };
}

// start is called when your Battlesnake begins a game
function start(gameState) {
  console.log("GAME START");

  _boardMaxX = gameState.board.width - 1;
  _boardMaxY = gameState.board.height - 1;
}

// end is called when your Battlesnake finishes a game
function end(gameState) {
  if (gameState.board.snakes.every((snake) => snake.health <= 0)) {
    console.log("GAME CONCLUDED");
  } else {
    console.log(`I have died with length ${gameState.you.length}`);
  }

  // console.log("GS - "+JSON.stringify(gameState));
}




// move is called on every turn and returns your next move
// Valid moves are "up", "down", "left", or "right"
// See https://docs.battlesnake.com/api/example-move for available data
function move(gameState) {
    let isMoveSafe = {
        up: true,
        down: true,
        left: true,
        right: true,
    };
    let isMoveKill = {
    up: false,
    down: false,
    left: false,
    right: false,
    };

    const predictor = new PredictorBoard(gameState);

    
    console.log(`Turn # ${gameState.turn}`);
    printBoard(predictor.getBoard());
    
  // We've included code to prevent your Battlesnake from moving backwards
  const myHead = gameState.you.body[0];
  const myNeck = gameState.you.body[1];
  const myLength = gameState.you.length;

  let killOpponentLength = -1;

  // CHECK for collisions with neck
  if (myNeck.x < myHead.x) {
    isMoveSafe.left = false;
  } else if (myNeck.x > myHead.x) {
    isMoveSafe.right = false;
  } else if (myNeck.y < myHead.y) {
    isMoveSafe.down = false;
  } else if (myNeck.y > myHead.y) {
    isMoveSafe.up = false;
  }
  // CHECK for collisions with walls.
  if (myHead.x == 0) {
    isMoveSafe.left = false;
  } else if (myHead.x == _boardMaxX) {
    isMoveSafe.right = false;
  }
  if (myHead.y == 0) {
    isMoveSafe.down = false;
  } else if (myHead.y == _boardMaxY) {
    // console.log("Not safe up");
    isMoveSafe.up = false;
  }

  // TODO: Step 2 - Prevent your Battlesnake from colliding with itself
  const myBody = gameState.you.body;
  myBody.forEach(function (myBodyPoint) {
    if (myBodyPoint.y == myHead.y && myBodyPoint.x == myHead.x - 1) {
      isMoveSafe.left = false;
    } else if (myBodyPoint.y == myHead.y && myBodyPoint.x == myHead.x + 1) {
      isMoveSafe.right = false;
    } else if (myBodyPoint.x == myHead.x && myBodyPoint.y == myHead.y - 1) {
      isMoveSafe.down = false;
    } else if (myBodyPoint.x == myHead.x && myBodyPoint.y == myHead.y + 1) {
      isMoveSafe.up = false;
    }
  });

  // TODO: Step 3 - Prevent your Battlesnake from colliding with other Battlesnakes
  const opponents = gameState.board.snakes;
  opponents.forEach(function (opponent) {
    // Only the body of the oponent (no head) if can win in head on
    opponent.body
      // .slice(opponent.length >= myLength ? 0 : 1)
      .forEach(function (opponentBodyPart) {
        if (
          opponentBodyPart.y == myHead.y &&
          opponentBodyPart.x == myHead.x - 1
        ) {
          isMoveSafe.left = false;
        } else if (
          opponentBodyPart.y == myHead.y &&
          opponentBodyPart.x == myHead.x + 1
        ) {
          isMoveSafe.right = false;
        } else if (
          opponentBodyPart.x == myHead.x &&
          opponentBodyPart.y == myHead.y - 1
        ) {
          isMoveSafe.down = false;
        } else if (
          opponentBodyPart.x == myHead.x &&
          opponentBodyPart.y == myHead.y + 1
        ) {
          isMoveSafe.up = false;
        }
      });
  });

  // Are there any safe moves left?
  const safeMoves = Object.keys(isMoveSafe).filter((key) => isMoveSafe[key]);
  if (safeMoves.length == 0) {
    console.log(`MOVE ${gameState.turn}: No safe moves detected! Moving down`);
    return { move: "down" };
  }

  // Choose a random move from the safe moves
  const nextMove = safeMoves[Math.floor(Math.random() * safeMoves.length)];

  // TODO: Step 4 - Move towards food instead of random, to regain health and survive longer
  // food = gameState.board.food;

  // console.log(`MOVE ${gameState.turn}: ${nextMove}`);
  // console.log(myHead.y+"_"+_boardMaxY)
  return { move: nextMove };
}

runServer({
  info: info,
  start: start,
  move: move,
  end: end,
});

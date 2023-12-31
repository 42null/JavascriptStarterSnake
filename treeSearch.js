import { printPath } from "./helpers.js";

class P {
  constructor(x, y, directonTaken) {
    this.x = x;
    this.y = y;
    this.d = directonTaken;
  }
}

export class TreeSearch {
  constructor(board, startingX, startingY, steps) {
    this.boardArray = board;
    // this.starting = {"x": startingX, "y": startingY};
    this.starting = new P(startingX, startingY);
    this.paths = [];
  }

  getPoint(x, y) {
    return this.boardArray[x][y][1];
  }

  checkSourroundings(p, targetNum) {
    const sourroundings = [];
    try {
      if (this.boardArray[p.x - 1][p.y][1] === targetNum) {
        sourroundings.push(new P(p.x - 1, p.y, "left"));
      }
    } catch (e) {}
    try {
      if (this.boardArray[p.x + 1][p.y][1] === targetNum) {
        sourroundings.push(new P(p.x + 1, p.y, "right"));
      }
    } catch (e) {}
    try {
      if (this.boardArray[p.x][p.y - 1][1] === targetNum) {
        sourroundings.push(new P(p.x, p.y - 1, "down"));
      }
    } catch (e) {}
    try {
      if (this.boardArray[p.x][p.y + 1][1] === targetNum) {
        sourroundings.push(new P(p.x, p.y + 1, "up"));
      }
    } catch (e) {}
    return sourroundings;
  }

  generatePaths() {
    //Yes I know this isn't a very efficent way to do trees, but I am getting a working prototype done

    const aviablePaths = this.checkSourroundings(this.starting, 4);
    for (let i = 0; i < aviablePaths.length; i++) {
      // console.log(aviablePaths[i].x,aviablePaths[i].y,aviablePaths[i].d);
      this.paths.push([aviablePaths[i]]);
    }
    const currentPathsTotal = this.paths.length;
    for (let i = 0; i < currentPathsTotal; i++) {
      const currentPath = this.paths[0];
      const nextOptions = this.checkSourroundings(currentPath[0], 5);
      for (let j = 0; j < nextOptions.length; j++) {
        this.paths.push([...currentPath, nextOptions[j]]);
        // console.log([...currentPath, nextOptions[j]]);
      }
      this.paths.shift(1);
      // console.log(aviablePaths[i].x,aviablePaths[i].y,aviablePaths[i].d);
    }
  }

  pickPath() {
    // console.log(JSON.stringify(this.paths));
    const condensed = this.paths.map((path) => path.map((point) => point.d));
    // condensed.forEach(item => printPath(item));
    console.log("----");
    for (let i = 0; i < condensed.length; i++) {
      if (condensed[i].length < 2) {
        console.log("!!!!!!! should not move there");
        condensed.splice(i--, 1);
      }
    }
    condensed.forEach((item) => printPath(item));
    console.log();
    //     console.log(condensedPath);
  }
}

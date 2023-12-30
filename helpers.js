export function generateFilledArrayBoard(width, height, fill) {
  let array = new Array(height);
  for (let i = 0; i < height; i++) {
    let row = new Array(width);
    for (let j = 0; j < width; j++) {
      row[j] = new Array(2);
      row[j][0] = fill;
    }
    array[i] = row;
  }
  return array;
}

// export function printBoard(board) {
//   console.log("----------");
//   board.forEach(function (row) {
//     process.stdout.write("|");
//     row.forEach(function (point) {
//       process.stdout.write(String(point));
//     });
//     console.log("|");
//   });
//   console.log("----------\n");
// }

export function printBoard(board) {
  console.log(" -----------");
  for (let coloum = board[0].length - 1; coloum >= 0; coloum--) {
    process.stdout.write("|");

    for (let row = 0; row < board.length; row++) {
      process.stdout.write(String(board[row][coloum][0]));
    }

    console.log("|");
  }

  console.log(" ----------\n");
}

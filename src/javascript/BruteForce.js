import Board from "./Board";

const board = [
  [2, 2, 1, 1, 1, 2, 2,],
  [2, 2, 1, 1, 1, 2, 2,],
  [1, 1, 1, 1, 1, 1, 1,],
  [1, 1, 1, 0, 1, 1, 1,],
  [1, 1, 1, 1, 1, 1, 1,],
  [2, 2, 1, 1, 1, 2, 2,],
  [2, 2, 1, 1, 1, 2, 2,],
];

let qtdTocos = 32;

const ultimoTocoPosition = {
  i: Number,
  j: Number
}

/** @type {Board} */ let board3D;
function initBruteForce(board) {
  board3D = board;
}

async function restaUm() {

  for (let y = 0; y < 7; y++) {
    for (let x = 0; x < 7; x++) {

      // o elemento atual (x, y) sempre deverá ser uma peça (valor 1)
      if (board[y][x] !== 1) continue;

      // dá pra jogar pra uma peça abaixo
      if (y + 2 <= 6) {
        if (board[y + 2][x] === 0 && board[y + 1][x] === 1) {
          board[y][x] = 0;
          board[y + 1][x] = 0;
          board[y + 2][x] = 1;
          qtdTocos--;
          
          board3D.movePiece(x, y, x, y+2);
          board3D.putPieceAside(x, y+1);

          await checaOsTocos();

          board[y][x] = 1;
          board[y + 1][x] = 1;
          board[y + 2][x] = 0;
          qtdTocos++;

          board3D.movePiece(x, y+2, x, y);
          board3D.putPieceBack(x, y+1);
        }
      }


      // dá pra jogar pra uma peça acima
      if (y - 2 >= 0) {
        if (board[y - 2][x] === 0 && board[y - 1][x] === 1) {
          board[y][x] = 0;
          board[y - 1][x] = 0;
          board[y - 2][x] = 1;
          qtdTocos--;
          
          board3D.movePiece(x, y, x, y-2);
          board3D.putPieceAside(x, y-1);

          await checaOsTocos();

          board[y][x] = 1;
          board[y - 1][x] = 1;
          board[y - 2][x] = 0;
          qtdTocos++;

          board3D.movePiece(x, y-2, x, y);
          board3D.putPieceBack(x, y-1);
        }
      }


      // dá pra jogar pra uma peça à direita
      if (x + 2 <= 6) {
        if (board[y][x + 2] === 0 && board[y][x + 1] === 1) {
          board[y][x] = 0;
          board[y][x + 1] = 0;
          board[y][x + 2] = 1;
          qtdTocos--;
          
          board3D.movePiece(x, y, x+2, y);
          board3D.putPieceAside(x+1, y);

          await checaOsTocos();

          board[y][x] = 1;
          board[y][x + 1] = 1;
          board[y][x + 2] = 0;
          qtdTocos++;

          board3D.movePiece(x+2, y, x, y);
          board3D.putPieceBack(x+1, y);
        }
      }

      // dá pra jogar pra uma peça à esquerda
      if (x - 2 >= 0) {
        if (board[y][x - 2] === 0 && board[y][x - 1] === 1) {
          board[y][x] = 0;
          board[y][x - 1] = 0;
          board[y][x - 2] = 1;
          qtdTocos--;
          
          board3D.movePiece(x, y, x-2, y);
          board3D.putPieceAside(x-1, y);

          await checaOsTocos();

          board[y][x] = 1;
          board[y][x - 1] = 1;
          board[y][x - 2] = 0;
          qtdTocos++;

          board3D.movePiece(x-2, y, x, y);
          board3D.putPieceBack(x-1, y);
        }
      }
    }
  }
}

// gambiarra
var config = {
  sleepAmount: 100
}

function changeSleepAmount(ms) {
  config.sleepAmount = ms;
}

async function checaOsTocos() {
  if (temAlgumaJogada()) {
    await sleep(config.sleepAmount);
    await restaUm();
  } else if (qtdTocos === 1 && isLastTocoOnRightPosition()) {
    console.log("restou um");
    console.log("--------------------------------------------------------");
    printBoard();
  }
}

function temAlgumaJogada() {
  for (let y = 0; y < 7; y++) {
    for (let x = 0; x < 7; x++) {

      if (board[y][x] !== 1) continue;

      // dá pra jogar pra baixo
      if (y + 2 <= 6)
        if (board[y + 2][x] === 0 && board[y + 1][x] === 1) {
          return true;
        }


      // dá pra jogar pra cima
      if (y - 2 >= 0)
        if (board[y - 2][x] === 0 && board[y - 1][x] === 1) {
          return true;
        }


      // dá pra jogar pra direita
      if (x + 2 <= 6)
        if (board[y][x + 2] === 0 && board[y][x + 1] === 1) {
          return true;
        }


      // dá pra jogar pra esquerda
      if (x - 2 >= 0)
        if (board[y][x - 2] === 0 && board[y][x - 1] === 1) {
          return true;
        }
    }
  }

  return false;
};

function printBoard() {
  let s = '  0 1 2 3 4 5 6\n';
  for (let y = 0; y < 7; y++) {
    s += `${y} `;
    for (let x = 0; x < 7; x++) {
      const el = board[y][x];
      if (el == 2) {
        s += '  ';
      } else {
        s += `${el} `
      }
    }
    s += '\n';
  }
  console.log(s);
}

function isLastTocoOnRightPosition() {
  return board[ultimoTocoPosition.i][ultimoTocoPosition.j] === 1;
}


async function sleep(ms) {
  return new Promise(resolve => setTimeout(() => resolve(), ms));
}

function aplicaNo3D() {

}


export { initBruteForce, restaUm, changeSleepAmount }
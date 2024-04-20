const elements = ["Na", "F", "Cl", "Br", "I", "H", "OH","K","Ag","Li"];
const board = [];
const rows = 15;
const cols = 10;
const cellSize = 40;
let fallingElement;
let score = 0;
let formedSais = [];
let formedAcids = [];
let formedBases = [];
let gameOver = false;

const possibleCompounds = {
  sais: ["NaF", "NaCl", "NaBr", "NaI"],
  acids: ["HF", "HCl", "HBr", "HI"],
  bases: ["AgOH", "NaOH", "LiOH", "KOH"]
};

const colors = {
  Na: "#B0E0E6",
  F: "#2567F5",
  Cl: "#008000",
  Br: "#8B4513",
  I: "#800080",
  H: "#00FF00",
  OH: "#008080",
  Ag: "#6495ED",
  Li: "#00BFFF",
  K:"#836FFF"
};

class FallingElement {
  constructor() {
    this.row = 0;
    this.col = Math.floor(cols / 2);
    this.element = random(elements);
  }

  display() {
    textSize(20);
    textAlign(CENTER, CENTER);
    fill(colors[this.element]);
    rect(this.col * cellSize, this.row * cellSize, cellSize, cellSize);
    fill(255);
    text(
      this.element,
      this.col * cellSize + cellSize / 2,
      this.row * cellSize + cellSize / 2
    );
  }

  fall() {
    if (this.row < rows - 1 && !board[this.row + 1][this.col]) {
      this.row += 1;
    } else {
      placeElementOnBoard();
      checkForSais();
      checkForAcids();
      checkForBases();
      this.row = 0;
      this.col = Math.floor(cols / 2);
      this.element = random(elements);
      if (board[0][Math.floor(cols / 2)]) {
        gameOver = true;
      }
    }
  }

  move(dir) {
    if (dir === "left" && this.col > 0 && !board[this.row][this.col - 1]) {
      this.col -= 1;
    } else if (
      dir === "right" &&
      this.col < cols - 1 &&
      !board[this.row][this.col + 1]
    ) {
      this.col += 1;
    } else if (dir === "down") {
      this.fall();
    }
  }
}

function placeElementOnBoard() {
  board[fallingElement.row][fallingElement.col] = fallingElement.element;
}

function displayBoard() {
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      if (board[i][j]) {
        textSize(20);
        textAlign(CENTER, CENTER);
        fill(colors[board[i][j]]);
        rect(j * cellSize, i * cellSize, cellSize, cellSize);
        fill(255);
        text(
          board[i][j],
          j * cellSize + cellSize / 2,
          i * cellSize + cellSize / 2
        );
      }
    }
  }
}

function keyPressed() {
  if (!gameOver) {
    if (keyCode === LEFT_ARROW) {
      fallingElement.move("left");
    } else if (keyCode === RIGHT_ARROW) {
      fallingElement.move("right");
    } else if (keyCode === DOWN_ARROW) {
      fallingElement.move("down");
    }
  }
}

function Movetouch() {
  if (!gameOver) {
    let touchX = mouseX;
    let touchY = mouseY;

    let canvasCenterX = width / 2;
    if (touchX < canvasCenterX) {
      fallingElement.move("left");
    } else {
      fallingElement.move("right");
    }
  }
}

function setup() {
  createCanvas(cols * cellSize, rows * cellSize + 100);
  frameRate(1);

  for (let i = 0; i < rows; i++) {
    board[i] = Array(cols).fill(null);
  }

  fallingElement = new FallingElement();
}

function draw() {
  background(220);
  displayScore();
  displayCompound();
  displayBoard();

  if (gameOver) {
    if (
      formedSais.length === possibleCompounds.sais.length &&
      formedAcids.length === possibleCompounds.acids.length &&
      formedBases.length === possibleCompounds.bases.length
    ) {
      textSize(32);
      textAlign(CENTER, CENTER);
      fill(255, 0, 0);
      text("GAME OVER", width / 2, height / 2 - 50);
    } else {
      textSize(32);
      textAlign(CENTER, CENTER);
      fill(255, 0, 0);
      text("GAME OVER", width / 2, height / 2 - 50);
    }
  } else {
    fallingElement.display();
    fallingElement.fall();
  }
}
``


function displayScore() {
  fill(0);
  textSize(24);
  text(`Score: ${score}`, 50, height - 90);
}



function checkForSais() {
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) { // Verifique todas as colunas, não apenas até cols - 1
      if (board[i][j] === "Na") {
        for (let x = -1; x <= 1; x++) {
          for (let y = -1; y <= 2; y++) { // Inclua y = 2 para verificar o lado direito
            if (
              i + x >= 0 &&
              i + x < rows &&
              j + y >= 0 && // Não há necessidade de verificação do limite superior em cols aqui
              j + y < cols
            ) {
              let compound = board[i][j] + board[i + x][j + y];
              if (
                possibleCompounds.sais.includes(compound) &&
                !formedSais.includes(compound)
              ) {
                score += 10;
                formedSais.push(compound);
                board[i][j] = null;
                board[i + x][j + y] = null;
                adjustBoard();
              }
            }
          }
        }
      }
    }
  }
}

function checkForAcids() {
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) { // Verifique todas as colunas, não apenas até cols - 1
      if (board[i][j] === "H") {
        for (let x = -1; x <= 1; x++) {
          for (let y = -1; y <= 2; y++) { // Inclua y = 2 para verificar o lado direito
            if (
              i + x >= 0 &&
              i + x < rows &&
              j + y >= 0 && // Não há necessidade de verificação do limite superior em cols aqui
              j + y < cols
            ) {
              let compound = board[i][j] + board[i + x][j + y];
              if (
                possibleCompounds.acids.includes(compound) &&
                !formedAcids.includes(compound)
              ) {
                score += 10;
                formedAcids.push(compound);
                board[i][j] = null;
                board[i + x][j + y] = null;
                adjustBoard();
              }
            }
          }
        }
      }
    }
  }
}

function checkForBases() {
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) { // Verifique todas as colunas, não apenas até cols - 1
      if (board[i][j] === "OH") {
        for (let x = -1; x <= 1; x++) {
          for (let y = -1; y <= 2; y++) { // Inclua y = 2 para verificar o lado direito
            if (
              i + x >= 0 &&
              i + x < rows &&
              j + y >= 0 && // Não há necessidade de verificação do limite superior em cols aqui
              j + y < cols
            ) {
              let element = board[i + x][j + y];
              if (element === "Na" || element === "Ag" || element === "Li"||element=="K") {
                let compound = board[i][j] + element;
                score += 10;
                formedBases.push(compound); // Adicione a base formada à lista
                board[i][j] = null;
                board[i + x][j + y] = null;
                adjustBoard();
              }
            }
          }
        }
      }
    }
  }
}

  function displayCompound() {
  fill(0);
  textSize(20);
  for (let i = 0; i < possibleCompounds.sais.length; i++) {
    let color = formedSais.includes(possibleCompounds.sais[i]) ? "green" : "black";
    fill(color);
    text(possibleCompounds.sais[i], 30 + i * 60, height - 60);
  }

  for (let i = 0; i < possibleCompounds.bases.length; i++) {
    let color = formedBases.includes(possibleCompounds.bases[i].toLowerCase()) ? "blue" : "black";
    console.log("Base:", possibleCompounds.bases[i], "Cor:", color);
    fill(color);
    text(possibleCompounds.bases[i], 30 + i * 60, height - 20);
  }
  for (let i = 0; i < possibleCompounds.acids.length; i++) {
    let color = formedAcids.includes(possibleCompounds.acids[i]) ? "red" : "black";
    fill(color);
    text(possibleCompounds.acids[i], 30 + i * 60, height - 40);
  }
}            

function adjustBoard() {
  for (let i = rows - 1; i >= 0; i--) {
    for (let j = cols - 1; j >= 0; j--) {
      if (!board[i][j]) {
        let rowAbove = i - 1;
        while (rowAbove >= 0 && !board[rowAbove][j]) {
          rowAbove--;
        }
        if (rowAbove >= 0) {
          board[i][j] = board[rowAbove][j];
          board[rowAbove][j] = null;
        }
      }
    }
  }
}


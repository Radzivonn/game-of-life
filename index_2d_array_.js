const canvas = document.getElementById('mainCanvas');
const ctx = canvas.getContext('2d');
ctx.fillStyle = 'white';

const PALLETTE_K = 1.1; // RGB casting factor

const stopButton = document.getElementById('stopButton');
const pauseButton = document.getElementById('pauseButton');
const continueButton = document.getElementById('continueButton');

const genCounter = document.getElementById('genCount');

const dimensionX = canvas.width;
const dimensionY = canvas.height;

const CELL_SCALE = 4; // Scaling cells amount by dimension
const CELL_COUNT_X = dimensionX / CELL_SCALE;
const CELL_COUNT_Y = dimensionY / CELL_SCALE;

const ALIVE_RATE = 0.3; // percentage of living cells in the first generation

let paused = true;

console.log('DIMENSION ', dimensionX, dimensionY);
console.log('CELL COUNT', CELL_COUNT_X, CELL_COUNT_Y);

let cells = [];
let generationCounter = 0;

const initCells = () => {
  for (let y = 0; y < CELL_COUNT_Y; y++) {
    const row = [];
    for (let x = 0; x < CELL_COUNT_X; x++) {
      row.push(Math.random() < ALIVE_RATE ? true : false);
    }
    cells.push(row);
  }
};

const drawCells = () => {
  for (let y = 0; y < CELL_COUNT_Y; y++) {
    for (let x = 0; x < CELL_COUNT_X; x++) {
      if (cells[y][x]) {
        ctx.fillRect(
          x * CELL_SCALE,
          y * CELL_SCALE,
          1 * CELL_SCALE,
          1 * CELL_SCALE,
        );
      } else {
        ctx.clearRect(
          x * CELL_SCALE,
          y * CELL_SCALE,
          1 * CELL_SCALE,
          1 * CELL_SCALE,
        );
      }
    }
  }
};

const drawField = () => {
  drawCells();
};

const fpmY = (coord) => {
  if (coord === 0) return CELL_COUNT_Y - 1;
  else return coord;
};

const fpmX = (coord) => {
  if (coord === 0) return CELL_COUNT_X - 1;
  else return coord;
};

const fppY = (coord) => {
  if (coord === CELL_COUNT_Y - 1) return -1;
  else return coord;
};

const fppX = (coord) => {
  if (coord === CELL_COUNT_X - 1) return -1;
  else return coord;
};

const countCellNeighbors = (x, y) => {
  let neighbors = 0;
  if (cells[fpmY(y) - 1][x] === true) neighbors++;
  if (cells[y][fppX(x) + 1] === true) neighbors++;
  if (cells[fppY(y) + 1][x] === true) neighbors++;
  if (cells[y][fpmX(x) - 1] === true) neighbors++;
  if (cells[fpmY(y) - 1][fppX(x) + 1] === true) neighbors++;
  if (cells[fppY(y) + 1][fppX(x) + 1] === true) neighbors++;
  if (cells[fppY(y) + 1][fpmX(x) - 1] === true) neighbors++;
  if (cells[fpmY(y) - 1][fpmX(x) - 1] === true) neighbors++;
  return neighbors;
};

const checkCell = (x, y) => {
  const neighbors = countCellNeighbors(x, y);
  if (cells[y][x] && (neighbors === 2 || neighbors === 3)) return true;
  if (!cells[y][x] && neighbors === 3) return true;
  return false;
};

let animationID;

const getNewGeneration = () => {
  const newGeneration = [];
  for (let y = 0; y < CELL_COUNT_Y; y++) {
    newGeneration[y] = [];
    for (let x = 0; x < CELL_COUNT_X; x++) {
      newGeneration[y][x] = checkCell(x, y);
    }
  }
  return newGeneration;
};

const animate = () => {
  cells = getNewGeneration();
  drawField();
  generationCounter++;
  genCounter.innerHTML = generationCounter;
  animationID = requestAnimationFrame(() => animate());
};

const startAnimation = () => {
  if (paused) {
    animationID = requestAnimationFrame(animate);
    paused = false;
  }
};

const stopAnimation = () => {
  if (!paused) {
    cancelAnimationFrame(animationID);
    paused = true;
  }
};

pauseButton.addEventListener('click', () => stopAnimation());
continueButton.addEventListener('click', () => startAnimation());

initCells();
startAnimation();

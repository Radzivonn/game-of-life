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
    for (let x = 0; x < CELL_COUNT_X; x++) {
      cells.push(Math.random() < ALIVE_RATE ? 1 : 0);
    }
  }
};

const drawCells = () => {
  for (let y = 0; y < CELL_COUNT_Y; y++) {
    for (let x = 0; x < CELL_COUNT_X; x++) {
      if (cells[y * CELL_COUNT_X + x]) {
        /* Uncomment to color the cells with some palette */
        // ctx.fillStyle = `rgb(${Math.floor(PALLETTE_K * y)}, ${Math.floor(
        //   255 - PALLETTE_K * x,
        // )}, ${Math.floor(255 - PALLETTE_K * y)})`;

        ctx.fillRect(x * CELL_SCALE, y * CELL_SCALE, CELL_SCALE, CELL_SCALE);
      } else {
        ctx.clearRect(x * CELL_SCALE, y * CELL_SCALE, CELL_SCALE, CELL_SCALE);
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

const countCellNeighbors = (cells, x, y) => {
  const WIDTH_X = CELL_COUNT_X;
  let neighbors = 0;
  if (cells[fpmY(y) * WIDTH_X + x - WIDTH_X] === 1) neighbors++; // верхний
  if (cells[y * WIDTH_X + fppX(x) + 1] === 1) neighbors++; // правый
  if (cells[fppY(y) * WIDTH_X + x + WIDTH_X] === 1) neighbors++; // нижний
  if (cells[y * WIDTH_X + fpmX(x) - 1] === 1) neighbors++; // левый
  if (cells[fpmY(y) * WIDTH_X + fppX(x) - WIDTH_X + 1] === 1) neighbors++; // верхний правый
  if (cells[fppY(y) * WIDTH_X + fppX(x) + WIDTH_X + 1] === 1) neighbors++; // нижний правый
  if (cells[fppY(y) * WIDTH_X + fpmX(x) + WIDTH_X - 1] === 1) neighbors++; // нижний левый
  if (cells[fpmY(y) * WIDTH_X + fpmX(x) - WIDTH_X - 1] === 1) neighbors++; // верхний левый
  return neighbors;
};

const checkCell = (cells, x, y) => {
  const neighbors = countCellNeighbors(cells, x, y);
  if (cells[y * CELL_COUNT_X + x] && (neighbors === 2 || neighbors === 3))
    return 1;
  if (!cells[y * CELL_COUNT_X + x] && neighbors === 3) return 1;
  return 0;
};

let animationID;

const getNewGeneration = (cells) => {
  const newGeneration = [];
  for (let y = 0; y < CELL_COUNT_Y; y++) {
    for (let x = 0; x < CELL_COUNT_X; x++) {
      newGeneration[y * CELL_COUNT_X + x] = checkCell(cells, x, y);
    }
  }
  return newGeneration;
};

const animate = () => {
  cells = getNewGeneration(cells);
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

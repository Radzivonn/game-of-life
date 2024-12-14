const canvas = document.getElementById('mainCanvas');
const ctx = canvas.getContext('2d');
ctx.fillStyle = 'white';

const PALLETTE_K = 1.2; // RGB casting factor

const restartButton = document.getElementById('restartButton');
const pauseButton = document.getElementById('pauseButton');
const continueButton = document.getElementById('continueButton');
const RGBToggle = document.getElementById('RGB-checkbox');

const genCounter = document.getElementById('genCount');

const dimensionX = canvas.width;
const dimensionY = canvas.height;

const CELL_SCALE = 4; // scaling cells amount by dimension
const CELL_COUNT_X = dimensionX / CELL_SCALE;
const CELL_COUNT_Y = dimensionY / CELL_SCALE;

const ALIVE_RATE = 0.3; // percentage of living cells in the first generation

console.log('CANVAS DIMENSION ', dimensionX, dimensionY);
console.log('CELL DIMENSION ', CELL_COUNT_X, CELL_COUNT_Y);
console.log('NUMBER OF CELLS ', CELL_COUNT_X * CELL_COUNT_Y);

let cells = [];
let generationCounter = 0;
let animationID;
let isPaused = true;
let isPalletteON = false;

const initCells = () => {
  cellsArr = [];
  for (let y = 0; y < CELL_COUNT_Y; y++) {
    for (let x = 0; x < CELL_COUNT_X; x++) {
      cellsArr.push(Math.random() < ALIVE_RATE ? 1 : 0);
    }
  }
  return cellsArr;
};

const setFillColorByCoord = (x, y) => {
  const colorScale = CELL_SCALE;
  ctx.fillStyle = `rgb(${Math.floor(PALLETTE_K * y) * colorScale}, ${Math.floor(
    355 - PALLETTE_K * x * colorScale,
  )}, ${Math.floor(
    100 - PALLETTE_K * y + Math.floor(x / PALLETTE_K - 100) * colorScale,
  )})`;
};

const drawCell = (x, y, isAlive) => {
  if (isAlive) {
    if (isPalletteON) setFillColorByCoord(x, y);
    ctx.fillRect(x * CELL_SCALE, y * CELL_SCALE, CELL_SCALE, CELL_SCALE);
  } else ctx.clearRect(x * CELL_SCALE, y * CELL_SCALE, CELL_SCALE, CELL_SCALE);
};

const drawCells = (cells) => {
  for (let y = 0; y < CELL_COUNT_Y; y++) {
    for (let x = 0; x < CELL_COUNT_X; x++) {
      drawCell(x, y, cells[y * CELL_COUNT_X + x]);
    }
  }
};

const drawField = (cells) => {
  drawCells(cells);
};

/* functions to check for out of bounds fields to implement a looping field */
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
/* functions to check for out of bounds fields to implement a looping field */

const countCellNeighbors = (cells, x, y) => {
  const WIDTH_X = CELL_COUNT_X;
  let neighbors = 0;
  if (cells[fpmY(y) * WIDTH_X + x - WIDTH_X] === 1) neighbors++; // top
  if (cells[y * WIDTH_X + fppX(x) + 1] === 1) neighbors++; // right
  if (cells[fppY(y) * WIDTH_X + x + WIDTH_X] === 1) neighbors++; // bottom
  if (cells[y * WIDTH_X + fpmX(x) - 1] === 1) neighbors++; // left
  if (cells[fpmY(y) * WIDTH_X + fppX(x) - WIDTH_X + 1] === 1) neighbors++; // top right
  if (cells[fppY(y) * WIDTH_X + fppX(x) + WIDTH_X + 1] === 1) neighbors++; // bottom right
  if (cells[fppY(y) * WIDTH_X + fpmX(x) + WIDTH_X - 1] === 1) neighbors++; // bottom left
  if (cells[fpmY(y) * WIDTH_X + fpmX(x) - WIDTH_X - 1] === 1) neighbors++; // top left
  return neighbors;
};

/* returns next generation cell */
const checkCell = (cells, x, y) => {
  const neighbors = countCellNeighbors(cells, x, y);
  if (neighbors === 3 || (cells[y * CELL_COUNT_X + x] && neighbors === 2)) {
    return 1;
  }
  return 0;
};

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
  drawField(cells);
  generationCounter++;
  genCounter.innerHTML = generationCounter;
  animationID = requestAnimationFrame(() => animate());
};

const startAnimation = () => {
  if (isPaused) {
    animationID = requestAnimationFrame(animate);
    isPaused = false;
  }
};

const stopAnimation = () => {
  if (!isPaused) {
    cancelAnimationFrame(animationID);
    isPaused = true;
  }
};

const restartAnimation = () => {
  generationCounter = 0;
  stopAnimation();
  cells = initCells();
  startAnimation();
};

const changeColor = (checked) => {
  if (!checked) ctx.fillStyle = 'white';
  isPalletteON = checked;
  if (isPaused) drawCells(cells);
};

const drawCellsByMouse = (e) => {
  e.preventDefault();
  // if left mouse button pressed set alive cell
  // but if right mouse button pressed set empty cell
  if (e.buttons === 1 || e.buttons === 2) {
    const x = Math.floor(e.offsetX / CELL_SCALE);
    const y = Math.floor(e.offsetY / CELL_SCALE);
    cells[y * CELL_COUNT_X + x] = e.buttons === 1;
    if (isPaused) drawCell(x, y, e.buttons === 1);
  }
};

canvas.addEventListener('mousedown', (e) => drawCellsByMouse(e));
canvas.addEventListener('mousemove', (e) => drawCellsByMouse(e));
canvas.addEventListener('contextmenu', (e) => e.preventDefault());
RGBToggle.addEventListener('change', (e) => changeColor(e.target.checked));
pauseButton.addEventListener('click', () => stopAnimation());
continueButton.addEventListener('click', () => startAnimation());
restartButton.addEventListener('click', () => restartAnimation());

cells = initCells();
startAnimation();

const canvas = document.getElementById('mainCanvas');
const ctx = canvas.getContext('2d');
ctx.fillStyle = 'white';
canvas.style.width = '100%';

let FPS_LIMIT = 144;
let FPS = 0;
let lastTimestamp = 0;
let lastTimestampFPSCounter = 0;
let frameCount = 0;

const PALLETTE_K = 1.2; // RGB casting factor

let CELL_SCALE = 4; // scaling cells amount and their size by dimension
let CELL_COUNT_X = Math.round(canvas.width / CELL_SCALE);
let CELL_COUNT_Y = Math.round(canvas.height / CELL_SCALE);

let ALIVE_RATE = 0.3; // percentage of living cells in the first generation

const cellsScaleRange = document.getElementById('cellsScaleRange');
const cellsScaleSpan = document.getElementById('cellsScaleValue');
const acceptCellsScaleButton = document.getElementById(
  'acceptCellsScaleButton',
);
cellsScaleRange.value = CELL_SCALE;
cellsScaleSpan.textContent = CELL_SCALE;

const fpsCounter = document.getElementById('fpsCounter');
const fpsInput = document.getElementById('fpsInput');
const acceptFPSButton = document.getElementById('acceptFPSsettingsButton');

const fieldWidthInput = document.getElementById('fieldWidthInput');
const fieldHeightInput = document.getElementById('fieldHeightInput');
const acceptDimensionButton = document.getElementById('acceptDimensionButton');

const aliveRateSpan = document.getElementById('aliveRateValue');
const aliveRateRange = document.getElementById('aliveRateRange');
aliveRateRange.value = ALIVE_RATE;
aliveRateSpan.textContent = `${ALIVE_RATE * 100}%`;

const RGBToggle = document.getElementById('RGB-checkbox');

const restartButton = document.getElementById('restartButton');
const pauseButton = document.getElementById('pauseButton');
const continueButton = document.getElementById('continueButton');
const removeButton = document.getElementById('removeButton');

const genCounter = document.getElementById('genCount');
const populationCounter = document.getElementById('populationCounter');

console.log('CANVAS DIMENSION ', canvas.width, canvas.height);
console.log('CELL DIMENSION ', CELL_COUNT_X, CELL_COUNT_Y);
console.log('NUMBER OF CELLS ', CELL_COUNT_X * CELL_COUNT_Y);

let cells = [];
let generationCounter = 0;
let animationID;
let isPaused = true;
let isPalletteON = false;

const createColorPalette = () => {
  const colorScale = CELL_SCALE;
  const colors = [];
  for (let y = 0; y < CELL_COUNT_Y; y++) {
    for (let x = 0; x < CELL_COUNT_X; x++) {
      const r = Math.floor(PALLETTE_K * y) * colorScale;
      const g = Math.floor(355 - PALLETTE_K * x * colorScale);
      const b = Math.floor(
        100 - PALLETTE_K * y + Math.floor(x / PALLETTE_K - 100) * colorScale,
      );
      colors[y * CELL_COUNT_X + x] = `rgb(${r}, ${g}, ${b})`;
    }
  }
  return colors;
};

let colorPalette = createColorPalette();

const initCells = (aliveRate) => {
  cellsArray = [];
  for (let y = 0; y < CELL_COUNT_Y; y++) {
    for (let x = 0; x < CELL_COUNT_X; x++) {
      cellsArray.push(Math.random() < aliveRate ? 1 : 0);
    }
  }
  return cellsArray;
};

const drawCell = (x, y) => {
  if (isPalletteON) ctx.fillStyle = colorPalette[y * CELL_COUNT_X + x];
  ctx.fillRect(x * CELL_SCALE, y * CELL_SCALE, CELL_SCALE, CELL_SCALE);
};

const drawCells = (cells) => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let y = 0; y < CELL_COUNT_Y; y++) {
    for (let x = 0; x < CELL_COUNT_X; x++) {
      if (cells[y * CELL_COUNT_X + x]) {
        drawCell(x, y);
      }
    }
  }
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

const countPopulation = (cells) => {
  let counter = 0;
  for (let y = 0; y < CELL_COUNT_Y; y++) {
    for (let x = 0; x < CELL_COUNT_X; x++) {
      if (cells[y * CELL_COUNT_X + x]) counter++;
    }
  }
  return counter;
};

const countFPS = (timestamp) => {
  frameCount++;
  if (lastTimestampFPSCounter !== 0) {
    let elapsed = timestamp - lastTimestampFPSCounter;
    if (elapsed > 1000) {
      FPS = frameCount;
      fpsCounter.innerHTML = FPS;
      frameCount = 0;
      lastTimestampFPSCounter = timestamp;
    }
  } else {
    lastTimestampFPSCounter = timestamp;
  }
};

const animate = (timestamp) => {
  if (timestamp - lastTimestamp > 1000 / FPS_LIMIT) {
    countFPS(timestamp);
    lastTimestamp = timestamp;
    cells = getNewGeneration(cells);
    drawCells(cells);
    generationCounter++;
    genCounter.innerHTML = generationCounter;
    populationCounter.innerHTML = countPopulation(cells);
  }
  animationID = requestAnimationFrame((timestamp) => animate(timestamp));
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
    fpsCounter.innerHTML = 0;
    isPaused = true;
  }
};

const restartAnimation = () => {
  generationCounter = 0;
  stopAnimation();
  cells = initCells(ALIVE_RATE);
  startAnimation();
};

const removeAll = () => {
  stopAnimation();
  cells = initCells(0);
  generationCounter = 0;
  genCounter.innerHTML = generationCounter;
  populationCounter.innerHTML = 0;
  drawCells(cells);
};

const changeColor = (checked) => {
  if (!checked) ctx.fillStyle = 'white';
  isPalletteON = checked;
  if (isPaused) drawCells(cells);
};

const acceptFPS = () => {
  if (fpsInput.checkValidity() && fpsInput.value) {
    FPS_LIMIT = fpsInput.value;
    fpsInput.value = '';
    frameCount = 0;
    lastTimestampFPSCounter = 0;
  }
};

changeFieldDimension = (width, height) => {
  canvas.style.width = `${width}px`;
  canvas.width = width;
  canvas.height = height;
  CELL_COUNT_X = Math.round(width / CELL_SCALE);
  CELL_COUNT_Y = Math.round(height / CELL_SCALE);
};

changeCellsScale = (scale) => {
  CELL_SCALE = scale;
  CELL_COUNT_X = Math.round(canvas.width / CELL_SCALE);
  CELL_COUNT_Y = Math.round(canvas.height / CELL_SCALE);
  colorPalette = createColorPalette();
  restartAnimation();
};

acceptCanvasDimension = () => {
  if (
    fieldWidthInput.checkValidity() &&
    fieldHeightInput.checkValidity() &&
    fieldWidthInput.value &&
    fieldHeightInput.value
  ) {
    changeFieldDimension(fieldWidthInput.value, fieldHeightInput.value);
    fieldWidthInput.value = '';
    fieldHeightInput.value = '';
    if (!isPalletteON) ctx.fillStyle = 'white';
    colorPalette = createColorPalette();
    restartAnimation();
  }
};

const drawCellsByMouse = (e) => {
  e.preventDefault();
  // if left mouse button pressed set alive cell
  // but if right mouse button pressed set empty cell
  if (e.buttons === 1 || e.buttons === 2) {
    const x = Math.floor(e.offsetX / CELL_SCALE);
    const y = Math.floor(e.offsetY / CELL_SCALE);
    cells[y * CELL_COUNT_X + x] = e.buttons === 1 ? 1 : 0;
    if (isPaused) drawCell(x, y);
  }
};

const drawCellsByTouch = (e) => {
  const touch = e.touches[0];
  if (touch) {
    const x = Math.floor((touch.clientX - canvas.offsetLeft) / CELL_SCALE);
    const y = Math.floor((touch.clientY - canvas.offsetTop) / CELL_SCALE);
    cells[y * CELL_COUNT_X + x] = 1;
    if (isPaused) drawCell(x, y);
  }
};

const isTouchDevice = () =>
  'ontouchstart' in window ||
  navigator.maxTouchPoints > 0 ||
  navigator.msMaxTouchPoints > 0;

if (isTouchDevice()) {
  canvas.addEventListener('touchstart', (e) => drawCellsByTouch(e));
  canvas.addEventListener('touchmove', (e) => drawCellsByTouch(e));
} else {
  canvas.addEventListener('mousedown', (e) => drawCellsByMouse(e));
  canvas.addEventListener('mousemove', (e) => drawCellsByMouse(e));
}

canvas.addEventListener('contextmenu', (e) => e.preventDefault());
RGBToggle.addEventListener('change', (e) => changeColor(e.target.checked));
acceptFPSButton.addEventListener('click', () => acceptFPS());
acceptDimensionButton.addEventListener('click', () => acceptCanvasDimension());
aliveRateRange.addEventListener('input', (e) => {
  ALIVE_RATE = +e.target.value;
  aliveRateSpan.innerHTML = `${parseInt(+e.target.value * 100)}%`;
});
cellsScaleRange.addEventListener('input', (e) => {
  cellsScaleSpan.innerHTML = e.target.value;
});
acceptCellsScaleButton.addEventListener('click', () =>
  changeCellsScale(+cellsScaleRange.value),
);
pauseButton.addEventListener('click', () => stopAnimation());
continueButton.addEventListener('click', () => startAnimation());
restartButton.addEventListener('click', () => restartAnimation());
removeButton.addEventListener('click', () => removeAll());

cells = initCells(ALIVE_RATE);
startAnimation();

# [_Conway's Game of Life_](https://en.wikipedia.org/wiki/Conway%27s_Game_of_Life)
The Game of Life, also known as Conway's Game of Life or simply Life, is a cellular automaton devised by the British mathematician John Horton Conway in 1970.

## Rules
The universe of the Game of Life is an infinite, two-dimensional orthogonal grid of square cells, 
each of which is in one of two possible states, live or dead (or populated and unpopulated, respectively). 
Every cell interacts with its eight neighbors, which are the cells that are horizontally, vertically, or diagonally adjacent. At each step in time, the following transitions occur:

* Any live cell with fewer than two live neighbours dies, as if by underpopulation.
* Any live cell with two or three live neighbours lives on to the next generation.
* Any live cell with more than three live neighbours dies, as if by overpopulation.
* Any dead cell with exactly three live neighbours becomes a live cell, as if by reproduction.

The initial pattern constitutes the seed of the system. The first generation is created by applying the above rules simultaneously to every cell in the seed,
live or dead; births and deaths occur simultaneously, and the discrete moment at which this happens is sometimes called a tick. Each generation is a pure function of the preceding one.
The rules continue to be applied repeatedly to create further generations.

## Overview
![image](https://github.com/user-attachments/assets/4a42aa1c-14ec-40c6-90b4-a3cc672c6ffa)

## Game field
![image](https://github.com/user-attachments/assets/8166b6eb-32e2-49a2-abe2-bd5209e5beef)

## Number of past generations
![image](https://github.com/user-attachments/assets/37ef7d06-2fb9-4c44-81a9-252a4c6a0050)

## Сontrol buttons
![image](https://github.com/user-attachments/assets/1e97d52c-e056-4112-abfb-dcab12f9636c)

* Restart button - сreates a new field randomly filled with living cells and starts counting generations all over again
* Pause button - pauses the simulation at the generation on which pause was pressed
* Continue button - unpauses the simulation

The index_2d_array script implements a standard game on a 2d array  
![image](https://github.com/user-attachments/assets/9a55eb40-72b3-4b4c-a1ab-6182d30d0f60)

The index_1d_array script implements the same game, but the field is implemented not on a 2d array, but on a 1d array  
![image](https://github.com/user-attachments/assets/177db26c-494d-460b-947d-d363c3575fc1)

### All you need to start the game is to install the files in the same directory and open the index.html file in the browser!
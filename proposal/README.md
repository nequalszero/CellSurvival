## Cell Survival with Variations

### Background

Cell Survival is a game in which the player manipulates a circular cell on a map full of cells of varying sizes. The player's goal is to become the biggest cell on the map,
which is accomplished by eating smaller cells and avoiding being eaten by larger cells. A cell that collides with another cell will have its radius appropriately adjusted
based on its size relative to the cell it has collided with.

The Cell Survival game bears some resemblance to the mechanics involved in the popular game, Arg.io, with Arg.io implementing additional features such as splitting and viruses,
as well as different conditions for a cell to be eaten.  This simulation will incorporate a mixture of these features, as outlined in the **Functionality & MVP** and **Bonus Features** sections.  

### Functionality & MVP  

With this Cell Survival simulator:

- [ ] Users will be able to start and reset the game board
- [ ] Users will be able to adjust the velocity of their cell
- [ ] Cells will be able to consume other cells
- [ ] Appropriate win/loss messages will be displayed

In addition, this project will include:

- [ ] An About modal describing the background and rules of the game
- [ ] A production Readme

### Wireframes

This app will consist of a single screen with game board, game controls, and nav links to the Github, my LinkedIn,
and the About modal.  

![wireframes](./wireframes/JavaScriptProject.png)

### Architecture and Technologies

This project will be implemented with the following technologies:

- Vanilla JavaScript and `jquery` for overall structure and game logic,
- `HTML5 Canvas` for DOM manipulation and rendering,
- Webpack to bundle and serve up the various scripts.

In addition to the webpack entry file, there will be several scripts involved in this project:

`game.js`:

`game_view.js`:

`cell.js`: will contain the constructor and update functions for the `Cell` objects.  Each `Cell` will contain a `radius` (hexagon, triangle, or square), a `velocity`, a `position`  and an `aliveState` (`true` or `false`).

`player_cell.js`: will contain the constructor and update functions for the `PlayerCell` object.  It will have the same properties as the regular `Cell` object.

### Implementation Timeline

**Day 1**: Setup all necessary Node modules, including getting webpack up and running.  Create `webpack.config.js` as well as `package.json`.  Write a basic entry file and the bare bones of all of the scripts outlined above.

- Get a green bundle with `webpack`
- Look at old example like Asteroids to figure out what will go in the `game.js` and `game_view.js` files.

**Day 2**: Continue working on classes. Try to get stuff to appear on the screen.  Try to get stuff to update on the screen. Goals for the day:

- Get a cell to appear on the `Canvas`
- Get player cell to appear on the `Canvas`
- Get cells to move.

**Day 3**: Work on cell to cell interaction.  Goals for the day:

- Gets cells to eat cells and resize.


**Day 4**: Work on bugs.  Goals for the day:

- Work on bugs, catch up time.


### Bonus features

If there's extra time, the following features could be implemented:

- [ ] Change cell colors depending on relative size to player cell
- [ ] Adjust cell movement speed as cell gets larger
- [ ] Penalize player cell with loss of mass for direction changes.

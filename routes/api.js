'use strict';

const SudokuSolver = require('../controllers/sudoku-solver.js');

module.exports = function (app) {
  
  let solver = new SudokuSolver();

  app.route('/api/check')
    .post((req, res) => {
      const puzzle = req.body.puzzle;
      const coordinate = req.body.coordinate;
      const value = req.body.value;

      if (puzzle == ""  || puzzle == null || coordinate == ""  || coordinate == null || value == ""  || value == null) {
        return res.json({ error: 'Required field(s) missing' })
      }

      let validation = solver.validate(puzzle);

      if (validation === "Invalid characters in puzzle") {
        return res.json({ error: 'Invalid characters in puzzle' })
      } else if (validation === "Expected puzzle to be 81 characters long") {
        return res.json({ error: 'Expected puzzle to be 81 characters long' })
      }

      // check that coord is A1 - I9 
      const validCoords = /^[A-I][1-9]$/;

      if (!validCoords.test(coordinate)){
        return res.json({ error: 'Invalid coordinate'})
      }

      // check that value = 1-9 
      const validVal = /^[1-9]$/

      if (!validVal.test(value)){
        return res.json({ error: 'Invalid value' })
      }

      // validation done
      const letters = ["A", "B", "C", "D", "E", "F", "G", "H", "I"]
      const row = letters.indexOf(coordinate.split("")[0]) + 1
      const col = coordinate.split("")[1]
      
      // Check if the value is already in the coordinate
      const index = (row - 1) * 9 + (parseInt(col) - 1);
      if (puzzle[index] === value) {
        return res.json({ valid: true });
      }

      let checkRow = solver.checkRowPlacement(puzzle, row, col, value);
      let checkCol = solver.checkColPlacement(puzzle, row, col, value);
      let checkRegion = solver.checkRegionPlacement(puzzle, row, col, value);

      if (checkRow && checkCol && checkRegion) {
          return res.json({ valid: true })
      } else if (!checkRow && !checkCol && !checkRegion) {
        return res.json( {valid: false, conflict: ["row", "column", "region"] })
      } else if (!checkRow && !checkCol && checkRegion) {
        return res.json( {valid: false, conflict: ["row", "column"] })
      } else if (!checkRow && checkCol && !checkRegion) {
        return res.json( {valid: false, conflict: ["row", "region"] })
      } else if (checkRow && !checkCol && !checkRegion) {
        return res.json( {valid: false, conflict: ["column", "region"] })
      } else if (!checkRow && checkCol && checkRegion) {
        return res.json( {valid: false, conflict: ["row"] })
      } else if (checkRow && !checkCol && checkRegion) {
        return res.json( {valid: false, conflict: ["column"] })
      } else if (checkRow && checkCol && !checkRegion) {
        return res.json( {valid: false, conflict: ["region"] })
      }
    });
    
  app.route('/api/solve')
    .post((req, res) => {
      const puzzle = req.body.puzzle;
      let validation = solver.validate(puzzle);

      if (validation === "Required field missing") {
        return res.json({ error: 'Required field missing' })
      } else if (validation === "Invalid characters in puzzle") {
        return res.json({ error: 'Invalid characters in puzzle' })
      } else if (validation === "Expected puzzle to be 81 characters long") {
        return res.json({ error: 'Expected puzzle to be 81 characters long' })
      }

      let solution = solver.solve(puzzle)

      if (solver.getNextEmptyCell(solution) == -1) {
          return res.json({solution: solution})
      } else {
        return res.json({ error: 'Puzzle cannot be solved' })
      }
    });
};
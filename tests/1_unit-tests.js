const chai = require('chai');
const assert = chai.assert;

const Solver = require('../controllers/sudoku-solver.js');
let solver = new Solver();
let puzzle = '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..'
let solution = "769235418851496372432178956174569283395842761628713549283657194516924837947381625"

suite('UnitTests', () => {

  test('Logic handles a valid puzzle string of 81 characters', function(done) {
    let input = puzzle;
    assert.equal(solver.solve(input), solution);
    done();
  });

  test('Logic handles a puzzle string with invalid characters (not 1-9 or .)', function(done) {
    let input = 'XX9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..';
    assert.equal(solver.validate(input), "Invalid characters in puzzle");
    done();
  });

  test('Logic handles a puzzle string that is not 81 characters in length', function(done) {
    let input = '..9..5.1.85.4....2432......1...69.';
    assert.equal(solver.validate(input), "Expected puzzle to be 81 characters long");
    done();
  });

  test('Logic handles a valid row placement', function(done) {
    let input = '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..';
    assert.equal(solver.checkRowPlacement(input, 1, 1, 2), true);
    done();
  });

  test('Logic handles an invalid row placement', function(done) {
    let input = '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..';
    assert.equal(solver.checkRowPlacement(input, 1, 1, 9), false);
    done();
  });

  test('Logic handles a valid column placement', function(done) {
    let input = '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..';
    assert.equal(solver.checkColPlacement(input, 1, 1, 2), true);
    done();
  });

  test('Logic handles an invalid column placement', function(done) {
    let input = '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..';
    assert.equal(solver.checkColPlacement(input, 1, 1, 1), false);
    done();
  });

  test('Logic handles a valid region (3x3 grid) placement', function(done) {
    let input = '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..';
    assert.equal(solver.checkRegionPlacement(input, 1, 1, 7), true);
    done();
  });

  test('Logic handles an invalid region (3x3 grid) placement', function(done) {
    let input = '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..';
    assert.equal(solver.checkRegionPlacement(input, 1, 1, 2), false);
    done();
  });

  test('Valid puzzle strings pass the solver', function(done) {
    let input = puzzle;
    assert.equal(solver.solve(input), solution);
    done();
  });

  //todo
  test('Invalid puzzle strings fail the solver', function(done) {
    let input = "9.9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..";
    assert.notEqual(solver.getNextEmptyCell((solver.solve(input)), -1));
    done();
  });

  test('Solver returns the the expected solution for an incomplete puzzzle', function(done) {
    let input = puzzle;
    assert.equal(solver.solve(input), solution);
    done();
  });



});

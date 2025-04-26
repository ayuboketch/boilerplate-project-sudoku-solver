
// tests/1_unit-tests.js
const chai = require('chai');
const assert = chai.assert;
const Solver = require('../controllers/sudoku-solver.js');
let solver;

suite('Unit Tests', () => {
  suite('validate()', () => {
    setup(() => solver = new Solver());
    test('Valid puzzle string passes', () => {
      const { valid } = solver.validate('.................................................................................');
      assert.isTrue(valid);
    });
    test('Puzzle with invalid length', () => {
      const { error } = solver.validate('123');
      assert.equal(error, 'Expected puzzle to be 81 characters long');
    });
    test('Puzzle with invalid characters', () => {
      const { error } = solver.validate('X' + '.'.repeat(80));
      assert.equal(error, 'Invalid characters in puzzle');
    });
  });

  suite('checkRowPlacement()', () => {
    setup(() => solver = new Solver());
    test('Valid placement in row', () => {
      const puzzle = '1'.padEnd(81, '.');
      assert.isTrue(solver.checkRowPlacement(puzzle, 'A', '2', '2'));
    });
    test('Invalid placement in row', () => {
      const puzzle = '11'.padEnd(81, '.');
      assert.isFalse(solver.checkRowPlacement(puzzle, 'A', '2', '1'));
    });
  });
});

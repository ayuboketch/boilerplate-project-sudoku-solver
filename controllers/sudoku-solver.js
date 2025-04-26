// controllers/sudoku-solver.js
class SudokuSolver {

  validate(puzzleString) {
    if (puzzleString === undefined) {
      return { error: 'Required field(s) missing' };
    }
    if (puzzleString.length !== 81) {
      return { error: 'Expected puzzle to be 81 characters long' };
    }
    if (/[^\.1-9]/.test(puzzleString)) {
      return { error: 'Invalid characters in puzzle' };
    }
    return { valid: true };
  }

  checkRowPlacement(puzzleString, row, column, value) {
    const grid = this._toGrid(puzzleString);
    const r = 'ABCDEFGHI'.indexOf(row);
    const c = parseInt(column) - 1;
    const rowVals = grid[r].slice().filter((n, idx) => idx !== c && n !== '.');
    return !rowVals.includes(value);
  }

  checkColPlacement(puzzleString, row, column, value) {
    const grid = this._toGrid(puzzleString);
    const r = 'ABCDEFGHI'.indexOf(row);
    const c = parseInt(column) - 1;
    const colVals = grid.map(rowArr => rowArr[c]).filter((n, idx) => idx !== r && n !== '.');
    return !colVals.includes(value);
  }

  checkRegionPlacement(puzzleString, row, column, value) {
    const grid = this._toGrid(puzzleString);
    const r = 'ABCDEFGHI'.indexOf(row);
    const c = parseInt(column) - 1;
    const br = Math.floor(r / 3) * 3;
    const bc = Math.floor(c / 3) * 3;
    const block = [];
    for (let dr = 0; dr < 3; dr++) {
      for (let dc = 0; dc < 3; dc++) {
        const rr = br + dr;
        const cc = bc + dc;
        if (!(rr === r && cc === c) && grid[rr][cc] !== '.') {
          block.push(grid[rr][cc]);
        }
      }
    }
    return !block.includes(value);
  }

  solve(puzzleString) {
    // Validate format
    const validation = this.validate(puzzleString);
    if (validation.error) return { error: validation.error };

    // Convert to grid
    const grid = this._toGrid(puzzleString);

    // Pre-solve conflict detection
    for (let i = 0; i < 9; i++) {
      const row = grid[i].filter(n => n !== '.');
      const col = grid.map(r => r[i]).filter(n => n !== '.');
      if (this._hasDuplicates(row) || this._hasDuplicates(col)) {
        return { error: 'Puzzle cannot be solved' };
      }
    }

    for (let r = 0; r < 9; r += 3) {
      for (let c = 0; c < 9; c += 3) {
        const block = [];
        for (let dr = 0; dr < 3; dr++) {
          for (let dc = 0; dc < 3; dc++) {
            const val = grid[r+dr][c+dc];
            if (val !== '.') block.push(val);
          }
        }
        if (this._hasDuplicates(block)) {
          return { error: 'Puzzle cannot be solved' };
        }
      }
    }

    // Backtracking solver
    const solved = this._solveGrid(grid);
    if (!solved) {
      return { error: 'Puzzle cannot be solved' };
    }

    return { solution: grid.flat().join('') };
  }

  // PRIVATE HELPERS
  _toGrid(str) {
    const grid = [];
    for (let i = 0; i < 9; i++) {
      grid.push(str.slice(i * 9, i * 9 + 9).split(''));
    }
    return grid;
  }

  _hasDuplicates(arr) {
    const seen = new Set();
    for (const v of arr) {
      if (seen.has(v)) return true;
      seen.add(v);
    }
    return false;
  }

  _solveGrid(grid) {
    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        if (grid[r][c] === '.') {
          for (let val = 1; val <= 9; val++) {
            const ch = val.toString();
            const puzzleStr = grid.flat().join('');
            const row = 'ABCDEFGHI'[r];
            const col = (c + 1).toString();
            if (
              this.checkRowPlacement(puzzleStr, row, col, ch) &&
              this.checkColPlacement(puzzleStr, row, col, ch) &&
              this.checkRegionPlacement(puzzleStr, row, col, ch)
            ) {
              grid[r][c] = ch;
              if (this._solveGrid(grid)) return true;
              grid[r][c] = '.';
            }
          }
          return false;
        }
      }
    }
    return true;
  }
}

module.exports = SudokuSolver;

class SudokuSolver {

  validate(puzzleString) {
    //
    const puzzle = puzzleString;

    if (puzzle == ""  || puzzle == null) {
      return 'Required field missing';
    }

    // regex to check for valid chars'
    const validChars = /^[1-9.]+$/;

    if (!validChars.test(puzzle)){
      return 'Invalid characters in puzzle';
    }

    // check len
    if (puzzle.length != 81 ){
      return 'Expected puzzle to be 81 characters long';
    }

  }

  checkRowPlacement(puzzleString, row, column, value) {
    
    row = row - 1;
    column = column - 1;
    value = value.toString()

    let puzzleArray = puzzleString.split("");
    let rowStart = row * 9
    let rowEnd = rowStart + 9
    let rowArray = puzzleArray.slice(rowStart, rowEnd)
    
    //console.log(rowArray)

    if (!rowArray.includes(value)) {
        //console.log(`checkRowPlacement = true`)
        return true
    }

    //console.log(`checkRowPlacement = false`)
    return false
  }

  checkColPlacement(puzzleString, row, column, value) {

    row = row - 1;
    column = column - 1;
    value = value.toString()
    let colArray = []

    let puzzleArray = puzzleString.split("");

    for (let i = column; i < puzzleString.length; i+=9) {
      colArray.push(puzzleArray[i])
    }
    
    //console.log(colArray)

    if (!colArray.includes(value)) {
        //console.log(`checkColPlacement = true`)
        return true
    }
        
    //console.log(`checkColPlacement = false`)
    return false

  }

  checkRegionPlacement(puzzleString, row, column, value) {
    // row = row - 1;
    // column = column - 1;
    value = value.toString()
    let puzzleArray = puzzleString.split("");
    let regionArr = []
    const valPos = (row - 1) * 9 + column - 1

    //const letters = ["A", "B", "C", "D", "E", "F", "G", "H", "I"]


    // get the positioning in the 3x3 regionCol
    
    // RC RC RC
    // 00 01 02
    // 10 11 12
    // 20 21 22

    let regionRow = row % 3 == 2 ? 1 : row % 3 == 1 ? 0 : 2;
    let regionCol = column % 3 == 2 ? 1 : column % 3 == 1 ? 0 : 2;
    let position = regionRow.toString() + regionCol.toString()

    //console.log(`Value position: ${valPos}, R${regionRow}, C${regionCol}, Region: ${position}`)

    switch (position){

      // handling of first row
      case "00":
        for (let i = 0; i < 19; i += 9) {
          regionArr = regionArr.concat(puzzleArray.slice(valPos + i, valPos + i + 3))
        }
        //console.log(regionArr)
        break;

      case "01":
        for (let i = 0; i < 19; i += 9) {
          regionArr = regionArr.concat(puzzleArray.slice(valPos - 1 + i, valPos - 1 + i + 3))
        }
        //console.log(regionArr)
        break;

      case "02":
        for (let i = 0; i < 19; i += 9) {
          regionArr = regionArr.concat(puzzleArray.slice(valPos - 2 + i, valPos - 2 + i + 3))
        }
        //console.log(regionArr)
        break;


      // handling of second row

      case "10":
        regionArr = regionArr.concat(puzzleArray.slice(valPos - 9, valPos - 6))
        regionArr = regionArr.concat(puzzleArray.slice(valPos, valPos + 3)) 
        regionArr = regionArr.concat(puzzleArray.slice(valPos + 9, valPos + 12)) 
        //console.log(regionArr)
        break;

      case "11":
        regionArr = regionArr.concat(puzzleArray.slice(valPos - 10, valPos - 7))
        regionArr = regionArr.concat(puzzleArray.slice(valPos - 1, valPos + 2)) 
        regionArr = regionArr.concat(puzzleArray.slice(valPos + 8, valPos + 11)) 
        //console.log(regionArr)
        break;

      case "12":
        regionArr = regionArr.concat(puzzleArray.slice(valPos - 11, valPos - 8))
        regionArr = regionArr.concat(puzzleArray.slice(valPos - 2, valPos + 1)) 
        regionArr = regionArr.concat(puzzleArray.slice(valPos + 7, valPos + 10)) 
        //console.log(regionArr)
        break;

      // handling of third row
      case "20":
        for (let i = 18; i >= 0; i -= 9) {
          regionArr = regionArr.concat(puzzleArray.slice(valPos - i, valPos - i + 3))
        }
        //console.log(regionArr)
        break;

      case "21":
        for (let i = 18; i >= 0; i -= 9) {
          regionArr = regionArr.concat(puzzleArray.slice(valPos - 1 - i, valPos - 1 - i + 3))
        }
        //console.log(regionArr)
        break;

      case "22":
        for (let i = 18; i >= 0; i -= 9) {
          regionArr = regionArr.concat(puzzleArray.slice(valPos - 2 - i, valPos - 2 - i + 3))
        }
        //console.log(regionArr)
        break;

      default:
      console.log("error")
      break;
    }

  //console.log(regionArr)

    if (!regionArr.includes(value)) {
        //console.log(`checkRegionPlacement = true`)
        return true
    }
  
  //console.log(`checkRegionPlacement = false`)
  return false;

  }

  comboPlacementCheck(puzzle, row, col, value){

    if (this.checkRowPlacement(puzzle, row, col, value) && this.checkColPlacement(puzzle, row, col, value) && this.checkRegionPlacement(puzzle, row, col, value)) {
      return true
    }

    return false
  }

  getNextEmptyCell(puzzleString) {
    return puzzleString.indexOf(".")
  }


  solve(puzzleString) {
    //console.log(`${puzzleString} ###START###`)

    let nextBlankPosition = this.getNextEmptyCell(puzzleString);
    //console.log(`NextBlank = ${nextBlankPosition}`)
    let blankRow = nextBlankPosition === -1 ? -1 : Math.floor(nextBlankPosition / 9) + 1;
    let blankCol = nextBlankPosition === -1 ? -1 : (nextBlankPosition % 9) + 1;

    if (blankCol === -1){
      //console.log(`#############Base ${puzzleString}`)
      return puzzleString;
    }

    let puzzleArray;

    for (let y = 1; y <= 9; y++){
      //console.log(`row${blankRow} col${blankCol}, num${y}, rCheck = ${this.checkRowPlacement(puzzleString, blankRow, blankCol, y)} cCheck = ${this.checkColPlacement(puzzleString, blankRow, blankCol, y)}  gCheck = ${this.checkRegionPlacement(puzzleString, blankRow, blankCol, y)} `)
      if (this.comboPlacementCheck(puzzleString, blankRow, blankCol, y)) {
        puzzleArray = puzzleString.split("");
        puzzleArray[nextBlankPosition] = y.toString();
        puzzleString = puzzleArray.join("");
        //this.solve(puzzleString);
        puzzleString = this.solve(puzzleString)
        //console.log(`${puzzleString} returned string`)
      }

    }

    //console.log(`${puzzleString} before "." if. "To replace position " = ${nextBlankPosition}, next empty position = ${this.getNextEmptyCell(puzzleString)}`) //problem?

    if (this.getNextEmptyCell(puzzleString) !== -1){
      //console.log(`${puzzleString} inside "." if. To replace position = ${nextBlankPosition}`)
      puzzleArray = puzzleString.split("");
      puzzleArray[nextBlankPosition] = ".";
      puzzleString = puzzleArray.join("");
    }

    //console.log(`${puzzleString} before last return on "To replace position " = ${nextBlankPosition}, next empty position = ${this.getNextEmptyCell(puzzleString)}`) //problem?
    return puzzleString
  }
}

module.exports = SudokuSolver;


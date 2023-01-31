/**
 * @author u/IAmMoonie <https://www.reddit.com/user/IAmMoonie/>
 * @file https://www.reddit.com/r/sheets/comments/109a3nm/is_there_a_way_to_make_it_send_an_email_when_a
 * @desc Send email when column contains a date of today, send the info in a different column on the same row
 * @license MIT
 * @version 1.0
 */

/**
 * When a checkbox is checked, the function will write the value of the target cell divided by the
 * number of blank cells in the row to the unedited cells
 * @param {Object} range - the range being edited
 * @param {number} checkBoxColumn - the column number of the checkbox column
 * @returns {number} the value of the cell in the range that is being edited.
 * @throws {Error} if the edited values do not contain a boolean value
 * @example
 * onEdit({range: {A1: true}}) // cell A1 will be set to false, and values in the same row will be updated * 
 */
function onEdit({ range }) {
    /* These are user defined constants that are used in the function. */
    const checkBoxColumn = 6;
    const targetCell = "G4";
    const rowStart = 2;
    const numCols = 3;
  
    /* This is a guard clause. It is checking to see if the column that was edited is the checkbox
    column. If it is not, then the function will return. */
    if (range.getColumn() != checkBoxColumn) return;
  
    /* This is getting the sheet that was edited, the value of the target cell, the range of the edited
    cells, and the values of the edited cells. */
    const sheet = range.getSheet();
    const targetValue = sheet.getRange(targetCell).getValue();
    const editedCells = range;
    const editedValues = editedCells.getValues();
  
    /* Checking to see if the edited cells contain a boolean value. If they do, it will get the values of
    the row, get the total of the values, get the number of blank cells, and then write the value to
    write in the blank cells. */
    try {
      validateInput_(editedValues);
      if (editedValues[0][0] == true) {
        const rowValues = sheet
          .getRange(editedCells.getRow(), rowStart, 1, numCols)
          .getValues()[0];
        const totalValues = getTotalValues_(rowValues);
        const numBlankCells = getnumBlankCells_(rowValues);
        const valueToWrite = (targetValue - totalValues) / numBlankCells;
        writeNewValuesInNaNCells_(sheet, rowValues, editedCells, valueToWrite);
        editedCells.setValue(false);
      }
    } catch (error) {
      console.error(error);
    }
  }
  
  /**
   * The function throws an error if the edited cells do not contain a boolean value.
   * @param {Array} editedValues - The values that the user has entered into the cells.
   * @throws {Error} if the edited cells do not contain a boolean value.
   * @example
   * validateInput_([[true]]); // does not throw an error
   * validateInput_([["not a boolean"]]); // throws an error: "The edited cells must contain a boolean value."
   */
  function validateInput_(editedValues) {
    if (typeof editedValues[0][0] != "boolean") {
      throw new Error(`The edited cells must contain a boolean value.`);
    }
  }
  
  /**
   * It takes an array of numbers and returns the sum of all the numbers in the array.
   * @param {Array<Number>} rowValues - The values of the row.
   * @returns {Number} The total of all the values in the rowValues array.
   * @example
   * const rowValues = [1, 2, 3];
   * console.log(getTotalValues_(rowValues));
   */
  function getTotalValues_(rowValues) {
    return rowValues.reduce(
      (acc, val) => (!isNaN(val) && typeof val === "number" ? acc + val : acc),
      0
    );
  }
  
  /**
   * It returns the number of blank cells in a row.
   * @param {Array} rowValues - The values in the row.
   * @returns {number} The number of blank cells in the row.
   * @example
   * const row = [1, 2, null, 4];
   * const numBlankCells = getnumBlankCells_(row);
   * console.log(numBlankCells); // Output: 1
   */
  function getnumBlankCells_(rowValues) {
    return rowValues.filter((value) => isNaN(value) || typeof value !== "number")
      .length;
  }
  
  /**
   * It takes a sheet, a row of values, the edited cells, and a value to write. It then checks if the
   * values in the row are NaN, and if they are, it writes the value to write in the corresponding cells
   * @param {Sheet} sheet - the sheet object
   * @param {Array<number>} rowValues - The values of the row that was edited.
   * @param {Range} editedCells - The range of cells that were edited.
   * @param {number} valueToWrite - The value to write in the NaN cells.
   * @throws {Error} If the valueToWrite is not a number.
   * @example
   * writeNewValuesInNaNCells_(sheet, [1, NaN, 2, NaN], sheet.getActiveRange(), 0);
   */
  function writeNewValuesInNaNCells_(
    sheet,
    rowValues,
    editedCells,
    valueToWrite
  ) {
    const isNaNCell = rowValues.map((value) => isNaN(parseFloat(value)));
    const nanCols = isNaNCell
      .map((val, idx) => (val ? idx : undefined))
      .filter((val) => val !== undefined);
    nanCols.forEach((col) =>
      sheet.getRange(editedCells.getRow(), col + 2).setValue(valueToWrite)
    );
  }
  

import Thinker from './thinker.js';
export default class EnginePlay extends Thinker {
  #NUMBER_FIELDS = {
    c: [
      [1, 4, 7],
      [2, 5, 8],
      [3, 6, 9],
    ],
    r: [
      [1, 2, 3],
      [4, 5, 6],
      [7, 8, 9],
    ],
    d: [
      [1, 5, 9],
      [3, 5, 7],
    ],
  };

  constructor() {
    super();
    this.positionDraw = [5, 6, 9];

    //Initial tree results from class Thinker
    this.initialVars();
    this.getTreeAllResult();

    //Initial vars from game
    this.initialVars();

    //HUMAN   1 :
    //AUTO   4;
  }

  initialVars() {
    this.nextMoveHuman = true;
    this.gamePlaying = false;
    this.humanPlayX = true;
    this.numberStepComputer = 0;
    this.filed = [0, 0, 0, 0, 0, 0, 0, 0, 0];
    if (this.treeAllResult) {
      this.curentTreeBranch = this.treeAllResult;
    }
  }

  stopGame() {
    this.initialVars();
  }

  isGamePlaying() {
    return this.gamePlaying;
  }

  getCoordinatesFiles(numberField) {
    return {
      rows: Math.trunc((Number(numberField) - 1) / 3),
      column: (Number(numberField) - 1) % 3,
    };
  }

  setMarkToField(numberField) {
    //TODO Треба  правильно порахувати номер поля
    //Якщо це перший крок то дізнатися номер таблиці перекодування
    //Якщо ні, то застосувати таблицю перекодування

    if (this.getField(numberField)) {
      return;
    }

    this.setField(numberField, 1);

    //Отут походила людина
    this.setCurentTreeBranch();

    return this.getMark(true);
  }

  getMark(human) {
    if (human) {
      return this.humanPlayX ? 'X' : 'O';
    } else {
      return this.humanPlayX ? 'O' : 'X';
    }
  }

  isEndGame() {
    //Треба повернути результат.
    //result - won draw
    //humanWon: true

    const winer = this.isWinner();

    if (winer) {
      // console.log(this.filed);
      // console.log('🚀 ~ winer', winer);

      return {
        result: 'won',
        humanWon: winer.won === 'human',
        ...winer,
      };
    }

    if (this.isDraw()) {
      return {
        result: 'draw',
      };
    }

    return;
  }

  nextStepComputer() {
    const numberField = this.getStepComputer();
    //TODO Треба  правильно порахувати номер поля
    //Якщо це перший крок то дізнатися номер таблиці перекодування
    //Якщо ні, то застосувати таблицю перекодування

    this.setField(numberField, 4);
    //Отут походив комп.ютер
    this.setCurentTreeBranch();

    return {
      number: numberField,
      mark: this.humanPlayX ? 'O' : 'X',
    };
  }

  getSumColumn(numberColumn) {
    return this.getNumberWinerField('c', numberColumn).reduce(
      (sum, element) => (sum += this.getField(element)),
      0,
    );
  }

  getSumRow(numberRow) {
    return this.getNumberWinerField('r', numberRow).reduce(
      (sum, element) => (sum += this.getField(element)),
      0,
    );
  }

  getSumDiagonal(numberDiagonal) {
    if (numberDiagonal < 2) {
      return this.getNumberWinerField('d', numberDiagonal).reduce(
        (sum, element) => (sum += this.getField(element)),
        0,
      );
    } else return 0;
  }

  getSumDimension(namen, number) {
    switch (namen) {
      case 'c':
        return this.getSumColumn(number);

      case 'r':
        return this.getSumRow(number);

      case 'd':
        return this.getSumDiagonal(number);
      default:
        return 0;
    }
  }

  isWinner() {
    const dimension = ['c', 'r', 'd'];

    for (let index = 0; index < 3; index++) {
      for (const namen of dimension) {
        const sumDimension = this.getSumDimension(namen, index);

        if (sumDimension === 3 || sumDimension === 12) {
          return {
            won: sumDimension === 3 ? 'human' : 'computer',
            dimension: namen,
            number: index,
            wonField: this.getNumberWinerField(namen, index),
          };
        }
      }
    }
    return;
  }

  getNumberWinerField(type, number) {
    return this.#NUMBER_FIELDS[type][number];
  }

  isDraw() {
    let totalSum = 0;
    for (let index = 0; index < 3; index++) {
      const sumColumn = this.getSumColumn(index);
      const sumRow = this.getSumRow(index);
      const sumDiagonal = this.getSumDiagonal(index);

      totalSum += this.positionDraw.includes(sumColumn) ? 1 : 0;
      totalSum += this.positionDraw.includes(sumRow) ? 1 : 0;
      totalSum += this.positionDraw.includes(sumDiagonal) ? 1 : 0;
    }

    return totalSum === 8;
  }

  getField(numberField) {
    return this.filed[numberField - 1];
  }

  setField(numberField, value) {
    this.filed[numberField - 1] = value;
  }

  // ! ------------------------------------------------------------
  getStepComputer() {
    //якщо prevField undefined то граємо реші і ставимо в  центр
    //Правило 1. Якщо гравець може негайно виграти, він це робить.
    //Правило 2. Якщо гравець не може негайно виграти, але його противник міг би негайно виграти, зробивши хід у якусь клітинку, гравець сам робить хід у цю клітинку,
    this.numberStepComputer++;

    // * 1
    //Якщо людина ходить перша
    if (this.humanPlayX && this.numberStepComputer === 1) {
      if (!this.getField(5)) {
        //Якщо центр вільний, то ставимо туди
        return 5;
      } else {
        //Якщо центр зайнятий, то ставимо у вільний кут

        const freeField = this.getFreeField([1, 3, 7, 9]);
        return freeField;
      }
    }

    // * 2
    //Якщо ми ходимо першими то ставимо в кут, або центр
    if (!this.humanPlayX && this.numberStepComputer === 1) {
      if (Math.random() > 0.5) {
        return 1;
      } else {
        return 5;
      }
    }

    // * 3
    //Якщо центр вільний, то ставимо туди
    if (!this.getField(5)) {
      return 5;
    }

    // * 4
    //Правило 1. Якщо гравець може негайно виграти, він це робить.
    let numberField = this.findPreWinField();
    if (numberField) {
      return numberField;
    }

    // * 5
    //Правило 2. Якщо гравець не може негайно виграти, але його противник міг би негайно
    //виграти, зробивши хід у якусь клітинку, гравець сам робить хід у цю клітинку,
    numberField = this.findPreLostField();
    if (numberField) {
      return numberField;
    }

    return this.getBestMove();
    //! Шукати варіанти
  }

  getFreeField(arrNumbers) {
    for (let number of arrNumbers) {
      if (!this.getField(number)) {
        return number;
      }
    }
  }

  //Треба знайти напрямок в якому сума елементів дорівнює якомусь числу
  findDirectionEquelValue(value) {
    for (const direction of Object.values(this.#NUMBER_FIELDS)) {
      for (const arrNumber of direction) {
        if (this.getSumElement(arrNumber) === value) {
          return arrNumber;
        }
      }
    }
  }

  getSumElement(arrNumber) {
    return arrNumber.reduce(
      (sum, numberField) => (sum += this.getField(numberField)),
      0,
    );
  }

  //Знайти порожнє поле в напрямку
  findEmptyFieldForDirection(direction) {
    for (const numberField of direction) {
      if (!this.getField(numberField)) {
        return numberField;
      }
    }
  }

  findPreWinField() {
    const direction = this.findDirectionEquelValue(8);
    if (!direction) {
      return;
    }

    return this.findEmptyFieldForDirection(direction);
  }

  findPreLostField() {
    const direction = this.findDirectionEquelValue(2);
    if (!direction) {
      return;
    }
    return this.findEmptyFieldForDirection(direction);
  }

  //! OLD
}

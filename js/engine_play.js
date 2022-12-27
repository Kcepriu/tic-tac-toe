export default class EnginePlay {
  constructor() {
    this.name = 'Hello';

    this.nextMoveHuman = true;
    this.gamePlaying = false;
    this.humanPlayX = true;
    this.filed = [[], [], []];
    //HUMAN   1 :
    //AUTO   -1;
  }

  stopGame() {
    this.nextMoveHuman = true;
    this.humanPlayX = true;
    this.gamePlaying = false;
    this.filed = [[], [], []];
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
    const coordinate = this.getCoordinatesFiles(numberField);

    if (this.filed[coordinate.rows][coordinate.column]) {
      return;
    }

    this.filed[coordinate.rows][coordinate.column] = 1;

    return this.getMark(true);
  }

  getMark(human) {
    if (human) {
      return this.humanPlayX ? 'X' : 'O';
    } else {
      return this.humanPlayX ? 'O' : 'X';
    }
  }

  isEndGame({ human }) {
    //Треба повернути результат.
    //result - won draw
    //humanWon: true

    return;
  }

  nextStepComputer() {
    //якщо prevField undefined то граємо реші і ставимо в  центр
    //Правило 1. Якщо гравець може негайно виграти, він це робить.
    //Правило 2. Якщо гравець не може негайно виграти, але його противник міг би негайно виграти, зробивши хід у якусь клітинку, гравець сам робить хід у цю клітинку,

    return {
      number: 1,
      mark: this.humanPlayX ? 'O' : 'X',
    };
  }
}

//this.game

export default class Thinker {
  constructor() {
    this.filed = []; //Перезапишеться у нащадку
    this.humanPlayX = true; //Перезапишеться у нащадку
    this.treeAllResult = this.getElementWinner();
  }

  getTreeAllResult() {
    for (const step of this.getStartPosition()) {
      const newResult = this.nextStep(step);

      this.treeAllResult[this.getKey(step.startArray)] = newResult;
      this.treeAllResult.winnerX =
        this.treeAllResult.winnerX || newResult.winnerX;
      this.treeAllResult.winnerO =
        this.treeAllResult.winnerO || newResult.winnerO;

      this.treeAllResult.numberField = step.numberField;
    }
    // console.log(this.treeAllResult);
  }

  getElementWinner() {
    return {
      winnerX: false,
      winnerO: false,
      draw: false,
      countWinnerX: 0,
      countWinnerO: 0,
      countDraw: 0,
      numberField: -1,
    };
  }

  getKey(array) {
    if (this.humanPlayX) return array.join('');

    return array.reduce((result, element) => {
      if (element === 1) {
        element = 4;
      } else if (element === 4) {
        element = 1;
      }

      result += element;

      return result;
    }, '');
  }

  getStartPosition() {
    return [
      {
        startArray: '100000000'.split('').map(Number),
        freeCels: [2, 3, 4, 5, 6, 7, 8, 9],
        numberField: 1,
        curentPlay: -1,
      },
      {
        startArray: '010000000'.split('').map(Number),
        freeCels: [1, 3, 4, 5, 6, 7, 8, 9],
        numberField: 2,
        curentPlay: -1,
      },
      {
        startArray: '000010000'.split('').map(Number),
        freeCels: [1, 2, 3, 4, 6, 7, 8, 9],
        numberField: 5,
        curentPlay: -1,
      },
    ];
  }

  nextStep(stepPrev) {
    const result = this.getElementWinner();

    result.numberField = stepPrev.numberField;

    //Перерірити чи не перемога когось
    this.filed = [...stepPrev.startArray];

    const resultGame = this.isEndGame();

    if (resultGame) {
      if (resultGame.result === 'draw') {
        result.draw = true;
        result.countDraw = 1;
      } else if (resultGame.humanWon) {
        result.winnerX = true;
        result.countWinnerX = 1;
      } else {
        result.winnerO = true;
        result.countWinnerO = 1;
      }
      return result;
    }

    if (stepPrev.freeCels.length === 0) {
      // if (stepPrev.freeCels.length < 3) {
      result.draw = true;
      result.countDraw = 1;
      return result;
    }

    for (const index of stepPrev.freeCels) {
      const step = {
        startArray: [...stepPrev.startArray],
        freeCels: [...stepPrev.freeCels],
        numberField: index,
        curentPlay: -1 * stepPrev.curentPlay,
      };

      step.startArray[index - 1] = this.getNumberFromElementField(
        stepPrev.curentPlay,
      );

      this.deleteElement(step.freeCels, index);

      const newResult = this.nextStep(step);

      result[this.getKey(step.startArray)] = newResult;

      result.winnerX = result.winnerX || newResult.winnerX;
      result.winnerO = result.winnerO || newResult.winnerO;
      result.draw = result.draw || newResult.draw;

      result.countWinnerX += newResult.countWinnerX;
      result.countWinnerO += newResult.countWinnerO;
      result.countDraw += newResult.countDraw;
    }

    return result;
  }

  getNumberFromElementField(curentPlay) {
    const multiplier = this.humanPlayX ? 1 : -1;
    return curentPlay * multiplier > 0 ? 1 : 4;
  }

  deleteElement(array, value) {
    const index = array.indexOf(value);
    if (index > -1) {
      array.splice(index, 1); // 2nd parameter means remove one item only
    }
  }

  setCurentTreeBranch() {
    const key = this.getKey(this.filed);
    this.curentTreeBranch = this.curentTreeBranch[key];
    if (!this.curentTreeBranch) {
      throw 'Error result tree ' + key;
    }
  }

  getChansePlayer(data) {
    const { countWinnerX, countWinnerO, countDraw } = data;

    const allCount = countWinnerX + countWinnerO + countDraw;

    const newChancePlayerX = (countWinnerX + countDraw) / allCount;
    const newChancePlayerO = (countWinnerO + countDraw) / allCount;

    return this.humanPlayX
      ? [newChancePlayerO, newChancePlayerX]
      : [newChancePlayerX, newChancePlayerO];
  }

  getBestMove() {
    let chanceCurentPlayer = 0;
    let chanceEnemy = 0;

    let numberField = null;
    const arrayVariant = [];

    //playX - шукати накращий для хрестика
    for (let key of Object.keys(this.curentTreeBranch)) {
      const value = this.curentTreeBranch[key];
      if (typeof value !== 'object' || value === null) {
        continue;
      }

      arrayVariant.push(value);

      const [newChanceCurentPlayer, newChanceEnemy] =
        this.getChansePlayer(value);

      if (
        newChanceCurentPlayer > chanceCurentPlayer ||
        (newChanceCurentPlayer > newChanceEnemy && newChanceEnemy < chanceEnemy)
      ) {
        chanceCurentPlayer = newChanceCurentPlayer;
        chanceEnemy = newChanceEnemy;

        numberField = value.numberField;
      }
    }

    if (numberField === null) {
      numberField = this.getRandomField(arrayVariant);
    }

    return numberField;
  }
  getRandomField(arrayVariant) {
    const number = Math.floor(Math.random() * arrayVariant.length);

    return arrayVariant[number].numberFiled;
  }

  getRandomStep__() {
    let result = -1;
    while (result < 0) {
      result = Math.floor(Math.random() * 9) + 1;

      if (this.filed[result]) {
        result = -1;
      } else {
        this.filed[result] = 4;
      }
    }

    return result;
  }
}

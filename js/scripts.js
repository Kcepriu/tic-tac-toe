import EnginePlay from './engine_play.js';

class TicTacToe {
  #CLASS_WIN = {
    win: 'class_win',
    lose: 'class_lose',
  };

  constructor(className = 'game-name') {
    this.game = new EnginePlay();

    this.className = className;

    this.rootElementGame = document.querySelector(`.${this.className}`);

    this.btnReset = this.findObject('.game-name__btn-reset');

    this.btnPlayX = this.findObject('.game-name__btn-result--x');
    this.btnPlay0 = this.findObject('.game-name__btn-result--o');

    this.gameField = this.findObject('.game-name__fields');

    // * Initialization
    this.initializationEvents();
  }

  findObject(className) {
    return this.rootElementGame.querySelector(className);
  }

  initializationEvents() {
    this.btnReset.addEventListener('click', this.onClickReset.bind(this));

    this.btnPlayX.addEventListener('click', this.onClickResult_X.bind(this));
    this.btnPlay0.addEventListener('click', this.onClickResult_O.bind(this));

    this.gameField.addEventListener('click', this.onClickGameFiled.bind(this));
  }

  // ! Handlers
  onClickResult_X() {
    //Сюди не можна тикнути
    if (this.game.humanPlayX) {
      return;
    }

    this.game.humanPlayX = true;
    this.setActiveButton();
  }

  onClickResult_O() {
    if (!this.game.humanPlayX) {
      return;
    }

    this.btnPlayX.classList.remove('game-name__btn-result--curent');
    this.btnPlay0.classList.add('game-name__btn-result--curent');

    this.game.humanPlayX = false;
    this.setActiveButton();

    //Start game
    this.startGame();
    this.nextAutoStep();
  }

  onClickReset(event) {
    this.game.stopGame();

    //Clear field
    this.cleanField();

    this.setActiveButton();
    this.setStatusBtnResult();
  }

  setActiveButton() {
    if (this.game.humanPlayX) {
      this.btnPlayX.classList.add('game-name__btn-result--curent');
      this.btnPlay0.classList.remove('game-name__btn-result--curent');
    } else {
      this.btnPlayX.classList.remove('game-name__btn-result--curent');
      this.btnPlay0.classList.add('game-name__btn-result--curent');
    }
  }

  setStatusBtnResult() {
    if (this.game.isGamePlaying()) {
      // ДодатиАтрибут
      this.addAtributeToObject(this.btnPlayX, 'disabled');
      this.addAtributeToObject(this.btnPlay0, 'disabled');
    } else {
      this.removeAtributeToObject(this.btnPlayX, 'disabled');
      this.removeAtributeToObject(this.btnPlay0, 'disabled');
    }
  }

  onClickGameFiled(event) {
    if (!this.game.isGamePlaying()) {
      this.startGame();
    }

    if (!this.game.nextMoveHuman) {
      return;
    }

    this.nextHumansStep(event.target);
  }

  // ! Обробники
  startGame() {
    this.game.gamePlaying = true;
    this.setStatusBtnResult();
  }

  cleanField() {
    const fields = this.gameField.querySelectorAll('li');

    fields.forEach(element => {
      this.writeMark(element, '');
      element.classList.remove(this.#CLASS_WIN.win);
      element.classList.remove(this.#CLASS_WIN.lose);
    });
  }

  addAtributeToObject(object, atribute) {
    object.setAttribute(atribute, '');
  }

  removeAtributeToObject(object, atribute) {
    object.removeAttribute(atribute);
  }

  // ! Гра
  nextHumansStep(field) {
    const mark = this.game.setMarkToField(field.dataset.number);

    if (!mark) {
      return;
    }

    this.writeMark(field, mark);

    //Перевірити чи не виграв
    const resultGame = this.game.isEndGame();

    if (resultGame) {
      this.endGame(resultGame);
      return;
    }

    //Зробити крок компʼютеру
    this.nextAutoStep();
  }

  //! Хід компʼютера
  nextAutoStep() {
    this.game.nextMoveHuman = false;

    const resultStep = this.game.nextStepComputer();
    this.writeMark(this.getFieldOfNum(resultStep.number), resultStep.mark);

    //Перевірити чи не виграв
    const resultGame = this.game.isEndGame();
    if (resultGame) {
      this.endGame(resultGame);
      return;
    }

    this.game.nextMoveHuman = true;
  }

  writeMark(field, value) {
    field.textContent = value;
  }

  endGame(resultGame) {
    this.game.nextMoveHuman = false;
    //ВИвести повідомлення resultGame
    this.showMessage(resultGame);
  }

  showMessage(resultGame) {
    //TODO
    if (resultGame.result === 'draw') {
      // console.log('Нічия');
      Notiflix.Report.info('Нічия', '', 'Okay');
    } else if (resultGame.humanWon) {
      this.showWin(resultGame);

      Notiflix.Report.success('Перемога!!', '', 'Okay');
      // console.log('Ви виграли.', resultGame.dimension, resultGame.number);
    } else {
      this.showWin(resultGame);
      Notiflix.Report.failure('Ви програли.', '', 'Okay');
      console.log('Ви програли.', resultGame.dimension, resultGame.number);
    }
  }

  showWin(resultGame) {
    resultGame.wonField.forEach(numberField => {
      const field = this.getFieldOfNum(numberField);
      field.classList.add(
        resultGame.humanWon ? this.#CLASS_WIN.win : this.#CLASS_WIN.lose,
      );
    });
  }

  getFieldOfNum(numberField) {
    return this.gameField.querySelector(`[data-number="${numberField}"]`);
  }
}

// ! Start script

const gameTicTacToe = new TicTacToe('game-name');

//состояния игры

const STATUS = {
  CONTINUE: "continue",
  WIN: "win",
  INVALID: "invalid",
  INVALID_SKIP: "invalid-skip",
  GAME_OVER: "game-over",
  MUST_MOVE_FIRST: "must-move-first",
  NO_ROLL: "no-roll"
};

// ядро игры
class Dice {
  constructor(diceCount, diceSides) {
    this.diceCount = diceCount;
    this.diceSides = diceSides;
    this.values = [];
    this.sum = 0;
  }

  roll() {
    this.values = [];

    for (let i = 0; i < this.diceCount; i++) {
      const value = Math.floor(Math.random() * this.diceSides) + 1;
      this.values.push(value);
    }

    this.sum = this.values.reduce((acc, cur) => acc + cur, 0);
  }
}


class Player {
  constructor(name, cards) {
    this.name = name;
    this.cards = [...cards];
  }

  hasCard(value) {
    return this.cards.includes(value);
  }

  removeCard(value) {
    this.cards = this.cards.filter(card => card !== value);
  }

  removeCards(values) {
    this.cards = this.cards.filter(card => !values.includes(card));
  }

  hasWon() {
    return this.cards.length === 0;
  }
}


class Game {
  constructor(diceCount, diceSides, playersCount) {
    this.diceCount = diceCount;
    this.diceSides = diceSides;
    this.playersCount = playersCount;
    this.players = [];
    this.currentPlayerIndex = 0;
    this.dice = new Dice(this.diceCount, this.diceSides);
    for (let i = 0; i < this.playersCount; i++) {
      const name = `Игрок ${i + 1}`;
      const cards = this.generateCards();
      this.players.push(new Player(name, cards))
    }
    this.awaitingMove = false;
    //флаг состояния игры(завершен ход или нет, в переводе "ожидающий ход")
    this.gameOver = false;
  }

//вспомогательные функции
  generateCards() {
    let array = [];
    for (let i = 1; i <= this.diceCount * this.diceSides; i++) {
      array.push(i);
    }
    return array;
  }

  getCurrentPlayer() {
    return this.players[this.currentPlayerIndex];
  }

  switchPlayer() {
    this.currentPlayerIndex = (this.currentPlayerIndex + 1) % this.players.length;
  }

///


  rollDice() {
    if (this.awaitingMove) {
      return STATUS.MUST_MOVE_FIRST;
    }
    if (this.gameOver) {
      return STATUS.GAME_OVER;
    }

    this.dice.roll();
    this.awaitingMove = true;
    return {
      values: this.dice.values,
      sum: this.dice.sum,
    }
  }

  clearDice() {
    this.dice.values = [];
    this.dice.sum = 0;
  }

  getAvailableMoves() {
    const player = this.getCurrentPlayer();
    const values = this.dice.values;

    const uniqueValues = [...new Set(values)];
    const singles = uniqueValues.filter(value => player.hasCard(value));
    const canUseSum = player.hasCard(this.dice.sum);

    return {
      singles: singles,
      canUseSum: canUseSum,
    }
  }

  playMove(type) {
    if (this.dice.values.length === 0) {
      return STATUS.NO_ROLL;
    }

    if (this.gameOver) {
      return STATUS.GAME_OVER;
    }

    const player = this.getCurrentPlayer();
    const moves = this.getAvailableMoves();

    if (type === "singles") {
      if (moves.singles.length === 0) {
        return STATUS.INVALID;
      }
      player.removeCards(moves.singles);
      this.awaitingMove = false;
    }
    else if (type === "sum") {
      if (!moves.canUseSum) {
        return STATUS.INVALID;
      }
      player.removeCard(this.dice.sum);
      this.awaitingMove = false;
    }
    else  {
      return STATUS.INVALID;
    }


    if (player.hasWon()) {
      this.clearDice();
      this.gameOver = true;
      this.awaitingMove = false;
      return STATUS.WIN;
    }

    this.clearDice();

    this.switchPlayer();
    return STATUS.CONTINUE;
  }

  skipMove() {
    if (!this.awaitingMove || this.gameOver) {
      return STATUS.INVALID_SKIP;
    }

    this.clearDice();
    this.awaitingMove = false;

    this.switchPlayer();
    return STATUS.CONTINUE;
  }
}

///


// UI игры
const game = new Game(2, 6, 2);

//кнопка запуска игры и смены игрока на следующего
const goButton = document.getElementById("go");

//блок, где показываются ходы и кнопки закрытия карточек
const diceDiv = document.getElementById("Dice");

//блок, где отображаются сами карточки (игровое поле)
const gameFieldDiv = document.getElementById("GameField");


//блок с генерацией значений кубиков, кнопок и игроков с их текущими карточками
function renderDice() {
  diceDiv.innerHTML = "";

  if (game.dice.values.length === 0) {
    diceDiv.innerHTML = "Your draw";
    return;
  }

  const diceText = game.dice.values.join(" и ");

  diceDiv.innerHTML += "выпало: " + diceText;

  const moves = game.getAvailableMoves();
  renderMoveButtons(moves);
}

function renderMoveButtons(moves) {
  if (moves.singles.length > 0) {
    const singlesBtn = document.createElement("button");
    singlesBtn.textContent = "убрать " + moves.singles.join(" и ");

    singlesBtn.addEventListener("click", () => {
      const result = game.playMove("singles");
      handleMoveResult(result);
    });
    diceDiv.append(singlesBtn);
  }


  if (moves.canUseSum) {
    const sumBtn = document.createElement("button");
    sumBtn.textContent = "убрать " + game.dice.sum;

    sumBtn.addEventListener("click", () => {
      const result = game.playMove("sum");
      handleMoveResult(result);
    });
    diceDiv.append(sumBtn);
  }

  if (moves.singles.length === 0 && !moves.canUseSum) {
    const skipBtn = document.createElement("button");
    skipBtn.textContent = "пропустить ход";

    skipBtn.addEventListener("click", () => {
      const result = game.skipMove();
      handleMoveResult(result);

    });
    diceDiv.append(skipBtn);
  }
}

function renderPlayers() {
  gameFieldDiv.innerHTML = "";

  game.players.forEach((player, index) => {
    let line = player.name + ":" + player.cards.join(", ")

    if (index === game.currentPlayerIndex) {
      line = "👉 " + line;
    }

    gameFieldDiv.innerHTML += line + "<br>"
  });
}

function renderAll() {
  renderPlayers();
  renderDice();
}

///

==
//центр управления UI
function handleMoveResult(result) {
  if (result === STATUS.CONTINUE) {
    renderAll();
    return;
  }
  if (result === STATUS.WIN) {
    alert(game.getCurrentPlayer().name + " победил!");
    renderAll();
    return;
  }
  if (result === STATUS.INVALID) {
    alert("недопустимый ход");
  }
  if (result === STATUS.INVALID_SKIP) {
    alert("пропуск невозможен");
  }
}

///


goButton.addEventListener("click", () => {
  const result = game.rollDice();
  if (result === STATUS.MUST_MOVE_FIRST) {
    alert("сначала сделайте ход");
    return;
  }
  if (result === STATUS.GAME_OVER) {
    return;
  }
  renderAll();
});
///


//тестировочная часть в терминале
/*const game = new Game(2, 6, 2);
console.log
("текущий игрок", game.getCurrentPlayer().name);

console.log("бросаем кубики...");
const diceResult = game.rollDice();
console.log("выпало:", diceResult);

const moves = game.getAvailableMoves();
console.log("возможные ходы:", moves);

if (moves.singles.length > 0) {
  console.log("Делаем ход singles");
  console.log(game.playMove("singles"));
} else if (moves.canUseSum) {
  console.log("Делаем ход sum");
  console.log(game.playMove("sum"));
} else {
  console.log("Нет ходов, пропуск");
}*/
///

const STATUS = {
  CONTINUE: "continue",
  WIN: "win",
  INVALID: "invalid",
  INVALID_SKIP: "invalid-skip",
  GAME_OVER: "game-over",
  MUST_MOVE_FIRST: "must-move-first"
};

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
    this.gameOver = false;
  }

  switchPlayer() {
    this.currentPlayerIndex = (this.currentPlayerIndex + 1) % this.players.length;
  }

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
    } else if (type === "sum") {
      if (!moves.canUseSum) {
        return STATUS.INVALID;
      }
      player.removeCard(this.dice.sum);
      this.awaitingMove = false;
    } else {
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


let game = new Game(2, 6, 3);

const goButton = document.getElementById("go");

const diceDiv = document.getElementById("Dice");

const gameFieldDiv = document.getElementById("GameField");

const restartButton = document.getElementById("restart");


function renderDice() {
  diceDiv.innerHTML = "";

  goButton.disabled = game.awaitingMove || game.gameOver;

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
    singlesBtn.classList.add("btn", "primary", "move-btn");
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
    sumBtn.classList.add("btn", "primary", "move-btn");
    sumBtn.addEventListener("click", () => {
      const result = game.playMove("sum");
      handleMoveResult(result);
    });
    diceDiv.append(sumBtn);
  }

  if (moves.singles.length === 0 && !moves.canUseSum) {
    const skipBtn = document.createElement("button");
    skipBtn.classList.add("btn", "secondary", "move-btn");
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
    const playerDiv = document.createElement("div");
    playerDiv.classList.add("player-card");

    if (index === game.currentPlayerIndex) {
      playerDiv.classList.add("active");
    }

    const nameDiv = document.createElement("div");
    nameDiv.classList.add("player-name");
    nameDiv.textContent = player.name;

    playerDiv.append(nameDiv);


    const cardsDiv = document.createElement("div");
    cardsDiv.classList.add("cards");

    player.cards.forEach((card) => {
      const cardDiv = document.createElement("div");
      cardDiv.classList.add("card");
      cardDiv.textContent = card;
      cardsDiv.append(cardDiv);
    })
    playerDiv.append(cardsDiv);

    gameFieldDiv.append(playerDiv);
  });
}

function renderAll() {
  renderPlayers();
  renderDice();
}


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

restartButton.addEventListener("click", () => {
  if (!game.gameOver) {
    const confirmRestart = confirm(" Вы уверены, что хотите начать заново?")
    if (!confirmRestart) {
      return;
    }
  }
  game = new Game(2, 6, 2);
  renderAll();
});
///

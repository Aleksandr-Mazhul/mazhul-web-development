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

    this.dice = new Dice(this.diceCount, this.diceSides);
    this.players = [];
    for (let i = 0; i < this.playersCount; i++) {
      const name = `Игрок ${i + 1}`;
      const cards = this.generateCards();
      this.players.push(new Player(name, cards))
    }
    this.currentPlayerIndex = 0;
  }

  generateCards() {
    let array = [];
    for (let i = 1; i <= this.diceCount * this.diceSides; i++) {
      array.push(i);
    }
    return array;
  }
}


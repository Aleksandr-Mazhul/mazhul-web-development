const Status = Object.freeze({
  IDLE: "IDLE",
  SHOWING_SEQUENCE: "SHOWING_SEQUENCE",
  WAITING_INPUT: "WAITING_INPUT",
  GAME_OVER: "GAME_OVER",
});

class Game {
  #cntOfBtn
  #status
  #sequence
  #currentStep
  #currentScore
  #record
  #timings

  constructor(cntOfBtn) {
    this.#cntOfBtn = cntOfBtn;
    this.#status = Status.IDLE;
    this.#sequence = [];
    this.#currentStep = 0;
    this.#currentScore = 0;
    this.#record = 0;
    this.#timings = {
      betweenCards: 800,
      beforeStart: 800,
      cardActive: 100,
    };
  }

  get status() {
    return this.#status;
  }

  set status(status) {
    if (Object.values(Status).includes(status)) {
      this.#status = status;
      this.updateControls();
    }
  }

  get cntOfBtn() {
    return this.#cntOfBtn;
  }

  get sequence() {
    return this.#sequence;
  }

  updateControls() {
    const restartBtn = document.querySelector("#restart");
    const startBtn = document.querySelector("#start");

    const status = this.#status;

    if (status === Status.SHOWING_SEQUENCE) {
      if (restartBtn) {
        restartBtn.disabled = true;
        restartBtn.classList.add("disabled");
      }
      if (startBtn) {
        startBtn.disabled = true;
        startBtn.classList.add("disabled");
      }
    } else {
      if (restartBtn) {
        restartBtn.disabled = false;
        restartBtn.classList.remove("disabled");
      }

      if (startBtn) {
        if (status === Status.IDLE || status === Status.GAME_OVER || status === Status.WAITING_INPUT) {
          startBtn.disabled = false;
          startBtn.classList.remove("disabled");
        } else {
          startBtn.disabled = true;
          startBtn.classList.add("disabled");
        }
      }
    }
  }

  init() {
    this.load();
    this.setupEventListeners();
    this.renderCards();
    this.renderHUD();
    this.updateControls();
    this.showStartMessage();
    if (this.status === Status.WAITING_INPUT) {
      void this.playSequence();
    }
  }

  showStartMessage() {
    if (this.#sequence.length === 0) {
      this.renderText("Press Start");
      return;
    }

    if (this.status === Status.GAME_OVER) {
      this.renderText("Game Over");
      return;
    }

    this.renderText("Press Start to continue");
  }

  async startRound() {
    if (this.status === Status.SHOWING_SEQUENCE) return;
    this.status = Status.SHOWING_SEQUENCE;
    await this.RSG();
    await this.playSequence();
    this.status = Status.WAITING_INPUT;
  }

  async nextRound() {
    this.#currentStep = 0;
    this.#currentScore += 1;
    this.generateSequence();
    this.save();
    this.renderHUD();
    await this.startRound();
  }

  restartGame() {
    this.resetState();
    this.status = Status.IDLE;
    this.renderHUD();
    this.save();
    this.renderText("Press Start");

  }


  async playSequence() {
    for (const el of this.#sequence) {
      const card = document.querySelector(`[data-id="${el}"]`);
      if (!card) continue;

      card.classList.add('active');
      await this.delay(this.#timings.betweenCards / 2);

      card.classList.remove('active');
      await this.delay(this.#timings.betweenCards / 2);
    }
  }

  async RSG() {
    const array = ["ready", "set", "go"];
    for (const text of array) {
      this.renderText(text);
      await this.delay(this.#timings.beforeStart);
    }
    this.renderText('');
  }

  async delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }


  renderCards() {
    const container = document.querySelector('#container');
    container.innerHTML = '';
    for (let i = 1; i <= this.cntOfBtn; i++) {
      const div = document.createElement('div');
      div.className = 'card';
      div.dataset.id = String(i);
      container.appendChild(div);
    }
  }

  renderHUD() {
    document.querySelector('#score').textContent = this.#currentScore;
    document.querySelector('#record').textContent = this.#record;
  }

  renderText(text) {
    document.querySelector(".TextInput p").textContent = text;
  }


  setupEventListeners() {
    this.handleBlocks();
    this.handleStartBtn();
    this.handleRestartBtn();
  }

  handleStartBtn() {
    const start = document.querySelector("#start");

    start.addEventListener('click', async () => {
      if (this.#sequence.length === 0 || this.status === Status.GAME_OVER) {
        this.restartGame();
        await this.nextRound();
      } else {
        await this.startRound();
      }
    });
  }

  handleRestartBtn() {
    const restart = document.querySelector("#restart");

    restart.addEventListener('click', () => {
      if (this.status !== Status.SHOWING_SEQUENCE) {
        this.restartGame();
      }
    });
  }

  handleBlocks() {
    const container = document.querySelector('#container');

    container.addEventListener('click', async (e) => {
      if (this.status !== Status.WAITING_INPUT) return;

      const card = e.target.closest('.card');
      if (!card) return;

      card.classList.add('active');
      await this.delay(this.#timings.cardActive);
      card.classList.remove('active');

      const id = Number(card.dataset.id);
      const sequence = this.#sequence;

      if (id !== sequence[this.#currentStep]) {
        this.loseGame();
        return;
      }

      if (this.#currentStep === sequence.length - 1) {
        await this.nextRound();
      } else {
        this.nextStep();
      }
    });
  }


  nextStep() {
    this.#currentStep++;
    this.save();
  }

  loseGame() {
    this.status = Status.GAME_OVER;
    if (this.#currentScore > this.#record) {
      this.#record = this.#currentScore;
    }
    this.renderText("Game Over");
    this.renderHUD();
    this.save();
  }


  generateId() {
    return Math.floor(Math.random() * this.cntOfBtn) + 1;
  }

  generateSequence() {
    this.#sequence.push(this.generateId());
  }


  save() {
    localStorage.setItem('game', JSON.stringify({
      sequence: this.#sequence,
      currentStep: this.#currentStep,
      currentScore: this.#currentScore,
      record: this.#record,
      status: this.#status
    }));
  }

  load() {
    const raw = localStorage.getItem('game');

    if (!raw) {
      this.resetState();
      return;
    }

    const data = JSON.parse(raw);

    this.#sequence = Array.isArray(data.sequence) ? data.sequence : [];
    this.#currentStep = data.currentStep ?? 0;
    this.#currentScore = data.currentScore ?? 0;
    this.#record = data.record ?? 0;
    this.status = data.status || Status.IDLE;
  }

  resetState() {
    this.#sequence = [];
    this.#currentStep = 0;
    this.#currentScore = 0;
    this.#record = 0;
  }
}

const game = new Game(4);
game.init();

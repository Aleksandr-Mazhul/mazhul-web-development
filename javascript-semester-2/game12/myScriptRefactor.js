// ============================================
//          КОНФИГУРАЦИЯ
// ============================================
const CONFIG = {
  playersCount: 2,
  diceCount: 2,
  diceSides: 6,
};

const GAME_STATUS = {
  WAITING: 'waiting',
  TURN: 'turn',
  GAME_OVER: 'gameOver'
};


// ============================================
//          ГЕНЕРАЦИЯ ДАННЫХ
// ============================================
function generateCards() {
  const maxValue = CONFIG.diceCount * CONFIG.diceSides;
  const cards = [];
  for (let i = 1; i <= maxValue; i++) {
    cards.push(i);
  }
  return cards;
}

function createPlayers() {
  const players = [];
  for (let i = 0; i < CONFIG.playersCount; i++) {
    players.push({
      id: i,
      name: `Игрок ${i + 1}`,
      initialCards: generateCards(),
      currentCards: generateCards(),
    });
  }
  return players;
}


// ============================================
//          СОСТОЯНИЕ ПРИЛОЖЕНИЯ
// ============================================
const players = createPlayers();

const gameState = {
  currentPlayerIndex: 0,
  dice: {
    values: [],
    sum: 0,
  },
  gameStatus: GAME_STATUS.WAITING,
  winner: null,
};


// ============================================
//          УТИЛИТЫ (ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ)
// ============================================
function randNumFromTo(min, max) {
  return Math.floor(min + Math.random() * (max - min + 1));
}

function getCurrentPlayer() {
  return players[gameState.currentPlayerIndex];
}

function switchToNextPlayer() {
  gameState.currentPlayerIndex = (gameState.currentPlayerIndex + 1) % players.length;
}

function resetAllPlayersCards() {
  players.forEach(player => {
    player.currentCards = [...player.initialCards];
  });
}


// ============================================
//          ЛОГИКА КУБИКОВ
// ============================================
function rollDice() {
  const values = [];
  for (let i = 0; i < CONFIG.diceCount; i++) {
    values.push(randNumFromTo(1, CONFIG.diceSides));
  }
  
  gameState.dice.values = values;
  gameState.dice.sum = values.reduce((total, current) => total + current, 0);
}

function getAvailableSingles(player, diceValues) {
  return diceValues.filter(value => player.currentCards.includes(value));
}

function isSumAvailable(player, diceSum) {
  return player.currentCards.includes(diceSum);
}


// ============================================
//          ЛОГИКА УДАЛЕНИЯ КАРТ
// ============================================
function removeCardsByValues(player, valuesToRemove) {
  player.currentCards = player.currentCards.filter(
    card => !valuesToRemove.includes(card)
  );
}

function removeCardByValue(player, value) {
  player.currentCards = player.currentCards.filter(card => card !== value);
}

function processSinglesMove(player, diceValues) {
  const numbersToRemove = getAvailableSingles(player, diceValues);
  if (numbersToRemove.length > 0) {
    removeCardsByValues(player, numbersToRemove);
    return true;
  }
  return false;
}

function processSumMove(player, diceSum) {
  if (isSumAvailable(player, diceSum)) {
    removeCardByValue(player, diceSum);
    return true;
  }
  return false;
}


// ============================================
//          ЛОГИКА ПОБЕДИТЕЛЯ
// ============================================
function checkWinner() {
  for (let i = 0; i < players.length; i++) {
    if (players[i].currentCards.length === 0) {
      declareWinner(i);
      return true;
    }
  }
  return false;
}

function declareWinner(playerIndex) {
  gameState.gameStatus = GAME_STATUS.GAME_OVER;
  gameState.winner = playerIndex;
  alert(`🏆 ${players[playerIndex].name} победил! 🏆`);
  document.querySelector('#go').disabled = true;
}


// ============================================
//          УПРАВЛЕНИЕ СОСТОЯНИЕМ ИГРЫ
// ============================================
function setGameStatus(status) {
  gameState.gameStatus = status;
}

function isPlayersTurn() {
  return gameState.gameStatus === GAME_STATUS.TURN;
}

function canPressGo() {
  return gameState.gameStatus !== GAME_STATUS.TURN && 
         gameState.gameStatus !== GAME_STATUS.GAME_OVER;
}


// ============================================
//          ОБНОВЛЕНИЕ ИНТЕРФЕЙСА
// ============================================
function showCards() {
  const gameField = document.querySelector('#GameField');
  gameField.innerHTML = '';

  players.forEach((player, index) => {
    let playerLine = `Игрок ${index + 1}: `;
    
    if (index === gameState.currentPlayerIndex) {
      playerLine = '👉 ' + playerLine;
    }
    
    player.currentCards.forEach((card, i) => {
      playerLine += card;
      if (i < player.currentCards.length - 1) {
        playerLine += ', ';
      }
    });
    
    if (player.currentCards.length === 0) {
      playerLine += ' 🏆 ПОБЕДИТЕЛЬ! 🏆';
    }
    
    gameField.innerHTML += playerLine + '<br>';
  });
}

function showDice(to) {
  const currentPlayer = getCurrentPlayer();
  const diceData = gameState.dice;
  
  let str = `Ход игрока ${gameState.currentPlayerIndex + 1}: `;
  str += diceData.values.join(' и ') + '<br>';
  
  const availableSingles = getAvailableSingles(currentPlayer, diceData.values);
  const sumAvailable = isSumAvailable(currentPlayer, diceData.sum);
  
  let hasButtons = false;
  
  if (availableSingles.length > 0) {
    hasButtons = true;
    let buttonText = 'Убрать';
    if (availableSingles.length === 1) {
      buttonText += ` число ${availableSingles[0]}`;
    } else {
      buttonText += ` числа ${availableSingles.join(' и ')}`;
    }
    str += `<input type="button" value="${buttonText}" 
            onclick="removeNumbers('singles')" />`;
  }
  
  if (sumAvailable) {
    hasButtons = true;
    str += `<input type="button" value="Убрать сумму ${diceData.sum}" 
            onclick="removeNumbers('sum')" />`;
  }
  
  if (!hasButtons) {
    str += 'Нет доступных ходов! <br>';
    str += `<input type="button" value="Пропустить ход" onclick="skipTurn()" />`;
  }
  
  to.innerHTML = str;
}

function clearDiceDisplay() {
  document.querySelector('#Dice').innerHTML = 'You draw ...';
}


// ============================================
//          ОБРАБОТЧИКИ СОБЫТИЙ (ОСНОВНАЯ ЛОГИКА)
// ============================================
function handleGo() {
  if (!canPressGo()) {
    if (gameState.gameStatus === GAME_STATUS.GAME_OVER) {
      alert("Игра закончена! Нажмите 'Новая игра'.");
    }
    return;
  }
  
  switchToNextPlayer();
  rollDice();
  setGameStatus(GAME_STATUS.TURN);
  
  showCards();
  showDice(document.querySelector("#Dice"));
}

function removeNumbers(combinationType) {
  if (!isPlayersTurn()) {
    alert("Сейчас нельзя делать ход!");
    return;
  }

  const currentPlayer = getCurrentPlayer();
  const diceData = gameState.dice;
  let moveProcessed = false;

  if (combinationType === 'singles') {
    moveProcessed = processSinglesMove(currentPlayer, diceData.values);
  } else if (combinationType === 'sum') {
    moveProcessed = processSumMove(currentPlayer, diceData.sum);
  }

  if (moveProcessed) {
    showCards();
    const gameEnded = checkWinner();
    
    if (!gameEnded) {
      setGameStatus(GAME_STATUS.WAITING);
    }
  }
}

function skipTurn() {
  if (!isPlayersTurn()) return;
  
  alert(`Игрок ${gameState.currentPlayerIndex + 1} пропускает ход`);
  setGameStatus(GAME_STATUS.WAITING);
  handleGo();
}

function resetGame() {
  resetAllPlayersCards();
  
  gameState.currentPlayerIndex = 0;
  gameState.dice.values = [];
  gameState.dice.sum = 0;
  setGameStatus(GAME_STATUS.WAITING);
  gameState.winner = null;
  
  document.querySelector('#go').disabled = false;
  showCards();
  clearDiceDisplay();
}


// ============================================
//          ИНИЦИАЛИЗАЦИЯ
// ============================================
document.querySelector('#go').addEventListener('click', handleGo);
showCards();

document.addEventListener('DOMContentLoaded', () => {
  const resetBtn = document.createElement('input');
  resetBtn.type = 'button';
  resetBtn.value = 'Новая игра';
  resetBtn.id = 'reset';
  resetBtn.style.marginLeft = '10px';
  resetBtn.addEventListener('click', resetGame);
  
  const goBtn = document.querySelector('#go');
  goBtn.parentNode.insertBefore(resetBtn, goBtn.nextSibling);
});


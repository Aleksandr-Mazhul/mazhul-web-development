const players = [
  {
    id: 0,
    name: 'Игрок 1',
    initialCards: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
    currentCards: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
    isActive: false,
  },
  {
    id: 1,
    name: 'Игрок 2',
    initialCards: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
    currentCards: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
    isActive: false,
  }

]

const gameState = {
  currentPlayerIndex: 0,
  dice: {
    values: [],
    sum: 0,
  },
  gameStatus: 'waiting',
  winner: null,
};

const GAME_STATUS = {
  WAITING: 'waiting',
  ROLLING: 'rolling',
  TURN: 'turn',
  GAME_OVER: 'gameOver'
};


document.querySelector('#go').addEventListener('click', handleGo);


showCards(document.querySelector('#GameField'));


function rollDice(numberOfDice = 2) {
  const values = [];
  for (let i = 0; i < numberOfDice; i++) {
    values.push(randNumFromTo(1, 6));
  }
  gameState.dice.values = values;
  gameState.dice.sum = values.reduce((total, current) => total + current, 0);

}

function handleGo() {
  if (gameState.gameStatus === GAME_STATUS.GAME_OVER) {
    alert("Игра закончена! Начните новую игру.");
    return;
  }
  
  if (gameState.gameStatus === GAME_STATUS.TURN) {
    return;
  }
  
  gameState.currentPlayerIndex = (gameState.currentPlayerIndex + 1) % players.length;
  rollDice(2);
  gameState.gameStatus = GAME_STATUS.TURN;
  
  showDice(document.querySelector("#Dice"));
  showCards(); // обновляем маркер текущего игрока
}

function randNumFromTo(n, N) {
  return Math.floor(n + Math.random() * (N - n + 1));
}


/*function showDice(to) {
  let str = `Ход игрока ${gameState.currentPlayerIndex + 1}: `;
  str += gameState.dice.values.join(' ') + '<br>';
  
  // Проверяем, есть ли доступные ходы
  if (hasAvailableMoves()) {
    // Кнопка для отдельных значений
    str += `<input type="button" value="Убрать ${gameState.dice.values.join(' и ')}" 
            onclick="removeNumbers('singles')" />`;
  
    // Кнопка для суммы
    str += `<input type="button" value="Убрать сумму ${gameState.dice.sum}" 
            onclick="removeNumbers('sum')" />`;
  } else {
    str += 'Нет доступных ходов! <br>';
    str += `<input type="button" value="Пропустить ход" onclick="skipTurn()" />`;
  }
  
  to.innerHTML = str;
}*/

function showDice(to) {
  let str = `Ход игрока ${gameState.currentPlayerIndex + 1}: `;
  str += gameState.dice.values.join(' и ') + '<br>'; // убрали "= сумма"
  
  const currentPlayer = players[gameState.currentPlayerIndex];
  const diceData = gameState.dice;
  
  // Проверяем отдельные числа (только те, которые есть у игрока)
  const availableSingles = diceData.values.filter(value => 
    currentPlayer.currentCards.includes(value)
  );
  
  // Проверяем сумму
  const sumAvailable = currentPlayer.currentCards.includes(diceData.sum);
  
  let hasButtons = false;
  
  // Кнопка для отдельных чисел (только если есть хотя бы одно доступное число)
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
  
  // Кнопка для суммы (если доступна)
  if (sumAvailable) {
    hasButtons = true;
    str += `<input type="button" value="Убрать сумму ${diceData.sum}" 
            onclick="removeNumbers('sum')" />`;
  }
  
  // Если нет доступных кнопок
  if (!hasButtons) {
    str += 'Нет доступных ходов! <br>';
    str += `<input type="button" value="Пропустить ход" onclick="skipTurn()" />`;
  }
  
  to.innerHTML = str;
}



function showCards() {
  const gameField = document.querySelector('#GameField');
  gameField.innerHTML = ''; // очищаем поле

  // Проходим по ВСЕМ игрокам
  players.forEach((player, index) => {
    // Показываем имя игрока
    let playerLine = `Игрок ${index + 1}: `;
    
    // Добавляем маркер текущего игрока
    if (index === gameState.currentPlayerIndex) {
      playerLine = '👉 ' + playerLine;
    }
    
    // Добавляем карты
    player.currentCards.forEach((card, i) => {
      playerLine += card;
      if (i < player.currentCards.length - 1) {
        playerLine += ', ';
      }
    });
    
    // Если карт нет - пишем "ПОБЕДИТЕЛЬ!"
    if (player.currentCards.length === 0) {
      playerLine += ' 🏆 ПОБЕДИТЕЛЬ! 🏆';
    }
    
    gameField.innerHTML += playerLine + '<br>';
  });
}


function checkWinner() {
  for (let i = 0; i < players.length; i++) {
    if (players[i].currentCards.length === 0) {
      gameState.gameStatus = GAME_STATUS.GAME_OVER;
      gameState.winner = i;
      alert(`🏆 ${players[i].name} победил! 🏆`);
      
      // Делаем кнопки неактивными
      document.querySelector('#go').disabled = true;
      
      // Возвращаем true, если есть победитель
      return true;
    }
  }
  // Возвращаем false, если победителя нет
  return false;
}


/*function removeNumbers(combinationType) {
  // Проверяем, можно ли сейчас делать ход
  if (gameState.gameStatus !== GAME_STATUS.TURN) {
    alert("Сейчас нельзя делать ход!");
    return;
  }

  const currentPlayer = players[gameState.currentPlayerIndex];
  const diceData = gameState.dice;

  if (combinationType === 'singles') {
    currentPlayer.currentCards = currentPlayer.currentCards.filter(
      card => !diceData.values.includes(card)
    );
  }

  if (combinationType === 'sum') {
    if (currentPlayer.currentCards.includes(diceData.sum)) {
      currentPlayer.currentCards = currentPlayer.currentCards.filter(
        card => card !== diceData.sum
      );
    }
  }

  // Обновляем отображение
  showCards();
  
  // Проверяем победителя и получаем результат
  const gameEnded = checkWinner(); // теперь checkWinner возвращает true/false
  
  // Если игра не закончилась, готовим следующий ход
  if (!gameEnded) {
    gameState.gameStatus = GAME_STATUS.WAITING; // можно нажимать GO
  }
}*/


function removeNumbers(combinationType) {
  // Проверяем, можно ли сейчас делать ход
  if (gameState.gameStatus !== GAME_STATUS.TURN) {
    alert("Сейчас нельзя делать ход!");
    return;
  }

  const currentPlayer = players[gameState.currentPlayerIndex];
  const diceData = gameState.dice;

  if (combinationType === 'singles') {
    // Удаляем только те числа из кубиков, которые реально есть у игрока
    const numbersToRemove = diceData.values.filter(value => 
      currentPlayer.currentCards.includes(value)
    );
    
    currentPlayer.currentCards = currentPlayer.currentCards.filter(
      card => !numbersToRemove.includes(card)
    );
  }

  if (combinationType === 'sum') {
    // Удаляем сумму, если она есть у игрока
    if (currentPlayer.currentCards.includes(diceData.sum)) {
      currentPlayer.currentCards = currentPlayer.currentCards.filter(
        card => card !== diceData.sum
      );
    }
  }

  // Обновляем отображение
  showCards();
  
  // Проверяем победителя и получаем результат
  const gameEnded = checkWinner();
  
  // Если игра не закончилась, готовим следующий ход
  if (!gameEnded) {
    gameState.gameStatus = GAME_STATUS.WAITING;
    // Можно даже автоматически переключить ход:
    // handleGo();
  }
}




function skipTurn() {
  if (gameState.gameStatus !== GAME_STATUS.TURN) return;
  
  alert(`Игрок ${gameState.currentPlayerIndex + 1} пропускает ход`);
  gameState.gameStatus = GAME_STATUS.WAITING;
  // Автоматически переключаем на следующего игрока
  handleGo();
}



// Добавьте эту функцию после других функций
function resetGame() {
  // Сбрасываем карты игроков
  players.forEach(player => {
    player.currentCards = [...player.initialCards];
  });
  
  // Сбрасываем состояние игры
  gameState.currentPlayerIndex = 0;
  gameState.dice.values = [];
  gameState.dice.sum = 0;
  gameState.gameStatus = GAME_STATUS.WAITING;
  gameState.winner = null;
  
  // Активируем кнопку GO
  document.querySelector('#go').disabled = false;
  
  // Обновляем интерфейс
  showCards();
  document.querySelector('#Dice').innerHTML = 'You draw ...';
}

// Добавляем кнопку "Новая игра" после загрузки страницы
document.addEventListener('DOMContentLoaded', () => {
  // Создаем кнопку
  const resetBtn = document.createElement('input');
  resetBtn.type = 'button';
  resetBtn.value = 'Новая игра';
  resetBtn.id = 'reset';
  resetBtn.style.marginLeft = '10px'; // небольшой отступ
  resetBtn.addEventListener('click', resetGame);
  
  // Вставляем после кнопки GO
  const goBtn = document.querySelector('#go');
  goBtn.parentNode.insertBefore(resetBtn, goBtn.nextSibling);
});






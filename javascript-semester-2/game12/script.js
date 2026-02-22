let player = 0;
let dice1 = 0;
let dice2 = 0;
let cardPlayer1 = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
let actualCardsOfPlayer1 = [...cardPlayer1];
let cardPlayer2 = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
let actualCardsOfPlayer2 = [...cardPlayer2];

document.querySelector('#go').addEventListener('click', handleGo);

showCards(document.querySelector('#GameField'));

function handleGo() {
  player = (player + 1) % 2;
  dice1 = randNumFromTo(1, 6);
  dice2 = randNumFromTo(1, 6);

  showDice(document.querySelector("#Dice"));
}

function randNumFromTo(n, N) {
  return Math.floor(n + Math.random() * (N - n + 1));
}

function showDice(to) {
  let str = `Turn  ${player}  :   ${dice1}   ${dice2}`;
  str += `<input type="button" value="${dice1} + ${dice2}" />`;
  str += `<input type="button" value="${dice1 + dice2}" />`;
  to.innerHTML = str;
}

function showCards(to) {
  cardPlayer1.forEach((element, i) => to.innerHTML += element + (i === cardPlayer1.length - 1 ? "" : ","));
  to.innerHTML += "<br>";
  cardPlayer2.forEach((element,i) => to.innerHTML += element + (i === cardPlayer1.length - 1 ? "" : ","));
}

function removeCard(n,player) {
  actualCardsOfPlayer1 = cardPlayer1.filter(element => element !== n);

}
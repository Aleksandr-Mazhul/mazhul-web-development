export function renderCard(activeCard, isFlipped) {
  const cardEl = document.getElementById("card");

  if (!activeCard) {
    cardEl.innerHTML = "<div class='note'>No cards</div>";
    return;
  }

  cardEl.innerHTML = `
    <div class="note ${isFlipped ? "flipped" : ""} ${activeCard.learned ? "learned" : ""}">
      ${activeCard.learned ? `<div class="badge">✓</div>` : ""}
      ${isFlipped ? activeCard.back : activeCard.front}
    </div>
  `;

}

export function renderPosition(pos, total) {
  const posEl = document.getElementById("position");
  posEl.textContent = total === 0 ? "0 / 0" : `${pos} / ${total}`;
}

export function renderListCards(cards, handlers) {
  const listEl = document.getElementById("list");
  listEl.innerHTML = '';

  for (const card of cards) {
    const div = document.createElement("div");
    div.className = "card-row";

    div.innerHTML = `
      <span>${card.front}</span>
      <div class="actions">
        <button class="edit">✏️</button>
        <button class="delete">🗑</button>
      </div>
    `;

    div.querySelector(".edit").onclick = () => handlers.onEdit(card);
    div.querySelector(".delete").onclick = () => handlers.onDelete(card.id);

    listEl.appendChild(div);
  }
}

export function renderDeckList(decks, activeDeckId, handlers) {
  const decksEl = document.getElementById("decks");
  decksEl.innerHTML = "";

  for (const deck of decks) {

    const btn = document.createElement("button");
    btn.className = "deck";

    if (deck.id === activeDeckId) {
      btn.classList.add("active");
    }

    btn.innerHTML = `
      ${deck.name}
      <span class="delete-deck">×</span>
    `;

    btn.addEventListener('click', () => {
      handlers.onSelect(deck.id);
    });

    const deleteBtn = btn.querySelector(".delete-deck");
    deleteBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      handlers.onDelete(deck.id);
    });

    decksEl.appendChild(btn);
  }

  const addBtn = document.createElement("button");
  addBtn.className = "deck add";
  addBtn.textContent = "+";
  addBtn.onclick = () => handlers.onCreate();

  decksEl.appendChild(addBtn);
}

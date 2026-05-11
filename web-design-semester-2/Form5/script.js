const packageCards =
  document.querySelectorAll(".package-card");

packageCards.forEach(card => {

  const radio =
    card.querySelector('input[type="radio"]');

  radio.addEventListener("change", () => {

    packageCards.forEach(item => {
      item.style.background = "transparent";
      item.style.border = "none";
    });

    card.style.background = "#dbeafe";

    card.style.border =
      "2px solid #2563eb";

  });

});

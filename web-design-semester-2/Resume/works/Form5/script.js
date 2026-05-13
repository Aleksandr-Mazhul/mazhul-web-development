const packageCards =
  document.querySelectorAll(".package-card");

packageCards.forEach(card => {

  const radio =
    card.querySelector('input[type="radio"]');

  radio.addEventListener("change", () => {

    packageCards.forEach(item => {

      item.style.background =
        "rgba(255,255,255,0.04)";

      item.style.border =
        "1px solid transparent";

    });

    card.style.background =
      "rgba(255,255,255,0.08)";

    card.style.border =
      "1px solid rgba(147,197,253,0.4)";

  });

});

const quantityInput =
  document.querySelector("#count");

const plusBtn =
  document.querySelector(".plus");

const minusBtn =
  document.querySelector(".minus");

plusBtn.addEventListener("click", () => {

  const max =
    Number(quantityInput.max);

  let value =
    Number(quantityInput.value);

  if (value < max) {

    quantityInput.value =
      value + 1;

  }

});

minusBtn.addEventListener("click", () => {

  const min =
    Number(quantityInput.min);

  let value =
    Number(quantityInput.value);

  if (value > min) {

    quantityInput.value =
      value - 1;

  }

});
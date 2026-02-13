window.addEventListener("DOMContentLoaded", () => {
  document.body.classList.remove("container");

  const actions = document.querySelector(".valentine-actions");
  const noButton = document.querySelector(".valentine-no");
  const yesButton = document.querySelector(".valentine-yes");

  if (!actions || !noButton || !yesButton) {
    return;
  }

  const randomInRange = (min, max) => Math.random() * (max - min) + min;
  let currentNoScale = 1;
  let currentYesScale = 1;

  const setScales = (noScale, yesScale) => {
    currentNoScale = Math.min(currentNoScale, noScale);
    currentYesScale = Math.max(currentYesScale, yesScale);
    actions.style.setProperty("--no-scale", currentNoScale.toFixed(2));
    actions.style.setProperty("--yes-scale", currentYesScale.toFixed(2));
  };

  noButton.addEventListener("mouseenter", () => {
    setScales(randomInRange(0, 0.86), randomInRange(1.12, 1.38));
  });

  noButton.addEventListener("pointerdown", () => {
    setScales(randomInRange(0, 0.7), randomInRange(1.12, 1.38));
  });

  noButton.addEventListener("click", () => {
    setScales(randomInRange(0, 0.7), randomInRange(1.12, 1.38));
  });

  yesButton.addEventListener("click", () => {
    window.location.href = "./yes.html";
  });
});
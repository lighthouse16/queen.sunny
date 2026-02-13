window.addEventListener("load", () => {
  const grid = document.querySelector("[data-grid]");
  const statusEl = document.querySelector("[data-status]");

  if (!grid || !statusEl) {
    return;
  }

  const symbols = [
    { id: "pic-1", src: "./assets/pic (1).jpg" },
    { id: "pic-2", src: "./assets/pic (2).jpg" },
    { id: "pic-3", src: "./assets/pic (3).jpg" },
    { id: "pic-4", src: "./assets/pic (4).jpg" },
    { id: "pic-5", src: "./assets/pic (5).jpg" },
    { id: "pic-6", src: "./assets/pic (6).jpg" },
    { id: "pic-7", src: "./assets/pic (7).jpg" },
    { id: "pic-8", src: "./assets/pic (8).jpg" }
  ];
  const totalPairs = symbols.length;
  let firstCard = null;
  let secondCard = null;
  let lockBoard = false;
  let matchedPairs = 0;
  let hasCompleted = false;
  const redirectUrl = "./letter.html";
  const redirectDelayMs = 2500;
  const winMessageText = "Uay gioi vay shao";
  const gameSection = document.querySelector(".memory-game");

  const shuffle = (array) => {
    for (let i = array.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  const resetStats = () => {
    matchedPairs = 0;
  };

  const lockCards = (cardA, cardB) => {
    cardA.classList.add("is-matched");
    cardB.classList.add("is-matched");
    matchedPairs += 1;
    if (matchedPairs === totalPairs && !hasCompleted) {
      hasCompleted = true;
      if (gameSection) {
        gameSection.classList.add("is-hidden");
      }
      const existingMessage = document.querySelector(".win-message");
      const message = existingMessage || document.createElement("div");
      if (!existingMessage) {
        message.className = "win-message";
        document.body.append(message);
      }
      message.textContent = "Uầy giỏi vậy shao";
      window.requestAnimationFrame(() => {
        message.classList.add("is-visible");
      });
      window.setTimeout(() => {
        window.location.href = redirectUrl;
      }, redirectDelayMs);
    }
  };

  const unflipCards = (cardA, cardB) => {
    window.setTimeout(() => {
      cardA.classList.remove("is-flipped");
      cardB.classList.remove("is-flipped");
      lockBoard = false;
    }, 650);
  };

  const handleCardClick = (event) => {
    const card = event.currentTarget;
    if (lockBoard || card.classList.contains("is-matched")) {
      return;
    }

    if (card === firstCard) {
      return;
    }

    card.classList.add("is-flipped");

    if (!firstCard) {
      firstCard = card;
      statusEl.textContent = "";
      return;
    }

    secondCard = card;
    lockBoard = true;

    const match = firstCard.dataset.symbol === secondCard.dataset.symbol;
    if (match) {
      lockCards(firstCard, secondCard);
      firstCard = null;
      secondCard = null;
      lockBoard = false;
    } else {
      
      unflipCards(firstCard, secondCard);
      firstCard = null;
      secondCard = null;
    }
  };

  const buildCard = (symbol) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "memory-card";
    button.dataset.symbol = symbol.id;
    button.setAttribute("aria-label", "Memory card");

    const angle = Math.random() * Math.PI * 2;
    const distance = 260 + Math.random() * 200;
    const offsetX = Math.cos(angle) * distance;
    const offsetY = Math.sin(angle) * distance;
    const rotation = (Math.random() * 80 - 40).toFixed(1);
    button.style.setProperty("--tx", `${offsetX.toFixed(1)}px`);
    button.style.setProperty("--ty", `${offsetY.toFixed(1)}px`);
    button.style.setProperty("--rot", `${rotation}deg`);

    const front = document.createElement("span");
    front.className = "memory-face memory-face--front";
    front.textContent = "?";

    const back = document.createElement("span");
    back.className = "memory-face memory-face--back";

    const image = document.createElement("img");
    image.src = symbol.src;
    image.alt = "Memory card image";
    image.loading = "lazy";
    back.append(image);

    button.append(front, back);
    button.addEventListener("click", handleCardClick);
    return button;
  };

  const setupGame = () => {
    resetStats();
    firstCard = null;
    secondCard = null;
    lockBoard = false;
    grid.innerHTML = "";

    const deck = shuffle([...symbols, ...symbols]);
    const baseDelay = 1.6;
    let finishedAnimations = 0;
    deck.forEach((symbol, index) => {
      const card = buildCard(symbol);
      card.classList.add("is-flipped");
      card.style.setProperty("--delay", `${baseDelay + index * 0.07}s`);
      card.classList.add("fly-in");
      card.addEventListener(
        "animationend",
        () => {
          card.classList.remove("fly-in");
          finishedAnimations += 1;
          if (finishedAnimations === deck.length) {
            const cards = Array.from(grid.children);
            window.setTimeout(() => {
              cards.forEach((item) => item.classList.remove("is-flipped"));
              window.setTimeout(() => {
                const firstRects = new Map(
                  cards.map((item) => [item, item.getBoundingClientRect()])
                );
                shuffle(cards).forEach((item) => grid.append(item));
                const lastRects = new Map(
                  cards.map((item) => [item, item.getBoundingClientRect()])
                );
                cards.forEach((item) => {
                  const first = firstRects.get(item);
                  const last = lastRects.get(item);
                  const dx = first.left - last.left;
                  const dy = first.top - last.top;
                  item.style.transition = "transform 0s";
                  item.style.transform = `translate(${dx}px, ${dy}px)`;
                });
                window.requestAnimationFrame(() => {
                  cards.forEach((item) => {
                    item.style.transition = "transform 1.1s cubic-bezier(0.22, 0.61, 0.36, 1)";
                    item.style.transform = "translate(0, 0)";
                  });
                });
                window.setTimeout(() => {
                  cards.forEach((item) => {
                    item.style.transition = "";
                    item.style.transform = "";
                  });
                }, 1200);
              }, 420);
            }, 420);
          }
        },
        { once: true }
      );
      grid.append(card);
    });
  };

  setupGame();
});

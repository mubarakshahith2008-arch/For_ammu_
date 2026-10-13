
const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];

const scenes = $$(".scene");

function showScene(id) {
  const target = document.getElementById(id);
  if (!target) return;

  scenes.forEach(scene => scene.classList.remove("active"));
  target.classList.add("active");

  window.scrollTo({ top: 0, behavior: "smooth" });
}

$$("[data-next]").forEach(button => {
  button.addEventListener("click", () => {
    showScene(button.dataset.next);
  });
});

// Music: first tap starts the song; later taps mute or unmute it.
const song = $("#song");
const musicBtn = $("#musicBtn");

musicBtn.addEventListener("click", async () => {
  if (song.paused) {
    try {
      await song.play();
      musicBtn.textContent = song.muted
        ? "🔊 Unmute music"
        : "🔇 Mute music";
    } catch (error) {
      musicBtn.textContent = "🎵 Tap to retry";
    }
  } else {
    song.muted = !song.muted;
    musicBtn.textContent = song.muted
      ? "🔊 Unmute music"
      : "🔇 Mute music";
  }
});

song.addEventListener("play", () => {
  musicBtn.textContent = song.muted
    ? "🔊 Unmute music"
    : "🔇 Mute music";
});

// Memory photo viewer.
const photoDialog = $("#photoDialog");
const largePhoto = $("#largePhoto");
const photoCaption = $("#photoCaption");

$$(".photo-card").forEach(card => {
  card.addEventListener("click", () => {
    const image = card.querySelector("img");
    largePhoto.src = image.src;
    largePhoto.alt = image.alt;
    photoCaption.textContent =
      card.querySelector("span").textContent;

    if (typeof photoDialog.showModal === "function") {
      photoDialog.showModal();
    } else {
      window.open(image.src, "_blank", "noopener");
    }
  });
});

$("#closePhoto").addEventListener("click", () => {
  photoDialog.close();
});

photoDialog.addEventListener("click", event => {
  if (event.target === photoDialog) {
    photoDialog.close();
  }
});

// Animated love letter.
const letterText = $("#letterText");
const originalLetter = letterText.textContent.trim();
let letterStarted = false;
let typingTimer;

$("#letterBtn").addEventListener("click", () => {
  if (letterStarted) {
    clearInterval(typingTimer);
    letterText.textContent = originalLetter;
    letterStarted = false;
    $("#letterBtn").textContent = "Read my letter ✨";
    return;
  }

  letterStarted = true;
  letterText.textContent = "";
  $("#letterBtn").textContent = "Show full letter";

  let position = 0;

  typingTimer = setInterval(() => {
    letterText.textContent += originalLetter[position];
    position++;

    if (position >= originalLetter.length) {
      clearInterval(typingTimer);
      $("#letterBtn").textContent = "Read again ↻";
      letterStarted = false;
    }
  }, 24);
});

// Proposal response.
$("#yesBtn").addEventListener("click", () => {
  $("#proposalReply").textContent =
    "You just made this little heart smile! ❤️";

  burstHearts(18);

  setTimeout(() => showScene("birthday"), 1500);
});

$("#noBtn").addEventListener("click", () => {
  $("#proposalReply").textContent =
    "Take your time, Ammu. Your happiness matters most. 💗";
});

// Final surprise.
$("#surpriseBtn").addEventListener("click", () => {
  $("#surprise").hidden = false;
  $("#surpriseBtn").textContent = "Surprise opened ❤️";
  $("#surpriseBtn").disabled = true;
  burstHearts(25);
});

// Heart button labelled ammu_143.
let loveCount = 0;

$("#heartBtn").addEventListener("click", () => {
  loveCount++;

  const heart = $("#heartBtn");
  heart.classList.remove("liked");

  // Restart the heart animation.
  void heart.offsetWidth;
  heart.classList.add("liked");
  heart.textContent = "♥";

  $("#heartLabel").textContent =
    `ammu_143 ❤️ ${loveCount} ${loveCount === 1 ? "heart" : "hearts"}`;

  burstHearts(5);
});

$("#brand").addEventListener("click", event => {
  event.preventDefault();
  showScene("welcome");
});

// Restart the experience.
$("#restartBtn").addEventListener("click", () => {
  clearInterval(typingTimer);

  letterText.textContent = originalLetter;
  letterStarted = false;
  $("#letterBtn").textContent = "Read my letter ✨";

  $("#proposalReply").textContent = "";
  $("#surprise").hidden = true;
  $("#surpriseBtn").disabled = false;
  $("#surpriseBtn").textContent = "One last surprise 🎁";

  showScene("welcome");
});

// Floating hearts.
function burstHearts(amount = 10) {
  const container = $("#hearts");

  for (let i = 0; i < amount; i++) {
    const heart = document.createElement("span");

    heart.className = "floating-heart";
    heart.textContent = ["♥", "♡", "💗", "✨"][
      Math.floor(Math.random() * 4)
    ];

    heart.style.left = Math.random() * 100 + "vw";
    heart.style.fontSize = 14 + Math.random() * 24 + "px";
    heart.style.animationDuration = 3 + Math.random() * 4 + "s";

    container.appendChild(heart);
    heart.addEventListener("animationend", () => heart.remove());
  }
}

setInterval(() => {
  if (document.hidden) return;

  const heart = document.createElement("span");
  heart.className = "floating-heart";
  heart.textContent = Math.random() > 0.5 ? "♡" : "♥";
  heart.style.left = Math.random() * 100 + "vw";
  heart.style.fontSize = 12 + Math.random() * 15 + "px";
  heart.style.animationDuration = 6 + Math.random() * 5 + "s";

  $("#hearts").appendChild(heart);
  heart.addEventListener("animationend", () => heart.remove());
}, 1200);

// Twinkling star background.
const canvas = $("#stars");
const ctx = canvas.getContext("2d");
let stars = [];
let width = 0;
let height = 0;

function resizeCanvas() {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);

  width = window.innerWidth;
  height = window.innerHeight;

  canvas.width = width * dpr;
  canvas.height = height * dpr;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  stars = Array.from({ length: Math.min(140, Math.floor(width / 5)) }, () => ({
    x: Math.random() * width,
    y: Math.random() * height,
    radius: Math.random() * 1.7 + 0.3,
    phase: Math.random() * Math.PI * 2,
    speed: 0.01 + Math.random() * 0.025
  }));
}

function drawStars() {
  ctx.clearRect(0, 0, width, height);

  stars.forEach(star => {
    star.phase += star.speed;

    const alpha = 0.35 + (Math.sin(star.phase) + 1) * 0.3;

    ctx.beginPath();
    ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255, 222, 245, ${alpha})`;
    ctx.fill();
  });

  requestAnimationFrame(drawStars);
}

window.addEventListener("resize", resizeCanvas);
resizeCanvas();
drawStars();

// CHANGE THIS to the birthday date (local time), for example "2026-12-25T00:00:00".
const BIRTHDAY_DATE = "2026-12-25T00:00:00";

const $ = (id) => document.getElementById(id);
const targetDate = new Date(BIRTHDAY_DATE).getTime();

function updateCountdown() {
  const now = Date.now();
  const distance = targetDate - now;
  if (Number.isNaN(targetDate)) {
    $("countdownNote").textContent = "Please set a valid birthday date in script.js.";
    return;
  }
  if (distance <= 0) {
    $("days").textContent = $("hours").textContent = $("minutes").textContent = $("seconds").textContent = "00";
    $("countdownNote").textContent = "It's time to celebrate you! Happy birthday, Anshu! ♡";
    return;
  }
  $("days").textContent = String(Math.floor(distance / 86400000)).padStart(2, "0");
  $("hours").textContent = String(Math.floor((distance % 86400000) / 3600000)).padStart(2, "0");
  $("minutes").textContent = String(Math.floor((distance % 3600000) / 60000)).padStart(2, "0");
  $("seconds").textContent = String(Math.floor((distance % 60000) / 1000)).padStart(2, "0");
}
updateCountdown();
setInterval(updateCountdown, 1000);

function celebrate() {
  const colors = ["#f3a9c1", "#e9c1d0", "#f8d78b", "#c9a5d6", "#fff"];
  for (let i = 0; i < 75; i++) {
    const piece = document.createElement("span");
    piece.className = "confetti";
    piece.style.left = Math.random() * 100 + "vw";
    piece.style.background = colors[Math.floor(Math.random() * colors.length)];
    piece.style.animationDuration = (2 + Math.random() * 2) + "s";
    piece.style.animationDelay = Math.random() * .7 + "s";
    document.body.appendChild(piece);
    setTimeout(() => piece.remove(), 5000);
  }
}
$("surpriseButton").addEventListener("click", () => {
  celebrate();
  $("letter").scrollIntoView({ behavior: "smooth" });
});
$("cakeButton").addEventListener("click", () => {
  $("cakeButton").classList.add("blown");
  $("cakeHint").textContent = "Wish made! May it come true, Anshu. ♡";
  celebrate();
});
$("letterButton").addEventListener("click", () => {
  const extra = $("extraLetter");
  extra.hidden = !extra.hidden;
  $("letterButton").textContent = extra.hidden ? "Read a little more ↓" : "A little less ↑";
});
$("musicButton").addEventListener("click", async () => {
  const audio = $("birthdayMusic");
  try {
    if (audio.paused) {
      await audio.play();
      $("musicButton").classList.add("playing");
      $("musicButton").innerHTML = "♫ <span>Pause music</span>";
    } else {
      audio.pause();
      $("musicButton").classList.remove("playing");
      $("musicButton").innerHTML = "♫ <span>Play music</span>";
    }
  } catch {
    showToast("Add your song as assets/music/birthday-song.mp3 first ♡");
  }
});
function showToast(message) {
  const toast = $("toast");
  toast.textContent = message;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 2800);
}

// Birthday page interactions and an original, gentle synthesized birthday melody.
const BIRTHDAY_DATE = "2026-11-08T00:00:00";
const $ = (id) => document.getElementById(id);
const targetDate = new Date(BIRTHDAY_DATE).getTime();

function updateCountdown() {
  const distance = targetDate - Date.now();
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

// Synthesized in-browser tune: no separate audio file needed.
let audioContext;
let melodyTimer;
let melodyIndex = 0;
let musicPlaying = false;
const melody = [
  [523.25,.28],[523.25,.28],[587.33,.55],[523.25,.55],[698.46,.55],[659.25,1],
  [523.25,.28],[523.25,.28],[587.33,.55],[523.25,.55],[783.99,.55],[698.46,1],
  [523.25,.28],[523.25,.28],[1046.5,.55],[880,.55],[698.46,.55],[659.25,.55],[587.33,1],
  [932.33,.28],[932.33,.28],[880,.55],[698.46,.55],[783.99,.55],[698.46,1]
];
function playNote(frequency, duration=.45, volume=.055) {
  if (!audioContext) return;
  const start = audioContext.currentTime;
  const oscillator = audioContext.createOscillator();
  const gain = audioContext.createGain();
  oscillator.type = "sine";
  oscillator.frequency.setValueAtTime(frequency, start);
  gain.gain.setValueAtTime(.0001, start);
  gain.gain.exponentialRampToValueAtTime(volume, start+.025);
  gain.gain.exponentialRampToValueAtTime(.0001, start+duration);
  oscillator.connect(gain);
  gain.connect(audioContext.destination);
  oscillator.start(start);
  oscillator.stop(start+duration+.03);
}
function playChime() {
  [659.25,783.99,987.77].forEach((note,i)=>setTimeout(()=>playNote(note,.7,.04),i*110));
}
function playMelodyStep() {
  if (!musicPlaying) return;
  const [frequency,duration] = melody[melodyIndex];
  playNote(frequency,duration*.88);
  melodyIndex = (melodyIndex+1)%melody.length;
  melodyTimer = setTimeout(playMelodyStep,duration*650);
}
async function toggleMusic() {
  try {
    const Engine = window.AudioContext || window.webkitAudioContext;
    if (!Engine) throw new Error("Audio unsupported");
    audioContext ||= new Engine();
    if (audioContext.state==="suspended") await audioContext.resume();
    musicPlaying = !musicPlaying;
    if (musicPlaying) {
      playMelodyStep();
      $("musicButton").classList.add("playing");
      $("musicButton").innerHTML = "♫ <span>Pause music</span>";
      $("musicButton").setAttribute("aria-label","Pause birthday music");
    } else {
      clearTimeout(melodyTimer);
      $("musicButton").classList.remove("playing");
      $("musicButton").innerHTML = "♫ <span>Play music</span>";
      $("musicButton").setAttribute("aria-label","Play birthday music");
    }
  } catch {
    showToast("Sorry, your browser could not start the birthday music ♡");
  }
}
$("musicButton").addEventListener("click",toggleMusic);

function celebrate() {
  const colors=["#f3a9c1","#e9c1d0","#f8d78b","#c9a5d6","#fff"];
  for(let i=0;i<75;i++){
    const piece=document.createElement("span");
    piece.className="confetti";
    piece.style.left=Math.random()*100+"vw";
    piece.style.background=colors[Math.floor(Math.random()*colors.length)];
    piece.style.animationDuration=(2+Math.random()*2)+"s";
    piece.style.animationDelay=Math.random()*.7+"s";
    document.body.appendChild(piece);
    setTimeout(()=>piece.remove(),5000);
  }
}
$("surpriseButton").addEventListener("click",()=>{
  celebrate();
  if(audioContext) playChime();
  $("letter").scrollIntoView({behavior:"smooth"});
});
$("cakeButton").addEventListener("click",()=>{
  $("cakeButton").classList.add("blown");
  $("cakeHint").textContent="Wish made! May it come true, Anshu. ♡";
  const Engine=window.AudioContext||window.webkitAudioContext;
  if(!audioContext&&Engine) audioContext=new Engine();
  if(audioContext?.state==="suspended") audioContext.resume();
  if(audioContext) playChime();
  celebrate();
});
$("letterButton").addEventListener("click",()=>{
  const extra=$("extraLetter");
  extra.hidden=!extra.hidden;
  $("letterButton").textContent=extra.hidden?"Read a little more ↓":"A little less ↑";
});
function showToast(message){
  const toast=$("toast");
  toast.textContent=message;
  toast.classList.add("show");
  setTimeout(()=>toast.classList.remove("show"),2800);
}

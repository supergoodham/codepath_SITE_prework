var clueHoldTime = 1000; //how long to hold each clue's light/sound
const cluePauseTime = 333; //how long to pause in between clues
const nextClueWaitTime = 500; //how long to wait before starting playback of the clue sequence


var pattern = [];
var patternLength = 6;
var progress = 0;
var gamePlaying = false;
var tonePlaying = false;
var volume = 0.5; //must be between 0.0 and 1.0
var guessCounter = 0;
var lives = 0;

function startGame() {
  //initialize game variables
  progress = 0;
  lives = 3;
  document.getElementById("Ntext").innerHTML = lives;
  gamePlaying = true;
  // swap the Start and Stop buttons
  document.getElementById("startBtn").classList.add("hidden");
  document.getElementById("stopBtn").classList.remove("hidden");
  generatePattern();
  playClueSequence();
}

function generatePattern() {
  for (let i = 0; i < patternLength; i++) {
    pattern[i] = Math.floor(Math.random() * 5) + 1;
  }
}

function stopGame() {
  gamePlaying = false;
  // swap the Start and Stop buttons
  document.getElementById("startBtn").classList.remove("hidden");
  document.getElementById("stopBtn").classList.add("hidden");
}

function loseGame() {
  stopGame();
  alert("Game Over. You lost.");
}

function winGame() {
  stopGame();
  alert("Game Over. You won!");
}

function lightButton(btn) {
  document.getElementById("button"+btn).classList.add("lit");
}
function clearButton(btn) {
  document.getElementById("button"+btn).classList.remove("lit");
}

function playSingleClue(btn) {
  if (gamePlaying) {
    lightButton(btn);
    playTone(btn, clueHoldTime);
    setTimeout(clearButton, clueHoldTime, btn);
  }
}

function playClueSequence() {
  guessCounter = 0;
  let delay = nextClueWaitTime; //set delay to initial wait time
  for (let i = 0; i <= progress; i++) {
    // for each clue that is revealed so far
    console.log("play single clue: " + pattern[i] + " in " + delay + "ms");
    setTimeout(playSingleClue, delay, pattern[i]); // set a timeout to play that clue
    delay += clueHoldTime;
    delay += cluePauseTime;
  }
  
}

function guess(btn) {
  console.log("user guessed: " + btn);
  if (!gamePlaying) {
    return;
  }
  //check if the button pressed match with the pattern according to the guess they are at
  if (btn == pattern[guessCounter]) {
    //check if the player correct click all the button on their turn
    if (guessCounter == progress) {
      //when the progress reach the entire length of the pattern
      if (progress == pattern.length - 1) {
        clueHoldTime = 1000;
        winGame();
      } else {
        //if the game's progress is not at the end, it increase the progress so
        //next turn is longer
        progress++;
        playClueSequence();
        clueHoldTime -= clueHoldTime/3;
      }
    } else {
      //increase guessCounter so it could check with next pattern
      guessCounter++;
    }
  } else {
    //when user click incorrect guess, game end
    //check amount of lives
    if (lives > 1) {
      lives -= 1;
      document.getElementById("Ntext").innerHTML = lives;
      playClueSequence();
      
    } else {
      loseGame();
      clueHoldTime = 1000;
    } 
  }
}



// Sound Synthesis Functions
const freqMap = {
  1: 250,
  2: 330,
  3: 400,
  4: 466,
  5: 500
}
function playTone(btn,len){ 
  o.frequency.value = freqMap[btn]
  g.gain.setTargetAtTime(volume,context.currentTime + 0.05,0.025)
  context.resume()
  tonePlaying = true
  setTimeout(function(){
    stopTone()
  },len)
}
function startTone(btn){
  if(!tonePlaying){
    context.resume()
    o.frequency.value = freqMap[btn]
    g.gain.setTargetAtTime(volume,context.currentTime + 0.05,0.025)
    context.resume()
    tonePlaying = true
  }
}
function stopTone(){
  g.gain.setTargetAtTime(0,context.currentTime + 0.05,0.025)
  tonePlaying = false
}

// Page Initialization
// Init Sound Synthesizer
var AudioContext = window.AudioContext || window.webkitAudioContext 
var context = new AudioContext()
var o = context.createOscillator()
var g = context.createGain()
g.connect(context.destination)
g.gain.setValueAtTime(0,context.currentTime)
o.connect(g)
o.start(0)

/* If you're feeling fancy you can add interactivity 
    to your site with Javascript */

//Global Variables
var pattern = [2, 5, 4, 3, 1, 2, 4, 5];
var progress = 0; 
var gamePlaying = false;
var tonePlaying = false;
var volume = 0.7;
var guessCounter = 0;
var clueHoldTime = 1000;

//global constant variables

const cluePauseTime = 333;
const nextClueWaitTime = 1000;


function startGame(){
    //initialize game variables
    progress = 0;
    gamePlaying = true;
  // swap the Start and Stop buttons
document.getElementById("startBtn").classList.add("hidden");
document.getElementById("stopBtn").classList.remove("hidden");
  for(let i=0; i<pattern.length; i++)
  {
    pattern[i]= getRandomPattern(1,5);
  }
  playClueSequence();
}

function stopGame(){
    //initialize game variables
    gamePlaying = false;
  // swap the Start and Stop buttons
document.getElementById("startBtn").classList.remove("hidden");
document.getElementById("stopBtn").classList.add("hidden");
}

// Sound Synthesis Functions
const freqMap = {
  1: 390.0,
  2: 490.6,
  3: 392,
  4: 466.2,
  5: 500.0
}

function getRandomPattern(min, max)
{
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random()*(max-min)+min);
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

function lightButton(btn){
  document.getElementById("button"+btn).classList.add("lit")
}

function clearButton(btn){
  document.getElementById("button"+btn).classList.remove("lit")
}

function playSingleClue(btn){
  if(gamePlaying){
    lightButton(btn);
    playTone(btn,clueHoldTime);
    setTimeout(clearButton,clueHoldTime,btn);
  }
}

function playClueSequence(){
  context.resume()
  
  guessCounter = 0;
  let delay = nextClueWaitTime; //set delay to initial wait time
  for(let i=0;i<=progress;i++){ // for each clue that is revealed so far
    console.log("play single clue: " + pattern[i] + " in " + delay + "ms")
    setTimeout(playSingleClue,delay,pattern[i]) // set a timeout to play that clue
    delay += clueHoldTime 
    delay += cluePauseTime;
    clueHoldTime = clueHoldTime-10;
  }
}

function loseGame(){
  stopGame();
  alert("Game Over. Nice Try!.");
}

function winGame(){
  stopGame();
  alert("You win! YAY!!.");
}

function guess(btn){
  console.log("user guessed: " + btn);
  if(!gamePlaying){
    return;
  }
  
  
  
    if(btn==pattern[guessCounter])
    {
      
      
      if(guessCounter==progress)
      {
        if(progress==pattern.length-1)
        {
          winGame();
        }
        
        else 
        {
          progress++;
          playClueSequence();
        }
      }
      else
      {
        guessCounter++;
      }
    }
    else
    {
      loseGame();
    }
  // add game logic here
}
// Below provides access to info/DOM of the respective element
const testWrapper = document.querySelector(".test-wrapper");
const testArea = document.querySelector("#test-area");
var testAreaValue = testArea.value;
const originText = document.querySelector("#origin-text p").innerHTML;
const resetButton = document.querySelector("#reset");
const theTimer = document.querySelector(".timer");

// Holds either the numerical or string value of the stopwatch/timer
var hundreths = 0;
var hundrethsString = "0";
var seconds = 0;
var secondsString="0";
var minutes = 0;
var minutesString ="0";

// Takes the text from originText and splits all of it individual characters, if a blank/space the element is considered empty but occupies that index in the array
var originTextChar = originText.split('');

// Initialzing the variables to be used to process and ouptut the user text to the origin-text-user
var input_current=[];
var inputCurrentJoin="";

// Will be hused to hold the setInterval functions
var intervalStopwatch;
var intervalProcessInput; 

// Keeps track of game state, used to determine if the setInterval functions should continue and whtehr or not to update the scoreBoard
var gameCompleted=0;

// Used to update the scoreboard based on number of gamesPlayed
var gamesPlayed=0;

// Holds the times
var timeArray = [];

/*========================================================================================================================*/

// Constructor for Time objects
function Time(minuteString,secondString,hundrethString,timeHundreths){
  this.minuteString = minuteString;
  this.secondString = secondString;
  this.hundrethString = hundrethString;
  this.timeHundreths = timeHundreths;
}

// Match the text entered with the provided text on the page:
function processInput(){
  
  // Takes the DOM in the testArea and turns it into a char array
  var testAreaValueChar = testArea.value.split('');
  
  // For each character in the testArea compare that character in the same index as the origintext
  testAreaValueChar.forEach((char,index) =>{
    // If it's the correct character be ready to display it
    if(char == originTextChar[index]){
      input_current[index] = char;
    }
    // Else it's wrong and should be replaced with an X.
    else{
      input_current[index] = "X"
    }
  })
  
  // Undo the char array split and rejoin it as one string
  inputCurrentJoin = input_current.join("");
  
  // Output the result
  document.getElementById("origin-text-user").innerHTML = inputCurrentJoin;
  
  // If the player types the provided text EXACTLY, the game stops displaying the correct text on the origin-text-user
  if(inputCurrentJoin == originText){
    stopGame();
  }
  // else empty the "board" in order to check the testArea at setIntervals . . .
  else{input_current=[];}
}

/*========================================================================================================================*/
// Run a standard minute/second/hundredths timer:
function stopwatch(){
  
  // Under the assumption that 10 miliseconds = 1 hundreth of a second,
  // and that the setInterval is being run at 10 miliseconds
  // 100 iterations/hundreths is 1 second
  if (hundreths == 100){
    seconds++;
    hundreths = 0;
  }
  
  // For every 60 seconds add 1 minute
  if (seconds == 60){
    minutes++;
    seconds = 0
  }
  
  // Add leading zero to numbers 9 or below (purely for aesthetics):
  if(hundreths < 10){ hundrethsString = "0" + hundreths; }else{ hundrethsString = hundreths;} 
  if(seconds < 10){ secondsString = "0" + seconds; }else{ secondsString = seconds;} 
  if(minutes < 10){ minutesString = "0" + minutes; }else{ minutesString = seconds;} 
  
  // Display the results
  document.getElementById("timer").innerHTML = minutesString + ":" + secondsString +":" + hundrethsString;

  //current++;
  hundreths++;
}
/*========================================================================================================================*/
// Start the timer:
function startGame(){
  
  // Only create/call the setInterval if thier not active already
  if (!(intervalStopwatch ) & !(intervalProcessInput )){
    intervalStopwatch = setInterval(stopwatch, 10) 
    intervalProcessInput = setInterval(processInput,10)
  }
}
/*========================================================================================================================*/
// Stops the timer, game, and setIntervals:
function stopGame(){
  gamesPlayed++;
  updateScoreboard();
  clearInterval(intervalStopwatch);
  clearInterval(intervalProcessInput);
  gameCompleted=1;
}
/*========================================================================================================================*/
// Reset everything:
function resetGame(){
  
  clearInterval(intervalStopwatch);
  clearInterval(intervalProcessInput);
  
  hundreths = 0;
  hundrethsString = "0";
  seconds = 0;
  secondsString="0";
  minutes = 0;
  minutesString ="0";
  
  input_current=[];
  inputCurrentJoin="";

  intervalStopwatch=null;
  intervalProcessInput=null; 
  
  gameCompleted=0;
  
  document.getElementById("origin-text-user").innerHTML = "X marks an incorrect type";
  testArea.value=null;
  document.getElementById("timer").innerHTML = "0"+minutesString + ":" + "0"+secondsString +":" + "0"+hundrethsString;
}
/*========================================================================================================================*/
// Used to keep times and update the Scoreboard
function updateScoreboard(){
  
  // Convert the time obtained into hundreths for a more accurate read
  var timeInHundreths = (minutes*60*100) + (seconds*100) + hundreths;
  
  // Place the newly obtained time into the timeTable
  timeArray.push(new Time(minutesString,secondsString,hundrethsString,timeInHundreths));
  
  // Sort the timeTable by Ascending Time
  timeArray = timeArray.sort((a,b)=> a.timeHundreths - b.timeHundreths)
  
  // Display the top 3 fastest times
  if(gamesPlayed >= 1){document.getElementById("timeGold").innerHTML = timeArray[0].minuteString + ":" + timeArray[0].secondString +":" + timeArray[0].hundrethString;}
  
  if(gamesPlayed >= 2){document.getElementById("timeSilver").innerHTML = timeArray[1].minuteString + ":" + timeArray[1].secondString +":" + timeArray[1].hundrethString;}
  
  if(gamesPlayed >= 3){document.getElementById("timeBronze").innerHTML = timeArray[2].minuteString + ":" + timeArray[2].secondString +":" + timeArray[2].hundrethString;}
}
/*========================================================================================================================*/
// Event listeners for keyboard input and the reset button:

// Game will start when a key is pressed down, not released.
// Leads to a "fun" situation where pressing shift will start the game
if (gameCompleted==0){testArea.addEventListener('keydown', startGame)}

// Reset button to reset the game at any time.
resetButton.addEventListener('click', resetGame)
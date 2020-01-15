const testWrapper = document.querySelector(".test-wrapper");
const testArea = document.querySelector("#test-area");
const originText = document.querySelector("#origin-text p");
const author = document.querySelector("#author");
const resetButton = document.querySelector("#reset");
const nextButton = document.querySelector("#next");
const record = document.querySelector("#record p");
const theTimer = document.querySelector(".timer");

const hidden = "hidden";
const visible = "visible";
const timerStartPoint = "00:00:00";
const maxTime = "99:99:99";

var timer = [0,0,0,0];
var interval;
var timerRunning;
var lastRecord = maxTime;


// Get a random quote and assign it to the paragraph
function getQuote() {
    fetch("https://type.fit/api/quotes")
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            let quote = data[Math.floor(Math.random() * data.length)];
            originText.innerHTML = quote.text;
            author.innerHTML = quote.author;
        })
        .catch(function (error) {
            console.log('Request to Quotes API failed:', error);
        });
}

// Add leading zero to numbers 9 or below (purely for aesthetics):
function leadingZero(time) {
    if (time <= 9) {
        time = "0" + time;
    }
    return time;
}

// Run a standard minute/second/hundredths timer:
function runTimer() {
    let currentTime = leadingZero(timer[0]) + ":" + leadingZero(timer[1]) + ":" + leadingZero(timer[2]);
    theTimer.innerHTML = currentTime;
    timer[3]++;

    timer[0] = Math.floor((timer[3] / 100) / 60);
    timer[1] = Math.floor((timer[3] / 100) - (timer[0] * 60));
    timer[2] = Math.floor(timer[3] - (timer[1] * 100) - (timer[0] * 6000));

}

// Match the text entered with the provided text on the page:
function spellCheck() {
    let originTxt = originText.innerHTML;
    let textEntered = testArea.value;
    let originTextMatch = originTxt.substring(0, textEntered.length);

    if (textEntered === originTxt) {
        testWrapper.style.borderColor = "#009B01";
        author.style.visibility = visible;
        clearInterval(interval);
    } else {
        if (textEntered === originTextMatch) {
            testWrapper.style.borderColor = "#4B40E0";
        } else {
            testWrapper.style.borderColor = "#E95D0F";
        }
    }
}

// Start the timer:
function start() {
    let textEnteredLength = testArea.value.length;

    if (textEnteredLength === 0 && !timerRunning) {
        timerRunning = true;
        interval = setInterval(runTimer, 10);
    }
}



// Reset everything:
function reset() {
    bestTime();
    clearInterval(interval);
    interval = null;
    timer = [0,0,0,0];
    timerRunning = false;

    testArea.value = "";
    theTimer.innerHTML = timerStartPoint;
    testWrapper.style.borderColor = "grey";
    author.style.visibility = hidden;
}

getQuote();

// Event listeners for keyboard input and the reset button:
testArea.addEventListener("keypress", start, false);
testArea.addEventListener("keyup", spellCheck, false);
resetButton.addEventListener("click", reset, false);
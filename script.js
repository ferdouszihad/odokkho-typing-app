const display = document.getElementById("display");
const displayBox = document.getElementById("display-box");
const question = document.getElementById("question");
const startBtn = document.getElementById("start");
const countdownOverlay = document.getElementById("countdown");
const resultModal = document.getElementById("result");
const modalBackground = document.getElementById("modal-background");

// variables
let userText = "";
let errorCount = 0;
let startTime;
let questionText = "";
let typeSpeed = 0;
let currentTime = 0;

// Load and display question
const load = () => {
  fetch("./texts.json")
    .then((res) => res.json)
    .then((data) => {
      questionText = data[Math.floor(Math.random() * data.length)];
      question.innerHTML = questionText;
    });
};
load();

// checks the user typed character and displays accordingly
const typeController = (e) => {
  const newLetter = e.key;

  // Handle backspace press
  if (newLetter == "Backspace") {
    userText = userText.slice(0, userText.length - 1);
    return display.removeChild(display.lastChild);
  }

  // these are the valid character we are allowing to type
  const validLetters =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ 1234567890!@#$%^&*()_+-={}[]'\".,?";

  // if it is not a valid character like Control/Alt then skip displaying anything
  if (!validLetters.includes(newLetter)) {
    return;
  }

  userText += newLetter;

  const newLetterCorrect = validate(newLetter);

  if (newLetterCorrect) {
    display.innerHTML += `<span class="green">${
      newLetter === " " ? "▪" : newLetter
    }</span>`;
  } else {
    display.innerHTML += `<span class="red">${
      newLetter === " " ? "▪" : newLetter
    }</span>`;
    errorCount++;
  }

  // check if given question text is equal to user typed text
  if (questionText === userText) {
    gameOver();
  }
};

const validate = (key) => {
  if (key === questionText[userText.length - 1]) {
    return true;
  }
  return false;
};

// FINISHED TYPING
const gameOver = () => {
  document.removeEventListener("keydown", typeController);
  // the current time is the finish time
  // so total time taken is current time - start time
  const finishTime = new Date().getTime();
  const timeTaken = (finishTime - startTime) / 1000;

  // show result modal
  resultModal.innerHTML = "";
  resultModal.classList.toggle("hidden");
  modalBackground.classList.toggle("hidden");
  // clear user text
  display.innerHTML = "";
  display.classList.add("d-none");
  display.classList.remove("d-flex");
  // make it inactive
  displayBox.classList.add("inactive");
  // show result
  typeSpeed = checkSpeed(questionText, timeTaken);

  resultModal.innerHTML += `
    <h1>Finished!</h1>
    <p class="gap-down-10">You took: 
    <span class="bold">${timeTaken.toFixed(0)}</span> seconds</p>
    <p class="gap-down-10">You made <span class="bold red">${errorCount}</span> mistakes</p>

    <p class="gap-down-10">Your Typing Speed = <span class="bold green">${typeSpeed}</span> WPM</p>
    <button onclick="closeModal()">Close</button>
  `;
  startBtn.innerText = "Start again";

  currentTime = new Date().toUTCString();

  addHistory(questionText, timeTaken, errorCount, typeSpeed, currentTime);
  // restart everything
  startTime = null;
  errorCount = 0;
  userText = "";
  displayBox.classList.add("inactive");
  load();
};

const closeModal = () => {
  modalbackground.classList.toggle("hidden");
  ResultModal.classList.toggle("hidden");
};

// START Countdown
startBtn.addEventlistener("click", () => {
  if (startTime) return;

  let count = 3;
  countdownOverlay.style.display = "flex";

  const startCountdown = setInterval(() => {
    countdownOverlay.innerHTML = `<h1>${count}</h1>`;

    // finished timer
    if (count === 0) {
      // -------------- START TYPING -----------------
      startBtn.innerText = "Started";
      display.classList.remove("d-none");
      display.classList.add("d-flex");
      document.addEventListener("keydown", typeController);
      countdownOverlay.style.display = "none";
      displayBox.classList.remove("inactive");
      clearInterval(startCountdown);
      startTime = new Date().getTime();
    }
    count--;
  }, 1000);
});

// If history exists, show it
displayHistory();

// Show typing time spent
setInterval(() => {
  const currentTime = new Date().getTime();
  const timeSpent = (currentTime - startTime) / 1000;

  document.getElementById("show-time").innerHTML = `${
    startTime ? timeSpent.toFixed(0) : 0
  } seconds`;
}, 1000);

const checkSpeed = (str, time) => {
  let a = str.split(" ");
  return ((a.length / time) * 60).toFixed(0);
};

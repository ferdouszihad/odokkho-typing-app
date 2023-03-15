const histories = document.getElementById("histories");

function addHistory(
  questionText,
  timeTaken,
  errorCount,
  typeSpeed,
  currentTime
) {
  const newRow = document.createElement("div");
  newRow.classList.add("card");

  newRow.innerHTML = `
  <h4>${questionText}</h4>
  <div>
  <p>You took: <span class="bold">${timeTaken.toFixed(2)}</span> seconds</p>
  <p>You made <span class="bold red">${errorCount}</span> mistakes</p>
  <p>Type speed =  <span class="bold red">${typeSpeed}</span> WPM</p>
  </div>
  `;

  histories.appendChild(newRow);

  let previousTests = JSON.parse(localStorage.getItem("testHistry")) || [];
  previousTests.push({
    questionText,
    timeTaken,
    errorCount,
    typeSpeed,
    currentTime,
  });
  localStorage.setItem("testHistory", JSON.stringify(previousTests));

  displayHistory();
}

function displayHistory() {
  histories.innerHTML = "";
  const previousTests = JSON.parse(localStorage.getItem("testHistory")) || [];

  previousTests.forEach((test) => {
    const newRow = document.createElement("div");
    newRow.classList.add("card");

    newRow.innerHTML = `
    <h3 style='font-weight:500;'>${test.questionText}</h3>
    <p>You took: <span class="bold">${test.timeTaken.toFixed(
      0
    )} </span> seconds</p>
    <p>You made <span class="bold red">${test.errorCount}</span> mistakes</p>
    <p>Typing Speed =  <span class="bold green">${
      test.typeSpeed ? test.typeSpeed : "Not available"
    }</span> WPM</p> 
    <p style="border-top:1px solid #ddd ; margin-top:8px">Practice Time <br> <span class="green">${
      test.currentTime ? test.currentTime : "No Data available"
    }</span></p>
    
  `;

    histories.appendChild(newRow);
  });
}

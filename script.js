/// ---------------- LOGIN SYSTEM ----------------
const loginPage = document.querySelector(".login-page");
const loginBtn = document.getElementById("login-btn");

// Hide login if user already logged in
if (localStorage.getItem("quizUser")) {
  loginPage.style.display = "none";
}

// Login button
if (loginBtn) {
  loginBtn.onclick = () => {
    const username = document.getElementById("username").value.trim();
    if (username === "") {
      alert("Enter your name!");
      return;
    }
    localStorage.setItem("quizUser", username);
    loginPage.style.display = "none";
  };
}

/// ---------------- QUIZ SYSTEM ----------------
const startBtn = document.querySelector(".start-btn");
const popupInfo = document.querySelector(".popup-info");
const exitBtn = document.querySelector(".exit-btn");
const main = document.querySelector(".main");
const continueBtn = document.querySelector(".continue-btn");
const quizSection = document.querySelector(".quiz-section");
const quizBox = document.querySelector(".quiz-box");
const resultBox = document.querySelector(".result-box");
const tryAgainBtn = document.querySelector(".tryAgain-btn");
const goHomeBtn = document.querySelector(".goHome-btn");

startBtn.onclick = () => {
  popupInfo.classList.add("active");
  main.classList.add("active");
};

exitBtn.onclick = () => {
  popupInfo.classList.remove("active");
  main.classList.remove("active");
};

continueBtn.onclick = () => {
  quizSection.classList.add("active");
  popupInfo.classList.remove("active");
  main.classList.remove("active");
  quizBox.classList.add("active");

  showQuestions(0);
  questionCounter(1);
  headerScore();
};

tryAgainBtn.onclick = () => {
  quizBox.classList.add("active");
  nextBtn.classList.remove("active");
  resultBox.classList.remove("active");

  clearInterval(timer); // reset safety
  questionCount = 0;
  questionNumb = 1;
  userScore = 0;

  showQuestions(questionCount);
  questionCounter(questionNumb);
  headerScore();
};

goHomeBtn.onclick = () => {
  quizSection.classList.remove("active");
  nextBtn.classList.remove("active");
  resultBox.classList.remove("active");

  clearInterval(timer); // reset safety
  questionCount = 0;
  questionNumb = 1;
  userScore = 0;

  showQuestions(questionCount);
  questionCounter(questionNumb);
};

/// ---------------- QUIZ VARIABLES ----------------
let questionCount = 0;
let questionNumb = 1;
let userScore = 0;

const nextBtn = document.querySelector(".next-btn");

nextBtn.onclick = () => {
  clearInterval(timer); // prevent overlapping intervals
  if (questionCount < questions.length - 1) {
    questionCount++;
    showQuestions(questionCount);
    questionNumb++;
    questionCounter(questionNumb);
    nextBtn.classList.remove("active");
  } else {
    showResultBox();
  }
};

const optionList = document.querySelector(".option-list");

/// ---------------- TIMER SYSTEM ----------------
let timer;
let timeLeft = 20; // 20 seconds per question

function startTimer() {
  timeLeft = 20;
  document.getElementById("time-count").textContent = timeLeft;

  timer = setInterval(() => {
    timeLeft--;
    document.getElementById("time-count").textContent = timeLeft;

    if (timeLeft <= 0) {
      clearInterval(timer);
      autoSelectCorrect();
    }
  }, 1000);
}

function autoSelectCorrect() {
  const correctAnswer = questions[questionCount].answer;
  const allOptions = optionList.children.length;

  for (let i = 0; i < allOptions; i++) {
    if (optionList.children[i].textContent === correctAnswer) {
      optionList.children[i].classList.add("correct");
    }
    optionList.children[i].classList.add("disabled");
  }

  nextBtn.classList.add("active");
}

/// ---------------- SHOW QUESTIONS ----------------
function showQuestions(index) {
  const questionText = document.querySelector(".question-text");
  questionText.textContent = `${questions[index].numb}. ${questions[index].question}`;

  const optionTag = `
    <div class="option"><span>${questions[index].options[0]}</span></div>
    <div class="option"><span>${questions[index].options[1]}</span></div>
    <div class="option"><span>${questions[index].options[2]}</span></div>
    <div class="option"><span>${questions[index].options[3]}</span></div>
  `;
  optionList.innerHTML = optionTag;

  const option = document.querySelectorAll(".option");
  for (let i = 0; i < option.length; i++) {
    option[i].setAttribute("onclick", "optionSelected(this)");
  }

  clearInterval(timer);
  startTimer();
}

/// ---------------- SELECT OPTION ----------------
function optionSelected(answer) {
  clearInterval(timer);

  const userAnswer = answer.textContent;
  const correctAnswer = questions[questionCount].answer;
  const allOptions = optionList.children.length;

  if (userAnswer === correctAnswer) {
    answer.classList.add("correct");
    userScore++;
    headerScore();
  } else {
    answer.classList.add("incorrect");
  }

  for (let i = 0; i < allOptions; i++) {
    if (optionList.children[i].textContent === correctAnswer) {
      optionList.children[i].classList.add("correct");
    }
    optionList.children[i].classList.add("disabled");
  }

  nextBtn.classList.add("active");
}

/// ---------------- SCORE + RESULT ----------------
function questionCounter(index) {
  const questionTotal = document.querySelector(".question-total");
  questionTotal.textContent = `${index} of ${questions.length} Questions`;
}

function headerScore() {
  const headerScoreText = document.querySelector(".header-score");
  headerScoreText.textContent = `Score: ${userScore} / ${questions.length}`;
}

function showResultBox() {
  quizBox.classList.remove("active");
  resultBox.classList.add("active");

  const scoreText = document.querySelector(".score-text");
  scoreText.textContent = `Your Score ${userScore} out of ${questions.length}`;

  const circularProgress = document.querySelector(".circular-progress");
  const progressValue = document.querySelector(".progress-value");

  let progressStartValue = -1;
  const progressEndValue = Math.round((userScore / questions.length) * 100);
  const speed = 10;

  const progress = setInterval(() => {
    progressStartValue++;
    circularProgress.style.background = `conic-gradient(#851111 ${
      progressStartValue * 3.6
    }deg, rgba(255, 255, 255, .1) 0deg)`;
    progressValue.textContent = `${progressStartValue}%`;
    if (progressStartValue >= progressEndValue) {
      clearInterval(progress);
    }
  }, speed);
}

// ---------- Certificate generation ----------
const downloadCertBtn = document.getElementById("download-cert-btn");
const certTemplate = document.getElementById("certificate-template");

function formatDateForCert(d) {
  const opts = { year: "numeric", month: "long", day: "numeric" };
  return new Date(d).toLocaleDateString(undefined, opts);
}

async function createCertificatePDF() {
  const name =
    localStorage.getItem("quizUser") && localStorage.getItem("quizUser").trim()
      ? localStorage.getItem("quizUser").trim()
      : "Guest";
  const percent = Math.round((userScore / questions.length) * 100);
  const dateStr = formatDateForCert(new Date());

  document.getElementById("cert-name").textContent = name;
  document.getElementById("cert-score").textContent = `${userScore} / ${questions.length}`;
  document.getElementById("cert-percent").textContent = `${percent}%`;
  document.getElementById("cert-date").textContent = dateStr;

  // make template visible for render
  certTemplate.style.display = "block";
  certTemplate.style.position = "absolute";
  certTemplate.style.left = "-9999px";

  await new Promise((r) => setTimeout(r, 50));

  const canvas = await html2canvas(certTemplate.querySelector(".cert-wrapper"), {
    scale: 2,
    useCORS: true,
    backgroundColor: null,
  });

  const imgData = canvas.toDataURL("image/png");
  const { jsPDF } = window.jspdf;
  const pdf = new jsPDF({ orientation: "landscape", unit: "pt", format: "a4" });

  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const imgProps = pdf.getImageProperties(imgData);
  const imgWidth = pageWidth;
  const imgHeight = (imgProps.height * pageWidth) / imgProps.width;

  pdf.addImage(imgData, "PNG", 0, (pageHeight - imgHeight) / 2, imgWidth, imgHeight);
  pdf.save(`${name.replace(/\s+/g, "_")}_ATX_Certificate.pdf`);

  certTemplate.style.display = "none";
}

if (downloadCertBtn) {
  downloadCertBtn.addEventListener("click", async () => {
    downloadCertBtn.disabled = true;
    downloadCertBtn.textContent = "Preparing...";
    try {
      await createCertificatePDF();
    } catch (err) {
      console.error("Certificate error:", err);
      alert("Failed to generate certificate. See console for details.");
    }
    downloadCertBtn.disabled = false;
    downloadCertBtn.textContent = "Download Certificate";
  });
}

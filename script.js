document.addEventListener("DOMContentLoaded", () => {
  const startScreen = document.getElementById("start-screen");
  const quizScreen = document.getElementById("quiz-screen");
  const resultScreen = document.getElementById("result-screen");

  const startBtn = document.getElementById("start-btn");
  const restartBtn = document.getElementById("restart-btn");
  const progress = document.getElementById("progress");
  const questionText = document.getElementById("question-text");
  const answerOptions = document.getElementById("answer-options");

  const scentName = document.getElementById("scent-name");
  const mbtiType = document.getElementById("mbti-type");
  const scentDescription = document.getElementById("scent-description");
  const resultImg = document.getElementById("result-img");
  const purchaseLink = document.getElementById("purchase-link");

  let gender = "";
  let age = "";
  let currentQuestion = 0;
  let selectedAnswers = [];

  const questions = [
    {
      text: "휴일에는 주로 어떤 활동을 좋아하나요?",
      options: ["조용히 휴식하기", "친구들과 어울리기"],
    },
    {
      text: "당신의 성격은 어떤 편인가요?",
      options: ["계획적인 편", "즉흥적인 편"],
    },
    {
      text: "스트레스를 받을 때, 당신은?",
      options: ["혼자 정리하는 편", "누군가와 이야기하는 편"],
    },
    {
      text: "여행할 때 당신은?",
      options: ["자연 풍경을 선호", "도시의 활기를 선호"],
    },
  ];

  const scents = [
    {
      mbti: "INTJ",
      name: "백화산 (Mountain Mist)",
      desc: "깊은 숲속의 청량함이 집중과 평온을 돕는 향기입니다.",
      img: "https://makanature2023-code.github.io/mbti-app/images/mountain.jpg",
      link: "https://smartstore.naver.com/makanature",
    },
    {
      mbti: "ENFP",
      name: "만리포 (Sunset Bloom)",
      desc: "자유로운 감성과 따뜻한 햇살이 어우러진 감미로운 향기입니다.",
      img: "https://makanature2023-code.github.io/mbti-app/images/sunset.jpg",
      link: "https://smartstore.naver.com/makanature",
    },
  ];

  document.querySelectorAll(".option").forEach((btn) => {
    btn.addEventListener("click", () => {
      const group = btn.dataset.group;
      const value = btn.dataset.value;

      if (group === "gender") {
        gender = value;
        document
          .querySelectorAll('[data-group="gender"]')
          .forEach((b) => b.classList.remove("selected"));
      } else if (group === "age") {
        age = value;
        document
          .querySelectorAll('[data-group="age"]')
          .forEach((b) => b.classList.remove("selected"));
      }

      btn.classList.add("selected");
      if (gender && age) startBtn.disabled = false;
    });
  });

  startBtn.addEventListener("click", () => {
    startScreen.classList.remove("active");
    quizScreen.classList.add("active");
    currentQuestion = 0;
    selectedAnswers = [];
    showQuestion();
  });

  restartBtn.addEventListener("click", () => {
    resultScreen.classList.remove("active");
    startScreen.classList.add("active");
    gender = "";
    age = "";
    selectedAnswers = [];
    startBtn.disabled = true;
    document.querySelectorAll(".option").forEach((b) => b.classList.remove("selected"));
  });

  function showQuestion() {
    const q = questions[currentQuestion];
    questionText.textContent = q.text;
    progress.style.width = `${((currentQuestion + 1) / questions.length) * 100}%`;

    answerOptions.innerHTML = "";
    q.options.forEach((opt) => {
      const btn = document.createElement("button");
      btn.classList.add("option", "quiz-option");
      btn.textContent = opt;
      btn.onclick = () => {
        selectedAnswers.push(opt);
        if (currentQuestion < questions.length - 1) {
          currentQuestion++;
          showQuestion();
        } else {
          showResult();
        }
      };
      answerOptions.appendChild(btn);
    });
  }

  function showResult() {
    quizScreen.classList.remove("active");
    resultScreen.classList.add("active");

    const result =
      selectedAnswers.filter((a) => a.includes("조용히") || a.includes("계획")).length >= 2
        ? scents[0]
        : scents[1];

    scentName.textContent = result.name;
    mbtiType.textContent = result.mbti;
    scentDescription.textContent = result.desc;
    resultImg.src = result.img;
    purchaseLink.href = result.link;
  }
});

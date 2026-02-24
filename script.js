/* ─────────────────────────────────────────
   DOM READY
───────────────────────────────────────── */
document.addEventListener("DOMContentLoaded", () => {

  if (document.body.classList.contains("home-page")) {
    showSection("home");
  }

  /* ✅ GAME PAGE */
  if (document.getElementById("game")) {
    document.getElementById("submit-answer")?.addEventListener("click", checkAnswer);
    document.getElementById("skip-question")?.addEventListener("click", skipQuestion);
    document.getElementById("hint-question")?.addEventListener("click", hintQuestion);

    document.getElementById("answer-input")?.addEventListener("keypress", e => {
      if (e.key === "Enter") {
        e.preventDefault();
        checkAnswer();
      }
    });

    startQuiz();
  }

  /* ✅ MEMBER DETAILS PAGE */
  if (document.querySelector(".member-detail")) {
    initMemberDetails();
  }
  showAlbumFromHash();
const loginBtn   = document.getElementById("loginBtn");
  const profileMenu = document.getElementById("profileMenu");

  if (!loginBtn || !profileMenu) {
    console.error("Nav elements not found – check HTML IDs");
    return;
  }

  const isLoggedIn = localStorage.getItem("tripleSLoggedIn") === "true";

  if (isLoggedIn) {
    loginBtn.style.display = "none";
    profileMenu.style.display = "block";
  } else {
    loginBtn.style.display = "block";
    profileMenu.style.display = "none";
  }
});

function updateNavStatus() {

  const loginBtn    = document.getElementById("loginBtn");
  const profileMenu = document.getElementById("profileMenu");
  const usernameEl  = document.getElementById("dropdownUsername");

  const shopNav  = document.getElementById("shopNav");
  const adminNav = document.getElementById("adminNav");
  const adminLink= document.getElementById("adminLink");
  const cartIcon = document.getElementById("cartIcon");

  if (!loginBtn || !profileMenu) return;

  const isLoggedIn  = localStorage.getItem("tripleSLoggedIn") === "true";
  const currentUser = JSON.parse(localStorage.getItem("tripleSCurrentUser"));

  // 👤 LOGIN / LOGOUT UI
  loginBtn.style.display    = isLoggedIn ? "none"  : "block";
  profileMenu.style.display = isLoggedIn ? "block" : "none";

  if (isLoggedIn && currentUser && usernameEl) {
    usernameEl.textContent = currentUser.username;
  }

  // 🛒 SHOP → ONLY WHEN LOGGED IN
  if (shopNav) {
    shopNav.style.display = isLoggedIn ? "block" : "none";
  }

  // 🛒 CART ICON → ONLY WHEN LOGGED IN
  if (cartIcon) {
    cartIcon.style.display = isLoggedIn ? "block" : "none";
  }

  // 👑 ADMIN UI
  if (currentUser && currentUser.role === "admin") {

    if (adminNav)  adminNav.style.display  = "block";
    if (adminLink) adminLink.style.display = "block";

  } else {

    if (adminNav)  adminNav.style.display  = "none";
    if (adminLink) adminLink.style.display = "none";

  }
}

document.addEventListener("DOMContentLoaded", updateNavStatus);
window.addEventListener("focus", updateNavStatus);

// ─────────────────────────────────────────
// Hamburger toggle for small screens
// ─────────────────────────────────────────
document.addEventListener("DOMContentLoaded", () => {
  const hambs = document.querySelectorAll('.hamburger');
  const navCenter = document.querySelector('.nav-center');

  if (!navCenter || !hambs.length) return;

  hambs.forEach(btn => {
    btn.addEventListener('click', () => {
      const isOpen = navCenter.classList.toggle('open');
      btn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });
  });

  // Close menu when clicking a nav link (mobile)
  navCenter.addEventListener('click', (e) => {
    if (e.target.tagName === 'A' && navCenter.classList.contains('open')) {
      navCenter.classList.remove('open');
      hambs.forEach(b => b.setAttribute('aria-expanded', 'false'));
    }
  });

  // Ensure menu resets on resize to desktop
  window.addEventListener('resize', () => {
    if (window.innerWidth > 768) {
      navCenter.classList.remove('open');
      hambs.forEach(b => b.setAttribute('aria-expanded', 'false'));
    }
  });
});

function toggleDropdown() {
  const dropdown = document.getElementById("dropdown");
  if (dropdown) dropdown.classList.toggle("show");
}

function logout() {
  localStorage.removeItem("tripleSLoggedIn");
  localStorage.removeItem("tripleSCurrentUser");
  updateNavStatus();
  window.location.reload();
}

function showAlbumFromHash() {
  const hash = window.location.hash;

  const sections = document.querySelectorAll(".album-detail");

  sections.forEach(sec => sec.style.display = "none");

  if (hash) {
    const active = document.querySelector(hash);
    if (active) {
      active.style.display = "block";

      // breadcrumb update
      const title = active.querySelector("h1")?.textContent || "Album";
      const bc = document.getElementById("album-breadcrumb");
      if (bc) bc.textContent = title;
    }
  } else {
    sections[0].style.display = "block";
  }
}
/* ─────────────────────────────────────────
   SPA SECTION SYSTEM (INDEX ONLY)
───────────────────────────────────────── */
function showSection(sectionId) {

  const sections = document.querySelectorAll("section");
  if (!sections.length) return;

  sections.forEach(section => section.style.display = "none");

  const target = document.getElementById(sectionId);
  if (!target) return;

  if (sectionId === "members") {
    target.style.display = "block";
    window.scrollTo(0, lastMembersScrollY);
  }
  else {
    target.style.display = "block";
    window.scrollTo(0, 0);
  }
  updateNavAndBreadcrumbs(sectionId, target);

  if (sectionId === "game") startQuiz();
}

/* ─────────────────────────────────────────
   NAV + BREADCRUMB
───────────────────────────────────────── */
function updateNavAndBreadcrumbs(sectionId, target) {

  document.querySelectorAll(".nav-center a").forEach(link =>
    link.classList.remove("active")
  );

  let activeNav = document.querySelector(
    `.nav-center a[onclick="showSection('${sectionId}')"]`
  );

  if (!activeNav && target?.classList.contains("member-detail")) {
    activeNav = document.querySelector(
      `.nav-center a[onclick="showSection('members')"]`
    );
  }

  if (activeNav) activeNav.classList.add("active");

  const bcCurrent = document.getElementById("bc-current");
  if (bcCurrent) {
    bcCurrent.textContent =
      sectionId.charAt(0).toUpperCase() + sectionId.slice(1);
  }
}

/* ─────────────────────────────────────────
   MEMBER DETAILS (HASH SYSTEM)
───────────────────────────────────────── */
function initMemberDetails() {

  const sections = document.querySelectorAll(".member-detail");
  const breadcrumb = document.getElementById("member-breadcrumb");

  function showMemberFromHash() {

    const hash = window.location.hash.replace("#", "").toLowerCase();
    if (!hash) return;

    let active = null;

    sections.forEach(section => {
      if (section.id.toLowerCase() === hash) {
        section.style.display = "block";
        active = section;
      } else {
        section.style.display = "none";
      }
    });

    if (!active) {
      window.location.replace("members.html");
      return;
    }

    const name = active.querySelector("h2")?.textContent;
    if (name && breadcrumb) breadcrumb.textContent = name;

    window.scrollTo(0, 0);
  }

  showMemberFromHash();
  window.addEventListener("hashchange", showMemberFromHash);
}

/* ─────────────────────────────────────────
   QUIZ DATA
───────────────────────────────────────── */
const IMAGE_BASE = "images/";
const MAX_PHOTOS_PER_MEMBER = 5;

const quizMembers = [
  { stageName: "SeoYeon", folder: "seoyeon_images" },
  { stageName: "HyeRin", folder: "hyerin_images" },
  { stageName: "JiWoo", folder: "jiwoo_images" },
  { stageName: "ChaeYeon", folder: "chaeyeon_images" },
  { stageName: "YooYeon", folder: "yooyeon_images" },
  { stageName: "SooMin", folder: "soomin_images" },
  { stageName: "NaKyoung", folder: "nakyoung_images" },
  { stageName: "YuBin", folder: "yubin_images" },
  { stageName: "Kaede", folder: "kaede_images" },
  { stageName: "DaHyun", folder: "dahyun_images" },
  { stageName: "Kotone", folder: "kotone_images" },
  { stageName: "YeonJi", folder: "yeonji_images" },
  { stageName: "Nien", folder: "nien_images" },
  { stageName: "SoHyun", folder: "sohyun_images" },
  { stageName: "Xinyu", folder: "xinyu_images" },
  { stageName: "Mayu", folder: "mayu_images" },
  { stageName: "Lynn", folder: "lynn_images" },
  { stageName: "JooBin", folder: "joobin_images" },
  { stageName: "HaYeon", folder: "hayeon_images" },
  { stageName: "ShiOn", folder: "shion_images" },
  { stageName: "ChaeWon", folder: "chaewon_images" },
  { stageName: "Sullin", folder: "sullin_images" },
  { stageName: "SeoAh", folder: "seoah_images" },
  { stageName: "JiYeon", folder: "jiyeon_images" }
];
// script.js

let currentIndex = 0;
let score = 0;
let timeLeft = 300;
let skipsUsed = 0;
let hintsUsed = 0;
let timerInterval = null;
let selectedMembers = [];

const MAX_SKIPS = 3;
const MAX_HINTS = 3;    // ← MUST match your actual folder structure

// Assume quizMembers is defined earlier in the file or in another <script>
// Example:
// const quizMembers = [
//   { stageName: "Yoon SeoYeon", folder: "seoyeon" },
//   { stageName: "Jeong HyeRin", folder: "hyerin" },
//   // ... all 24 members
// ];

document.addEventListener("DOMContentLoaded", () => {
  prepareQuiz();

  document.getElementById("start-quiz")?.addEventListener("click", startQuiz);
  document.getElementById("submit-answer")?.addEventListener("click", checkAnswer);
  document.getElementById("skip-question")?.addEventListener("click", skipQuestion);
  document.getElementById("hint-question")?.addEventListener("click", hintQuestion);

  document.getElementById("answer-input")?.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();   // 🛑 stop form submit
    checkAnswer();
  }
});
});

function prepareQuiz() {
  if (timerInterval) clearInterval(timerInterval);
  timerInterval = null;

  currentIndex = 0;
  score = 0;
  timeLeft = 300;
  skipsUsed = 0;
  hintsUsed = 0;
  selectedMembers = [];

  document.getElementById("quiz-stats").style.display = "none";
  document.getElementById("answer-input").style.display = "none";
  document.getElementById("submit-answer").style.display = "none";
  document.getElementById("skip-question").style.display = "none";
  document.getElementById("hint-question").style.display = "none";
  document.getElementById("feedback").innerHTML = "";

  document.getElementById("current-question").textContent = "–";
  document.getElementById("score").textContent = "–";
  document.getElementById("timer").textContent = "–:–";

  document.getElementById("member-image").src = "images/tripleS_group.jpg"; // preview
  document.getElementById("member-image").alt = "tripleS members";

  document.getElementById("start-quiz").textContent = "Start";
  document.getElementById("start-quiz").style.display = "inline-block";
}

function startQuiz() {
  // Shuffle members
  selectedMembers = [...quizMembers]
    .sort(() => Math.random() - 0.5)
    .slice(0, 24);

  currentIndex = 0;
  score = 0;
  timeLeft = 300;
  skipsUsed = 0;
  hintsUsed = 0;

  document.getElementById("score").textContent = score;
  document.getElementById("current-question").textContent = 1;
  document.getElementById("timer").textContent = "5:00";

  document.getElementById("quiz-stats").style.display = "flex";
  document.getElementById("answer-input").style.display = "block";
  document.getElementById("submit-answer").style.display = "inline-block";
  document.getElementById("skip-question").style.display = "inline-block";
  document.getElementById("hint-question").style.display = "inline-block";

  document.getElementById("start-quiz").style.display = "none";
  document.getElementById("feedback").innerHTML = "";

  loadQuestion();
  startTimer();
}

function loadQuestion() {
  if (currentIndex >= selectedMembers.length) {
    endQuiz();
    return;
  }

  const member = selectedMembers[currentIndex];
  let baseName = member.stageName.toLowerCase().replace(/\s+/g, '');
  const folder = member.folder || baseName;

  const randomNum = Math.floor(Math.random() * MAX_PHOTOS_PER_MEMBER) + 1;
  const imagePath = `${IMAGE_BASE}${folder}/${baseName}_${randomNum}.webp`;

  console.log("Loading:", imagePath);

  const img = document.getElementById("member-image");
  img.src = imagePath;
  img.alt = member.stageName;

  img.onerror = () => {
    console.warn("Failed → fallback");
    img.src = `${IMAGE_BASE}${folder}/${baseName}_1.webp`;
  };

document.getElementById("answer-input").value = "";
  document.getElementById("feedback").innerHTML = "";

  // ─── Always show the buttons when loading a new question ───
  document.getElementById("submit-answer").style.display = "inline-block";
  document.getElementById("skip-question").style.display = "inline-block";
  document.getElementById("hint-question").style.display = "inline-block";

  document.getElementById("current-question").textContent = currentIndex + 1;

  // Reset hints if you want fresh hints per question
  hintsUsed = 0;
}


function startTimer() {
  if (timerInterval) clearInterval(timerInterval);

  timerInterval = setInterval(() => {
    timeLeft--;
    const min = Math.floor(timeLeft / 60);
    const sec = timeLeft % 60;
    document.getElementById("timer").textContent = `${min}:${sec.toString().padStart(2, '0')}`;

    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      endQuiz();
    }
  }, 1000);
}
function normalize(str) {
  return String(str)
    .normalize("NFKD")              // remove hidden unicode differences
    .replace(/[^\w\s]/g, "")        // remove special characters
    .replace(/\s+/g, "")            // remove ALL spaces
    .toLowerCase()
    .trim();

}
function checkAnswer() {
  const inputRaw = document.getElementById("answer-input").value;
  const correctRaw = selectedMembers[currentIndex].stageName;

  const input = normalize(inputRaw);
  const correct = normalize(correctRaw);

  console.log("INPUT:", input);
  console.log("CORRECT:", correct);

  if (input === correct) {
    console.log("✅ MATCH");

    score++;
    document.getElementById("score").textContent = score;

    document.getElementById("feedback").innerHTML =
      `<span style="color:#2ecc71;font-weight:bold;">Correct! +1</span>`;

    setTimeout(() => {
      if (currentIndex < selectedMembers.length - 1) {
        currentIndex++;
        loadQuestion();
      } else {
        endQuiz();
      }
    }, 800);

  } else {
    console.log("❌ NO MATCH");
    document.getElementById("feedback").innerHTML =
      `<span style="color:#dc3545;font-weight:bold;">Wrong... Try again!</span>`;
  }
}

function skipQuestion() {
  if (skipsUsed >= MAX_SKIPS) {
    document.getElementById("feedback").innerHTML = '<span style="color:#ff4444;">No skips left</span>';
    return;
  }
  skipsUsed++;
  document.getElementById("feedback").innerHTML = `<span style="color:#888;">Skipped (${MAX_SKIPS - skipsUsed} left)</span>`;

  document.getElementById("submit-answer").style.display = "none";
  document.getElementById("skip-question").style.display = "none";
  document.getElementById("hint-question").style.display = "none";

  if (currentIndex < selectedMembers.length - 1) {
    currentIndex++;
    setTimeout(loadQuestion, 800);
  } else {
    setTimeout(endQuiz, 800);
  }
}

function hintQuestion() {
  if (hintsUsed >= MAX_HINTS) {
    document.getElementById("feedback").innerHTML = '<span style="color:#ff4444;">No hints left</span>';
    return;
  }
  hintsUsed++;
  const first = selectedMembers[currentIndex].stageName.charAt(0).toUpperCase();
  document.getElementById("feedback").innerHTML = `<span style="color:#e67e22;">Hint: Starts with ${first} (${MAX_HINTS - hintsUsed} left)</span>`;
}

function endQuiz() {
  if (timerInterval) clearInterval(timerInterval);
  timerInterval = null;

  document.getElementById("feedback").innerHTML = `
    <h2 style="color:#fff;">Quiz Complete!</h2>
    <p style="font-size:1.8rem;">Score: <strong>${score} / 24</strong></p>
  `;

  document.getElementById("answer-input").style.display = "none";
  document.getElementById("submit-answer").style.display = "none";
  document.getElementById("skip-question").style.display = "none";
  document.getElementById("hint-question").style.display = "none";

  document.getElementById("start-quiz").textContent = "Play Again";
  document.getElementById("start-quiz").style.display = "inline-block";
}
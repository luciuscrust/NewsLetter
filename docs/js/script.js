// ---------------- Sidebar Toggle ----------------
const toggleBtn = document.getElementById('menu-toggle');
const sidebar = document.getElementById('sidebar');

toggleBtn?.addEventListener('click', () => {
  sidebar?.classList.toggle('open');
});

// ---------------- Popup Subscription Form Handler ----------------
["sub-btn", "sub-btn2"].forEach(id => {
  const btn = document.getElementById(id);
  btn?.addEventListener("click", (e) => {
    e.preventDefault();
    document.getElementById("popup-form")?.classList.add("show");
  });
});

document.getElementById("close-popup")?.addEventListener("click", () => {
  document.getElementById("popup-form")?.classList.remove("show");
});

//---------------- Google sheets ----------------
const sheetURL = 'https://script.google.com/macros/s/AKfycbyPqnBU19t9ucXB07XPucLl1Ja6TPR6hoFQ8DiCVCF7YSI71mwiXkybFTMrS3wLyEv4/exec';

document.getElementById("sub-form")?.addEventListener("submit", function (e) {
  e.preventDefault();

  const name = document.getElementById("sub-name")?.value.trim();
  const email = document.getElementById("sub-email")?.value.trim();
  const address = document.getElementById("sub-add")?.value.trim();
  const course = document.getElementById("sub-opp")?.value;
  const message = document.getElementById("sub-message");

  if (!email || !validateEmail(email)) {
    if (message) {
      message.textContent = "Please enter a valid email.";
      message.style.color = "red";
      message.classList.remove("hidden");
    }
    return;
  }

  fetch(sheetURL, {
    method: 'POST',
    mode: 'no-cors',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ type: "subscription", name, email, address, course })
  })
  .then(() => {
    if (message) {
      message.textContent = "Subscription submitted!";
      message.style.color = "green";
      message.classList.remove("hidden");
    }
    document.getElementById("sub-form").reset();
  })
  .catch(err => {
    console.error("Submission error:", err);
    if (message) {
      message.textContent = "Something went wrong.";
      message.style.color = "red";
      message.classList.remove("hidden");
    }
  });
});

// ---------------- Email Validation ----------------
function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// ---------------- Ad Rotation ----------------
const ads = document.querySelectorAll('.ad-carousel .ad');
let currentAd = 0;

function rotateAds() {
  if (ads.length === 0) return;

  ads[currentAd]?.classList.add('hidden');
  currentAd = (currentAd + 1) % ads.length;
  ads[currentAd]?.classList.remove('hidden');
}
setInterval(rotateAds, 5000);

// ---------------- Load News ----------------
const latestNewsSection = document.querySelector(".latest-news");
const latestNews = document.querySelector(".news-grid");
const opinionSection = document.querySelector(".opinion");
const internationalSection = document.querySelector(".international-news");
const trendingSection = document.querySelector(".trending-grid");

const API_KEY = "da521dc7acfe401d870388a473a27a51";
const BASE_URL = `https://newsapi.org/v2/top-headlines?language=en&pageSize=9&apiKey=${API_KEY}`;

function createArticle(article) {
  const articleEl = document.createElement("div");
  articleEl.classList.add("article");

  articleEl.innerHTML = `
    <img src="${article.urlToImage || 'https://via.placeholder.com/400x200?text=No+Image'}" alt="${article.title}">
    <div class="article-content">
      <h3>${article.title}</h3>
      <p>${article.description || 'No description available.'}</p>
      <a href="${article.url}" target="_blank" rel="noopener noreferrer">Read More</a>
    </div>
  `;

  return articleEl;
}

async function fetchNews() {
  try {
    const res = await fetch(`${BASE_URL}&category=general`);
    const data = await res.json();
    const articles = data.articles || [];

    latestNews.innerHTML = "";
    internationalSection.innerHTML = "<h2>International News</h2>";
    trendingSection.innerHTML = "";

    articles.slice(0, 3).forEach(article => latestNews.appendChild(createArticle(article)));
    articles.slice(6, 9).forEach(article => {
      internationalSection.appendChild(createArticle(article));
      trendingSection.appendChild(createArticle(article));
    });

    setupSearch();
  } catch (err) {
    console.error("Error fetching news:", err);
    latestNewsSection.innerHTML += "<p>Failed to load news articles.</p>";
  }
}

// ---------------- Search Setup ----------------
function setupSearch() {
  const allArticles = document.querySelectorAll(".article");
  const searchInput = document.getElementById("search-input");
  const searchBtn = document.getElementById("submit");

  if (!searchInput || !searchBtn) return;

  searchBtn.addEventListener("click", () => {
    const query = searchInput.value.toLowerCase();
    allArticles.forEach(article => {
      const text = article.textContent.toLowerCase();
      article.classList.toggle("hidden-article", !text.includes(query));
    });
  });
}

// ---------------- Letter Display & Submission ----------------
const lettersContainer = document.getElementById('letters-container');
let letters = [];
let currentIndex = 0;
const rotationInterval = 5 * 1000; // 5 minutes

async function fetchLetters() {
  try {
    const response = await fetch(sheetURL);
    const data = await response.json();
    if (Array.isArray(data) && data.length > 0) {
      letters = data;
      displayLetter();
      setInterval(displayLetter, rotationInterval);
    } else {
      lettersContainer.innerHTML = "<p>No letters found.</p>";
    }
  } catch (error) {
    console.error("Failed to fetch letters:", error);
    lettersContainer.innerHTML = "<p>Unable to load letters at this time.</p>";
  }
}

function displayLetter() {
  if (!letters.length) return;
  const letter = letters[currentIndex];
  lettersContainer.innerHTML = `
    <h2>Opinions & Letters</h2>
    <article class="article" class="letter">
      <p>"${letter.message}"</p>
      <p class="letter-author">— ${letter.author}</p>
    </article>
  `;
  currentIndex = (currentIndex + 1) % letters.length;
}
// Wait for the DOM to be fully loaded before calling fetchLetters and fetchNews
window.addEventListener("DOMContentLoaded", () => {
  fetchLetters(); // Fetch the letters once the DOM is loaded
  fetchNews();    // Fetch the news once the DOM is loaded
});


// ---------------- Sidebar Toggle ----------------
const toggleBtn = document.getElementById('menu-toggle');
const sidebar = document.getElementById('sidebar');

toggleBtn.addEventListener('click', () => {
  sidebar.classList.toggle('open');
});

// ---------------- Newsletter Form Handler ----------------
document.getElementById('newsletter-form').addEventListener('submit', function (e) {
  e.preventDefault();

  const email = document.getElementById('newsletter-email').value.trim();
  const message = document.getElementById('newsletter-message');

  if (!email || !validateEmail(email)) {
    message.textContent = "Please enter a valid email.";
    message.style.color = "red";
    message.classList.remove("hidden");
    return;
  }

  const sheetURL = 'https://script.google.com/macros/s/AKfycbyPqnBU19t9ucXB07XPucLl1Ja6TPR6hoFQ8DiCVCF7YSI71mwiXkybFTMrS3wLyEv4/exec';

  fetch(sheetURL, {
    method: 'POST',
    mode: 'no-cors',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email })
  })
  .then(() => {
    document.getElementById('newsletter-form').reset();
    message.textContent = "Thanks for subscribing!";
    message.style.color = "green";
    message.classList.remove("hidden");
  })
  .catch(error => {
    console.error('Error:', error);
    message.textContent = "Something went wrong. Please try again later.";
    message.style.color = "red";
    message.classList.remove("hidden");
  });
});

// ---------------- Popup Subscription Form Handler ----------------
document.getElementById("sub-btn").addEventListener("click", () => {
  document.getElementById("popup-form").classList.add("show");
});

document.getElementById("close-popup").addEventListener("click", () => {
  document.getElementById("popup-form").classList.remove("show");
});

document.getElementById("sub-form").addEventListener("submit", function (e) {
  e.preventDefault();

  const name = document.getElementById("sub-name").value.trim();
  const email = document.getElementById("sub-email").value.trim();
  const address = document.getElementById("sub-add").value.trim();
  const course = document.getElementById("sub-opp").value;
  const message = document.getElementById("sub-message");

  if (!email || !validateEmail(email)) {
    message.textContent = "Please enter a valid email.";
    message.style.color = "red";
    message.classList.remove("hidden");
    return;
  }

  const sheetURL = 'https://script.google.com/macros/s/AKfycbyPqnBU19t9ucXB07XPucLl1Ja6TPR6hoFQ8DiCVCF7YSI71mwiXkybFTMrS3wLyEv4/exec';

  fetch(sheetURL, {
    method: 'POST',
    mode: 'no-cors',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, address, course })
  })
  .then(() => {
    message.textContent = "Subscription submitted!";
    message.style.color = "green";
    message.classList.remove("hidden");
    document.getElementById("sub-form").reset();
  })
  .catch(err => {
    console.error("Submission error:", err);
    message.textContent = "Something went wrong.";
    message.style.color = "red";
    message.classList.remove("hidden");
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
  ads[currentAd].classList.add('hidden');
  currentAd = (currentAd + 1) % ads.length;
  ads[currentAd].classList.remove('hidden');
}
setInterval(rotateAds, 5000);

// ---------------- Search Bar ----------------
const searchInput = document.getElementById("search-input");
const searchBtn = document.getElementById("submit");

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

    articles.slice(0, 3).forEach(article => {
      latestNews.appendChild(createArticle(article));
    });

    internationalSection.innerHTML = "<h2>International News</h2>";
    articles.slice(6, 9).forEach(article => {
      internationalSection.appendChild(createArticle(article));
    });

    articles.slice(6, 9).forEach(article => {
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

  searchBtn.addEventListener("click", () => {
    const query = searchInput.value.toLowerCase();

    allArticles.forEach(article => {
      const text = article.textContent.toLowerCase();
      if (text.includes(query)) {
        article.classList.remove("hidden-article");
      } else {
        article.classList.add("hidden-article");
      }
    });
  });
}
window.addEventListener("DOMContentLoaded", fetchNews);

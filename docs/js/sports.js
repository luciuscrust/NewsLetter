// ---------------- Sidebar Toggle ----------------
const toggleBtn = document.getElementById("menu-toggle");
const sidebar = document.getElementById("sidebar");

toggleBtn.addEventListener("click", () => {
  sidebar.classList.toggle("open");
});

// ---------------- NewsAPI Sports Fetch ----------------
const API_KEY = "da521dc7acfe401d870388a473a27a51";
const API_URL = `https://newsapi.org/v2/top-headlines?category=sports&language=en&pageSize=9&apiKey=${API_KEY}`;
const container = document.getElementById("sports-articles");

async function fetchSportsNews() {
  try {
    const response = await fetch(API_URL);
    const data = await response.json();

    if (data.status !== "ok" || !data.articles || data.articles.length === 0) {
      container.innerHTML = `<p>Failed to load sports articles. (${data.message || "No data"})</p>`;
      return;
    }

    container.innerHTML = ""; // Clear old content

    data.articles.forEach(article => {
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

      container.appendChild(articleEl);
    });
  } catch (error) {
    console.error("Error fetching news:", error);
    container.innerHTML = "<p>Failed to load articles. Please try again later.</p>";
  }
}

fetchSportsNews();

// ---------------- Popup Subscription Form Handler ----------------
document.getElementById("sub-btn").addEventListener("click", e => {
  e.preventDefault();
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
  const submitBtn = document.querySelector("#sub-form button");

  if (!email || !validateEmail(email)) {
    if (message) {
      message.textContent = "Please enter a valid email.";
      message.style.color = "red";
      message.classList.remove("hidden");
    }
    return;
  }

  submitBtn.disabled = true;

  const sheetURL = 'https://script.google.com/macros/s/AKfycbyPqnBU19t9ucXB07XPucLl1Ja6TPR6hoFQ8DiCVCF7YSI71mwiXkybFTMrS3wLyEv4/exec';

  fetch(sheetURL, {
    method: 'POST',
    mode: 'no-cors',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      type: "subscription",
      name,
      email,
      address,
      course
    })
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
    })
    .finally(() => {
      submitBtn.disabled = false;
    });
});

// ---------------- Email Validation ----------------
function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

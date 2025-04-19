// ---------------- Sidebar Toggle ----------------
const toggleBtn = document.getElementById('menu-toggle');
const sidebar = document.getElementById('sidebar');

toggleBtn.addEventListener('click', () => {
  sidebar.classList.toggle('open');
});

const API_KEY = "da521dc7acfe401d870388a473a27a51"; 
const API_URL = `https://newsapi.org/v2/top-headlines?category=sports&language=en&pageSize=9&apiKey=${API_KEY}`;

const container = document.getElementById("sports-articles");

async function fetchSportsNews() {
  try {
    const response = await fetch(API_URL);
    const data = await response.json();

    if (data.articles && data.articles.length > 0) {
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
    } else {
      container.innerHTML = "<p>No sports articles found.</p>";
    }
  } catch (error) {
    console.error("Error fetching news:", error);
    container.innerHTML = "<p>Failed to load articles. Please try again later.</p>";
  }
}

fetchSportsNews();

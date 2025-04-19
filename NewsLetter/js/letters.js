// ---------------- Sidebar Toggle ----------------
const toggleBtn = document.getElementById('menu-toggle');
const sidebar = document.getElementById('sidebar');

toggleBtn?.addEventListener('click', () => {
  sidebar?.classList.toggle('open');
});

// ---------------- Email Validation ----------------
function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// ---------------- Google Apps Script URL ----------------
const sheetURL = 'https://script.google.com/macros/s/AKfycbyPqnBU19t9ucXB07XPucLl1Ja6TPR6hoFQ8DiCVCF7YSI71mwiXkybFTMrS3wLyEv4/exec';

// ---------------- Popup Subscription Form ----------------
document.getElementById("sub-btn")?.addEventListener("click", (e) => {
  e.preventDefault();
  document.getElementById("popup-form")?.classList.add("show");
});

document.getElementById("close-popup")?.addEventListener("click", () => {
  document.getElementById("popup-form")?.classList.remove("show");
});

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

// ---------------- Letter Display & Submission ----------------
const lettersContainer = document.getElementById('letters-container');
let letters = [];
let currentIndex = 0;
const rotationInterval = 5 * 60 * 1000; // 5 minutes

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
    <div class="letter">
      <p>"${letter.message}"</p>
      <p class="letter-author">— ${letter.author}</p>
    </div>
  `;
  currentIndex = (currentIndex + 1) % letters.length;
}

document.getElementById("letter-form")?.addEventListener("submit", function (e) {
  e.preventDefault();

  const name = document.getElementById("name")?.value.trim();
  const email = document.getElementById("email")?.value.trim();
  const messageText = document.getElementById("message")?.value.trim();

  let msgEl = document.getElementById("letter-message");
  if (!msgEl) {
    msgEl = document.createElement("p");
    msgEl.id = "letter-message";
    msgEl.style.marginTop = "10px";
    this.appendChild(msgEl);
  }

  if (!name || !email || !messageText) {
    msgEl.textContent = "All fields are required.";
    msgEl.style.color = "red";
    return;
  }

  if (!validateEmail(email)) {
    msgEl.textContent = "Please enter a valid email address.";
    msgEl.style.color = "red";
    return;
  }

  fetch(sheetURL, {
    method: "POST",
    mode: "no-cors",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ type: "letter", name, email, message: messageText })
  })
  .then(() => {
    msgEl.textContent = "Thank you for your letter!";
    msgEl.style.color = "green";
    this.reset();
  })
  .catch((error) => {
    console.error("Letter submission failed:", error);
    msgEl.textContent = "Something went wrong. Try again.";
    msgEl.style.color = "red";
  });
});

fetchLetters();

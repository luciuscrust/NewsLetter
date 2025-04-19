// ---------------- Config ----------------
const sheetURL = 'https://script.google.com/macros/s/AKfycbyPqnBU19t9ucXB07XPucLl1Ja6TPR6hoFQ8DiCVCF7YSI71mwiXkybFTMrS3wLyEv4/exec';

// ---------------- Utility ----------------
function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function setMessage(el, text, color = "red") {
  if (el) {
    el.textContent = text;
    el.style.color = color;
    el.classList.remove("hidden");
  }
}

// ---------------- Sidebar Toggle ----------------
document.getElementById('menu-toggle')?.addEventListener('click', () => {
  document.getElementById('sidebar')?.classList.toggle('open');
});

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
    setMessage(message, "Please enter a valid email.");
    return;
  }

  fetch(sheetURL, {
    method: 'POST',
    mode: 'no-cors',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ type: "subscription", name, email, address, course })
  })
  .then(() => {
    setMessage(message, "Subscription submitted!", "green");
    this.reset();
  })
  .catch(err => {
    console.error("Submission error:", err);
    setMessage(message, "Something went wrong.");
  });
});

// ---------------- Contact Form Handler ----------------
document.getElementById("contact-form")?.addEventListener("submit", function (e) {
  e.preventDefault();

  const name = document.getElementById("contact-name")?.value.trim();
  const email = document.getElementById("contact-email")?.value.trim();
  const purpose = document.getElementById("contact-purpose")?.value;
  const messageText = document.getElementById("contact-message")?.value.trim();

  let msgEl = document.getElementById("contact-response");
  if (!msgEl) {
    msgEl = document.createElement("p");
    msgEl.id = "contact-response";
    msgEl.style.marginTop = "10px";
    this.appendChild(msgEl);
  }

  if (!name || !email || !purpose || !messageText) {
    setMessage(msgEl, "Please complete all fields.");
    return;
  }

  if (!validateEmail(email)) {
    setMessage(msgEl, "Please enter a valid email address.");
    return;
  }

  fetch(sheetURL, {
    method: "POST",
    mode: "no-cors",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      type: "contact",
      name,
      email,
      purpose,
      message: messageText
    })
  })
    .then(() => {
      setMessage(msgEl, "Your message has been sent!", "green");
      this.reset();
    })
    .catch((error) => {
      console.error("Contact form error:", error);
      setMessage(msgEl, "There was an error sending your message.");
    });
});

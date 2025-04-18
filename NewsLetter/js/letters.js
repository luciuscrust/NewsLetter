const form = document.getElementById('letter-form');
const lettersContainer = document.getElementById('letters-container');

form.addEventListener('submit', function(event) {
  event.preventDefault();

  const name = document.getElementById('name').value;
  const message = document.getElementById('message').value;

  const letter = document.createElement('div');
  letter.className = 'letter';
  letter.innerHTML = `
    <p>"${message}"</p>
    <p class="letter-author">— ${name}</p>
  `;

  lettersContainer.prepend(letter);
  form.reset();
});

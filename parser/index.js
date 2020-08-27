import { tokenize } from './language';

// import { tokenize } from './tokenizer';
// import { init } from './language';

window.addEventListener('DOMContentLoaded', (event) => {
  const input = document.querySelector('#input');
  const display = document.querySelector('#display');
  document.querySelector('#submit').addEventListener('click', (e) => {
    display.innerHTML = JSON.stringify(tokenize(input.value).map(({ token, type }) => ({ token, type })), null, 2);
  });
  document.querySelector('#print').addEventListener('click', (e) => {
    display.innerHTML = input.value;
  });
});

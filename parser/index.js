import { parse } from './language';

// import { parse } from './parser';
// import { init } from './language';

window.addEventListener('DOMContentLoaded', (event) => {
  const input = document.querySelector('#input');
  const display = document.querySelector('#display');
  document.querySelector('#submit').addEventListener('click', (e) => {
    display.innerHTML = JSON.stringify(parse(input.value), null, 2);
  });
  document.querySelector('#print').addEventListener('click', (e) => {
    display.innerHTML = input.value;
  });
});

import { tokenize } from './tokenizer';
import { init } from './language';

init();

window.addEventListener('DOMContentLoaded', (event) => {
  const input = document.querySelector('#input');
  document.querySelector('#submit').addEventListener('click', (e) => {
    console.log(tokenize(input.value));
  });
  document.querySelector('#print').addEventListener('click', (e) => {
    console.log({ text: input.value });
  });
});

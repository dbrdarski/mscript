import parse from "./langs/default";

console.log({ parse })

// import { parse } from "./parser";
// import { init } from "./language";


window.addEventListener("DOMContentLoaded", (event) => {
  const input = document.querySelector("#input");
  const display = document.querySelector("#display");
  let read
  const parseInput = () => { read = parse(input.value).read }
  parseInput()

  input.addEventListener("input", parseInput)

  document.querySelector("#submit").addEventListener("click", (e) => {
    console.log(input.value)
    // console.log(read(input.value))
    // display.innerHTML = JSON.stringify(parse(input.value), null, 2);
    display.innerHTML = JSON.stringify(read(), null, 2);
  });
  document.querySelector("#print").addEventListener("click", (e) => {
    display.innerHTML = input.value;
  });
});

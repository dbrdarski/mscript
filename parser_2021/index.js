const { initializeASTs } from "./parser";
const { initializeParsers } from "./tokenizer";

export function setup () {
  initializeParsers();
  initializeASTs();
}

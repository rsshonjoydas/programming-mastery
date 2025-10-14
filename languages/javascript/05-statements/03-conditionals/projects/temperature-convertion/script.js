// TEMPERATURE CONVERSION PROGRAM
const textBox = document.getElementById('textBox');
const toFahrenheit = document.getElementById('toFahrenheit');
const toCelsius = document.getElementById('toCelsius');
const result = document.getElementById('result');
let temp;

function convert() {
  if (toFahrenheit.checked) {
    temp = Number(textBox.value);
    temp = (temp * 9) / 5 + 32;
    result.textContent = temp.toFixed(1) + '℉';
  } else if (toCelsius.checked) {
    temp = Number(textBox.value);
    temp = (temp - 32) * (5 / 9);
    result.textContent = temp.toFixed(1) + '℃';
  } else {
    result.textContent = 'Select a unit.';
  }
}

function submit(e) {
  e.preventDefault();
  if (e.keyCode === 13) {
    convert();
  }
}

textBox.addEventListener('keydown', submit);
toFahrenheit.addEventListener('keydown', submit);
toCelsius.addEventListener('keydown', submit);

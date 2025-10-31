// === ELEMENTS ===
const calculateBtn = document.getElementById("calculate-btn");
const bitsSelect = document.getElementById("num-bits");
const numberField = document.getElementById("number");
const solutionDiv = document.querySelector(".solution");
const signElem = document.querySelector(".sign-cntr");
const exponentElem = document.querySelector(".exponent-cntr");
const mantissaElem = document.querySelector(".mantissa-cntr");
const decimalAnswerElem = document.querySelector(".dec-answer-cntr");
const decToIeee = document.getElementById("decToIe");
const ieeeToDec = document.getElementById("ieToDec");
const toggleBckgr = document.querySelector(".toggle-background");
const bitsOptions = document.querySelector(".num-bit");
const decimalAnswer = document.querySelector(".decimal-answer-div");
const ieeeAnswer = document.querySelector(".answer-div");

let targetCalculation = "d-ieee";

// === MAIN FUNCTIONS ===

// Convert Decimal → IEEE
function convertDecToIEEE(numValue, bit) {
  if (isNaN(numValue)) return alert("Please enter a valid number");

  const signBit = numValue < 0 ? "1" : "0";
  const value = Math.abs(numValue);

  const exponentBits = bit === 32 ? 8 : 11;
  const mantissaBits = bit === 32 ? 23 : 52;
  const bias = bit === 32 ? 127 : 1023;

  if (value === 0) {
    signElem.textContent = signBit;
    exponentElem.textContent = "0".repeat(exponentBits);
    mantissaElem.textContent = "0".repeat(mantissaBits);
    return;
  }

  let exponent = Math.floor(Math.log2(value));
  let mantissaVal = value / Math.pow(2, exponent) - 1; // normalized mantissa

  const exponentBitsStr = (exponent + bias).toString(2).padStart(exponentBits, "0");


  let mantissaStr = "";
  let frac = mantissaVal;
  for (let i = 0; i < mantissaBits; i++) {
    frac *= 2;
    if (frac >= 1) {
      mantissaStr += "1";
      frac -= 1;
    } else {
      mantissaStr += "0";
    }
  }

  signElem.textContent = signBit;
  exponentElem.textContent = exponentBitsStr;
  mantissaElem.textContent = mantissaStr;
}

// Convert IEEE → Decimal
function convertIEEEToDec(binaryStr) {
  const clean = binaryStr.replace(/\s+/g, "");
  if (!/^[01]+$/.test(clean)) {
    alert("Invalid binary input (only 0 and 1 allowed)");
    return;
  }

  const bitLen = clean.length;
  const exponentBits = bitLen === 32 ? 8 : bitLen === 64 ? 11 : null;
  if (!exponentBits) {
    alert("Binary input must be 32 or 64 bits long");
    return;
  }

  const mantissaBits = bitLen - exponentBits - 1;
  const bias = exponentBits === 8 ? 127 : 1023;

  const signBit = clean[0];
  const exponentStr = clean.slice(1, 1 + exponentBits);
  const mantissaStr = clean.slice(1 + exponentBits);

  const sign = signBit === "1" ? -1 : 1;
  const exponent = parseInt(exponentStr, 2) - bias;

  let mantissa = 1.0;
  for (let i = 0; i < mantissaBits; i++) {
    if (mantissaStr[i] === "1") {
      mantissa += Math.pow(2, -(i + 1));
    }
  }

  const result = sign * mantissa * Math.pow(2, exponent);
  decimalAnswerElem.textContent = result;
}

// === EVENT HANDLERS ===

calculateBtn.addEventListener("click", () => {
  if (targetCalculation === "d-ieee") {
    const numValue = parseFloat(numberField.value);
    const bits = parseInt(bitsSelect.value);

    if (!bits) {
      alert("Please select bit size (32 or 64)");
      return;
    }

    convertDecToIEEE(numValue, bits);
    solutionDiv.classList.add("active");
  } else if (targetCalculation === "ieee-d") {
    const numValue = numberField.value.trim();
    if (!numValue) return alert("Enter a binary value");
    convertIEEEToDec(numValue);
    solutionDiv.classList.add("active");
  }
});

// === TOGGLES ===

ieeeToDec.addEventListener("click", () => {
  solutionDiv.classList.remove("active");
  numberField.type = "text";
  numberField.value = "";
  bitsSelect.value = "";
  targetCalculation = "ieee-d";
  bitsOptions.classList.add("hidden");
  toggleBckgr.classList.add("active");
  decimalAnswer.classList.remove("hidden");
  ieeeAnswer.classList.add("hidden");
});

decToIeee.addEventListener("click", () => {
  solutionDiv.classList.remove("active");
  numberField.type = "number";
  numberField.value = "";
  bitsSelect.value = "";
  targetCalculation = "d-ieee";
  bitsOptions.classList.remove("hidden");
  toggleBckgr.classList.remove("active");
  decimalAnswer.classList.add("hidden");
  ieeeAnswer.classList.remove("hidden");
});

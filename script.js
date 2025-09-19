// === SELECTORS ===
const billInput = document.getElementById("bill");
const tipButtons = document.querySelectorAll(".tip-btn");
const customTipInput = document.getElementById("customTip");
const peopleInput = document.getElementById("people");
const errorMessage = document.getElementById("people-error");

const tipAmountOutput = document.getElementById("tip-amount");
const totalAmountOutput = document.getElementById("total-amount");
const resetBtn = document.getElementById("resetBtn");

function calculateTip(bill, tipPercent, people) {
  const tipAmount = (bill * (tipPercent / 100)) / people;
  const total = bill / people + tipAmount;
  return { tipAmount, total };
}

function formatCurrency(value) {
  return `$${value.toFixed(2)}`;
}

function handleCalculation(tipPercent) {
  const bill = parseFloat(billInput.value.trim());
  const people = parseInt(peopleInput.value.trim(), 10);

  // Validation: bill must be > 0
  if (isNaN(bill) || bill <= 0) return;

  // Validation: people must be >= 1
  if (isNaN(people) || people <= 0) {
    errorMessage.style.display = "block";
    return;
  } else {
    errorMessage.style.display = "none";
  }

  const { tipAmount, total } = calculateTip(bill, tipPercent, people);

  tipAmountOutput.textContent = formatCurrency(tipAmount);
  totalAmountOutput.textContent = formatCurrency(total);

  // Enable reset button
  resetBtn.disabled = false;
}

// Tip buttons
tipButtons.forEach((button) => {
  button.addEventListener("click", () => {
    customTipInput.value = "";
    const tipPercent = parseFloat(button.dataset.tip);
    handleCalculation(tipPercent);

    tipButtons.forEach((btn) => btn.setAttribute("aria-pressed", "false"));
    button.setAttribute("aria-pressed", "true");
  });
});

// Custom tip input
customTipInput.addEventListener("input", () => {
  tipButtons.forEach((btn) => btn.setAttribute("aria-pressed", "false"));
  const tipPercent = parseFloat(customTipInput.value.trim());
  if (!isNaN(tipPercent) && tipPercent >= 0) {
    handleCalculation(tipPercent);
  }
});

// Bill and people inputs (recalculate when typing)
[billInput, peopleInput].forEach((input) => {
  input.addEventListener("input", () => {
    const activeBtn = [...tipButtons].find(
      (btn) => btn.getAttribute("aria-pressed") === "true"
    );
    if (activeBtn) {
      handleCalculation(parseFloat(activeBtn.dataset.tip));
    } else if (customTipInput.value) {
      handleCalculation(parseFloat(customTipInput.value));
    }
  });
});

// Reset button
resetBtn.addEventListener("click", () => {
  billInput.value = "";
  tipButtons.forEach((btn) => btn.setAttribute("aria-pressed", "false"));
  customTipInput.value = "";
  peopleInput.value = "";
  resetBtn.disabled = true;
  tipAmountOutput.textContent = "$0.00";
  totalAmountOutput.textContent = "$0.00";
  errorMessage.style.display = "none";
});

// Initial setup
resetBtn.disabled = true;

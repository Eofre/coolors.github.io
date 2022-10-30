"use strict";

const colors = document.querySelectorAll(".col");

document.addEventListener("keydown", (e) => {
  e.preventDefault();
  if (e.code.toLowerCase() === "space") {
    setRandomColors();
  }
});

document.addEventListener("click", (e) => {
  const type = e.target.dataset.type;

  if (type === "lock") {
    const node =
      e.target.tagName.toLowerCase() === "i" ? e.target : e.target.children[0];

    node.classList.toggle("fa-lock-open");
    node.classList.toggle("fa-lock");
  } else if (type === "copy") {
    copyToClickboard(e.target.textContent);
  }
});

function generateRandomColor() {
  const hexCodes = "0123456789ABCDEF";
  let color = "";
  for (let i = 0; i < 6; i++) {
    color += hexCodes[Math.floor(Math.random() * hexCodes.length)];
  }

  return "#" + color;
}

function copyToClickboard(text) {
  return navigator.clipboard.writeText(text);
}

function setRandomColors(isInitial) {
  const colorsHashArr = isInitial ? getColorsFromHash() : [];

  colors.forEach((color, index) => {
    const isLocked = color.querySelector("i").classList.contains("fa-lock");
    const text = color.querySelector("h2");

    if (isLocked) {
      colorsHashArr.push(text.textContent);
      return;
    }

    const randomColor = isInitial
      ? colorsHashArr[index]
        ? colorsHashArr[index]
        : generateRandomColor()
      : generateRandomColor();

    if (!isInitial) {
      colorsHashArr.push(randomColor);
    }

    text.textContent = randomColor;
    color.style.background = randomColor;

    setTextColor(text, randomColor);
  });

  updateColorsHash(colorsHashArr);
}

function setTextColor(text, color) {
  const luminance = chroma(color).luminance();
  text.style.color = luminance > 0.5 ? "black" : "white";
}

function updateColorsHash(colors = []) {
  document.location.hash = colors
    .map((col) => {
      return col.toString().substring(1);
    })
    .join("-");
}

function getColorsFromHash() {
  if (document.location.hash.length > 1) {
    return document.location.hash
      .substring(1)
      .split("-")
      .map((color) => "#" + color);
  }
  return [];
}

setRandomColors(true);

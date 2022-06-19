// CONSTANTES
const startX = 500;
const startY = 680;
const lineBaseLength = 1000;
let cloudEffect = false;
let stop = false;
let animate = true;
let iterationsAsk = 1;

// Canvas
let canvas = document.getElementById("myCanvas");
let ctx = canvas.getContext("2d");

// var grad = ctx.createRadialGradient(startX, startY, 50, 750, startY, 750);
// grad.addColorStop(0, 'rgb(200,230,255)');
// grad.addColorStop(1, 'rgb(0,80,255)');
ctx.strokeStyle = "#05FF05";
ctx.fillStyle = "#444444";
// ctx.fillRect(0, 0, 2000, 1500);

ctx.lineWidth = 3;

// Récupération des propriétés de la dragon curve
const getCurve = (iterations) => {
  const curve = [];

  for (let i = 1; i <= iterations; i++) {
    let size = curve.length;
    curve.push(1);
    for (let j = size - 1; j >= 0; j--) {
      curve.push(-curve[j]);
    }
  }
  return curve;
};

let startTime;
const draw = (iterations, isCircle) => {
  startTime = 0;
  stop = false;

  // Use the identity matrix while clearing the canvas
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.translate(startX, startY);
  ctx.rotate((-iterations * Math.PI) / 4);

  const curve = getCurve(iterations);
  let lineSize = lineBaseLength / Math.pow(2, iterations / 2);
  if (isCircle) lineSize /= 2;

  // first line
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(lineSize, 0);
  ctx.translate(lineSize, 0);
  ctx.stroke();

  if (isCircle) drawCurves(curve, lineSize, 0)();
  else drawLines(curve, lineSize, 0)();
};

const drawLines = (curve, lineSize, index) => (timestamp) => {
  if (!startTime) startTime = timestamp;
  if (index >= curve.length) {
    ctx.stroke();
    return;
  }
  if (animate) ctx.beginPath();

  const batchLength = Math.min(10_000, Math.ceil(curve.length / 60));
  const nextStep = Math.min(curve.length, index + batchLength);
  for (let i = index; i < nextStep; i++) {
    getColor(curve, i);
    ctx.moveTo(0, 0);
    if (curve[i] === 1) ctx.rotate(Math.PI / 2);
    else ctx.rotate(-Math.PI / 2);
    ctx.lineTo(lineSize, 0);
    ctx.translate(lineSize, 0);
  }

  if (animate) {
    ctx.stroke();
    console.log("total time since start : ", timestamp - startTime, "ms");
  }
  drawNext(animate, drawLines(curve, lineSize, nextStep));
};

const drawCurves = (curve, radius, index) => () => {
  if (index >= curve.length) {
    ctx.lineTo(radius, 0);
    ctx.stroke();
    return;
  }

  const batchLength = Math.ceil(curve.length / 60);
  const nextStep = Math.min(curve.length, index + batchLength);
  for (let i = index; i < nextStep; i++) {
    getColor(curve, i);
    ctx.moveTo(0, 0);
    if (curve[i] === 1) {
      ctx.arc(0, radius, radius, -Math.PI / 2, 0, false);
      ctx.translate(radius, radius);
      ctx.rotate(Math.PI / 2);
    } else {
      ctx.arc(0, -radius, radius, +Math.PI / 2, 0, true);
      ctx.translate(radius, -radius);
      ctx.rotate(-Math.PI / 2);
    }
  }
  drawNext(animate, drawCurves(curve, radius, nextStep));
};

const drawNext = (animate, drawFunction) => {
  if (stop) return;
  if (animate) {
    window.requestAnimationFrame(drawFunction);
  } else {
    drawFunction();
  }
};

const getColor = (curve, i) => {
  // -------------------- CLOUD EFFET
  if (cloudEffect) {
    // const red = 150 * (i / curve.length);
    // const green = 80 + (120 * i) / curve.length;
    // ctx.strokeStyle = `rgb(${red},${green},255)`;

    // TOP bleu clair violet clair
    const h = (Math.cos(-Math.PI / 2 + i / 20000) + 1) * 15 + 210;
    const l = (Math.sin(Math.PI / 2 + i / 20000) + 1) * 15 + 50;
    ctx.strokeStyle = `hsl(${h},100%,${l}%)`;
    ctx.stroke();
    ctx.beginPath();
  }
  // -------------------- CLOUD EFFET
};

const plusL = () => {
  draw(++iterationsAsk, false);
  updateLevel(iterationsAsk);
};
const moinsL = () => {
  draw(--iterationsAsk, false);
  updateLevel(iterationsAsk);
};
const plusC = () => {
  draw(++iterationsAsk, true);
  updateLevel(iterationsAsk);
};
const moinsC = () => {
  draw(--iterationsAsk, true);
  updateLevel(iterationsAsk);
};
const updateLevel = (newLevel) => {
  // Affichage du niveau
  const niveau = document.getElementById("niveau");
  niveau.innerText = `Niveau : ${newLevel} - nb segment : ${Math.pow(
    2,
    newLevel
  )}`;
};
const changeAnimate = (event) => {
  animate = event.target.checked;
};
const setStop = () => {
  stop = true;

  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
};

// Affichage de la courbe N18
cloudEffect = true;
iterationsAsk = 17;
plusC();

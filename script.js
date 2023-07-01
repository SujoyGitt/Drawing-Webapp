const canvas = document.querySelector("canvas");
const fillColor = document.querySelector("#fill");
let toolsBtn = document.querySelectorAll(".tool");
let sizeSlider = document.querySelector("#size-slider");
const transparentCheckBox = document.querySelector("#transparency");
const transparentSlider = document.querySelector("#transparent-slider");
let colorsBtn = document.querySelectorAll(".colors .option");
let colorPicker = document.querySelectorAll("#color-picker");
let ctx = canvas.getContext("2d");
let clearCanvas = document.querySelector(".clear-canvas");
let saveImg = document.querySelector(".save-img");
const colorPlate = document.querySelector(".colorPlate");
colorPlate.addEventListener("click", () => {
  document
    .querySelector(".tools-board")
    .classList.toggle("mobileViewtoolsBoard");
});
//global variabel variable bydefault value
let previewX, previewY, snapshot;
let selectedTools = "brush";
let isDrawing = false;
let brushWidth = 1;
let transparency = 0.5;
let selectedColor = "#fffff";
//set canvas background because when drawing save as img this background is transparent
const canvasBackground = () => {
  ctx.fillStyle = "#fcfcfc";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = selectedColor;
};
//brushsize
sizeSlider.addEventListener("change", () => (brushWidth = sizeSlider.value)); //passing slider value  as brush size
console.log(brushWidth);
console.log(transparency);
// transparency
transparentCheckBox.addEventListener("change", () => {
  if (!transparentCheckBox.checked) {
    transparentSlider.setAttribute("disabled", "true");
  } else {
    transparentSlider.removeAttribute("disabled");
  }
});
transparentSlider.addEventListener("change", () => {
  transparency = transparentSlider.value / 10;
});
//colors btn
colorsBtn.forEach((btn) => {
  btn.addEventListener("click", () => {
    document.querySelector(".colors .selected").classList.remove("selected");
    btn.classList.add("selected");
    //passing selected btn background color as selected color value
    selectedColor = window
      .getComputedStyle(btn)
      .getPropertyValue("background-color");
  });
});
//colors picker
colorPicker.forEach((color) => {
  color.addEventListener("change", () => {
    color.parentElement.style.background = color.value;
    color.parentElement.click();
  });
});
//setting canvas width/height.. offsetWidth/height viewble width height of an element because By default , the browser create width and height 300 or 150 px of canvas
window.addEventListener("load", () => {
  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;
  canvasBackground();
});
//adding click event to all tools option
toolsBtn.forEach((btn) => {
  btn.addEventListener("click", () => {
    document.querySelector(".options .active").classList.remove("active");
    btn.classList.add("active");
    selectedTools = btn.id;
  });
});
//start drawing
if (window.innerWidth < 992) {
  console.log("now you are small screen");
  //start drawing for mobile
  canvas.addEventListener("touchstart", (e) => {
    previewX = e.changedTouches[0].pageX; //passing current mousex  position as previeous mousex value
    previewY = e.changedTouches[0].pageY; //passing current mousey  position as previeous mousey value
    isDrawing = true;
    ctx.beginPath(); //create new path to the draw
    transparentCheckBox.checked
      ? (ctx.globalAlpha = transparency)
      : (ctx.globalAlpha = 1);
    ctx.lineWidth = brushWidth;
    ctx.strokeStyle = selectedColor;
    ctx.fillStyle = selectedColor;
    //coping canvas data & passing as snapshot value.. this avoids dragging the image
    snapshot = ctx.getImageData(0, 0, canvas.width, canvas.height);
  });
  //continue drawing
  canvas.addEventListener("touchmove", (e) => {
    if (!isDrawing) return; //if drawing is false return null form here
    ctx.putImageData(snapshot, 0, 0); //adding copied canvas on to this canvas
    if (selectedTools === "brush" || selectedTools === "eraser") {
      ctx.strokeStyle = selectedTools === "eraser" ? "#fcfcfc" : selectedColor;
      ctx.lineTo(e.changedTouches[0].pageX, e.changedTouches[0].pageY); //creating line according to the mouse pointer
      ctx.stroke(); //drawing filling line with color
    } else if (selectedTools === "rectangle") {
      //if fillcolor isn't checked draw a rect with border else draw rect with background
      if (!fillColor.checked) {
        //creating rectangle according to the mouse pointer
        return ctx.strokeRect(
          e.changedTouches[0].pageX,
          e.changedTouches[0].pageX,
          previewX - e.changedTouches[0].pageX,
          previewY - e.changedTouches[0].pageX
        );
      }
      ctx.fillRect(
        e.changedTouches[0].pageX,
        e.changedTouches[0].pageY,
        previewX - e.changedTouches[0].pageX,
        previewY - e.changedTouches[0].pageY
      );
    } else if (selectedTools === "circle") {
      ctx.beginPath(); //creating new path drawing circle

      //getting to radius according to the mouse pointer
      let radius = Math.sqrt(
        Math.pow(previewX - e.changedTouches[0].pageX, 2) +
          Math.pow(previewX - e.changedTouches[0].pageY, 2)
      );
      ctx.arc(previewX, previewY, radius, 0, 2 * Math.PI);
      !fillColor.checked ? ctx.stroke() : ctx.fill(); //if fillcolor is checked fill circle else draw border circle
    } else if (selectedTools === "triangle") {
      ctx.beginPath(); //creating new path drawing triangle

      ctx.moveTo(previewX, previewY); //moving triangle to the mouse pointer
      ctx.lineTo(e.changedTouches[0].pageX, e.changedTouches[0].pageY);
      ctx.lineTo(
        previewX * 2 - e.changedTouches[0].pageX,
        e.changedTouches[0].pageY
      );
      ctx.closePath();
      !fillColor.checked ? ctx.stroke() : ctx.fill();
    }
  });
  //end drawing
  canvas.addEventListener("touchend", () => (isDrawing = false));
}
//start drawing for big screen
else {
  canvas.addEventListener("mousedown", (e) => {
    previewX = e.offsetX; //passing current mousex  position as previeous mousex value
    previewY = e.offsetY; //passing current mousey  position as previeous mousey value
    isDrawing = true;
    ctx.beginPath(); //create new path to the draw
    transparentCheckBox.checked
      ? (ctx.globalAlpha = transparency)
      : (ctx.globalAlpha = 1);
    ctx.lineWidth = brushWidth;
    ctx.strokeStyle = selectedColor;
    ctx.fillStyle = selectedColor;
    //coping canvas data & passing as snapshot value.. this avoids dragging the image
    snapshot = ctx.getImageData(0, 0, canvas.width, canvas.height);
  });
  //continue drawing
  canvas.addEventListener("mousemove", (e) => {
    if (!isDrawing) return; //if drawing is false return null form here
    ctx.putImageData(snapshot, 0, 0); //adding copied canvas on to this canvas
    if (selectedTools === "brush" || selectedTools === "eraser") {
      ctx.strokeStyle = selectedTools === "eraser" ? "#fcfcfc" : selectedColor;
      ctx.lineTo(e.offsetX, e.offsetY); //creating line according to the mouse pointer
      ctx.stroke(); //drawing filling line with color
    } else if (selectedTools === "rectangle") {
      //if fillcolor isn't checked draw a rect with border else draw rect with background
      if (!fillColor.checked) {
        //creating rectangle according to the mouse pointer
        return ctx.strokeRect(
          e.offsetX,
          e.offsetY,
          previewX - e.offsetX,
          previewY - e.offsetY
        );
      }
      ctx.fillRect(
        e.offsetX,
        e.offsetY,
        previewX - e.offsetX,
        previewY - e.offsetY
      );
    } else if (selectedTools === "circle") {
      ctx.beginPath(); //creating new path drawing circle
      //getting to radius according to the mouse pointer
      let radius = Math.sqrt(
        Math.pow(previewX - e.offsetX, 2) + Math.pow(previewX - e.offsetX, 2)
      );
      ctx.arc(previewX, previewY, radius, 0, 2 * Math.PI);
      !fillColor.checked ? ctx.stroke() : ctx.fill(); //if fillcolor is checked fill circle else draw border circle
    } else if (selectedTools === "triangle") {
      ctx.beginPath(); //creating new path drawing triangle
      ctx.moveTo(previewX, previewY); //moving triangle to the mouse pointer
      ctx.lineTo(e.offsetX, e.offsetY);
      ctx.lineTo(previewX * 2 - e.offsetX, e.offsetY);
      ctx.closePath();
      !fillColor.checked ? ctx.stroke() : ctx.fill();
    }
  });
  //end drawing
  canvas.addEventListener("mouseup", () => (isDrawing = false));
}

//clear canvas
clearCanvas.addEventListener("click", () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  canvasBackground();
});

saveImg.addEventListener("click", () => {
  const link = document.createElement("a");
  link.download = `${Date.now()}.jpg`;
  link.href = canvas.toDataURL();
  link.click();
});

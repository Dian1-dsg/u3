let img1, img2, img3, img4;
let lastClickMillis = 0;
let colorFactor = 255;
let textAlpha = 255;  
let delayBeforeFade = 2000; 

// 时钟相关变量
let secondAngle = 0;
let minuteAngle = 0;
let hourAngle = 0;

// 文本绘制相关变量
let textObjects = []; 

var x = 0;
var y = 0;
var font = 'Georgia';
var letters = 'Click Roast duck, 点击烤鸭，Click Roast duck.';
var fontSizeMin = 3;
var angleDistortion = 0.0;
var counter = 0;

function preload() {
  img1 = loadImage('asset/roast duck.png');  
  img2 = loadImage('asset/shelf.png');      
  img3 = loadImage('asset/Fire1.png');
  img4 = loadImage('asset/wood.png');
}

function setup() {
  createCanvas(displayWidth, displayHeight);
  imageMode(CORNER);  

  
  [img3, img4, img1, img2].forEach(img => {
    img.loadPixels();
    for (let i = 0; i < img.pixels.length; i += 4) {
      if (img.pixels[i] > 240 && img.pixels[i + 1] > 240 && img.pixels[i + 2] > 240) {
        img.pixels[i + 3] = 0;
      }
    }
    img.updatePixels();
  });

  background(255);
  cursor(CROSS);

  x = mouseX;
  y = mouseY;

  textFont(font);
  textAlign(LEFT);
}

function draw() {
  background(255);


  image(img2, -150, -80, 1200, 800);

  
  let elapsed = millis() - lastClickMillis;
  if (elapsed > delayBeforeFade) {
    colorFactor = min(colorFactor + 0.1, 255);
  }

  tint(colorFactor, colorFactor, 0);
  image(img1, 53, 80, 700, 450);
  noTint();

  image(img3, 300, 200, 300, 200);
  image(img4, 300, 200, 300, 200);


  drawStaticClock();


  for (let i = textObjects.length - 1; i >= 0; i--) {
    let txt = textObjects[i];

    if (millis() - txt.createTime > 2000) {
      txt.alpha -= 1;  
      txt.alpha = constrain(txt.alpha, 0, 255);  
    }

   
    if (txt.alpha <= 0) {
      textObjects.splice(i, 1);
      continue;
    }

    push();
    translate(txt.x, txt.y);
    rotate(txt.angle);
    fill(0, 0, 0, txt.alpha);
    text(txt.letter, 0, 0);
    pop();
  }


  if (mouseIsPressed && mouseButton == LEFT) {
    let d = dist(x, y, mouseX, mouseY);
    textSize(constrain(fontSizeMin + d / 2, 3, 100));

    let newLetter = letters.charAt(counter);
    let stepSize = textWidth(newLetter);

    if (d > stepSize) {
      let angle = atan2(mouseY - y, mouseX - x);

      textObjects.push({
        x: x,
        y: y,
        angle: angle + random(angleDistortion),
        letter: newLetter,
        alpha: 255,  
        createTime: millis()  
      });

      counter++;
      if (counter >= letters.length) counter = 0;

      x = x + cos(angle) * stepSize;
      y = y + sin(angle) * stepSize;
    }
  }
}


function drawStaticClock() {
  let currentTime = millis() / 1000;  // 每秒刷新一次

  secondAngle = map(currentTime % 60, 0, 60, 0, 360);
  drawHand(secondAngle, 120, color(255, 0, 0), 4);  // 秒针

  minuteAngle = map(currentTime / 60 % 60, 0, 60, 0, 360);
  drawHand(minuteAngle, 100, color(0, 0, 255), 6);  // 分针

  hourAngle = map((currentTime / 3600) % 12, 0, 12, 0, 360);
  drawHand(hourAngle, 70, color(0, 0, 0), 8);  // 时针
}


function drawHand(angle, length, c, weight) {
  push();
  translate(width / 2, height / 2);
  rotate(angle);
  stroke(c);
  strokeWeight(weight);
  line(0, 0, 0, -length);
  pop();
}


function mousePressed() {
  colorFactor = constrain(colorFactor - 20, 0, 255);
  lastClickMillis = millis();
}


function keyReleased() {
  if (key == 's' || key == 'S') saveCanvas('screenshot', 'png');
  if (keyCode == DELETE || keyCode == BACKSPACE) background(255);
}

function keyPressed() {
  if (keyCode == UP_ARROW) angleDistortion += 0.1;
  if (keyCode == DOWN_ARROW) angleDistortion -= 0.1;
}




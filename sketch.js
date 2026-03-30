let points = [];
let numPoints = 10; // 增加到 10 個點
let trackWidth = 50;
let gameState = "START"; // START, PLAYING, GAMEOVER, WIN
let obstacles = []; // 儲存干擾物
let numPoints = 5; // 指定使用 5 個點
let trackWidth;
let gameState = "START"; // 狀態：START, PLAYING, GAMEOVER, WIN

function setup() {
  createCanvas(400, 400);
  createCanvas(windowWidth, windowHeight);
  generateTrack();
  generateObstacles();
  resetGame();
}

function draw() {
  background(220);
  background(20);
  
  // 繪製與移動干擾物
  drawObstacles();

  // 繪製軌道外框（判定區域）
  drawTrack();

  if (gameState === "START") {
    displayOverlay("移動至起點（綠色區域）開始遊戲", color(255));
    checkStart();
    drawTrack();
    displayMessage("點擊起點 (綠圓) 開始遊戲", color(255));
    drawMarkers();
    if (mouseIsPressed && dist(mouseX, mouseY, points[0].x, points[0].y) < 20) {
      gameState = "PLAYING";
    }
  } else if (gameState === "PLAYING") {
    drawTrack();
    drawMarkers();
    checkCollision();
    checkWin();
    drawPlayer();
    
    // 檢查是否到達終點
    if (dist(mouseX, mouseY, points[numPoints - 1].x, points[numPoints - 1].y) < 20) {
      gameState = "WIN";
    }
  } else if (gameState === "GAMEOVER") {
    displayOverlay("碰到牆壁了！點擊畫面重試", color(255, 50, 50));
    displayMessage("觸電了！點擊畫面重來", color(255, 50, 50));
  } else if (gameState === "WIN") {
    displayOverlay("恭喜通關！點擊畫面重新開始", color(50, 255, 50));
    displayMessage("恭喜通關！點擊畫面重來", color(50, 255, 50));
  }

  // 標示起點與終點
  drawMarkers();
}

function generateObstacles() {
  obstacles = [];
  for (let i = 0; i < 8; i++) {
    obstacles.push({
      x: random(width),
      y: random(height),
      vx: random(-2, 2),
      vy: random(-2, 2),
      size: random(20, 60)
    });
  }
}

function drawObstacles() {
  fill(255, 50, 50, 80); // 半透明紅色
  noStroke();
  for (let obs of obstacles) {
    // 移動邏輯
    obs.x += obs.vx;
    obs.y += obs.vy;

    // 邊界反彈
    if (obs.x < 0 || obs.x > width) obs.vx *= -1;
    if (obs.y < 0 || obs.y > height) obs.vy *= -1;

    // 繪製干擾圓形
    ellipse(obs.x, obs.y, obs.size);
    
    // 裝飾性的頂點 (增加視覺干擾)
    push();
    stroke(255, 50, 50, 150);
    line(obs.x - obs.size, obs.y, obs.x + obs.size, obs.y);
    pop();
  }
}

function generateTrack() {
function resetGame() {
  points = [];
  let margin = width * 0.1;
  let availableWidth = width - margin * 2;
  let step = availableWidth / (numPoints - 1);

  // 軌道大小不固定：隨機產生軌道寬度
  trackWidth = random(40, 80);
  
  // 產生 5 個點，分佈在畫面中
  for (let i = 0; i < numPoints; i++) {
    // 增加起伏範圍：從 0.2~0.8 擴大到 0.1~0.9
    let x = margin + i * step;
    let y = random(height * 0.1, height * 0.9);
    let x = map(i, 0, numPoints - 1, 100, width - 100);
    let y = random(height * 0.2, height * 0.8);
    points.push(createVector(x, y));
  }
  gameState = "START";
}

function drawTrack() {
  noFill();
  // 繪製外層軌道（牆壁效果）
  stroke(60);
  strokeWeight(trackWidth);
  strokeJoin(ROUND);
  strokeCap(ROUND);
  
  // 繪製灰色大軌道
  stroke(60);
  strokeWeight(trackWidth);
  beginShape();
  for (let p of points) {
    vertex(p.x, p.y);
    vertex(p.x, p.y); // 使用 vertex 指令
  }
  endShape();

  // 繪製中心導線
  stroke(0, 200, 255, 150);
  stroke(150, 150, 255, 100);
  strokeWeight(2);
  beginShape();
  for (let p of points) {
    vertex(p.x, p.y);
  }
  endShape();
}

function drawMarkers() {
  noStroke();
  fill(0, 255, 0, 150); // 起點綠色
  circle(points[0].x, points[0].y, trackWidth * 0.8);
  fill(255, 200, 0, 150); // 終點金色
  circle(points[points.length - 1].x, points[points.length - 1].y, trackWidth * 0.8);
  fill(0, 255, 100); // 起點
  ellipse(points[0].x, points[0].y, 30);
  fill(255, 50, 50); // 終點
  ellipse(points[numPoints - 1].x, points[numPoints - 1].y, 30);
}

function drawPlayer() {
  fill(255, 255, 0);
  noStroke();
  circle(mouseX, mouseY, 15);
}

function checkStart() {
  if (dist(mouseX, mouseY, points[0].x, points[0].y) < trackWidth / 2) {
    gameState = "PLAYING";
  }
}

function checkCollision() {
  let onTrack = false;
  // 檢查滑鼠是否在任何一段頂點連成的線段範圍內
  // 檢查滑鼠是否在任何一段線段的範圍內
  for (let i = 0; i < points.length - 1; i++) {
    let d = distToSegment(mouseX, mouseY, points[i], points[i+1]);
    let d = distToSegment(mouseX, mouseY, points[i], points[i + 1]);
    if (d < trackWidth / 2) {
      onTrack = true;
      break;
    }
  }

  // 檢查是否碰到紅色的干擾物
  for (let obs of obstacles) {
    if (dist(mouseX, mouseY, obs.x, obs.y) < obs.size / 2 + 7) {
      onTrack = false;
      break;
    }
  }

  if (!onTrack) {
    gameState = "GAMEOVER";
  }
  if (!onTrack) gameState = "GAMEOVER";
}

function checkWin() {
  if (dist(mouseX, mouseY, points[points.length - 1].x, points[points.length - 1].y) < 15) {
    gameState = "WIN";
  }
// 計算點到線段距離的輔助函式
function distToSegment(px, py, v, w) {
  let l2 = dist(v.x, v.y, w.x, w.y) ** 2;
  if (l2 == 0) return dist(px, py, v.x, v.y);
  let t = ((px - v.x) * (w.x - v.x) + (py - v.y) * (w.y - v.y)) / l2;
  t = Math.max(0, Math.min(1, t));
  return dist(px, py, v.x + t * (w.x - v.x), v.y + t * (w.y - v.y));
}

function mousePressed() {
  if (gameState === "GAMEOVER" || gameState === "WIN") {
    generateTrack();
    generateObstacles();
    gameState = "START";
  }
}

function displayOverlay(msg, col) {
function displayMessage(txt, col) {
  fill(col);
  textAlign(CENTER, CENTER);
  textSize(24);
  fill(col);
  text(msg, width / 2, height - 50);
  text(txt, width / 2, height - 50);
}

// 數學輔助：計算點到線段的距離
function distToSegment(px, py, v, w) {
  let l2 = distSq(v.x, v.y, w.x, w.y);
  if (l2 == 0) return dist(px, py, v.x, v.y);
  let t = ((px - v.x) * (w.x - v.x) + (py - v.y) * (w.y - v.y)) / l2;
  t = max(0, min(1, t));
  return dist(px, py, v.x + t * (w.x - v.x), v.y + t * (w.y - v.y));
function mousePressed() {
  if (gameState === "GAMEOVER" || gameState === "WIN") resetGame();
}

function distSq(x1, y1, x2, y2) {
  return pow(x1 - x2, 2) + pow(y1 - y2, 2);
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  resetGame();
}

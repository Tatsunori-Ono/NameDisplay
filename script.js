var circles = [];
var mic;
var spectrum;

function setup() {
  createCanvas(windowWidth, windowHeight);
  background(230);
  mic = new p5.AudioIn();
  mic.start();
  fft = new p5.FFT(0.8, 32);
  noStroke();
}

function mouseClicked() {
  userStartAudio();
}

function draw() {
  spectrum = fft.analyze();
  var rectWidth = width / spectrum.length;
  fill(0, 200, 255);
  // 配列の長さだけ処理する
  for (var s = 0; s < spectrum.length; s++) {
    // 四角形の縦幅
    var rectHeight = spectrum[s] * 1.5;
    // 四角形を描く
    rect(s * rectWidth, height, rectWidth - 2, -rectHeight);
  }

  // 文字の色
  fill(255);
  // フォント
  textFont('Chewy');
  strokeWeight(10);
  // 文字の位置
  textAlign(CENTER, CENTER);
  var volume = mic.getLevel();
  var volsize = volume * 200;
  // 文字のサイズ
  textSize(100 + volsize);
  // 文字を表示する
  text('Tatsunori', width/4 * 2, height/4 * 1.25);
  // 文字のサイズ
  textSize(75 + volsize);
  // 文字を表示する
  text('Media Art', width / 4 * 2, height / 4 * 2.25);

  textFont('geo');
  // テキストの色
  fill(255);
  // テキストのサイズ
  textSize(75);
  // テキストの位置
  textAlign(CENTER, CENTER);
  // テキストを表示
  text(hour() + ':' + minute() + ':' + second(), width / 2, height * 0.9);

  // マウスをクリックしている間、
  if (mouseIsPressed) {
    // circles配列に追加(マウスの座標)
    circles.push(new Circle(mouseX, mouseY));

    // circleが100を超えたら、先頭のcircleを一つ消す
    if (circles.length > 100) {
      circles.splice(01, 1);
    }
  }

  // 配列の数だけ処理する
  for (var i = 0; i < circles.length; i++) {
    // 移動する
    circles[i].move();
    // 表示する
    circles[i].draw();

    // 自分以外の Circle を参照
    for (var j = 0; j < circles.length; j++) {
      // （1）円の座標
      var position1 = circles[i].position;
      // （2）円の座標
      var position2 = circles[j].position;

      // （1）円と（2）円の距離を計算する
      var distance = dist(position1.x, position1.y,
        position2.x, position2.y);

      // 円の距離が50以下のとき
      if (distance < 50) {
        // 線の色
        stroke(255, 0, 0);
        // 線を描く
        line(position1.x, position1.y, position2.x, position2.y);
      }
    }
  }
}

// 円を発射するクラス
class Circle {
  // 初期化
  constructor(x, y) {
    // 座標（マウスの位置）
    this.position = createVector(x, y);
    // 動き
    this.velocity = p5.Vector.random2D();
    // 大きさ
    var volume = mic.getLevel();
    var volsize = volume * 100;
    this.size = 3 + volsize;
  }

  move() {
    // 座標に動きを加える
    this.position.add(this.velocity);
  }

  draw() {
    fill(255, 0, 0);
    strokeWeight(5);
    rect(this.position.x, this.position.y, this.size);
  }
}
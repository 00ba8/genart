
function addGrain(s, a) {
  var stren = round(s);
  var alph = a || false;
  loadPixels();
  var dens = pixelDensity();
  var count = 4 * (width * dens) * (height * dens);
  for (let i = 0; i < count; i += 4) {
    pixels[i] = pixels[i] + random(-stren, stren);
    pixels[i+1] = pixels[i+1] + random(-stren, stren);
    pixels[i+2] = pixels[i+2] + random(-stren, stren);
    if (alph) {
        pixels[i+3] = pixels[i+3] + random(-stren, stren);
    }
  }
  updatePixels();
}

function dstrt() {
  let x1 = random(width);
  let y1 = random(height);
  let x2 = round(x1 + random(-10, 10));
  let y2 = round(y1 + random(-10, 10));
  set(x2, y2, get(x1, y1, 30, 30));
  updatePixels();
}

var cs = 1800;
var s = 5;

function setup() {
  pixelDensity(1);
  var fxrand = sfc32(...hashes);
  var seed = 987654321*fxrand();
  //console.log(seed);
  
  randomSeed(seed);
  noiseSeed(seed);

  console.log('ff');
  
  canvas = createCanvas(cs, cs);
  canvas.parent('flscr');
  
  background(250, 240, 202);

  noLoop();
  noStroke();
}

function draw() {
  
  for (let x=s; x<cs-s+1; x+=2) {
    for (let y=s; y<cs-s+1; y+=2) {
      var n = int(noise(x/200,y/200) * 250);
      //var n = int(noise(y/200) * 250);
      //console.log(n);
      if (n < 130) {
        //fill(255,255,255);
        //circle(x,y,2);
        fill(10, 70, 120+n);
        circle(x,y,2);
      }

      if (n > 100 && n % 15 == 0) {
        fill(n/2,n/2,n/2,100);
        circle(x,y,2);
      }
    }
  }

  console.log(fxhash);
}

function saveImage() {
  buff = createGraphics(s, s);
  buff.copy(canvas, 0,0,s,s,0,0,s,s);
  buff.save(fxhash + '.png');
}

function keyReleased() {
  if (key == 's') {
    saveImage();
  }
}
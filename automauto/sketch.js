// features
function randVal(min, max) { return fxrand() * (max - min) + min; }
function randElem(a) { return a[parseInt(randVal(0, a.length))]; }
var useDynamicRules = randElem([true, false, false]);
var maxRuleChanges = useDynamicRules == true ? parseInt(randVal(0,5)) : 0;
var dynamicRules = [];
for (let i=0;i<3; i++) {
  dynamicRules.push(parseInt(randVal(0,256)));
}
var filterRules = [0, 2, 4, 6, 8, 10, 12, 14, 16, 20,
               24, 32, 34, 36, 38, 40, 42, 44, 46, 48,
               52, 56, 64, 66, 72, 74, 76,
               80, 84, 88, 96, 98, 100, 104, 106, 108,
               112, 116, 120, 128, 130, 132, 136, 138,
               140, 142, 144, 148, 152, 160, 162, 164,
               166, 168, 170, 172, 174, 176, 180, 184,
               192, 194, 196, 200, 202, 204, 208, 212,
               216, 224, 226, 228, 232, 234, 236, 240,
               244, 248]
var initRules = [parseInt(randVal(0,256)), parseInt(randVal(0,256)), parseInt  (randVal(0,256))];
while(true) { // check so that initial rules are not only composed of rules in the filter list
  if (filterRules.includes(initRules[0]) && filterRules.includes(initRules[1]) && filterRules.includes(initRules[2])) {
    initRules = [parseInt(randVal(0,256)), parseInt(randVal(0,256)), parseInt  (randVal(0,256))];
  } else {
    break;
  }
}
var features = {
  'cellCount': randElem([50, 100, 200, 400]),
  //"cellCount": randElem([50]),
  'shape': randElem(['square', 'circle', 'mix', 'symbol']),
  //'shape': randElem(['circle']),
  'startRow': randElem(['rng', 'rare', 'single', 'center']),
  'align': randElem(['vertical', 'horizontal']),
  //'align': randElem(['horizontal']),
  'rules': initRules,
  'useDynamicRules': useDynamicRules,
  //'maxRuleChanges': maxRuleChanges,
  'dynamicRules': useDynamicRules == true ? dynamicRules : [],
  'colors': randElem(['rgb','ryg','pyb','byg','obg','rgb','rgb'])
}





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

function bgGradient() {
  let w = width;
  let h = height;
  push();
  let gradient = drawingContext.createLinearGradient(w/2-w/3, h/2-h/3, w/2+w/3, h/2+h/3);
  gradient.addColorStop(0, color(random(255),random(255),random(255), 169));
  gradient.addColorStop(1, color(random(255),random(255),random(255), 169));
  drawingContext.fillStyle = gradient;
  rect(0,0,w,h);
  pop();
}

function dstrt() {
  let x1 = random(width);
  let y1 = random(height);
  let x2 = round(x1 + random(-10, 10));
  let y2 = round(y1 + random(-10, 10));
  set(x2, y2, get(x1, y1, 30, 30));
  updatePixels();
}

function getRule(dcml) { // input decimal
  var s = (dcml >>> 0).toString(2).split(''); // convert to binary and split to str array
  //var numberArray = stringArray.map(Number);
  //console.log(s);
  //console.log(s.length);
  //console.log(s.map(Number));
  if (8 - s.length > 0) { 
    return (Array(8 - s.length).fill(0)).concat(s.map(Number)); // fill rem padding (8 for 256 max) with and concat with srt array converted to int array
  } else {
    return (s.map(Number));
  }
}

function setCell(r, ps) { // ps - array of previous states, e.g. [1,0,1]
  //console.log('setCell ps:', ps);
  var i = parseInt(ps.join(''), 2); // array to str to use as rule index, max val 7 == 1,1,1 -> to int
  //var ind = 0;
  //console.log('setCell ind:', i);
  switch(i) {
    case 7: return r[0]; break;
    case 6: return r[1]; break;
    case 5: return r[2]; break;
    case 4: return r[3]; break;
    case 3: return r[4]; break;
    case 2: return r[5]; break;
    case 1: return r[6]; break;
    case 0: return r[7]; break;
    default: console.log('ERROR: setCell unhandled case.'); return r[0];
  }
  //return r[i];
}

function genGrid(fr, rule, dr) { // input initial states array [1,1,0,1,...,1], len is cc
  var dynRule = [];
  var ruleChangeRow = -1;
  if (dr != -1) {
    dynRule = getRule(dr);
    ruleChangeRow = int(random(10,ccv-10));
  }
  var result = [fr];
  var row = fr;
  for (let r=1; r<ccv; r++) { // each row, first (0) row is inp
    var nextRow = [];
    if (ruleChangeRow != -1 && r > ruleChangeRow) { // update the rule if conditions are met
      //console.log('here');
      rule = dynRule;
    }
    for (let i=0; i<cc; i++) { // each cell
      var c1 = 0; // states
      var c2 = 0;
      var c3 = 0;
      if (i == 0) { // handle first elem
        c1 = 0;
        c2 = row[i];
        c3 = row[i+1];
      } else if (i == cc - 1) { // handle last elem
        c1 = row[i-1];
        c2 = row[i];
        c3 = 0;
      } else {  // handle all other elems
        c1 = row[i-1];
        c2 = row[i];
        c3 = row[i+1];
      }
      //console.log('genGrid:', [c1,c2,c3]);
      nextRow.push(setCell(rule, [c1,c2,c3]));
    }
    //console.log('p row:', row);
    //console.log('n row:', nextRow);
    row = nextRow;
    result.push(row);
  }
  return result;
}

function setInp(cc, sr) { // take cell count, generate first row with random cells
  var inp = [];
  if (sr == 'rng') {
    for (let i=0; i<cc; i++) {
      inp.push(int(random(0,2)));
    }
  } else if (sr == 'rare') {
    for (let i=0; i<cc; i++) {
      random(0,10) > 8 ? inp.push(1) : inp.push(0);
    }
  } else if (sr == 'single') {
    for (let i=0; i<cc; i++) { inp.push(0); }
    inp[int(random(10,inp.length-10))] = 1;
  } else { // center
    for (let i=0; i<cc; i++) { inp.push(0); }
    inp[int(inp.length/2)] = 1;
  }
  return inp;
}

var ca = features.align; // canvas alignment
var cw = 2000; // canvas w, for default horizontal alignment
var ch = 3000; // canvas h
if (ca == 'horizontal') {
  cw = 3000;
  ch = 2000;
}
var cc = features.cellCount; // cell count horizontal, row
var cellShape = features.shape; // shape
var sr = features.startRow; // start row composition of enabled cells
var cs = cw / cc; // cell size
var ccv = ch / cs; // cell count vertical, column
var ruleSet = features.rules; // rules
var useDynRules = features.useDynamicRules; // true, false
//var maxRuleChanges = features.maxRuleChanges; // if use dyn rules true, max rule changes on generation
var dynRules = features.dynamicRules; // if use dynamic rules, get rules otherwise []
var colorSet = features.colors; // colors set ['rgb','ryg','pyb','byg','obg']

window.$fxhashFeatures = {
  "Alignment": features.align,
  "Cell count": features.cellCount,
  "Shapes": features.shape,
  "Start row composition": features.startRow,
  "Rules": features.rules.join(', '),
  "Dynamic rules enabled": features.useDynamicRules,
  "Dynamic rules": features.dynamicRules.join(', '),
  "Color set": features.colors
}

console.log(window.$fxhashFeatures);

function setup() {
  //pixelDensity(1);
  var fxrand = sfc32(...hashes);
  var seed = 987654321*fxrand();
  //console.log(seed);
  console.log(features);
  console.log(cellShape);
  
  randomSeed(seed);
  noiseSeed(seed);
  
  ca == 'horizontal' ? canvas = createCanvas(cw + 508, ch + 480) : canvas = createCanvas(cw + 480, ch + 508); // add borders to fit ~a4
  canvas.parent('flscr');

  ellipseMode(CORNER);
  textAlign(CENTER,BOTTOM);
  textStyle(BOLD);
  if (cc == 400) {
    textSize(19);
  } else {
    cc == 50 ? textSize(69) : textSize(27);
  }
  blendMode(MULTIPLY);

  background(255);
  //bgGradient();
  
  noLoop();
}

function draw() {
  var colors = [color(255, 20, 20, 125), color(20, 255, 20, 125), color(20, 20, 255, 125)]; // default colorSet rgb ['rgb','ryg','pyb','byg','obg']
  switch(colorSet) {
    case 'ryg': colors = [color(255, 89, 94, 145), color(255, 202, 58, 145), color(138, 201, 38, 145)]; break;
    case 'pyb': colors = [color(254, 33, 139, 145), color(254, 215, 0, 145), color(33, 176, 254, 145)]; break;
    case 'byg': colors = [color(91, 192, 235, 145), color(253, 231, 76, 145), color(155, 197, 61, 145)]; break;
    case 'obg': colors = [color(244, 96, 54, 145), color(46, 41, 78, 145), color(27, 153, 139, 145)]; break;
    default: colors = [color(255, 20, 20, 145), color(20, 255, 20, 145), color(20, 20, 255, 145)]; // rgb
  }
  var dRule1 = ruleSet[0];
  var dRule2 = ruleSet[1];
  var dRule3 = ruleSet[2];
  console.log('decimal rules:', dRule1, dRule2, dRule3);
  var rule1 = getRule(dRule1);
  var rule2 = getRule(dRule2);
  var rule3 = getRule(dRule3);
  console.log('rules:', rule1, rule2, rule3);
  var fr1 = setInp(cc, sr);
  var fr2 = setInp(cc, sr);
  var fr3 = setInp(cc, sr);
  //console.log('fr:', fr);
  //var fr1 = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
  //var fr2 = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
  //var fr3 = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
  /*var fr1 = Array(cc).fill(0);
  var fr2 = Array(cc).fill(0);
  var fr3 = Array(cc).fill(0);
  fr1[cc/2] = 1;
  fr2[cc/2] = 1;
  fr3[cc/2] = 1;
  console.log(fr1);*/
  if (useDynRules == true) {
    var grid1 = genGrid(fr1, rule1, dynRules[0]);
    var grid2 = genGrid(fr2, rule2, dynRules[1]);
    var grid3 = genGrid(fr3, rule3, dynRules[1]);
  } else {
    var grid1 = genGrid(fr1, rule1, -1);
    var grid2 = genGrid(fr2, rule2, -1);
    var grid3 = genGrid(fr3, rule3, -1);
  }
  //console.log('grid:', grid);
  let x = 0;
  let y = 0;
  ca == 'horizontal' ? translate(254, 240) : translate(240, 254);
  for (let i=0; i<ccv; i++) {
    x = 0; // x goes back to beggining of the row, distance of cs
    y = i * cs; // y moves to next column, distance of cs
    for (let j=0; j<cc; j++) {
      x = j * cs;
      //console.log('x:', x);
      push();
      //translate(x,y);
      
      var ns = int(noise(j / 200, i / 200) * 210);

      // black noise
      if (ns > 150) {
        //console.log(ns);
        noStroke();
        fill(0, 0, 0, 53);
        cellShape == 'circle' ? circle(x,y,cs) : square(x,y,cs);
      }
      
      //var n = 20;
      if (cellShape == 'circle') {
        stroke(1);
        fill(255, 255, 255, 150);
        circle(x,y,cs);
        /*if (cc == 50 && ns > 100) {
          //console.log('here');
          stroke(3);
          random([1,2]) == 1 ? square(x+cs/4,y+cs/4,cs/2) : fill(0,0,0,200), square(x+cs/2.5,y+cs/2.5,cs/4);
        }*/
      }
      noStroke();
      let newSize = ns > 120 ? cs - 2 : cs + 2;
      if (grid1[i][j] == 1) {
        fill(colors[0]);
        //circle(x,y,newSize);
        switch(cellShape) {
          case "circle": circle(x,y,newSize); break;
          case "square": square(x,y,newSize); break;
          case "mix":
            let sch = random([1,2,3]);
            if (sch == 1) { circle(x,y,newSize) }
            if (sch == 2) { square(x,y,newSize) }
            if (sch == 3) { text('x',x,y) }
            break;
          default: text('x',x,y); break;
        }
        //continue;
      }
      if (grid2[i][j] == 1) {
        fill(colors[1]);
        //circle(x,y,newSize);
        switch(cellShape) {
          case "circle": circle(x,y,newSize); break;
          case "square": square(x,y,newSize); break;
          case "mix":
            let sch = random([1,2,3]);
            if (sch == 1) { circle(x,y,newSize) }
            if (sch == 2) { square(x,y,newSize) }
            if (sch == 3) { text('o',x,y) }
            break;
          default: text('o',x,y); break;
        }
        //continue;
      }
      if (grid3[i][j] == 1) {
        fill(colors[2]);
        //circle(x,y,newSize);
        switch(cellShape) {
          case "circle": circle(x,y,newSize); break;
          case "square": square(x,y,newSize); break;
          case "mix":
            let sch = random([1,2,3]);
            if (sch == 1) { circle(x,y,newSize) }
            if (sch == 2) { square(x,y,newSize) }
            if (sch == 3) { text('+',x,y) }
            break;
          default: text('+',x,y); break;
        }
        //continue;
      }
      /*else {
        fill(255,255,255,100);
        //stroke(1);
        circle(x,y,cs);
      }*/
      
      // white noise
      /*if (ns < 70) {
        fill(255, 255, 255, 50);
        square(x,y,cs);
      }*/
      
      pop();
    }
  }

  addGrain(29,15);
  console.log(fxhash);
  fxpreview();
}

function saveImage() {
  //buff = createGraphics(s, s);
  //buff.copy(canvas, 0,0,s,s,0,0,s,s);
  save(canvas, 'automatic_' + fxhash + '.png');
}

function keyReleased() {
  if (key == 's') {
    saveImage();
  }
}
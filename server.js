
const Neuron = require('./Neuron');
const Layer = require('./Layer');
const Network = require('./Network');
const fs = require('fs');
const PNG = require('pngjs').PNG;

var catBw = fs.readFileSync('cat_bw.png');
var cat = fs.readFileSync('cat.png');

//Load sample images
var catBwPng = PNG.sync.read(catBw);
var catPng = PNG.sync.read(cat);
//---

let trainigSet = [];
for(let y=1; y<catBwPng.height-1; y++){
  for(let x=1; x<catBwPng.width-1; x++){
    let pixelValues = [];
    for(let i=-1;i<2;i++){
      for(let j=-1;j<2;j++){
        var idx = (catBwPng.width * (y+i) + (x+j)) << 2;
        pixelValues.push(
          catBwPng.data[idx]/255, //Red
          catBwPng.data[idx+1]/255, //Green
          catBwPng.data[idx+2]/255 //Blue
        )
      }
    }
    var idx = (catBwPng.width * (y) + (x)) << 2;
    trainigSet.push({
      input: pixelValues,
      output: [catPng.data[idx]/255, catPng.data[idx+1]/255, catPng.data[idx+2]/255]
    })
  }
}

console.log("Training set length:", trainigSet.length);

//CREATE NEW NETWORK
let input = new Layer(27);
let hidden = new Layer(32);
let output = new Layer(3);
input.project(hidden);
hidden.project(output);

let perceptron = new Network({
  input: input,
  hidden: [hidden],
  output: output
});
//---

//Tain network
let iters = 100;
let training = perceptron.train(trainigSet, {
  rate: [0.6],
  iterations: iters,
  error: 0.01,
  every: {
    iterations: 1,
    run(data){
      let estimatedMillis = data.millis*((iters/data.iteration)-1);
      let seconds = Math.round(estimatedMillis/1000);
      let minutes = Math.round(seconds/60);
      let hours = Math.round(minutes/60);
      seconds = seconds % 60;
      minutes = minutes % 60;
      console.log("i:"+data.iteration, "e:"+data.error, "r:"+data.rate, 'remaining:'+hours+'h '+minutes+'m '+seconds+'s', 'elapsed:'+data.millis);
      if(data.iteration%5 === 0) imageP();
    }
  }
})
console.log(training);
//---

function imageP(){
  var toProcess = fs.readFileSync('cat_bw.png');
  var toProcessPng = PNG.sync.read(toProcess);

  console.log("processing image");
  for(let y=1; y<toProcessPng.height-1; y++){
    for(let x=1; x<toProcessPng.width-1; x++){
      let pixelValues = [];
      for(let i=-1;i<2;i++){
        for(let j=-1;j<2;j++){
          var idx = (toProcessPng.width * (y+i) + (x+j)) << 2;
          pixelValues.push(
            toProcessPng.data[idx]/255, //Red
            toProcessPng.data[idx+1]/255, //Green
            toProcessPng.data[idx+2]/255 //Blue
          )
        }
      }
      let result = perceptron.activate(pixelValues);
      var idx = (toProcessPng.width * (y) + (x)) << 2;
      toProcessPng.data[idx] = result[0]*255;
      toProcessPng.data[idx+1] = result[1]*255;
      toProcessPng.data[idx+2] = result[2]*255;
    }
  }

  //SAVE IMAGE
  var buffer = PNG.sync.write(toProcessPng);
  fs.writeFileSync('out.png', buffer);
}

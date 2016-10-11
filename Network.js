const Layer = require('./Layer');

const Network = function(layers){

  this.input = layers.input;
  this.hidden = layers.hidden;
  this.output = layers.output;
  this.step = 0.2;

  this.activate = function(arr){
    this.input.activate(arr);
    for(let i in this.hidden) this.hidden[i].activate();
    return this.output.activate();
  }

  this.propagate = function(rate, expectedArr){
    e = {error:0};
    e.error += this.output.propagate(rate, expectedArr).error;
    for(let i=this.hidden.length-1;i>=0;i--) this.hidden[i].propagate(rate);
    return e;
  }

  this.train = function(data, options){
    options = Object.assign({}, {
      iterations: 20000,
      rate: 0.2,
      error: 0.001
    }, options);
    let initTime = new Date();
    let e;
    for(let i=0;i<options.iterations;i++){
      let rate = Array.isArray(options.rate) ? options.rate[Math.floor(options.rate.length*i/options.iterations)] : options.rate;
      e = {iteration:i+1, error:0, rate: rate};
      for(let j=0;j<data.length;j++){
        this.activate(data[j].input);
        e.error += this.propagate(rate, data[j].output).error;
      }
      e.millis = (new Date())-initTime;
      if(options.every && i%options.every.iterations==0){
        let runner = options.every.run(e);
        if(runner === false) return e;
      }
      if(e.error < options.error) return e;
    }
    return e;
  }

};

module.exports = Network;

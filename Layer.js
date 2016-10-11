const Neuron = require('./Neuron');

const Layer = function(size){
  this.neurons = [];

  for(let i=0;i<size;i++) this.neurons.push(new Neuron());

  this.activate = function(arr){
    let pred = [];
    for(let i=0;i<this.neurons.length;i++){
      pred.push(
        this.neurons[i].activate(arr ? arr[i] : undefined)
      );
    }
    return pred;
  }

  this.project = function(l){
    for(let i=0;i<this.neurons.length;i++){
      for(let j=0;j<l.neurons.length;j++){
        //Many to many projection
        this.neurons[i].project(l.neurons[j]);
      }
    }
  }

  this.propagate = function(rate, expectedArr){
    let error = 0;
    for(let i=0;i<this.neurons.length;i++){
      error += this.neurons[i].propagate(rate, expectedArr ? expectedArr[i] : undefined).error;
    }
    return {
      error
    }
  }

}

module.exports = Layer;

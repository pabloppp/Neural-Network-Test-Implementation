const sigmoid = (x) => 1/(1+Math.exp(-x));
const sigmoidToDerivative = (x) => x*(1-x);

const Neuron = function(){
  this.uid = Neuron.totalNeurons++;
  this.activation = 0;
  this.state = 0;
  this.synapsis = {};
  this.projections = {};
  this.error = 0;
  this.squash = sigmoid;
  this.derivate = sigmoidToDerivative;
  this.momentum = 0.01;

  this.project = function(n){
    this.projections[n.uid] = n;
    n.synapsis[this.uid] = {
      w: Math.seededRandom(-1, 1),
      neuron:this, d:0, ld:0
    }
  }

  this.activate = function(v){
    if(v !== undefined){
      this.activation = v;
      return this.activation;
    }
    this.state = 0;
    for(let i in this.synapsis){
      this.state += this.synapsis[i].w*this.synapsis[i].neuron.activation;
    }
    this.activation = this.squash(this.state).toFixed(Neuron.precission);
    return this.activation;
  }

  this.propagate = function(rate, expected){
    if(expected !== undefined){
      this.diff = expected - this.activation;
      this.error = (expected - this.activation)*this.derivate(this.activation);
    }
    else{
      this.error = 0;
      for(let i in this.projections){
        this.error += this.projections[i].synapsis[this.uid].w*this.projections[i].error;
      }
      this.error *= this.derivate(this.activation); //(expected - this.activation)*this.activation;
    }
    for(let i in this.synapsis){
      this.synapsis[i].d = rate*this.error*this.synapsis[i].neuron.activation; //delta
      this.synapsis[i].w += this.synapsis[i].d + this.synapsis[i].ld*this.momentum;
      this.synapsis[i].ld = this.synapsis[i].d; //last delta
    }
    return {
      error: this.diff*this.diff/2
    };
  }
}
Neuron.totalNeurons = 0;
Neuron.precission = 8;

module.exports = Neuron;


//HELPERS
// the initial seed
Math.seed = 1993;
Math.seededRandom = function(max, min) {
    max = max || 1;
    min = min || 0;

    Math.seed = (Math.seed * 9301 + 49297) % 233280;
    var rnd = Math.seed / 233280;

    return min + rnd * (max - min);
}

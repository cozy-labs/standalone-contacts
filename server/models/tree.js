// Generated by CoffeeScript 1.7.1
var Tree, americano;

americano = require('americano-cozy');

module.exports = Tree = americano.getModel('Tree', {
  type: String,
  struct: Object
});

Tree.all = function(params, callback) {
  return Tree.request('byType', params, callback);
};

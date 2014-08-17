// Generated by CoffeeScript 1.7.1
var Contact, ContactLog, americano;

americano = require('americano-cozy-pouchdb');

ContactLog = require('./contact_log');

module.exports = Contact = americano.getModel('Contact', {
  id: String,
  fn: String,
  n: String,
  datapoints: function(x) {
    return x;
  },
  note: String,
  tags: function(x) {
    return x;
  },
  _attachments: Object
});

Contact.prototype.remoteKeys = function() {
  var dp, model, out, _i, _len, _ref;
  model = this.toJSON();
  out = [this.id];
  _ref = model.datapoints;
  for (_i = 0, _len = _ref.length; _i < _len; _i++) {
    dp = _ref[_i];
    if (dp.name === 'tel') {
      out.push(ContactLog.normalizeNumber(dp.value));
    } else if (dp.name === 'email') {
      out.push(dp.value.toLowerCase());
    }
  }
  return out;
};

Contact.prototype.getComputedFN = function(config) {
  var familly, given, middle, prefix, suffix, _ref;
  _ref = this.n.split(';'), familly = _ref[0], given = _ref[1], middle = _ref[2], prefix = _ref[3], suffix = _ref[4];
  switch (config.nameOrder) {
    case 'given-familly':
      return "" + given + " " + middle + " " + familly;
    case 'familly-given':
      return "" + familly + ", " + given + " " + middle;
    case 'given-middleinitial-familly':
      return "" + given + " " + (initial(middle)) + " " + familly;
  }
};

Contact.prototype.toVCF = function(config) {
  var dp, i, key, model, out, type, value, _ref;
  model = this.toJSON();
  out = "BEGIN:VCARD\n";
  out += "VERSION:3.0\n";
  if (model.note) {
    out += "NOTE:" + model.note + "\n";
  }
  if (model.n) {
    out += "N:" + model.n + "\n";
    out += "FN:" + (this.getComputedFN(config)) + "\n";
  } else if (model.fn) {
    out += "FN:" + model.fn + "\n";
  }
  _ref = model.datapoints;
  for (i in _ref) {
    dp = _ref[i];
    value = dp.value;
    switch (dp.name) {
      case 'about':
        if (dp.type === 'org' || dp.type === 'title') {
          out += "" + (dp.type.toUpperCase()) + ":" + value + "\n";
        } else {
          out += "X-" + (dp.type.toUpperCase()) + ":" + value + "\n";
        }
        break;
      case 'other':
        out += "X-" + (dp.type.toUpperCase()) + ":" + value + "\n";
        break;
      default:
        key = dp.name.toUpperCase();
        if (key === 'ADR') {
          value = value.replace(/(\r\n|\n\r|\r|\n)/g, ";");
        }
        type = "TYPE=" + (dp.type.toUpperCase());
        out += "" + key + ";" + type + ":" + value + "\n";
    }
  }
  return out += "END:VCARD\n";
};

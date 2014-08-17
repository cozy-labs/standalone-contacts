// Generated by CoffeeScript 1.7.1
var MailSent, americano;

americano = require('americano-cozy-pouchdb');

module.exports = MailSent = americano.getModel('MailSent', {
  createdAt: {
    type: Number,
    "default": 0
  },
  sentAt: {
    type: Number,
    "default": 0
  },
  subject: {
    type: String
  },
  from: {
    type: String
  },
  to: {
    type: String
  },
  cc: {
    type: String
  },
  bcc: {
    type: String
  },
  html: {
    type: String
  }
});

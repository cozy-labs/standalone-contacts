// Generated by CoffeeScript 1.7.1
var ContactLog, async;

ContactLog = require('../models/contact_log');

async = require('async');

module.exports = {
  byContact: function(req, res) {
    var keys;
    keys = req.contact.remoteKeys();
    return ContactLog.byRemote(keys, function(err, logs) {
      logs.sort(function(x, y) {
        var tx, ty;
        tx = new Date(x.timestamp).getTime();
        ty = new Date(y.timestamp).getTime();
        if (tx > ty) {
          return 1;
        }
        if (tx < ty) {
          return -1;
        }
        if (x.type === 'NOTE' && y.type !== 'NOTE') {
          return 1;
        }
        if (y.type === 'NOTE' && x.type !== 'NOTE') {
          return -1;
        }
        return 0;
      });
      if (err) {
        return res.error(err);
      }
      return res.send(logs, 200);
    });
  },
  fetch: function(req, res, next, id) {
    return ContactLog.find(id, function(err, log) {
      if (err) {
        return res.error(500, 'An error occured', err);
      }
      if (!log) {
        return res.error(404, 'Log not found');
      }
      req.log = log;
      return next();
    });
  },
  create: function(req, res) {
    var data;
    data = {
      type: 'NOTE',
      direction: 'NA',
      timestamp: new Date(req.body.timestamp).toISOString(),
      remote: {
        id: req.contact.id
      },
      content: req.body.content
    };
    return ContactLog.create(data, function(err, log) {
      if (err) {
        return res.error(err);
      }
      return res.send(log, 201);
    });
  },
  update: function(req, res) {
    return req.log.updateAttributes(req.body, function(err) {
      if (err) {
        return res.error(err);
      }
      return res.send(req.log, 200);
    });
  },
  "delete": function(req, res) {
    return req.log.destroy(function(err) {
      if (err) {
        return res.error(err);
      }
      return res.send({
        success: true
      }, 204);
    });
  },
  merge: function(req, res) {
    var toMerge;
    toMerge = Array.isArray(req.body) ? req.body : [req.body];
    return ContactLog.merge(toMerge, function(err) {
      if (err) {
        return res.error(err);
      }
      return res.send({
        success: true
      }, 201);
    });
  },
  mergeFing: function(req, res) {
    return PhoneCommunicationLog.all(function(finglogs) {
      var converted;
      if (err) {
        return res.error(err);
      }
      converted = finglogs.map(function(log) {
        log = log.toJSON();
        log.remote = {
          tel: log.correspondantNumber
        };
        if (log.type === 'VOICE') {
          log.content = {
            duration: log.chipCount
          };
        }
        return log;
      });
      return ContactLog.merge(converted, function(err) {
        if (err) {
          return res.error(err);
        }
        return res.send({
          success: true
        }, 201);
      });
    });
  }
};

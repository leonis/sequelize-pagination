'use strict';

const User = require('./model.js');

module.exports = {
  init: (callback) => {
    const values = Array.from(new Array(100)).map((_, i) => {
      return {id: i};
    });

    User.sync({force: true})
      .then((_) => {
        return User.bulkCreate(values);
      })
      .then((_) => {
        callback();
      })
      .catch((err) => {
        callback(err);
      });
  },
  cleanup: (callback) => {
    User.destroy({truncate: true})
      .then((_) => {
        callback();
      })
      .catch(callback);
  }
};

'use strict';

module.exports = function(Model, options) {
  Model.defineProperty('content', {type: String, dataType: 'text'});
  Model.defineProperty('blocked', {type: Boolean});
  Model.defineProperty('affordable', {type: Boolean});
  Model.defineProperty('price', {type: Number});
  Model.defineProperty('likes', {type: Object});
  Model.defineProperty('dislikes', {type: Object});
  Model.defineProperty('coinType', {type: String});
  Model.defineProperty('expiration', {type: Date});
};

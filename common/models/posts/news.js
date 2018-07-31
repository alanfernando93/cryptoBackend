'use strict';
var f = require('../../../lib/functions');

module.exports = function(News) {
  // verifica si es tiene un precio por defecto
  News.afterRemote('create', (ctx, news, next) => {
    if (ctx.result.precio == null) {
      News.setPrice(ctx.result.id, ctx.result.userId)
        .then(price => {
          ctx.result.prece = price;
          next();
        });
    } else {
      next();
    }
  });
  News.setPrice = (newsId, userId) => {
    let userModel = News.app.models.user;
    return userModel.findById(userId)
      .then(usuario => {
        return News.count({userId: userId}, (err, count)  => {
          let price = f.CalculatePrice(usuario.precision.valor, count);
          // News.updateAll({id: newsId}, {precio: price, comprable: true});
          return price;
        });
      });
  };
};

'use strict';
var global = require('../../lib/global');

module.exports = (Model, options) => {
  Model.defineProperty('content', { type: String, dataType: 'text' });
  Model.defineProperty('blocked', { type: Boolean });
  Model.defineProperty('affordable', { type: Boolean });
  Model.defineProperty('price', { type: Number });
  Model.defineProperty('coinType', { type: String });
  Model.defineProperty('expiration', { type: Date });

  Model.mixin('Dropbox', true);

  Model.mixin('Likes', {
    'method': 'like',
    'endpoint': '/:id/like',
    'likes': 'likes',
    'userModel': 'user',
    'description': `likes ${Model.definition.name} instance for the given userId`,
  });
  Model.mixin('Likes', {
    'method': 'dislike',
    'endpoint': '/:id/dislike',
    'likes': 'dislikes',
    'userModel': 'user',
    'description': `dislikes ${Model.definition.name} instance for the given userId`,
  });

  // hook para quitar dislike si le damos like
  // Model.afterRemote('like', (ctx, noticia, next) => {
  //   var id = ctx.req.params.id;
  //   var userId = ctx.req.query.userId;
  //   var user = ctx.result.dislikes.users.find(element => element == userId);
  //   if (user) {
  //     ctx.method.ctor.dislike(id, userId);
  //     ctx.result.dislikes.users.splice(user, 1);
  //   }
  //   if (!ctx.result.likes.users.find(element => element == userId)) {
  //     ctx.method.ctor.dislike(id, userId);
  //     ctx.result.dislikes.users.push(userId);
  //   }
  //   ctx.result.dislikes.total = ctx.result.dislikes.users.length;
  //   Model.app.models.usuario.fameUser(userId, global.rpl, id, global.rpfl);
  //   next();
  // });

  // hook para quitar like si le damos dislike
  // Model.afterRemote('dislike', (ctx, model, next) => {
  //   var id = ctx.req.params.id;
  //   var userId = ctx.req.query.userId;
  //   var user = ctx.result.likes.users.find(element => element == userId);
  //   if (user) {
  //     ctx.method.ctor.like(id, userId);
  //     ctx.result.likes.users.splice(user, 1);
  //   }
  //   if (!ctx.result.dislikes.users.find(element => element == userId)) {
  //     ctx.method.ctor.like(id, userId);
  //     ctx.result.likes.users.push(userId);
  //   }
  //   ctx.result.likes.total = ctx.result.likes.users.length;
  //   Model.app.models.usuario.fameUser(userId, global.rpl, id, global.rpfl);
  //   next();
  // });

  Model.afterRemote('create', (ctx, user, next) => {
    let userId = ctx.result.userId;
    Model.app.models.user.findById(userId).then(data => {
      data.points += 1;
      data.save();
      next();
    });
  });
};

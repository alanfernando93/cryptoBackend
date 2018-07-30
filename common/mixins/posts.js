'use strict';

module.exports = function (Model, options) {
  Model.defineProperty('content', { type: String, dataType: 'text' });
  Model.defineProperty('blocked', { type: Boolean });
  Model.defineProperty('affordable', { type: Boolean });
  Model.defineProperty('price', { type: Number });
  Model.defineProperty('coinType', { type: String });
  Model.defineProperty('expiration', { type: Date });

  Model.mixin("Likes", {
    "method": "like",
    "endpoint": "/:id/like",
    "likes": "likes",
    "userModel": "user"
  });
  Model.mixin("Likes", {
    "method": 'dislike',
    "endpoint": '/:id/dislike',
    "likes": 'dislikes',
    "userModel": 'user',
    "description": ' dislikes instance for the given userId',
  });

  // hook para quitar dislike si le damos like
  Model.afterRemote('like', (ctx, noticia, next) => {
    console.log(ctx)
    next();
  });

  // hook para quitar like si le damos dislike
  Model.afterRemote('dislike', (ctx, noticia, next) => {
    console.log(ctx.result)
    next();
  });
};

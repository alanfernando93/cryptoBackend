'use strict';

module.exports = function(Complaint) {
  Complaint.beforeRemote('create', (ctx, models, next) => {
    var filter = {
      where: {
        modelId: ctx.req.body.modelId,
        modelName: ctx.req.body.nodelName,
      },
    };
    Complaint.find(filter).then(data => {
      if (data.length !== 0) return;
      next();
    });
  });
};

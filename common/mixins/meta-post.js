'use strict';

module.exports = (Model, options) => {
  Model.answers = (id, fk, req, res, cb) => {
    var answer = Model.app.models.answer;
    var filter = {
      where: {
        and: [{
          commentId: fk,
        }, {
          modelId: id,
        }, {
          modelName: Model.definition.name,
        }],
      },
    };
    answer.find(filter).then(data => {
      cb(null, data);
    });
  };

  Model.remoteMethod('answers', {
    accepts: [
      {arg: 'id', type: 'number', required: true},
      {arg: 'fk', type: 'number', required: true},
      {arg: 'req', type: 'object', 'http': {source: 'req'}},
      {arg: 'res', type: 'object', 'http': {source: 'res'}},
    ],
    returns: {arg: 'data', type: 'answer', root: true},
    http: {path: '/:id/comments/:fk/answers', verb: 'get'},
  });
};

'use strict';

var base64Img = require('base64-img');
var Dropbox = require('dropbox').Dropbox;
var dbx = new Dropbox({
  accessToken: 'NirdHiRLreAAAAAAAAAAm1nwmRf3YeOdaoLR5GTU4X0lWUkddr9zS_jVZ8NrCU0W',
  clientId: 'zn0kbmrq6ed8rme',
});
// dbx.setClientId('zn0kbmrq6ed8rme');

module.exports = (Model, options) => {
  var contents = {
    news: ['content', 'guessPrice', 'guessCoin'],
    signal: ['fundamentalAnalysis', 'technicalAnalysis'],
  };

  var defaultOptions = {
    maxFileSize: 10 * 1024 * 1024, // 10 MB
  };
  Model.defineProperty('image', {type: String});

  Model.dropbox = (provider, req, res, options, cb) => {

  };

  Model.remoteMethod('dropbox', {
    accepts: [{
      arg: 'id', type: 'string', required: true,
    }, {
      arg: 'req', type: 'object', 'http': {source: 'req'},
    }, {
      arg: 'res', type: 'object', 'http': {source: 'res'},
    }],
    returns: {
      arg: 'result', type: 'string',
    },
    http: {
      path: '/:id/dropbox', verb: 'post',
    },
    description: 'load main image in dropbox',
  });

  Model.afterRemote('find', (ctx, noticia, next) => {
    var modelName = '/' + Model.definition.name;
    var iterable = [];
    ctx.result.forEach((element) => {
      var request = {path: `${modelName}/${element.image}`};
      var promise = dbx.filesGetTemporaryLink(request).then(resp => {
        element.perfilLink = resp.link;
      }).catch(err => {
        console.error('Error: no se pudo conseguir link temporal de la imagen',
          modelName, '/', element.image);
      });
      iterable.push(promise);
    });
    Promise.all(iterable).then(valor => {
      next();
    });
  });

  Model.afterRemote('findById', (ctx, noticia, next) => {
    var modelName = '/' + Model.definition.name;
    var iterable = [];
    var expReg = /dropbox:["']{0,1}([^"' >]*)/g;
    var request = {path: `${modelName}/${ctx.result.image}`};
    var promise = dbx.filesGetTemporaryLink(request).then(resp => {
      ctx.result.perfilLink = resp.link;
    }).catch(error => {
      console.error('Error: no se pudo conseguir link temporal de la imagen',
        modelName, '/', ctx.result.image);
    });
    iterable.push(promise);

    let codImg;
    if (Model.definition.name !== 'user') {
      ctx.result.imgsEditor = [];
      contents[Model.definition.name].forEach(content => {
        codImg = ctx.result[content].match(expReg);
        console.log(codImg);
        if (!codImg) return;
        codImg.forEach((element) => {
          var nameImg = element.split(':')[1];
          ctx.result.imgsEditor.push(nameImg);
          var x = dbx.filesGetTemporaryLink({path: `${modelName}/${nameImg}`})
            .then(resp => {
              ctx.result[content] = ctx.result[content]
                .replace(element, resp.link);
            }).catch(error => {
              console.log(error);
            });
          iterable.push(x);
        });
      });
    }
    Promise.all(iterable).then(values => {
      next();
    });
  });
};

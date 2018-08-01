'use strict';

var base64Img = require('base64-img');
var Dropbox = require('dropbox').Dropbox;
var dbx = new Dropbox({
  accessToken: 'NirdHiRLreAAAAAAAAAAm1nwmRf3YeOdaoLR5GTU4X0lWUkddr9zS_jVZ8NrCU0W',
  clientId: 'zn0kbmrq6ed8rme',
});
// dbx.setClientId('zn0kbmrq6ed8rme');

module.exports = function(Model, options) {
  var defaultOptions = {
    maxFileSize: 10 * 1024 * 1024, // 10 MB
  };
  Model.defineProperty('image', { type: String });

  Model.dropbox = (provider, req, res, options, cb) => {

  };

  Model.remoteMethod('dropbox', {
    accepts: [
      { arg: 'id', type: 'string', required: true },
      { arg: 'req', type: 'object', 'http': { source: 'req' } },
      { arg: 'res', type: 'object', 'http': { source: 'res' } },
    ],
    returns: { arg: 'result', type: 'string' },
    http: { path: '/:id/dropbox', verb: 'post' },
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
        console.error(`Error: no se pudo conseguir link temporal de la imagen ${modelName}/${element.image}`);
      });
      iterable.push(promise);
    });
    Promise.all(iterable).then(valor => {
      next();
    });
  });

  Model.afterRemote('findById', (ctx, noticia, next) => {
    var contents = ['content', 'guessPrice', 'guessCoin'];
    var modelName = '/' + Model.definition.name;
    var iterable = [];
    var expReg = /dropbox:["']{0,1}([^"' >]*)/g;
    ctx.result.imgsEditor = [];
    var aux;
    console.log(ctx.result);
    var request = {path: `${modelName}/${ctx.result.image}`};
    var promise = dbx.filesGetTemporaryLink(request).then(resp => {
      ctx.result.perfilLink = resp.link;
    }).catch(error => {
      console.error(`Error: no se pudo conseguir link temporal de la imagen ${modelName}/${ctx.result.image}`);
    });
    iterable.push(promise);
    
    let codImg;
    contents.forEach(content => {
      codImg = ctx.result[content].match(expReg);
      if (!codImg) return;
      codImg.forEach((element) => {
        var nameImg = element.split(':')[1];
        ctx.result.imgsEditor.push(nameImg);
        var x = dbx.filesGetTemporaryLink(
          {
            path: `${modelName}/${nameImg}`,
          }
        ).then(resp => {
          aux = ctx.result[content].replace(element, resp.link);
          ctx.result[content] = aux;
        }).catch(error => {
          console.log(error);
        });
        iterable.push(x);
      });
    });

    // codImg = ctx.result.content.match(expReg);
    // if (codImg) {
    //   codImg.forEach((element) => {
    //     var nameImg = element.split(':')[1];
    //     ctx.result.imgsEditor.push(nameImg);
    //     var x = dbx.filesGetTemporaryLink(
    //       {
    //         path: '/news/' + nameImg,
    //       }
    //     ).then(resp => {
    //       aux = ctx.result.contenido.replace(element, resp.link);
    //       ctx.result.contenido = aux;
    //     }).catch(error => {
    //       console.log(error);
    //     });
    //     iterable.push(x);
    //   });
    // }

    // codImg = ctx.result.guessCoin.match(expReg);
    // if (codImg) {
    //   codImg.forEach((element) => {
    //     var nameImg = element.split(':')[1];
    //     ctx.result.imgsEditor.push(nameImg);
    //     var x = dbx.filesGetTemporaryLink(
    //       {
    //         path: '/news/' + nameImg,
    //       }
    //     ).then(resp => {
    //       aux = ctx.result.conj_moneda.replace(element, resp.link);
    //       ctx.result.conjMoneda = aux;
    //     }).catch(error => {
    //       console.log(error);
    //     });
    //     iterable.push(x);
    //   });
    // }
    // codImg = ctx.result.guessPrice.match(expReg);
    // if (codImg) {
    //   codImg.forEach((element) => {
    //     var nameImg = element.split(':')[1];
    //     ctx.result.imgsEditor.push(nameImg);
    //     var x = dbx.filesGetTemporaryLink(
    //       {
    //         path: '/news/' + nameImg,
    //       }
    //     ).then(resp => {
    //       aux = ctx.result.conj_precio.replace(element, resp.link);
    //       ctx.result.guessPrice = aux;
    //     }).catch(error => {
    //       console.log(error);
    //     });
    //     iterable.push(x);
    //   });
    // }
    Promise.all(iterable).then(values => {
      next();
    });
  });
};

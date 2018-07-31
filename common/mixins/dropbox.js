'use strict';

var base64Img = require('base64-img');
var Dropbox = require('dropbox').Dropbox;
// var dbx = new Dropbox({ accessToken: _variable.token });
// dbx.setClientId(_variable.key);

module.exports = function (Model, options) {
  var defaultOptions = {
    maxFileSize: 10 * 1024 * 1024, // 10 MB
  };
  Model.defineProperty('image', { type: String });

  Model.dropbox = (provider, req, res, options, cb) => {

  };

  Model.remoteMethod('dropbox', {
    accepts: [
      { arg: "id", type: "string", required: true },
      { arg: 'req', type: 'object', 'http': { source: 'req' } },
      { arg: 'res', type: 'object', 'http': { source: 'res' } },
    ],
    returns: { arg: "result", type: "string" },
    http: { path: "/:id/dropbox", verb: "post" },
    description: "load main image in dropbox",
  });

  Model.afterRemote('find', (ctx, noticia, next) => {
    var modelName = '/' + Model.definition.name;
    var iterablex = [];
    var iterabley = [];
    ctx.result.forEach((element, index) => {
      var res = {
        path: modelName,
        query: element.usuarioId + '-perfil-' + element.id,
      }
      var x = dbx.filesSearch(res).then(r => {
        console.log('nombre');
        ctx.result[index].perfilName = r.matches[0]['metadata'].name;
        var x = dbx.filesGetTemporaryLink({
          path: '/news/' + ctx.result[index].perfilName,
        }).then(resp => {
          console.log('link');

          ctx.result[index].perfilLink = resp.link;
        }).catch(error => {
          console.log(error);
        });
        iterabley.push(x);
      }).catch(error => {
        console.log(error);
      });
      iterablex.push(x);

    });
    Promise.all(iterablex).then(values => {
      Promise.all(iterabley).then(valor => {
        next();
      });
    });
  });

  Model.afterRemote('findById', (ctx, noticia, next) => {
    var iterable = [];
    var iterabley = [];
    ctx.result.imgsEditor = [];
    var aux;
    console.log(ctx.result);
    var x = dbx.filesSearch(
      {
        path: '/news', query: ctx.result.usuarioId + '-perfil-' + ctx.result.id,
      }
    ).then(r => {
      ctx.result.perfilName = r.matches[0]['metadata'].name;
      var y = dbx.filesGetTemporaryLink(
        {
          path: '/news/' + ctx.result.perfilName,
        }
      ).then(resp => {
        ctx.result.perfilLink = resp.link;
      }).catch(error => {
        console.log(error);
      });
      iterabley.push(y);
    }).catch(error => {
      console.log(error);
    });
    iterable.push(x);

    var expReg = /dropbox:["']{0,1}([^"' >]*)/g;
    var codImg = ctx.result.contenido.match(expReg);
    if (codImg) {
      codImg.forEach((element) => {
        var nameImg = element.split(':')[1];
        ctx.result.imgsEditor.push(nameImg);
        var x = dbx.filesGetTemporaryLink(
          {
            path: '/news/' + nameImg,
          }
        ).then(resp => {
          aux = ctx.result.contenido.replace(element, resp.link);
          ctx.result.contenido = aux;
        }).catch(error => {
          console.log(error);
        });
        iterable.push(x);
      });
    }

    codImg = ctx.result.conj_moneda.match(expReg);
    if (codImg) {
      codImg.forEach((element) => {
        var nameImg = element.split(':')[1];
        ctx.result.imgsEditor.push(nameImg);
        var x = dbx.filesGetTemporaryLink(
          {
            path: '/news/' + nameImg,
          }
        ).then(resp => {
          aux = ctx.result.conj_moneda.replace(element, resp.link);
          ctx.result.conjMoneda = aux;
        }).catch(error => {
          console.log(error);
        });
        iterable.push(x);
      });
    }
    codImg = ctx.result.conj_precio.match(expReg);
    if (codImg) {
      codImg.forEach((element) => {
        var nameImg = element.split(':')[1];
        ctx.result.imgsEditor.push(nameImg);
        var x = dbx.filesGetTemporaryLink(
          {
            path: '/news/' + nameImg,
          }
        ).then(resp => {
          aux = ctx.result.conj_precio.replace(element, resp.link);
          ctx.result.conj_precio = aux;
        }).catch(error => {
          console.log(error);
        });
        iterable.push(x);
      });
    }
    Promise.all(iterable).then(values => {
      Promise.all(iterabley).then(value => {
        next();
      });
    });
  });
};

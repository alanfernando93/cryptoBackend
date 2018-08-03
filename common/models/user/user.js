'use strict';

module.exports = function(User) {
  // User.validatesLengthOf('password', {
  //   min: 5, message:
  //     {min: 'el password debe de contener por lo menos 5 caracteres'},
  // });
  // User.validatesLengthOf('first-name',
  //   {min: 3, message: {min: 'nombre debe de tener como minimo 3 letras'}});
  // User.validatesLengthOf('last-name', +
  //   {min: 3, message: {min: 'apellido debe de tener como minimo 3 letras'}});
  // User.validatesUniquenessOf('email', {message: 'el email no es unico'});
  // User.validatesFormatOf('first-name', {
  //   with: /[a-zA-Z\-'\s]+/,
  //   message: 'el nombre debe estar compuesto por solo letras',
  // });// solo nombres con letras ej juan
  // User.validatesFormatOf('last-name', {
  //   with: /[a-zA-Z\-'\s]+/,
  //   message: 'el apellido debe de estar compuesto de solo letras',
  // });// apellido solo letras ej lopez
  // User.validatesFormatOf('password', {
  //   with: /((?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%]).{4,20})/,
  //   message: 'password debe de estar compuesto con al menos un dígito, una ' +
  //   'letra mayúscula, una letra minúscula y un símbolo especial ("@ # $%").',
  // }); // password compuesto por letras y numeros

  User.observe('after save', (ctx, next) => {
    var rol = User.app.models.Role;
    var map = User.app.models.RoleMapping;
    if (ctx.instance != undefined) {
      if (ctx.instance.realm == 'normal') {
        rol.find({where: {name: 'normal'}}, (err, role) => {
          if (err) throw err;
          map.upsertWithWhere({principalId: ctx.instance.id}, {
            principalType: 'NORMAL',
            principalId: ctx.instance.id,
            roleId: role[0].id,
          }, (err, rolemapping) => {
            if (err)
              console.log('error asignando roles');
            console.log(rolemapping);
          });
        });
      }
      if (ctx.instance.realm == 'premium') {
        rol.find({where: {name: 'premium'}}, (err, rol) => {
          if (err)
            throw err;
          map.upsertWithWhere({principalId: ctx.instance.id}, {
            principalType: 'Premium',
            principalId: ctx.instance.id,
            roleId: rol[0].id,
          }, (err, rolemapping) => {
            if (err)
              console.log('error asignando roles');
            console.log(rolemapping);
          });
        });
      }
    }
    next();
  });

  User.famaUser = (userId, point, coinType, reliability) => {
    User.findById(userId).then(data => {
      User.app.models.coin.find({
        where: {
          name: coinType,
        },
      }, (err, coin) => {
        if (data.fame == null) {
          // @dev valor : valor que tenga la moneda
          data.fame = [{
            id: coin[0].id, value: 2, symbol: coin[0].symbol,
          },
          ];
        } else {
          var element = data.fame.find(
            element => element.id === coin[0].id);
          if (element === undefined) {
            data.fame.push({
              id: coin[0].id, value: 2, symbol: coin[0].symbol,
            });
          } else {
            // @dev valor que se autoincrementa para segun al valor de la moneda
            data.fame[data.fame.indexOf(element)].value += point * 2;
          }
        }
        data.points += point;
        data.reliability += reliability;
        data.save();
        // User.updateAll({id: userId}, {
        //   points: data.points + point,
        //   reliability: data.reliability + reliability,
        //   fame: data.fame,
        // }).then(data => {
        // });
      });
    });
  };
};

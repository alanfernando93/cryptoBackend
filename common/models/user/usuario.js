'use strict';

module.exports = function(Usuario) {
  Usuario.validatesLengthOf('password', {
    min: 5, message:
      {min: 'el password debe de contener por lo menos 5 caracteres'},
  });
  Usuario.validatesLengthOf('firstName',
    {min: 3, message: {min: 'nombre debe de tener como minimo 3 letras'}});
  Usuario.validatesLengthOf('lastName', +
    {min: 3, message: {min: 'apellido debe de tener como minimo 3 letras'}});
  Usuario.validatesUniquenessOf('email', {message: 'el email no es unico'});
  Usuario.validatesFormatOf('firstName', {
    with: /[a-zA-Z\-'\s]+/,
    message: 'el nombre debe estar compuesto por solo letras',
  });// solo nombres con letras ej juan
  Usuario.validatesFormatOf('lastName', {
    with: /[a-zA-Z\-'\s]+/,
    message: 'el apellido debe de estar compuesto de solo letras',
  });// apellido solo letras ej lopez
  Usuario.validatesFormatOf('password', {
    with: /((?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%]).{4,20})/,
    message: 'password debe de estar compuesto con al menos un dígito, una letra mayúscula, una letra minúscula y un símbolo especial ("@ # $%").',
  }); // password compuesto por letras y numeros


  Usuario.remoteMethod('posts', {
    returns: {arg: 'posts', type: 'array'},
    accepts: [
      {arg: 'id', type: 'number', required: true},
      {arg: 'model', type: 'string'},
    ],
    http: {path: '/:id/posts/:model', verb: 'get'},
  });

  Usuario.posts = (id, model, cb) => {
    let Model = Usuario.app.models[model];
    Model.find({
      where: {
        userId: id,
      },
    }).then(data =>{
      console.log(data);
      cb(null, data);
    });
    // cb(null, '---');
    // Usuario.findById(id, {
    //   fields: ['id', 'tipo', 'resultado', 'usuarioId', 'usuario'],
    //   include: {
    //     relation: 'usuario',
    //     scope: {
    //       fields: ['id', 'username', 'perfil'],
    //     },
    //   },
    // }, cb);
  };
};

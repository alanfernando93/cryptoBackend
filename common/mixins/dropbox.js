'use strict';

var base64Img = require('base64-img');
// var IncomingForm = require('formidable');
// var StringDecoder = require('string_decoder').StringDecoder;
// var path = require('path');
// var uuid = require('uuid');
// var g = require('strong-globalize')();

module.exports = function(Model, options) {
  var defaultOptions = {
    maxFileSize: 10 * 1024 * 1024, // 10 MB
  };
  Model.defineProperty('image', {type: String});

  Model.dropbox = (provider, req, res, options, cb) => {
    // if (!cb && 'function' === typeof options) {
    //   cb = options;
    //   options = {};
    // }

    // if (!options.maxFileSize) {
    //   options.maxFileSize = defaultOptions.maxFileSize;
    // }

    // var form = new IncomingForm(options);
    // var container = options.container || req.params.container;
    // var fields = {};
    // var files = {};
    // form.handlePart = function(part) {
    //   var self = this;

    //   if (part.filename === undefined || part.filename === '') {
    //     var value = '';
    //     var decoder = new StringDecoder(this.encoding);

    //     part.on('data', function(buffer) {
    //       self._fieldsSize += buffer.length;
    //       if (self._fieldsSize > self.maxFieldsSize) {
    //         self._error(new Error(
    //           g.f('{{maxFieldsSize}} exceeded, received %s bytes of field data',
    //             self._fieldsSize
    //           )));
    //         return;
    //       }
    //       value += decoder.write(buffer);
    //     });

    //     part.on('end', function() {
    //       var values = fields[part.name];
    //       if (values === undefined) {
    //         values = [value];
    //         fields[part.name] = values;
    //       } else {
    //         values.push(value);
    //       }
    //       self.emit('field', part.name, value);
    //     });
    //     return;
    //   }

    //   this._flushing++;

    //   var file = {
    //     container: container,
    //     name: part.filename,
    //     type: part.mime,
    //     field: part.name,
    //   };

    //   // Options for this file
    //   // Build a filename
    //   if ('function' === typeof options.getFilename) {
    //     file.originalFilename = file.name;
    //     file.name = options.getFilename(file, req, res);
    //   } else if (options.nameConflict === 'makeUnique') {
    //     file.originalFilename = file.name;
    //     file.name = uuid.v4() + path.extname(file.name);
    //   }

    //   // Get allowed mime types
    //   if (options.allowedContentTypes) {
    //     var allowedContentTypes;
    //     if ('function' === typeof options.allowedContentTypes) {
    //       allowedContentTypes = options.allowedContentTypes(file, req, res);
    //     } else {
    //       allowedContentTypes = options.allowedContentTypes;
    //     }
    //     if (Array.isArray(allowedContentTypes) && allowedContentTypes.length !== 0) {
    //       if (allowedContentTypes.indexOf(file.type) === -1) {
    //         self._error(new Error(
    //           g.f('{{contentType}} "%s" is not allowed (Must be in [%s])',
    //             file.type,
    //             allowedContentTypes.join(', ')
    //           )));
    //         return;
    //       }
    //     }
    //   }

    //   // Get max file size
    //   var maxFileSize;
    //   if (options.maxFileSize) {
    //     if ('function' === typeof options.maxFileSize) {
    //       maxFileSize = options.maxFileSize(file, req, res);
    //     } else {
    //       maxFileSize = options.maxFileSize;
    //     }
    //   }

    //   // Get access control list
    //   if (options.acl) {
    //     if ('function' === typeof options.acl) {
    //       file.acl = options.acl(file, req, res);
    //     } else {
    //       file.acl = options.acl;
    //     }
    //   }

    //   self.emit('fileBegin', part.name, file);
  
    //   var uploadParams = {
    //     container: container,
    //     remote: file.name,
    //     contentType: file.type,
    //   };
    //   if (file.acl) {
    //     uploadParams.acl = file.acl;
    //   }
  
    //   var writer = provider.upload(uploadParams);
  
    //   writer.on('error', function(err) {
    //     self.emit('error', err);
    //   });

    //   var endFunc = function(providerFile) {
    //     self._flushing--;

    //     file.providerResponse = providerFile;

    //     var values = files[part.name];
    //     if (values === undefined) {
    //       values = [file];
    //       files[part.name] = values;
    //     } else {
    //       values.push(file);
    //     }
    //     self.emit('file', part.name, file);
    //     self._maybeEnd();
    //   };

    //   writer.on('success', function(file) {
    //     endFunc(file);
    //   });

    //   var fileSize = 0;
    //   if (maxFileSize) {
    //     part.on('data', function(buffer) {
    //       fileSize += buffer.length;
    //       file.size = fileSize;
    //       if (fileSize > maxFileSize) {
    //         // We are missing some way to tell the provider to cancel upload/multipart upload of the current file.
    //         // - s3-upload-stream doesn't provide a way to do this in it's public interface
    //         // - We could call provider.delete file but it would not delete multipart data
    //         self._error(new Error(
    //           g.f('{{maxFileSize}} exceeded, received %s bytes of field data (max is %s)',
    //             fileSize,
    //             maxFileSize
    //           )));
    //         return;
    //       }
    //     });
    //   }

    //   part.on('end', function() {
    //     writer.end();
    //   });
    //   part.pipe(writer, {end: false});
    // };

    // form.parse(req, function(err, _fields, _files) {
    //   cb = cb || function() {};
  
    //   if (err) {
    //     console.error(err);
    //     return cb(err);
    //   }
  
    //   if (Object.keys(_files).length === 0) {
    //     err = new Error('No file content uploaded');
    //     err.statusCode = 400; // DO NOT MODIFY res.status directly!
    //     return cb(err);
    //   }
  
    //   cb(null, {files: files, fields: fields});
    // });
  };

  Model.remoteMethod('dropbox', {
    accepts: [
      {arg: "id", type: "string", required: true},
      {arg: 'req', type: 'object', 'http': {source: 'req'}},
      {arg: 'res', type: 'object', 'http': {source: 'res'}},
    ],
    returns: {arg: "result", type: "string"},
    http: {path: "/:id/dropbox", verb: "post"},
    description: "load main image in dropbox",
  });
};

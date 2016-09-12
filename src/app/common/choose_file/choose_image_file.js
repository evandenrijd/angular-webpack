import angular from 'angular';

(function() {

  angular.module('gecopa.common.chooseImageFile', ['ngMaterial'])
    .directive('chooseImageFile', function($q) {
      
      let defaultImageConstructor = function() {
        return {
          filename: '', //filename of the original
          asURL: '',    //URL representing the file's data as a base64 encoded string
          mime: ''      //MIME type of the image, determined by its magic number
        };
      }

      let updateImage = function(event) {
        let image = defaultImageConstructor();

        var updateImageMime = function(event) { //via magic number
          return $q(function(resolve, reject) {
            var file = event.currentTarget.files[0];
            image.filename = file.name;
            if (file.size > 0) {
              var reader = new FileReader();
              reader.onloadend = function(e) {
                var arr = (new Uint8Array(e.target.result)).subarray(0, 4);
                var header = "";
                for(var i = 0; i < arr.length; i++) {
                  header += arr[i].toString(16);
                }
                var type = '';
                switch (header) {
                case "89504e47":
                  type = "image/png";
                  break;
                case "47494638":
                  type = "image/gif";
                  break;
                case "ffd8ffe0":
                case "ffd8ffe1":
                case "ffd8ffe2":
                  type = "image/jpeg";
                  break;
                default:
                  type = "unknown";
                  reject('ERR_UNKNOWN_MIME');
                  break;
                }
                image.mime = type;
                image.file = file;
                resolve(image);
              };
              reader.readAsArrayBuffer(file);
            } else {
              reject('ERR_NO_OR_EMPTY_FILE');
            }
          });
        }

        return $q(function(resolve, reject) {
          updateImageMime(event).then(function() {
            var file = image.file;
            var reader = new FileReader();
            reader.onload = function(e) {
              image.asURL = e.target.result;
              if (image.mime !== 'unknown') { //patch mime
                let re = /^data\:\;base64\,/;
                if (image.asURL.match(re)) {
                  let mime = 'data:' + image.mime + ';base64,'
                  console.debug('patched URL with missing mime: ' + mime);
                  image.asURL = image.asURL.replace(re, mime);
                }
              }
              delete image.file; //makes angular 1.5.8 crash
              resolve(image);
            };
            reader.readAsDataURL(file);            
          }).catch(function(error) {
            reject(error);
          });
        });
      };

      var link = function (scope, elem, attrs/*, ctrl*/) {
        var button = elem.find('button');
        var input = angular.element(elem[0].querySelector('#fileInput'));
        var pseudoInputCtrl = angular
            .element(elem[0].querySelector('#pseudoFileInput'))
            .controller('ngModel');
        button.bind('click', function() {
          input[0].click();
        });
        input.bind('change', function(e) {
          updateImage(e).then(function(result) {
            scope.image = result;
            pseudoInputCtrl.$setValidity("noCorrectImage", true);
          }).catch(function(error) {
            console.error('got error: ', error);
            scope.image = defaultImageConstructor();
            pseudoInputCtrl.$setValidity("noCorrectImage", false);
          }).finally(function(){
            pseudoInputCtrl.$setDirty();
          });
        });
      };

      return {
        // require: '^form',
        restrict: 'E',
        scope: {
          image: '='
        },
        link: link,
        template: require('./choose_image_file.tmpl.html')
      };

    });

}());

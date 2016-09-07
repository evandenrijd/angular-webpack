import angular from 'angular';
import _ from 'underscore';
import {dump_obj} from '../../utils';
import '../meta.module';
import concoursConstructor from './concours.constructor';

(function(){

  let concoursListConstructor = function(spec, my) {
    let self = spec || {};
    my = my || {};
    let URLS = {
      FETCH: 'data/concours.json'
    };
    let concours;

    function extract(result) {
      // console.debug('result: ', result);
      return result.data.map(spec => {
        return concoursConstructor(spec, my);
      });
    }

    function cacheConcours(result) {
      concours = extract(result);
      // console.debug('concours: ', concours);
      return concours;
    }

    let loadAllConcours = function () {
      return (concours) ? my.$q.when(concours) :
        my.$http.get(URLS.FETCH).then(result => {
          return cacheConcours(result);
        });
    }

    let reset = function(query) {
      return loadAllConcours();
    }

    function findConcours(concoursId) {
      return _.find(concours, function (aConcours) {
        return aConcours.get('id') === parseInt(concoursId, 10);
      })
    }

    let getConcoursById = function (concoursId) {
      return my.$q(function(resolve) {
        loadAllConcours().then(() => {
          resolve(findConcours(concoursId));
        })
      });
    };

    let createConcours = function (aConcours) {
      return my.$q(function(resolve) {
        loadAllConcours().then(() => {
          my.$timeout(function() { //FIXME 1s simulation of create
            aConcours.set('id', concours.length);
            concours.push(aConcours);
            console.debug('FIXME Normal create REST call');
            my.$translate('concours_db_successful_creation').then(result => {
              my.$mdToast.show(my.$mdToast.simple().textContent(result));
            });
            resolve(self);
          }, 1000);
        });
      });
    };

    let updateConcours = function (aConcours) {
      return my.$q(function(resolve) {
        loadAllConcours().then(() => {
          my.$timeout(function() { //FIXME 1s simulation of update
            let image = aConcours.getImageObject();
            if (image.asURL.match(/^data:/)) {
              //FIXME push data into the database + copy a file into the images-directory.
              //  => should be a SPECIAL REST call that does that.
              image.asURL = aConcours.getCachedImage();
              aConcours.setImageObject(image); //take the image from the cache if successful.
            } else {
              //FIXME Normal update REST call
            }
            var index = _.findIndex(concours, function (b) {
              return b.get('id') === aConcours.get('id');
            });
            concours[index] = aConcours;
            my.$translate('concours_db_successful_update').then(result => {
              my.$mdToast.show(my.$mdToast.simple().textContent(result));
            });
            resolve(self);
          }, 1000);
        });
      });
    };

    let deleteConcours = function (aConcours) {
      return my.$q(function(resolve) {
        loadAllConcours().then(() => {
          my.$timeout(function() { //FIXME 1s simulation of delete
            _.remove(concours, function (b) { //FIXME Normal delete REST call
              return b.get('id') === aConcours.get('id');
            });
            my.$translate('concours_db_successful_delete').then(result => {
              my.$mdToast.show(my.$mdToast.simple().textContent(result));
            });
            resolve(self);
          }, 1000);
        });
      });
    };

    //public API
    self.reset = reset;
    self.getConcoursById = getConcoursById;
    self.createConcours = createConcours;
    self.updateConcours = updateConcours;
    self.deleteConcours = deleteConcours;

    return self;
  }

  angular.module('gecopa.models.concours', [
    'gecopa.common.appState', //Use for translation
    'gecopa.models.meta'
  ])
    .provider('concoursList', function concoursListProvider() {
      this.$get = function concoursListConstructorFactory($http, $q, $translate, meta, $mdToast, $timeout) {
        return concoursListConstructor({}, {$http, $q, $translate, meta, $mdToast, $timeout});
      }
    });

})();

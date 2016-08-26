import angular from 'angular';
import concoursConstructor from './concours.object';
import _ from 'underscore';
import {dump_obj} from '../../utils';

(function(){

  let concoursListConstructor = function($http, $q) {
    let self = {};
    let my = {};
    let URLS = {
      FETCH: 'data/concours.json'
    };
    let concours;

    function extract(result) {
      console.debug('result: ', result);
      return result.data.map(spec => {
        return concoursConstructor(spec, my);
      });
    }

    function cacheConcours(result) {
      concours = extract(result);
      console.debug('concours: ', concours);
      return concours;
    }

    function findConcours(concoursId) {
      return _.find(concours, function (aConcours) {
        return aConcours.getId() === parseInt(concoursId, 10);
      })
    }

    self.loadAllConcours = function () {
      return (concours) ? $q.when(concours) :
        $http.get(URLS.FETCH).then(result => {
          return cacheConcours(result);
        });
    };

    self.getConcoursById = function (concoursId) {
      var deferred = $q.defer();
      if (concours) {
        deferred.resolve(findConcours(concoursId))
      } else {
        self.loadAllConcours().then(function () {
          deferred.resolve(findConcours(concoursId))
        })
      }
      return deferred.promise;
    };

    self.createConcours = function (aConcours) {
      aConcours.setId(concours.length);
      concours.push(aConcours);
    };

    self.updateConcours = function (aConcours) {
      var index = _.findIndex(concours, function (b) {
        return b.getId() === aConcours.getId();
      });
      concours[index] = aConcours;
    };

    self.deleteConcours = function (aConcours) {
      _.remove(concours, function (b) {
        return b.getId() === aConcours.getId();
      });
    };

    return self;
  }

  angular.module('gecopa.models.concours', [])
    .provider('concoursList', function concoursListProvider() {
      this.$get = function concoursListConstructorFactory($http, $q) {
        return concoursListConstructor($http, $q);
      }
    });

})();

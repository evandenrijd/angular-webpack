import angular from 'angular';
import _ from 'underscore';

(function(){

  angular.module('gecopa.common.settings', [])
    .provider('settings', function settingsProvider() {
      this.$get = function settingsConstructorFactory($http, $q, meta, $timeout, $mdToast) {
        "ngInject";
        return settingsConstructor({}, {$http, $q, meta, $timeout, $mdToast});
      }
    })
  ;

  function settingsConstructor(spec, my) {
    let self = {};
    my = my || {};

    //Public API
    self.load = load;
    self.update = update;
    self.getFormlyModel = getFormlyModel;
    self.setFormlyModel = setFormlyModel;
    self.getFormlyFields = getFormlyFields;

    let settings; //array coming from db (contains normally only one row)

    let URLS = {
      FETCH: 'data/settings.json'
    };

    let data = _.extend(spec, my.meta.init({name: 'settings'}));

    function extract(result) {
      return result.data.map(spec => {
        return spec;
      });
    }

    function cache(result) {
      settings = extract(result);
      if (settings) {
        data = _.extend(data, settings[0]);
      }
      return self;
    }

    function load() {
      return my.$q(function(resolve) {
        resolve((settings)?self:my.$http.get(URLS.FETCH).then(result => {
          return cache(result);
        }));
      });
    }

    function update(model) {
      data = _.extend(data, model);
      return my.$q(function(resolve) {
        my.$timeout(function() {
          console.debug('FIXME: save the oracle stuff');
          my.$mdToast.show(my.$mdToast.simple().textContent('Saved settings'));
          resolve(self);
        }, 1000);
      });
    }

    let formly_fields;
    function getFormlyFields(o) {
      if (!formly_fields) {
        formly_fields = my.meta.getFormlyFields(_.extend({
          name: 'settings'
        }, o));
      }
      return formly_fields;
    }

    let formly_model;
    function getFormlyModel(o) {
      formly_model = my.meta.getFormlyModel(_.extend({
        name: 'settings',
        model: data
      }, o));
      return formly_model;
    }

    function setFormlyModel() {
      data = formly_model;
      return self;
    }

    return self;
  }

})();


import angular from 'angular';
import '../defaults.module';
import _ from 'underscore';

(function(){

  let settingsConstructor = function (spec, my) {
    let self = {};
    my = my || {};

    let settings; //array coming from db (contains normally only one row)

    let URLS = {
      FETCH: 'data/settings.json'
    };

    let data = _.extend(spec, {
      languages: ['fr-BE', 'en-BE'],
      language: my.defaultLanguage
    });

    let get = function(prop) {
      return self[prop];
    }

    let set = function(prop, value) {
      if (angular.isObject(prop)) {
        angular.extend(self, prop);
      } else {
        self[prop] = value;
      }
      return self;
    }

    let extract = function(result) {
      return result.data.map(spec => {
        return spec;
      });
    }

    let cache = function(result) {
      settings = extract(result);
      if (settings) {
        data = _.extend(data, settings[0]);
      }
      return self;
    }

    let load = function () {
      return my.$q(function(resolve) {
        resolve((settings)?self:my.$http.get(URLS.FETCH).then(result => {
          return cache(result);
        }));
      });
    }

    let update = function(model) {
      data = _.extend(data, model);
      return my.$q(function(resolve) {
        my.$timeout(function() {
          console.debug('FIXME: save the oracle stuff');
          resolve(self);
        }, 100);
      });
    }

    let formly_fields;
    let getFormlyFields = function(o) {
      if (!formly_fields) {
        formly_fields = my.meta.getFormlyFields(_.extend({
          name: 'settings'
        }, o));
      }
      return formly_fields;
    }

    let formly_model;
    let getFormlyModel = function(o) {
      formly_model = my.meta.getFormlyModel(_.extend({
        name: 'settings',
        model: data
      }, o));
      return formly_model;
    }

    let setFormlyModel = function() {
      data = formly_model;
      return self;
    }

    //Public API
    self.get = get;
    self.set = set;
    self.load = load;
    self.update = update;
    self.getFormlyModel = getFormlyModel;
    self.setFormlyModel = setFormlyModel;
    self.getFormlyFields = getFormlyFields;

    return self;
  }

  angular.module('gecopa.models.settings', [
    'gecopa.common.defaults'
  ])
    .provider('settings', function settingsProvider() {
      this.$get = function settingsConstructorFactory($http, $q, defaultLanguage, meta, $timeout) {
        return settingsConstructor({}, {$http, $q, defaultLanguage, meta, $timeout});
      }
    })
  ;
})();


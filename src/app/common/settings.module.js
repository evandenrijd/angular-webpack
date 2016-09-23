import angular from 'angular';
import _ from 'underscore';
import settingsCtor from '../../common/settings_ctor';

(function(){

  angular.module('gecopa.common.settings', [])

    .factory('gcpSettingsCtorFactory', function(meta, $q) {
      "ngInject";
      let factory = function(spec) {
        return settingsCtor(spec, {meta, promise: function(executor){
          return $q(executor);
        }});
      }
      return factory;
    })

    .service('gcpSettingsDataService', function(meta, $http, $q) {
      "ngInject";
      return settingsClientFactoryCtor({}, {meta, $http, $q});
    })

  ;

  //extend the settingsCtor with formly use for client only.
  function settingsClientCtor(spec, my) {
    let self = settingsCtor(spec, _.extend(my, { promise: function(executor) {
      return my.$q(executor);
    }}));

    //Public API
    self.getFormlyFields = getFormlyFields;
    self.getFormlyModel = getFormlyModel;
    return self;

    let formly_fields;
    function getFormlyFields(o) {
      if (!formly_fields) {
        formly_fields = my.meta.getFormlyFields(_.extend({
          name: 'settings'
        }, o));
      }
      return formly_fields;
    }

    let formly_model; //copy of the spec
    function getFormlyModel(o) {
      formly_model = my.meta.getFormlyModel(_.extend({
        name: 'settings',
        model: spec
      }, o));
      return formly_model;
    }

    function setFormlyModel() {
      spec = formly_model;
      return self;
    }

  }

  //Will create settingCtor objects for the client, remotely.
  function settingsClientFactoryCtor(spec, my) {
    let self = {};
    my = my || {};

    let data = {};

    let URLS = {
      FETCH: 'http://localhost:3000/settings',
      POST: 'http://localhost:3000/settings'
    };

    //Public API
    self.get = get;
    self.set = set;
    self.load = load;
    self.store = store;

    return self;

    function get() {
      return data;
    }

    function set(spec) {
      data = settingsClientCtor(spec, my);
      return self;
    }

    function load() {
      return my.$q(function(resolve) {
        my.$http.get(URLS.FETCH).then(response => {
          data = settingsClientCtor(response.data, my);
          resolve(self);
        });
      });
    }

    function store() {
      return my.$http.post(URLS.POST, data.get());
    }

  }

})();


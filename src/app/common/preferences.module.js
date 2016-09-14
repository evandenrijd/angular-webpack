import angular from 'angular';
import _ from 'underscore';

(function(){

  angular.module('gecopa.common.preferences', [])
    .provider('preferences', function preferencesProvider() {
      this.$get = function preferencesConstructorFactory($q, meta, $timeout, $translate, languagePreferenceFactory) {
        return preferencesConstructor({}, {$q, meta, $timeout, $translate, languagePreferenceFactory});
      }
    })
  ;

  function preferencesConstructor(spec, my) {
    let self = {};
    my = my || {};

    //Public API
    self.update = update;
    self.getFormlyModel = getFormlyModel;
    self.setFormlyModel = setFormlyModel;
    self.getFormlyFields = getFormlyFields;

    let data = _.extend(my.meta.init({name: 'preferences'}), spec);

    function get(attr) {
      return data && data[attr];
    }

    function update(model) {
      return my.$q(function(resolve) {
        my.$timeout(function() {
          let language = get('language');
          if (language !== model.language) {
            my.$translate.use(model.language).then(function(){
              data = _.extend(data, model);
              my.languagePreferenceFactory.setLanguage(model.language);
              resolve(self);
            });
          } else {
            data = _.extend(data, model);
            resolve(self);
          }
        }, 100);
      });
    }

    let formly_fields;
    function getFormlyFields(o) {
      if (!formly_fields) {
        formly_fields = my.meta.getFormlyFields(_.extend({
          name: 'preferences'
        }, o));
      }
      return formly_fields;
    }

    let formly_model;
    function getFormlyModel(o) {
      formly_model = my.meta.getFormlyModel(_.extend({
        name: 'preferences',
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


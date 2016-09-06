import angular from 'angular';
import '../defaults.module';
import _ from 'underscore';

(function(){

  let preferencesConstructor = function(spec, my) {
    let self = {};
    my = my || {};

    let data = _.extend(spec, my.meta.init({name: 'preferences'}));

    let get = function(attr) {
      return data && data[attr];
    }

    let update = function(model) {
      return my.$q(function(resolve) {
        my.$timeout(function() {
          let language = get('language');
          if (language !== model.language) {
            console.debug('Current language: ', my.$translate.use());
            my.$translate.use(model.language).then(function(){
              console.debug('FIXME: set also language into cookie: ', model.language);
              console.debug('New language: ', my.$translate.use());
              data = _.extend(data, model);
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
    let getFormlyFields = function(o) {
      if (!formly_fields) {
        formly_fields = my.meta.getFormlyFields(_.extend({
          name: 'preferences'
        }, o));
      }
      return formly_fields;
    }

    let formly_model;
    let getFormlyModel = function(o) {
      formly_model = my.meta.getFormlyModel(_.extend({
        name: 'preferences',
        model: data
      }, o));
      return formly_model;
    }

    let setFormlyModel = function() {
      data = formly_model;
      return self;
    }

    //Public API
    self.update = update;
    self.getFormlyModel = getFormlyModel;
    self.setFormlyModel = setFormlyModel;
    self.getFormlyFields = getFormlyFields;

    return self;
  }

  angular.module('gecopa.models.preferences', [
    'gecopa.common.defaults'
  ])
    .provider('preferences', function preferencesProvider() {
      this.$get = function preferencesConstructorFactory($q, meta, $timeout, $translate) {
        return preferencesConstructor({}, {$q, meta, $timeout, $translate});
      }
    })
  ;

})();


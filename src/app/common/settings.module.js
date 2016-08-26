import angular from 'angular';
import './defaults.module';

(function(){

  let settingsProvider = function() {
    let self = {};

    let settingsConstructor = function (defaultLanguage) {
      let languages = ['fr-BE', 'en-BE'];

      let self = {
        consoleOut: true,
        debugOn: true,     //See also consoleOut
        popupMessaging: true,
        language: defaultLanguage,
      };

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

      self.get = get;
      self.set = set;

      return self;
    }

    self.$get = function (defaultLanguage) {
      return settingsConstructor(defaultLanguage);
    }

    return self;
  }

  angular.module('gecopa.common.settings', [
    'gecopa.common.defaults'
  ])
    .provider('settings', settingsProvider)
  ;
})();


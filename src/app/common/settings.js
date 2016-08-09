import angular from 'angular';

class Settings  {
  static defaults() {
    return {
      consoleOut: true,
      debugOn: true,     //See also consoleOut
      popupMessaging: true,
    };
  };

  constructor(obj) {
    this.properties = {};
    angular.extend(this.properties, Settings.defaults(), obj);
    return this;
  }

  get(prop) {
    return this.properties[prop];
  }

  set(prop, value) {
    if (angular.isObject(prop)) {
      angular.extend(this.properties, prop);
    } else {
      this.properties[prop] = value;
    }
    return this;
  }
};

angular.module('gecopa.common.settings', [])
  .provider('settings', function SettingsProvider() {
    this.$get = function () {
      return new Settings();
    }
  })
;

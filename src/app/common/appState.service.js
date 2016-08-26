import angular from 'angular';
import 'angular-translate';
import 'angular-translate-loader-static-files';
import {dump_obj} from '../utils';
import './defaults';
import './settings';

(function(){

  let appStateConstructor = function($translate, settings) {
    let self = {};
    let category = null;

    let getCategory = function() {
      return category;
    }

    let setCategory = function(aCategory) {
      category = aCategory;
      return self;
    }

    let getLanguage = function() {
      return settings.get('language');
    }

    let setLanguage = function(lang) {
      if (getLanguage() !== lang) {
        $translate.use(lang);
        settings.set('language', lang);
      }
      return self;
    }

    let toString = function(){
      return '{appState: ' + dump_obj({category}) + '}';
    }

    self.getCategory = getCategory;
    self.setCategory = setCategory;
    self.getLanguage = getLanguage;
    self.setLanguage = setLanguage;
    self.toString = toString;

    return self;
  }

  angular.module('gecopa.common.appState', [
    'gecopa.common.defaults',
    'gecopa.common.settings',
    'pascalprecht.translate',
  ])

    .config(function ($translateProvider, settingsProvider, defaultLanguageProvider) { //setup i18n
      $translateProvider.useStaticFilesLoader({
        prefix: 'data/languages/',
        suffix: '/gecopa.lang.json'
      });
      $translateProvider.preferredLanguage(defaultLanguageProvider.$get());
      $translateProvider.useSanitizeValueStrategy(null); //FIXME: allow for XSS
    })

    .provider('appState', function appStateProvider() {
      let self = {};
      self.$get = function appStateConstructorFactory($translate, settings) {
        return appStateConstructor($translate, settings);
      }
      return self;
    });

})();

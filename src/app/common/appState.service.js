import angular from 'angular';
import 'angular-translate';
import 'angular-translate-loader-static-files';
import {dump_obj} from '../utils';

(function(){

  let languages = ['fr-BE', 'en-BE'];
  let defaultLanguage = 'en-BE';

  let appStateConstructor = function($translate) {
    let self = {};
    let category = null;
    let language = defaultLanguage;

    let getCategory = function() {
      return category;
    }

    let setCategory = function(aCategory) {
      category = aCategory;
      return self;
    }

    let getLanguage = function() {
      return language;
    }

    let setLanguage = function(lang) {
      if (language !== lang) {
        $translate.use(lang);
        language = lang;
      }
      return self;
    }

    let toString = function(){
      return '{appState: ' + dump_obj({category}) + '}';
    }

    let getStateFromSelectedCategory = function() {
      let state = 'gecopa.admin';
      if (category) {
        state += '.' + category.getName();
      }
      return state;
    }

    self.getCategory = getCategory;
    self.setCategory = setCategory;
    self.getLanguage = getLanguage;
    self.setLanguage = setLanguage;
    self.toString = toString;
    self.getStateFromSelectedCategory = getStateFromSelectedCategory;

    return self;
  }

  angular.module('gecopa.common.appState', [
    'pascalprecht.translate',
  ])
    .config(function ($translateProvider) { //setup i18n
      $translateProvider.useStaticFilesLoader({
        prefix: 'data/languages/',
        suffix: '/gecopa.lang.json'
      });
      $translateProvider.preferredLanguage(defaultLanguage);
      $translateProvider.useSanitizeValueStrategy(null); //FIXME: allow for XSS
    })
    .provider('appState', function appStateProvider() {
      this.$get = function appStateConstructorFactory($translate) {
        return appStateConstructor($translate);
      }
    });

})();

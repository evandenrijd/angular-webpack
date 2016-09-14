import $ from "jquery";
import '../assets/css/gecopa.less';

import angular from 'angular';
import ngAnimate from 'angular-animate';
import ngMaterial from 'angular-material';
import uiRouter from 'angular-ui-router';
import ngMessages from 'angular-messages';
import ngFormly from 'angular-formly';
import ngFormlyMaterial from 'angular-formly-material';
import {dump_obj} from './utils';
import './common/preferences.module';
import './common/settings.module';
import 'angular-translate';
import 'angular-translate-loader-static-files';

import './categories/categories.module';

(function () {

  angular.module('gecopa.app', [
    ngAnimate,
    ngMaterial,
    uiRouter,
    ngMessages,
    ngFormly,
    ngFormlyMaterial,
    'gecopa.common.settings',
    'gecopa.common.preferences',
    'categories',
    'gecopa.common.concours',
    'pascalprecht.translate',
  ]).config(function($mdThemingProvider) { //ngMaterial theme
      $mdThemingProvider.theme('default')
        .primaryPalette('indigo');
    })

    .config(function uiRouter($urlRouterProvider, $locationProvider, $stateProvider) { //ui-router
      $stateProvider.state('gecopa', {
        url: '',
        abstract: true
      });
      // $locationProvider.html5Mode(true);

      $urlRouterProvider.when("", "/welcome");
      $urlRouterProvider.when("/", "/welcome");

      // For any unmatched url
      $urlRouterProvider.otherwise('/');
    })

    .run(function uiRouterErrorHandler($rootScope, $state) { //ui-router error handling
      $rootScope.$on('$stateChangeError',
                     (event, toState, toParams,
                      fromState, fromParams, error) => {
                       if (error) {
                         console.debug('$stateChangeError: ',
                                       dump_obj({toState,
                                                 toParams,
                                                 fromState,
                                                 fromParams,
                                                 error}));
                         $state.go('/');
                       }
                     }
                    );
      $rootScope.$on('$stateNotFound',
                     function(event, unfoundState, fromState, fromParams){
                       console.error('$stateNotFound: ',
                                     dump_obj({unfoundState,
                                               fromState,
                                               fromParams}));
                     });
      let date = new Date();
      console.debug('app bootstrapped at ' + date);
    })

    .run(function(formlyConfig) { //Specify custom formly templates
      formlyConfig.setType({
        name: 'inputImageFile',
        template: require('./common/formly/inputImageFile.tmpl.html')
      });
    })

    .value('defaultLanguage', 'en-BE')

    .factory('languagePreferenceFactory', function languagePreferenceFactory($window, defaultLanguage) {
      'use strict';
      let store = $window.localStorage;
      let key = 'gecopa.admin.language';

      return {
        getLanguage: getLanguage,
        setLanguage: setLanguage
      };

      function getLanguage() {
        return store.getItem(key) || defaultLanguage;
      }

      function setLanguage(lang) {
        if (lang) {
          store.setItem(key, lang);
        } else {
          store.removeItem(key);
        }
      }
    })

  //setup i18n
    .config(function ($translateProvider, settingsProvider, languagePreferenceFactoryProvider) {
      $translateProvider.useStaticFilesLoader({
        prefix: 'data/languages/',
        suffix: '/gecopa.lang.json'
      });
      $translateProvider.preferredLanguage(languagePreferenceFactoryProvider.$get().getLanguage());
      $translateProvider.useSanitizeValueStrategy(null); //FIXME: allow for XSS
    })

    .provider('appState', function appState() {
      let self = {};
      self.$get = function appStateConstructorFactory($translate, settings) {
        return appStateConstructor({}, {$translate, settings});
      }
      return self;
    })

    .controller('GecopaController', function gecopaController($mdSidenav, $log, appState) {
      return gecopaConstructor({}, {$mdSidenav, $log, appState});
    })

  ;

  function gecopaConstructor(spec, my) {
    let self = {};
    my = my || {};

    //public API
    self.toggleCategories = toggleCategories;

    //private variables
    let selected = null;

    function toggleCategories() {
      my.$mdSidenav('left').toggle();
    }

    return self;
  }

  function appStateConstructor(spec, my) {
    let self = {};
    let data = spec || {};

    //Public API
    self.get = get;
    self.set = set;
    self.toString = toString;

    function get(attr) {
      return data && data[attr];
    }

    function set(attr, value) {
      data[attr] = value;
      return self;
    }

    function toString(){
      let result = '{';
      Object.keys(data).map(a => {
        result = result + a + ': ' + dump_obj(self.get(a));
      });
      result = result + '}';
      return result;
    }

    return self;
  }

})();

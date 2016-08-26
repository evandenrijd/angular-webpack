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
import routing from './routing';
import './common/settings.module';
import './common/appState.module';

import './categories/categories';

(function () {

  let gecopaConstructor = function($mdSidenav, $log, appState) {
    let self = {};

    //private variables
    let selected = null;

    let toggleCategories = function() {
      $mdSidenav('left').toggle();
    }

    //public API
    self.toggleCategories = toggleCategories;

    return self;
  }

  angular.module('gecopa.app', [
    ngAnimate,
    ngMaterial,
    uiRouter,
    ngMessages,
    ngFormly,
    ngFormlyMaterial,
    'gecopa.common.settings',
    'gecopa.common.appState',
    'categories',
    'gecopa.models.concours',
  ])

    .config(function(settingsProvider){
      //Nothing to initialize
    })

    .config(function(appStateProvider) {
      //Nothing to initialize
    })

    .config(function($mdThemingProvider) { //ngMaterial theme
      $mdThemingProvider.theme('default')
        .primaryPalette('indigo');
    })

    .config(routing) //ui-router

    .run(function($rootScope, $state) { //ui-router error handling
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

    .controller('GecopaController', gecopaConstructor)
  ;

})();

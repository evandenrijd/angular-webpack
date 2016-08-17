import $ from "jquery";
import 'angular-material/angular-material.css';
import '../assets/css/gecopa.css';

import angular from 'angular';
import ngAnimate from 'angular-animate';
import ngMaterial from 'angular-material';
import uiRouter from 'angular-ui-router';
import {dump_obj} from './utils';
import routing from './routing';

import './categories/categories';

(function () {

  angular.module('gecopa', [
    ngAnimate,
    ngMaterial,
    uiRouter,
    'categories',
    'gecopa.models.concours',
  ])
    .config(function($mdThemingProvider) { //ngMaterial theme
      $mdThemingProvider.theme('default')
        .primaryPalette('indigo');
    })
    .controller('GecopaController', GecopaController)
    .run(function($rootScope, $state) {
      $rootScope.$on('$stateChangeError',
                     (event, toState, toParams, fromState, fromParams, error) => {
                       if (error) {
                         console.log('$stateChangeError: ',
                                     dump_obj({toState, toParams, fromState, fromParams, error}));
                         $state.go('/');
                       }
                     }
                    );
      $rootScope.$on('$stateNotFound',
                     function(event, unfoundState, fromState, fromParams){
                       console.debug('$stateNotFound: ',
                                     dump_obj({unfoundState, fromState, fromParams}));
                     });
      let date = new Date();
      console.debug('app bootstrapped at ' + date);
    })
    .service('appState', function appStateProvider($state) {
      let self = {};
      let category = null;

      let getCategory = function() {
        return category;
      }

      let setCategory = function(aCategory) {
        category = aCategory;
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
      self.toString = toString;
      self.getStateFromSelectedCategory = getStateFromSelectedCategory;

      return self;
    })
    .config(routing)
  ;

  function GecopaController($mdSidenav, $log, appState) {
    let self = {};

    //private variables
    let selected = null;

    let toggleCategories = function() {
      $mdSidenav('left').toggle();
    }

    //public API
    self.toggleCategories = toggleCategories;
    self.getStateFromSelectedCategory = appState.getStateFromSelectedCategory;

    return self;
  }

})();

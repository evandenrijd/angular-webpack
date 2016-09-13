import angular from 'angular';

import '../common/category.module';

import './concours/concoursList.module';
import './settings/settings.module';
import './preferences/preferences.module';

(function() {

  let categoriesListControllerConstructor = function(spec, my) {
    let self = {};
    my = my || {}; //shared state (global deps);


    let categories = my.categoryList.getCategories();

    let getCategories = function () {
      return categories;
    }

    let selectCategory = function(category) {
      my.appState.set('category', category);
      my.$state.go(my.appState.get('category').getNgUiRouterState());
    }

    let getSelectedCategory = function() {
      return my.appState.get('category');
    }

    //Public API
    self.getCategories = getCategories;
    self.selectCategory = selectCategory;
    self.getSelectedCategory = getSelectedCategory;

    return self;
  }

  let welcomeControllerConstructor = function(spec, my) {
    let self = {};
    my = my || {}; //shared state (global deps);

    let getFormlyVersion = function() {
      var versionGetter = /formly-js\/angular-formly\/(.*?)\/dist\//;
      var script = document.querySelector('script[src$="formly.js"]');
      var match = script && script.src && versionGetter.exec(script.src);
      return match && match[1];
    };

    let getState = function() {
      return my.appState;
    };

    //public API
    self.getState = getState;
    self.env = {};
    if (angular.version.full) self.env.angularVersion = angular.version.full;
    if (getFormlyVersion()) self.env.formlyVersion = getFormlyVersion();
    if (my.appState.toString()) self.env.appState = my.appState.toString();

    return self;
  }

  angular.module('categories', [
    'categories.concoursList',
    'categories.settings',
    'categories.preferences',
    'gecopa.common.category'
  ])
    .config(function ($stateProvider) {
      $stateProvider

        .state('gecopa.admin', {
          url: '',
          abstract: true,
          views: {
            'categories@': {
              controller: 'CategoriesListController as vm',
              template: require('./categories.tmpl.html')
            },
          }
        })

        .state('gecopa.admin.welcome', {
          url: '/welcome',
          views: {
            'content@': { //absolutely targets the named view in root unnamed state.
                          //<div ui-view='content'/> within index.html
              controller: 'WelcomeController as vm',
              template: require('./welcome.tmpl.html')
            }
          },
        })

      ;
    })
    .controller('CategoriesListController', function ($log, $state, appState, categoryList) {
      return categoriesListControllerConstructor({}, {$log, $state, appState, categoryList});
    })
    .controller('WelcomeController', function($log, appState){
      return welcomeControllerConstructor({}, {$log, appState});
    })
  ;

})();

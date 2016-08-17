import angular from 'angular';
import categoriesListController from './categories.list.controller';
import welcomeController from './welcome.controller';
import './concours/concours';

(function() {

  angular.module('categories', [
    'categories.concours'
  ])
    .config(function ($stateProvider) {
      $stateProvider

        .state('gecopa.admin', {
          url: '',
          abstract: true,
          views: {
            'categories@': {
              controller: 'CategoriesListController as categoriesListController',
              template: require('./categories.tmpl.html')
            },
          }
        })

        .state('gecopa.admin.welcome', {
          url: '/welcome',
          views: {
            'content@': { //absolutely targets the named view in root unnamed state.
                          //<div ui-view='content'/> within index.html
              controller: 'WelcomeController as welcomeController',
              template: require('./welcome.tmpl.html')
            }
          },
        })

      ;
    })
    .controller('CategoriesListController', categoriesListController)
    .controller('WelcomeController', welcomeController)
  ;

})();

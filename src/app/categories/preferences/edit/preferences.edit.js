import angular from 'angular';
import preferencesEditController from './preferences.edit.controller';

(function() {
  angular.module('categories.preferences.edit', [])
    .config(function ($stateProvider) {
      $stateProvider

        .state('gecopa.admin.preferences', {
          url: '/preferences',
          views: {
            'content@': {  //absolutely targets the named view in root unnamed state.
              //<div ui-view='content'/> within index.html
              controller: 'PreferencesEditController as vm',
              template: require('./preferences.edit.tmpl.html')
            }
          }
        })

      ;
    })
    .controller('PreferencesEditController', preferencesEditController)
  ;
})();

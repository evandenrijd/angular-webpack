import angular from 'angular';
import settingsEditController from './settings.edit.controller';

(function() {
  angular.module('categories.settings.edit', [])
    .config(function ($stateProvider) {
      $stateProvider

        .state('gecopa.admin.settings', {
          url: '/settings',
          views: {
            'content@': {  //absolutely targets the named view in root unnamed state.
              //<div ui-view='content'/> within index.html
              controller: 'SettingsEditController as vm',
              template: require('./settings.edit.tmpl.html')
            }
          }
        })

      ;
    })
    .controller('SettingsEditController', settingsEditController)
  ;
})();

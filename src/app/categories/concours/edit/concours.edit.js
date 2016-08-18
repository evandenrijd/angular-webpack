import angular from 'angular';
import ConcoursEditController from './concours.edit.controller';

angular.module('categories.concours.edit', [
  'gecopa.models.concours',
])
  .config(function ($stateProvider) {
    $stateProvider

      .state('gecopa.admin.concours.edit', {
        url: '/:id',
        views: {
          'content@': {  //absolutely targets the named view in root unnamed state.
                         //<div ui-view='content'/> within index.html
            controller: 'ConcoursEditController as concoursEditController',
            template: require('./concours.edit.tmpl.html')
          }
        }
      })

    ;
  })
  .controller('ConcoursEditController', ConcoursEditController);
;

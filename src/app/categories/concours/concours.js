import angular from 'angular';
import './create/concours.create';
import './edit/concours.edit';

import '../../common/models/concours.module';
import concoursListController from './concours.list.controller';

(function() {

  angular.module('categories.concours', [
    'categories.concours.create',
    'categories.concours.edit',
    'gecopa.models.concours',
  ])
    .config(function ($stateProvider) {
      $stateProvider

        .state('gecopa.admin.concours', {
          url: '/concours',
          views: {
            'content@': {  //absolutely targets the named view in root unnamed state.
                           //<div ui-view='content'/> within index.html
              controller: 'ConcoursListController as vm',
              template: require('./concours.tmpl.html')
            }
          }
        })

      ;
    })
    .controller('ConcoursListController', concoursListController);

})();

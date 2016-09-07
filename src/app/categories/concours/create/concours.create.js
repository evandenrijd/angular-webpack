import angular from 'angular';
import concoursCreateController from './concours.create.controller';
import '../../../common/choose_file/choose_image_file';

(function() {
  angular.module('categories.concours.create', [
    'gecopa.models.concours',
    'gecopa.common.chooseImageFile'
  ])
    .config(function ($stateProvider) {
      $stateProvider

        .state('gecopa.admin.concours.create', {
          url: '/new',
          views: {
            'content@': {  //absolutely targets the named view in root unnamed state.
              //<div ui-view='content'/> within index.html
              controller: 'ConcoursCreateController as vm',
              template: require('./concours.create.tmpl.html')
            }
          }
        })

      ;
    })
    .controller('ConcoursCreateController', concoursCreateController)
  ;
})();

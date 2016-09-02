import angular from 'angular';
import ConcoursEditController from './concours.edit.controller';
import '../../../common/choose_file/choose_image_file';

angular.module('categories.concours.edit', [
  'gecopa.models.concours',
  'gecopa.common.chooseImageFile'
])
  .config(function ($stateProvider) {
    $stateProvider

      .state('gecopa.admin.concours.edit', {
        url: '/:id',
        views: {
          'content@': {  //absolutely targets the named view in root unnamed state.
                         //<div ui-view='content'/> within index.html
            controller: 'ConcoursEditController as vm',
            template: require('./concours.edit.tmpl.html')
          }
        }
      })

    ;
  })
  .controller('ConcoursEditController', ConcoursEditController)
;

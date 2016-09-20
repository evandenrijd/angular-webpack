import angular from 'angular';
import '../../../common/choose_file/choose_image_file';
import '../../../common/concours.module';
import {dump_obj} from '../../../utils';

(function() {

  angular.module('categories.concours.edit', [
    'gecopa.common.concours',
    'gecopa.common.chooseImageFile'
  ])
    .config(function ($stateProvider) {
      "ngInject";
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
    .controller('ConcoursEditController', function($log, concoursList, $stateParams) {
      "ngInject";
      return concoursEditControllerConstructor({}, {$log, concoursList, $stateParams});
    })
  ;

  var concoursEditControllerConstructor = function(spec, my) {
    let self = {};
    my = my || {}; //shared state (global deps);
    let concours;

    let excludeKeys = ['id'];

    my.concoursList.getConcoursById(my.$stateParams.id).then(result => {
      concours = result;
      self.fields = concours.getFormlyFields({exclude: excludeKeys});
      self.model = concours.getFormlyModel({exclude: excludeKeys});
    });

    let getConcours = function() {
      return concours;
    }

    let submit = function() {
      concours.setFormlyModel();
      my.concoursList.updateConcours(concours);
    }

    let cancel = function() {
      self.model = concours.getFormlyModel({exclude: excludeKeys});
      return self;
    }

    self.submit = submit;
    self.cancel = cancel;
    self.getConcours = getConcours;

    return self;
  }

})();


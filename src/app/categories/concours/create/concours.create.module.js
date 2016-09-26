import angular from 'angular';
import concoursCtor from '../../../common/concours.ctor';
import '../../../common/choose_file/choose_image_file';
import {dump_obj} from '../../../utils';

(function() {
  angular.module('categories.concours.create', [
    'gecopa.common.concours',
    'gecopa.common.chooseImageFile'
  ])
    .config(function ($stateProvider) {
      "ngInject";
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
    .controller('ConcoursCreateController', function(meta, $translate, concoursList) {
      "ngInject";
      return concoursCreateControllerCtor({}, {meta, $translate, concoursList});
    })
  ;

  function concoursCreateControllerCtor(spec, my) {
    let self = {};
    my = my || {}; //shared state (global deps);
    let concours = concoursCtor(undefined, my);
    //FIXME set creation admin, from gcpAppState

    let excludeKeys = ['id'];

    self.fields = concours.getFormlyFields({exclude: excludeKeys});
    self.model = concours.getFormlyModel({exclude: excludeKeys});

    self.submit = submit;
    self.cancel = cancel;
    self.getConcours = getConcours;

    return self;

    function getConcours() {
      return concours;
    }

    function submit() {
      concours.setFormlyModel();
      my.concoursList.createConcours(concours);
    }

    function cancel() {
      self.model = concours.getFormlyModel({exclude: excludeKeys});
      return self;
    }

  }

})();

import angular from 'angular';
import './create/concours.create.module';
import './edit/concours.edit.module';

import '../../common/concours.module';

(function() {

  angular.module('categories.concoursList', [
    'categories.concours.create',
    'categories.concours.edit',
    'gecopa.common.concours',
  ])
    .config(function ($stateProvider) {
      "ngInject";
      $stateProvider

        .state('gecopa.admin.concours', {
          url: '/concours',
          views: {
            'content@': {  //absolutely targets the named view in root unnamed state.
              //<div ui-view='content'/> within index.html
              controller: 'ConcoursListController as vm',
              template: require('./concoursList.tmpl.html')
            }
          }
        })

      ;
    })

    .controller('ConcoursListController', function($log, concoursList, meta, $state) {
      "ngInject";
      return concoursListControllerConstructor({}, {$log, concoursList, meta, $state})
    })
  ;

  function concoursListControllerConstructor(spec, my) {
    let self = {};
    my = my || {}; //shared state (global deps);

    let concours = [];
    my.concoursList.reset({}).then(result => {
      concours = result;
    });

    //public API
    self.getConcoursList = getConcoursList;
    self.getAttributeLabelId = getAttributeLabelId;
    self.remove = remove;

    return self;

    function getAttributeLabelId(attr) {
      return my.meta.getAttributeLabelId({name: 'concours', attr: attr});
    }

    function getConcoursList() {
      return concours;
    }

    function remove(query) {
      my.concoursList.deleteConcours(query.id);
    }
  };

})();

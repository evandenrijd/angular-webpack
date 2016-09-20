import angular from 'angular';
import './create/concours.create.module';
import './edit/concours.edit.module';

import '../../common/concours.module';

(function() {

  let concoursListControllerConstructor = function (spec, my) {
    let self = {};
    my = my || {}; //shared state (global deps);
    let concours = [];

    my.concoursList.reset({}).then(result => {
      concours = result;
    });

    let getAttributeLabelId = function(attr) {
      return my.meta.getAttributeLabelId({name: 'concours', attr: attr});
    }

    let getConcoursList = function() {
      return concours;
    }

    let remove = function(query) {
      my.concoursList.deleteConcours(query.id);
    }

    //public API
    self.getConcoursList = getConcoursList;
    self.getAttributeLabelId = getAttributeLabelId;
    self.remove = remove;

    return self;
  };

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

})();

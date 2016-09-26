import angular from 'angular';
import '../../../common/preferences.module';
import {dump_obj} from '../../../utils';

(function() {

  angular.module('categories.preferences.edit', [])
    .config(function ($stateProvider) {
      "ngInject";
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

    .controller('PreferencesEditController', function ($log, preferences, $stateParams, $timeout, $window, $state) {
      "ngInject";
      return preferencesEditControllerCtor({}, {$log, preferences, $stateParams, $timeout, $window, $state});
    })
  ;

  function preferencesEditControllerCtor(spec, my) {
    let self = {};
    my = my || {};

    const layout = _layout();
    my.$timeout(function() {
      self.fields = my.preferences.getFormlyFields({layout: layout});
      self.model = my.preferences.getFormlyModel();
    }, 0);

    self.apply = apply;
    return self;

    function _layout() {
      return [
        {
          className: 'layout-row',
          fieldGroup: [
            { className: 'flex-20', key: 'language' }
          ]
        },
      ];
    }

    function apply() {
      my.preferences.update(self.model).then(() => {
        my.$window.location.reload(); //To make the select input also change
                                      //language
      });
    }

    function init() {
      self.model = my.preferences.getFormlyModel();
      return self;
    }

  };

})();

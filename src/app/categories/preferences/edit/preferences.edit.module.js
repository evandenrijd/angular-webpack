import angular from 'angular';
import '../../../common/preferences.module';
import {dump_obj} from '../../../utils';

(function() {

  let preferencesEditControllerConstructor = function(spec, my) {
    let self = {};
    my = my || {};
    let preferences;

    let layout = [
      {
        className: 'layout-row',
        fieldGroup: [
          { className: 'flex-20', key: 'language' }
        ]
      },
    ];

    my.$timeout(function() {
      preferences = my.preferences
      self.fields = preferences.getFormlyFields({layout: layout});
      self.model = preferences.getFormlyModel();
    }, 0);

    let apply = function() {
      preferences.update(self.model);
    }

    let init = function() {
      self.model = preferences.getFormlyModel();
      return self;
    }

    self.apply = apply;
    self.cancel = init;

    return self;
  };

  angular.module('categories.preferences.edit', [])
    .config(function ($stateProvider) {
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

    .controller('PreferencesEditController', function preferencesEditControllerFactory($log, preferences, $stateParams, $timeout) {
      return preferencesEditControllerConstructor({}, {$log, preferences, $stateParams, $timeout});
    })
  ;
})();

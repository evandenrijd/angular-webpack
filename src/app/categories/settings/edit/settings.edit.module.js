import angular from 'angular';
import '../../../common/settings.module';
import {dump_obj} from '../../../utils';

(function() {

  let settingsEditControllerConstructor = function(spec, my) {
    let self = {};
    my = my || {};
    let settings;

    let layout = [
      {
        className: 'layout-row',
        fieldGroup: [
          { className: 'flex-33', key: 'admins' },
        ]
      },
    ];

    my.settings.load().then(function(result) {
      settings = result;
      self.fields = settings.getFormlyFields({layout: layout});
      self.model = settings.getFormlyModel();
    });

    let submit = function() {
      settings.update(self.model);
    }

    let init = function() {
      self.model = settings.getFormlyModel();
      return self;
    }

    self.submit = submit;
    self.cancel = init;

    return self;
  };

  angular.module('categories.settings.edit', [])
    .config(function ($stateProvider) {
      "ngInject";
      $stateProvider

        .state('gecopa.admin.settings', {
          url: '/settings',
          views: {
            'content@': {  //absolutely targets the named view in root unnamed state.
              //<div ui-view='content'/> within index.html
              controller: 'SettingsEditController as vm',
              template: require('./settings.edit.tmpl.html')
            }
          }
        })

      ;
    })

    .controller('SettingsEditController', function settingsEditControllerFactory($log, settings, $stateParams) {
      "ngInject";
      return settingsEditControllerConstructor({}, {$log, settings, $stateParams});
    })

  ;
})();

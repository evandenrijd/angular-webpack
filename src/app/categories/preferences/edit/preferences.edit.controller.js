import angular from 'angular';
import '../../../common/models/preferences.module';
import {dump_obj} from '../../../utils';

export default function preferencesEditControllerConstructor(spec, my) {
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

export default function PreferencesEditController($log, preferences, $stateParams, $timeout) {
  return preferencesEditControllerConstructor({}, {$log, preferences, $stateParams, $timeout});
};

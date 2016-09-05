import angular from 'angular';
import '../../../common/models/settings.module';
import {dump_obj} from '../../../utils';

export default function settingsEditControllerConstructor(spec, my) {
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
    {
      className: 'layout-row',
      fieldGroup: [
        { className: 'flex-20', key: 'language' }
      ]
    }
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

export default function SettingsEditController($log, settings, $stateParams) {
  return settingsEditControllerConstructor({}, {$log, settings, $stateParams});
};

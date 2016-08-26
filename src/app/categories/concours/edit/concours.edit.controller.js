import angular from 'angular';
import '../../../common/models/concours.module';
import {dump_obj} from '../../../utils';

export default function ConcoursEditController($log, concoursList, $stateParams) {
  let self = {};
  let my = {}; //shared state (global deps);
  let concours = null;

  let getConcours = function() {
    return concours;
  }

  let submit = function() {
    concours.setState(self.model);
  }

  let init = function() {
    self.model = concours.getFormlyModel();
    return self;
  }

  self.submit = submit;
  self.cancel = init;
  self.getConcours = getConcours;

  concoursList.getConcoursById($stateParams.id).then(result => {
    concours = result;
    self.fields = concours.getFormlyFields();
    self.originalFields = angular.copy(self.fields);
    init();
  });

  return self;
};

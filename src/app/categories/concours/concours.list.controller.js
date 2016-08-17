import concoursConstructor from '../../common/models/concours.object';

export default function ConcoursListController($log, concoursService) {
  let self = {};
  let my = {}; //shared state (global deps);
  let concours = [];

  concoursService.loadAllConcours().then(result => {
    concours = result;
  });

  let getConcours = function() {
    return concours;
  }

  self.getConcours = getConcours;

  return self;
};

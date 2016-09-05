export default function concoursListController($log, concoursList, meta) {
  let self = {};
  let my = {}; //shared state (global deps);
  let concours = [];

  concoursList.loadAllConcours().then(result => {
    concours = result;
  });

  let getAttributeLabelId = function(attr) {
    return meta.getAttributeLabelId({name: 'concours', attr: attr});
  }

  let getConcours = function() {
    return concours;
  }

  //public API
  self.getConcours = getConcours;
  self.getAttributeLabelId = getAttributeLabelId;

  return self;
};

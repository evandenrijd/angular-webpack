export default function ConcoursListController($log, concoursList) {
  let self = {};
  let my = {}; //shared state (global deps);
  let concours = [];

  concoursList.loadAllConcours().then(result => {
    concours = result;
  });

  let getConcours = function() {
    return concours;
  }

  self.getConcours = getConcours;

  return self;
};

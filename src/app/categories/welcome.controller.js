export default function welcomeController($log, appState){
  let self = {};
  let getState = function() {
    return appState;
  };
  self.getState = getState;
  return self;
}

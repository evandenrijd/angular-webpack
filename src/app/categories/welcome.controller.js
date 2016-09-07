import angular from 'angular';

let welcomeControllerContructor = function(spec, my){
  let self = {};

  let getFormlyVersion = function() {
    var versionGetter = /formly-js\/angular-formly\/(.*?)\/dist\//;
    var script = document.querySelector('script[src$="formly.js"]');
    var match = script && script.src && versionGetter.exec(script.src);
    return match && match[1];
  }

  self.env = {
    angularVersion: angular.version.full,
    formlyVersion: getFormlyVersion(),
    appState: my.appState.toString()
  };

  let getState = function() {
    return my.appState;
  };

  //public API
  self.getState = getState;
  return self;
}

export default function welcomeController($log, appState){
  return welcomeControllerContructor({}, {$log, appState});
}

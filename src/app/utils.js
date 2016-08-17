export function dump_obj(obj, level) {
  var is_array = function (value) {
    return value &&
      typeof value === 'object' &&
      typeof value.length === 'number' &&
      typeof value.splice === 'function' &&
      !(value.propertyIsEnumerable('length'));
  }
  var simple_dump = function(obj) {
    if (typeof obj === 'string')
      return '\'' + obj + '\'';
    else if (typeof obj === 'number')
      return obj;
    else if (obj === null &&
             typeof obj === 'object')
      return 'null';
    else if (typeof obj === 'undefined')
      return 'undefined';
    else if (typeof obj === 'function')
      return 'function';
    else
      return '';
  };
  var result = '';
  level = level || 0;
  var pad = '';
  var indent = '  ';
  for (var j=0;j<level;j++) {
    pad += indent;
  }
  if (obj && typeof obj === 'object') {
    if (obj.hasOwnProperty('toString')) {
      result += obj.toString();
    } else {
      result += pad + (is_array(obj)?'[\n':'{\n');
      var items = Object.keys(obj).length;
      for (var item in obj) {
        items--;
        if (!obj.hasOwnProperty(item)) continue;
        var value = obj[item];
        if(typeof value === 'object') {
          result += pad + indent + item + ':\n' +
            dump_obj(value, level+1);
          if (items) result += ',';
          result += '\n';
        } else if (typeof value !== 'function') {
          result += pad + indent + item + ': ' +
            simple_dump(value);
          if (items) result += ',';
          result += '\n';
        }
      }
      result += pad + (is_array(obj)?']':'}');
    }
  } else {
    result = simple_dump(obj);
  }
  return result;
}

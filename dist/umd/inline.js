;(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof exports === 'object') {
    module.exports = factory();
  } else {
    root.Inline = factory();
  }
}(this, function() {
'use strict';

var Inline = function () {
  return 'foo';
}();
var rtn = Inline;
return Inline;
}));

'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = datetime;

var _dayjs = require('dayjs');

var _dayjs2 = _interopRequireDefault(_dayjs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function datetime(value) {
  var type = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'datetime';

  var format = '';

  if (!value) {
    return '';
  }

  if (type === 'date') {
    format = 'YYYY-MM-DD';
  } else if (type === 'time') {
    format = 'HH:mm:ss';
  } else {
    format = 'YYYY-MM-DD HH:mm:ss';
  }
  return (0, _dayjs2.default)(value).format(format);
}
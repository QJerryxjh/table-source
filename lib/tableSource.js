'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _index = require('./filters/index');

var _index2 = _interopRequireDefault(_index);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var TableSource = function () {
  function TableSource() {
    var userConfig = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, TableSource);

    this.dataSource = {
      content: [],
      pageable: {},
      sort: {}
    };
    this._resSource = {};
    this.loading = false;
    this.pagination = {
      showSizeChanger: true,
      pageSize: 10,
      current: 1,
      total: 0
    };
    this.config = {
      api: null,
      params: {},
      generateIndex: true,
      formatCreateAt: true,
      onUpdateData: function onUpdateData(record) {
        return record;
      },
      success: function success(records) {
        return records;
      },
      resFilter: function resFilter(records) {
        return records;
      }
    };

    Object.assign(this.config, userConfig);
    Object.assign(this.pagination, userConfig.pagination);
    this.onTableChange = this.onTableChange.bind(this);
  }

  _createClass(TableSource, [{
    key: 'loadData',
    value: function () {
      var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
        var res;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                this.loading = true;

                _context.prev = 1;
                _context.next = 4;
                return this.config.api(_extends({}, this.config.params, {
                  size: this.pagination.pageSize,
                  page: this.pagination.current - 1
                }));

              case 4:
                res = _context.sent;


                this._resSource = JSON.parse(JSON.stringify(res));

                res = this.config.resFilter(res);

                this.dataSource = _extends({}, res, {
                  content: res.content.map(this.config.onUpdateData)
                });

                this.pagination.total = res.totalElements;

                if (this.config.generateIndex) {
                  this.generateIndex();
                }

                if (this.config.formatCreateAt) {
                  this.formatCreateAt();
                }

                this.config.success(res);

              case 12:
                _context.prev = 12;

                this.loading = false;
                return _context.finish(12);

              case 15:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this, [[1,, 12, 15]]);
      }));

      function loadData() {
        return _ref.apply(this, arguments);
      }

      return loadData;
    }()
  }, {
    key: 'onTableChange',
    value: function onTableChange(pagination) {
      Object.assign(this.pagination, pagination);

      this.loadData();
    }
  }, {
    key: 'formatCreateAt',
    value: function formatCreateAt() {
      this.dataSource.content.forEach(function (value) {
        value._createAt = _index2.default.datetime(value.createAt);
      });
      return this;
    }
  }, {
    key: 'setParams',
    value: function setParams(params) {
      Object.assign(this.config.params, params);
    }
  }, {
    key: 'generateIndex',
    value: function generateIndex() {
      var fixedIndex = this.pagination.pageSize * (this.pagination.current - 1) + 1;

      this.dataSource.content.forEach(function (value, index) {
        value._index = index + fixedIndex;
      });
      return this;
    }
  }, {
    key: 'content',
    get: function get() {
      return this.dataSource.content;
    }
  }, {
    key: 'resSource',
    get: function get() {
      return this._resSource;
    }
  }]);

  return TableSource;
}();

exports.default = TableSource;
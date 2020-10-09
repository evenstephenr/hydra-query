var react = require('react');

function _extends() {
  _extends = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };

  return _extends.apply(this, arguments);
}

// A type of promise-like that resolves synchronously and supports only one observer

const _iteratorSymbol = /*#__PURE__*/ typeof Symbol !== "undefined" ? (Symbol.iterator || (Symbol.iterator = Symbol("Symbol.iterator"))) : "@@iterator";

const _asyncIteratorSymbol = /*#__PURE__*/ typeof Symbol !== "undefined" ? (Symbol.asyncIterator || (Symbol.asyncIterator = Symbol("Symbol.asyncIterator"))) : "@@asyncIterator";

// Asynchronously call a function and send errors to recovery continuation
function _catch(body, recover) {
	try {
		var result = body();
	} catch(e) {
		return recover(e);
	}
	if (result && result.then) {
		return result.then(void 0, recover);
	}
	return result;
}

var URLformat = function URLformat(_ref) {
  var query = _ref.query;
  return "?" + Object.keys(query).map(function (key) {
    return key + "=" + query[key];
  });
};

var mergeRequestOptions = function mergeRequestOptions(defaultOptions, customOptions) {
  if (customOptions === void 0) {
    customOptions = {};
  }

  var defaultKeys = Object.keys(defaultOptions);
  var customKeys = Object.keys(customOptions);
  var sharedKeys = defaultKeys.concat(customKeys.filter(function (k) {
    return !defaultKeys.includes(k);
  }));
  return sharedKeys.reduce(function (acc, key) {
    var _extends3;

    var defaultValue = defaultOptions[key];
    var customValue = customOptions[key];

    if (typeof defaultValue === "object" && typeof customValue === "object") {
      var _extends2;

      return _extends({}, acc, (_extends2 = {}, _extends2[key] = _extends({}, defaultValue, customValue), _extends2));
    }

    return _extends({}, acc, (_extends3 = {}, _extends3[key] = customValue || defaultValue, _extends3));
  }, {});
};

var setDefaultOptions = function setDefaultOptions() {
  return {
    method: "GET",
    headers: {
      "Content-Type": "application/json"
    },
    mode: "cors",
    cache: "no-cache"
  };
};

var request = function request(url, options) {
  var defaultOptions = setDefaultOptions();
  var opts = mergeRequestOptions(defaultOptions, options);
  return fetch(url, opts);
};

(function (ACTION) {
  ACTION["RESET"] = "reset";
  ACTION["REFRESH"] = "refresh";
  ACTION["SUCCESS"] = "success";
  ACTION["ERROR"] = "error";
})(exports.ACTION || (exports.ACTION = {}));

function useQueryReducer(state, action) {
  switch (action.type) {
    case exports.ACTION.RESET:
      {
        return {
          isLoading: false,
          url: state.url,
          params: state.params
        };
      }

    case exports.ACTION.REFRESH:
      {
        var actionUrl = action.url,
            _action$params = action.params,
            params = _action$params === void 0 ? {} : _action$params;
        return _extends({}, state, {
          url: actionUrl,
          params: params,
          isLoading: true
        });
      }

    case exports.ACTION.SUCCESS:
      {
        var data = action.data;
        return _extends({}, state, {
          data: data,
          isLoading: false
        });
      }

    case exports.ACTION.ERROR:
      {
        var error = action.error,
            errorCode = action.errorCode;
        return _extends({}, state, {
          error: error,
          errorCode: errorCode,
          isLoading: false
        });
      }

    default:
      return state;
  }
}
function useQuery(_ref2) {
  var endpoint = _ref2.endpoint,
      withCache = _ref2.withCache,
      params = _ref2.params,
      _ref2$requestUtil = _ref2.requestUtil,
      requestUtil = _ref2$requestUtil === void 0 ? request : _ref2$requestUtil;
  var reducer = useQueryReducer;

  var _useReducer = react.useReducer(reducer, {
    isLoading: false,
    params: params || {},
    url: endpoint + URLformat({
      query: _extends({}, params || {})
    })
  }),
      state = _useReducer[0],
      dispatch = _useReducer[1];

  var urlState = state.url,
      paramsState = state.params,
      isLoading = state.isLoading,
      data = state.data,
      error = state.error,
      errorCode = state.errorCode;
  var fetch = react.useCallback(function (config) {
    if (config === void 0) {
      config = {};
    }

    try {
      var _config, _config2;

      var mountData = function mountData(d) {
        if (withCache) {
          window.localStorage.setItem(withCache, JSON.stringify(d));
        }

        dispatch({
          type: exports.ACTION.SUCCESS,
          data: d
        });
      };

      var queryParams = _extends({}, params, (_config = config) === null || _config === void 0 ? void 0 : _config.params);

      var requestUrl = (((_config2 = config) === null || _config2 === void 0 ? void 0 : _config2.forcedEndpoint) || endpoint) + URLformat({
        query: _extends({}, queryParams)
      });
      var defaultErrorMessage = "Sorry, we are unable to retrieve this data for you right now. Please try again later.";
      return Promise.resolve(_catch(function () {
        var _config3;

        dispatch({
          type: exports.ACTION.REFRESH,
          url: requestUrl,
          params: params
        });
        return Promise.resolve(requestUtil(requestUrl, (_config3 = config) === null || _config3 === void 0 ? void 0 : _config3.options)).then(function (response) {
          var _exit = false;

          function _temp4(_result2) {
            return _exit ? _result2 : Promise.resolve(response.json()["catch"](function () {
              try {
                return Promise.resolve(function () {
                  var _config4;

                  if ((_config4 = config) === null || _config4 === void 0 ? void 0 : _config4.onResponse) {
                    return Promise.resolve(config.onResponse(payload)).then(function (_ref3) {
                      var responseData = _ref3.data;
                      mountData(responseData || {});
                    });
                  }
                }());
              } catch (e) {
                return Promise.reject(e);
              }
            })).then(function (payload) {
              var _exit2 = false;

              function _temp2(_result3) {
                if (_exit2) return _result3;
                mountData(payload);
              }

              var _temp = function () {
                var _config5;

                if ((_config5 = config) === null || _config5 === void 0 ? void 0 : _config5.onResponse) {
                  return Promise.resolve(config.onResponse(payload)).then(function (_ref4) {
                    var responseData = _ref4.data;
                    mountData(responseData);
                    _exit2 = true;
                  });
                }
              }();

              return _temp && _temp.then ? _temp.then(_temp2) : _temp2(_temp);
            });
          }

          var _temp3 = function () {
            if (!response.ok) {
              return Promise.resolve(response.json()).then(function (_ref5) {
                var error = _ref5.error;
                dispatch({
                  type: exports.ACTION.ERROR,
                  error: error || defaultErrorMessage,
                  errorCode: response.status
                });
                _exit = true;
              });
            }
          }();

          return _temp3 && _temp3.then ? _temp3.then(_temp4) : _temp4(_temp3);
        });
      }, function (e) {
        var _e$message = e.message,
            message = _e$message === void 0 ? defaultErrorMessage : _e$message;
        dispatch({
          type: exports.ACTION.ERROR,
          error: message,
          errorCode: 500
        });
      }));
    } catch (e) {
      return Promise.reject(e);
    }
  }, [params, endpoint, withCache, requestUtil]);
  var cachedData;

  if (withCache) {
    var cache = window.localStorage.getItem(withCache);
    if (cache) cachedData = JSON.parse(cache);
  }

  return {
    isLoading: isLoading,
    endpoint: endpoint,
    params: paramsState,
    url: urlState,
    fetch: fetch,
    data: cachedData || data,
    error: error,
    errorCode: errorCode,
    dispatch: dispatch
  };
}

exports.useQuery = useQuery;
exports.useQueryReducer = useQueryReducer;
//# sourceMappingURL=index.js.map

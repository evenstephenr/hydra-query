import { useReducer, useCallback } from 'react';

const URLformat = ({
  query
}) => {
  return `?${Object.keys(query).map(key => `${key}=${query[key]}`)}`;
};

const mergeRequestOptions = (defaultOptions, customOptions = {}) => {
  const defaultKeys = Object.keys(defaultOptions);
  const customKeys = Object.keys(customOptions);
  const sharedKeys = defaultKeys.concat(customKeys.filter(k => !defaultKeys.includes(k)));
  return sharedKeys.reduce((acc, key) => {
    const defaultValue = defaultOptions[key];
    const customValue = customOptions[key];

    if (typeof defaultValue === "object" && typeof customValue === "object") {
      return { ...acc,
        [key]: { ...defaultValue,
          ...customValue
        }
      };
    }

    return { ...acc,
      [key]: customValue || defaultValue
    };
  }, {});
};

const setDefaultOptions = () => ({
  method: "GET",
  headers: {
    "Content-Type": "application/json"
  },
  mode: "cors",
  cache: "no-cache"
});

const request = (url, options) => {
  const defaultOptions = setDefaultOptions();
  const opts = mergeRequestOptions(defaultOptions, options);
  return fetch(url, opts);
};

var ACTION;

(function (ACTION) {
  ACTION["RESET"] = "reset";
  ACTION["REFRESH"] = "refresh";
  ACTION["SUCCESS"] = "success";
  ACTION["ERROR"] = "error";
})(ACTION || (ACTION = {}));

function useQueryReducer(state, action) {
  switch (action.type) {
    case ACTION.RESET:
      {
        return {
          isLoading: false,
          url: state.url,
          params: state.params
        };
      }

    case ACTION.REFRESH:
      {
        const {
          url: actionUrl,
          params = {}
        } = action;
        return { ...state,
          url: actionUrl,
          params,
          isLoading: true
        };
      }

    case ACTION.SUCCESS:
      {
        const {
          data
        } = action;
        return { ...state,
          data,
          isLoading: false
        };
      }

    case ACTION.ERROR:
      {
        const {
          error,
          errorCode
        } = action;
        return { ...state,
          error,
          errorCode,
          isLoading: false
        };
      }

    default:
      return state;
  }
}
function useQuery({
  endpoint,
  withCache,
  params,
  requestUtil = request
}) {
  const reducer = useQueryReducer;
  const [state, dispatch] = useReducer(reducer, {
    isLoading: false,
    params: params || {},
    url: endpoint + URLformat({
      query: { ...(params || {})
      }
    })
  });
  const {
    url: urlState,
    params: paramsState,
    isLoading,
    data,
    error,
    errorCode
  } = state;
  const fetch = useCallback(async (config = {}) => {
    const queryParams = { ...params,
      ...(config === null || config === void 0 ? void 0 : config.params)
    };
    const requestUrl = ((config === null || config === void 0 ? void 0 : config.forcedEndpoint) || endpoint) + URLformat({
      query: { ...queryParams
      }
    });
    const defaultErrorMessage = "Sorry, we are unable to retrieve this data for you right now. Please try again later.";

    function mountData(d) {
      if (withCache) {
        window.localStorage.setItem(withCache, JSON.stringify(d));
      }

      dispatch({
        type: ACTION.SUCCESS,
        data: d
      });
    }

    try {
      dispatch({
        type: ACTION.REFRESH,
        url: requestUrl,
        params
      });
      const response = await requestUtil(requestUrl, config === null || config === void 0 ? void 0 : config.options);

      if (!response.ok) {
        const {
          error
        } = await response.json();
        dispatch({
          type: ACTION.ERROR,
          error: error || defaultErrorMessage,
          errorCode: response.status
        });
        return;
      }

      const payload = await response.json().catch(async () => {
        if (config === null || config === void 0 ? void 0 : config.onResponse) {
          const {
            data: responseData
          } = await config.onResponse(payload);
          mountData(responseData || {});
          return;
        }
      });

      if (config === null || config === void 0 ? void 0 : config.onResponse) {
        const {
          data: responseData
        } = await config.onResponse(payload);
        mountData(responseData);
        return;
      }

      mountData(payload);
    } catch (e) {
      const {
        message = defaultErrorMessage
      } = e;
      dispatch({
        type: ACTION.ERROR,
        error: message,
        errorCode: 500
      });
    }
  }, [params, endpoint, withCache, requestUtil]);
  let cachedData;

  if (withCache) {
    const cache = window.localStorage.getItem(withCache);
    if (cache) cachedData = JSON.parse(cache);
  }

  return {
    isLoading,
    endpoint,
    params: paramsState,
    url: urlState,
    fetch,
    data: cachedData || data,
    error,
    errorCode,
    dispatch
  };
}

export { ACTION, useQuery, useQueryReducer };
//# sourceMappingURL=index.modern.js.map

import {createAction} from 'redux-act'
import _defaults from 'lodash.defaultsdeep';

export const ASYNC_META = {
  REQUEST: "REQUEST",
  OK: "OK",
  ERROR: "ERROR",
  RESET: "RESET"
}

const defaultOption = {
  noRethrow: false,
  request:{
    metaReducer: (meta) => {
      return ASYNC_META.REQUEST
    }
  },
  ok:{
    metaReducer: () => {
      return ASYNC_META.OK
    }
  },
  error:{
    metaReducer: () => {
      return ASYNC_META.ERROR
    }
  }
}

export default function createActionAsync(description, api, options = defaultOption) {

  _defaults(options, defaultOption);

  let actions = {
    request: createAction(`${description}_${ASYNC_META.REQUEST}`, options.request.payloadReducer, options.request.metaReducer),
    ok: createAction(`${description}_${ASYNC_META.OK}`, options.ok.payloadReducer, options.ok.metaReducer),
    error: createAction(`${description}_${ASYNC_META.ERROR}`, options.error.payloadReducer, options.error.metaReducer),
    reset: createAction(`${description}_${ASYNC_META.RESET}`)
  }

  let actionAsync = (...args) => {
    return (dispatch, getState) => {
      dispatch(actions.request(...args));
      if(options.request.callback) options.request.callback(dispatch, getState, ...args);
      return api(...args, dispatch, getState)
      .then(response => {
        const out = {
            request: args,
            response: response
        }

        dispatch(actions.ok(out))
        if(options.ok.callback) options.ok.callback(dispatch, getState, response, ...args);
        return out;
      })
      .catch(error => {
        const errorOut = {
            actionAsync,
            request: args,
            error: error
        }
        dispatch(actions.error(errorOut))
        if(options.error.callback) options.error.callback(dispatch, getState, errorOut, ...args);
        if(!options.noRethrow) throw errorOut;
      })
    }
  }

  Object.assign(actionAsync, actions);
  actionAsync.options = options;
  return actionAsync;
}

import {createAction} from 'redux-act'

export default function createActionAsync(description, api, options = {}) {

  let actions = {
    request: createAction(`${description}_REQUEST`),
    ok: createAction(`${description}_OK`, options.payloadReducer, options.metaReducer),
    error: createAction(`${description}_ERROR`, options.payloadReducer, options.metaReducer)
  }

  let actionAsync = (...args) => {
    return (dispatch) => {
      dispatch(actions.request());
      return api(...args)
      .then(res => {
        dispatch(actions.ok(res))
      })
      .catch(err => {
        dispatch(actions.error(err))
        if(options.rethrow) throw err;
      })
    }
  }

  actionAsync.request = actions.request;
  actionAsync.ok = actions.ok;
  actionAsync.error = actions.error;
  return actionAsync;

};

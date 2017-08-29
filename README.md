# redux-act-async

Create async actions and reducers based on [redux-act](https://github.com/pauldijou/redux-act)

## Install

```bash
npm install redux-act-async --save
```

## Badges

[![Build Status](https://travis-ci.org/FredericHeem/redux-act-async.svg?branch=master)](https://travis-ci.org/FredericHeem/redux-act-async)

[![codecov](https://codecov.io/gh/FredericHeem/redux-act-async/branch/master/graph/badge.svg)](https://codecov.io/gh/FredericHeem/redux-act-async)

[![npm version](https://badge.fury.io/js/redux-act-async.svg)](https://badge.fury.io/js/redux-act-async)
## Usage

```js

import thunk from 'redux-thunk'
import {createStore, applyMiddleware} from 'redux';
import {createActionAsync, createReducerAsync} from 'redux-act-async';

// The async api to call, must be a function that returns a promise
let user = {id: 8};
function apiOk(){
  return Promise.resolve(user);
}

// createActionAsync will create 4 synchronous action creators:
// login.request, login.ok, login.error and login.reset
const login = createActionAsync('LOGIN', apiOk);

/*
createReducerAsync takes an async action created by createActionAsync.
It reduces the following state given the four actions:  request, ok, error and reset.
const defaultsState = {
    loading: false,
    request: null,
    data: null,
    error: null
};

if you need to overwrite the defaultsState just insert your initialState as a second paramenter in the createReducerAsync function. Just like that:

const initialState = {
    loading: false,
    request: null,
    data: {custom: "intitial data"},
    error: null
};

const reducer = createReducerAsync(login, initialState)

*/
const reducer = createReducerAsync(login)

const store = createStore(reducer, applyMiddleware(thunk));

await store.dispatch(login({username:'lolo', password: 'password'}));

```

## Legacy redux

In a nutshell, the following code:

```js
const options = {noRethrow: false};
const loginAction = createActionAsync('LOGIN', api, options);
const loginReducer = createReducerAsync(loginAction)
```

is equivalent to:

```js
const LOGIN_REQUEST = 'LOGIN_REQUEST'
const LOGIN_OK = 'LOGIN_OK'
const LOGIN_ERROR = 'LOGIN_ERROR'
const LOGIN_RESET = 'LOGIN_RESET'

const loginRequest = (value) => ({
  type: LOGIN_REQUEST,
  payload: value
})

const loginOk = (value) => ({
  type: LOGIN_OK,
  payload: value
})

const loginError = (value) => ({
  type: LOGIN_ERROR,
  payload: value
})

const loginReset = (value) => ({
  type: LOGIN_RESET,
  payload: value
})

const options = {noRethrow: true};

export const login = (...args) => {
  return (dispatch, getState) => {
    dispatch(loginRequest(...args));
    return api(...args, dispatch, getState)
    .then(response => {
      const out = {
          request: args,
          response: response
      }

      dispatch(loginOk(out))
      return out;
    })
    .catch(error => {
      const errorOut = {
          actionAsync,
          request: args,
          error: error
      }
      dispatch(loginError(errorOut))
      if(!options.noRethrow) throw errorOut;
    })
  }
}

const defaultsState = {
    loading: false,
    request: null,
    data: null,
    error: null
};

const reducer = createReducer({
    [actionAsync.request]: (state, payload) => ({
        ...state,
        request: payload,
        loading: true,
        data: null,
        error: null
    }),
    [actionAsync.ok]: (state, payload) => ({
        ...state,
        loading: false,
        data: payload.response
    }),
    [actionAsync.error]: (state, payload) => ({
        ...state,
        loading: false,
        error: payload.error
    }),
    [actionAsync.reset]: () => (defaultsState)
} , defaultsState);


```

That's 3 lines against 78 lines, a good way to reduce boilerplate code.

## Async Action Options

Here are all the options to configure an asynchronous action:

```javascript
const actionOptions = {
  noRethrow: false,
  request:{
    callback: (dispatch, getState, ...args) => {
    },
    payloadReducer: (payload) => {
      return payload
    },
    metaReducer: (meta) => {
      return ASYNC_META.REQUEST
    }
  },
  ok:{
    callback: (dispatch, getState, ...args) => {
    },
    payloadReducer: (payload) => {
      return payload
    },
    metaReducer: () => {
      return ASYNC_META.OK
    }
  },
  error:{
    callback: (dispatch, getState, ...args) => {
    },
    payloadReducer: (payload) => {
      return payload
    },
    metaReducer: () => {
      return ASYNC_META.ERROR
    }
  }
}

const loginAction = createActionAsync('LOGIN', api, actionOptions);

```
## Who is using this library ?

This library has been extracted originally from [starhack.it](https://github.com/FredericHeem/starhackit), a React/Node Full Stack Starter Kit.

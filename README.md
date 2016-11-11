# redux-act-async

Create async actions based on [redux-act](https://github.com/pauldijou/redux-act)

## Install

```bash
npm install redux-act-async --save
```

## Badges

[![Build Status](https://travis-ci.org/FredericHeem/redux-act-async.svg?branch=master)](https://travis-ci.org/FredericHeem/redux-act-async)

## Usage

```js

import thunk from 'redux-thunk'
import {createStore, applyMiddleware} from 'redux';
import thunkMiddleware from 'redux-thunk';
import {createReducer} from 'redux-act';
import {createActionAsync} from 'redux-act-async';

// The async api to call, must be a function that return a promise
let user = {id: 8};
function apiOk(){
  return Promise.resolve(user);
}

// createActionAsync will create 4 synchronous action creators: login.request, login.ok, login.error and login.reset
const login = createActionAsync('LOGIN', apiOk);

const initialState = {
  authenticated: false,
};

let reducer = createReducer({
    [login.request]: (state, payload) => ({
        ...state,
        request: payload,
        loading: true,
        error: null
    }),
    [login.ok]: (state, payload) => ({
        ...state,
        loading: false,
        data: payload.response
    }),
    [login.error]: (state, payload) => ({
        ...state,
        loading: false,
        error: payload.error
    }),
    [actionAsync.reset]: () => (defaultsState)
}, initialState);

const store = createStore(reducer, applyMiddleware(thunk));

let run = login({username:'lolo', password: 'password'});

await store.dispatch(run);

```

## Legacy redux

In a nutshell, the following code:

```js
const options = {rethrow: true};
const login = createActionAsync('LOGIN', api, options);
```

is equivalent to:

```js
const LOGIN_REQUEST = 'LOGIN_REQUEST'
const LOGIN_OK = 'LOGIN_OK'
const LOGIN_ERROR = 'LOGIN_ERROR'

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

      dispatch(loginError(out))
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
```

## Who is using this library ?

This library has been extracted originally from [starhack.it](https://github.com/FredericHeem/starhackit), a React/Node Full Stack Starter Kit.

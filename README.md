# redux-act-async

Create async actions based on [react-act](https://github.com/pauldijou/redux-act)

## Install

```bash
npm install redux-act-async --save
```

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

// createActionAsync will create 3 synchronous action creators: login.request, login.ok and login.error
const login = createActionAsync('LOGIN', apiOk);

const initialState = {
  authenticated: false,
};

let reducer = createReducer({
  [login.request]: (state, payload) => {
    console.log('login.request ', payload);
  },
  [login.ok]: (state, payload) => {
    console.log('login.ok ', payload);
  },
  [login.error]: (state, payload) => {
    console.log('login.error ', payload);
  }
}, initialState);


const store = createStore(reducer, applyMiddleware(thunk));

let run = login({username:'lolo', password: 'password'});

store.dispatch(run);

```

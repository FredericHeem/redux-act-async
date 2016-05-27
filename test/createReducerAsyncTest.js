import chai, {assert} from 'chai';
import spies from 'chai-spies';
import thunk from 'redux-thunk'
import {createStore, applyMiddleware} from 'redux';
import thunkMiddleware from 'redux-thunk';
import {createReducer} from 'redux-act';
import {createActionAsync} from '../src/index';
import {createReducerAsync} from '../src/index';

const expect = chai.expect;
chai.use(spies);

describe('createReducerAsync', function () {

  it('run the action, ok', function () {
    let actionName = 'LOGIN_2';
    let user = {id: 8};
    function apiOk(){
      console.log('apiOk');
      return Promise.resolve(user);
    }
    const login = createActionAsync(actionName, apiOk);

    let reducer = createReducerAsync(login)

    const store = createStore(reducer, applyMiddleware(thunk));
    //console.log(store.getState())
    let run = login({username:'lolo', password: 'password'});

    store.dispatch(run);
    //console.log(store.getState())
  });
  it('run the action, ko', function () {
    let actionName = 'LOGIN_3';
    let error = {name: 'myError'};
    function apiError(){
      return Promise.reject(error);
    }
    const login = createActionAsync(actionName, apiError);

    const initialState = {
      loading: false,
      authenticated: false,
    };

    let reducer = createReducerAsync(login, initialState)

    const store = createStore(reducer, applyMiddleware(thunk));

    let run = login({username:'lolo', password: 'password'});

    store.dispatch(run);
  });
});

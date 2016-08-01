import _ from 'lodash';
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

  it('run the action, ok', async () => {
    const actionName = 'LOGIN_2';
    const user = {id: 8};
    function apiOk(){
      //console.log('apiOk');
      return Promise.resolve(user);
    }
    const login = createActionAsync(actionName, apiOk);

    let reducer = createReducerAsync(login)

    const store = createStore(reducer, applyMiddleware(thunk));
    //console.log(store.getState())
    const params = {username:'lolo', password: 'password'};
    let run = login(params);

    await store.dispatch(run);
    //console.log(store.getState())
    assert(_.isEqual(store.getState().request, params))
    assert.isFalse(store.getState().loading)

  });
  it('run the action, ko', async () => {
    const actionName = 'LOGIN_3';
    const error = {name: 'myError'};
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

    const params = {username:'lolo', password: 'password'};
    let run = login(params);

    await store.dispatch(run);
    //console.log("state: ", store.getState());
    assert(_.isEqual(store.getState().request, params))
    assert.equal(store.getState().error, error)
    assert.isFalse(store.getState().loading)
  });
});

import _ from 'lodash';
import chai, {assert} from 'chai';
import spies from 'chai-spies';
import thunk from 'redux-thunk'
import {createStore, applyMiddleware} from 'redux';
import thunkMiddleware from 'redux-thunk';
import {createReducer} from 'redux-act';
import {createActionAsync, ASYNC_META} from '../src/index';
import {createReducerAsync} from '../src/index';

const expect = chai.expect;
chai.use(spies);

describe('createActionAsync', function () {
  const actionName = 'LOGIN';
  const param = {username:'lolo', password: 'password'};

  it('should support all format', function () {
    let actionName = 'LOGIN_1';
    const login = createActionAsync(actionName, () => Promise.resolve());
    expect(login).to.be.a('function');
    expect(login.request).to.be.a('function');
    expect(login.ok).to.be.a('function');
    expect(login.error).to.be.a('function');
  });

  it('run the action, ok', async () => {
    let actionName = 'LOGIN_2';
    let error = {name: 'myError'};

    function apiOk(username, password){
      return Promise.resolve({user_id:1});
    }
    const login = createActionAsync(actionName, apiOk);
    let run = login(param);
    let metas = [];
    function dispatch(action){
      metas.push(action.meta);
    }
    await run(dispatch);
    assert.deepEqual(metas, [ASYNC_META.REQUEST, ASYNC_META.OK]);
  });
  it('run the action, ko', async () => {
    let actionName = 'LOGIN_3';
    let error = {name: 'myError'};
    function apiError(){
      return Promise.reject(error);
    }
    const login = createActionAsync(actionName, apiError);
    let run = login(param);
    let metas = [];
    function dispatch(action){
      metas.push(action.meta);
    }
    await run(dispatch);
    assert.deepEqual(metas, [ASYNC_META.REQUEST, ASYNC_META.ERROR]);
  });

  it('run the action, but do not rethrow error', function() {

    let actionName = 'LOGIN_4';
    let error = {name: 'myError'};
    function apiError(){
      return Promise.reject(error);
    }
    const login = createActionAsync(actionName, apiError, {rethrow: false});
    let run = login({username:'lolo', password: 'password'});
    function dispatch(action){
    }

    return run(dispatch).catch(function(error){
      assert(false, 'when throwing is turned off, should not hit this path');
    });
  });

  it('run the action, throw error explicitely', function() {

    let actionName = 'LOGIN_5';
    let error = {name: 'myError'};
    function apiError(){
      return Promise.reject(error);
    }
    const login = createActionAsync(actionName, apiError, {rethrow: true});
    let run = login(param);
    function dispatch(action){
      //console.log('dispatch action:', action);
    }

    return run(dispatch).catch(function(error) {
      //console.log('dispatch error:', error);
      assert(_.isFunction(error.api), "error.api should be a function");
      expect(error.request[0]).to.be.equal(param);
      expect(error.error.name).to.be.equal('myError');
    });
  });

  it('run the action with multiple parameters', async () => {
    let actionName = 'LOGIN_6';
    let user = {id: 8};
    function apiOk(username, password){
      assert.equal(username, 'ciccio');
      assert.equal(password, 'password');
      return Promise.resolve(user);
    }
    const login = createActionAsync(actionName, apiOk);
    const reducer = createReducerAsync(login);
    const store = createStore(reducer, applyMiddleware(thunk));

    let run = login('ciccio', 'password');

    await store.dispatch(run);
    //console.log('store ', store.getState())
  });

  it('run the action with dispatch and getState-function as parameter', async () => {
    let actionName = 'LOGIN_8';
    let user = {id: 8};
    function apiOk(username, password, dispatch, getState) {
      assert.equal(username, 'ciccio');
      assert.equal(password, 'password');
      expect(dispatch).to.be.a('function');
      expect(getState).to.be.a('function');
      return Promise.resolve(user);
    }
    const login = createActionAsync(actionName, apiOk);
    const reducer = createReducerAsync(login);
    const store = createStore(reducer, applyMiddleware(thunk));
    let run = login('ciccio', 'password');

    await store.dispatch(run);

  });

  it('payloadReducer and metaReducer in options', function () {
    let actionName = 'LOGIN_7';
    let loginUser = {
      username: 'ciccio',
      password: 'password'
    };
    let user = {id: 8};
    function apiOk(username, password){
      return Promise.resolve(user);
    }

    const options = {
      request:{
        payloadReducer: (username, password) => {
          //console.log('request payloadReducer ', username, password)
          assert.equal(username, loginUser.username);
          assert.equal(password, loginUser.password);
          return {username, password}
        },
        metaReducer: (meta) => {
          //console.log('request metaReducer ', meta)
          return meta
        }
      },
      ok:{
        payloadReducer: (payload, username, password) => {
          //console.log('ok payloadReducer ', payload)
          assert.equal(username, loginUser.username);
          assert.equal(password, loginUser.password);
          return payload
        },
        metaReducer: (meta) => {
          //console.log('ok metaReducer ', meta)
          return meta
        }
      },
      error:{
        payloadReducer: (payload, username, password) => {
          //console.log('error payloadReducer ', payload)
          assert.equal(username, loginUser.username);
          assert.equal(password, loginUser.password);
          return payload
        },
        metaReducer: (meta) => {
          //console.log('error metaReducer ', meta)
          return meta
        }
      }
    }

    const login = createActionAsync(actionName, apiOk, options);
    const reducer = createReducerAsync(login);
    const store = createStore(reducer, applyMiddleware(thunk));

    let run = login(loginUser.username, loginUser.password);

    store.dispatch(run);
  });
  it('simple use case with reducer and store', async () => {
    let actionName = 'LOGIN_2';
    let user = {id: 8};
    function apiOk(){
      return Promise.resolve(user);
    }
    const login = createActionAsync(actionName, apiOk);
    const initialState = {
      authenticated: false,
    };

    let reducer = createReducer({
      [login.request]: (state, payload) => {
        //console.log('login.request ', payload);
      },
      [login.ok]: (state, payload) => {
        //console.log('login.ok ', payload.request);
        //console.log('login.ok ', payload.response);
      },
      [login.error]: (state, payload) => {
        //console.log('login.error ', payload);
      }
    }, initialState);


    const store = createStore(reducer, applyMiddleware(thunk));


    let run = login(param);

    await store.dispatch(run);

  });
  it('multiple tabs', async () => {
    let actionName = 'TAB';
    let user = {id: 8};
    function apiOk(){
      return Promise.resolve(user);
    }
    const tabActionAsync = createActionAsync(actionName, apiOk);

    const initialState = {
      data: new Map(),
      loading: new Map()
    };

    function reducer(state = initialState, action) {
      switch (action.type) {
        case tabActionAsync.request.getType():{
          //console.log('tab.request ', action);
          return {
            ...state,
            request: action.payload
          }
        }
        case tabActionAsync.ok.getType():{
          //console.log('tab.ok ', action);
          return {
            ...state,
            data: action.payload.response
          }
        }
        default:
          return state
      }
    }

    const store = createStore(reducer, applyMiddleware(thunk));
    await store.dispatch(tabActionAsync('tab1'));
    //console.log("state ", store.getState());
  });
});

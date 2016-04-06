import _ from 'lodash';
import Immutable from 'immutable'
import {createReducer} from 'redux-act';

const _defaultsState = {
    loading: false,
    data: []
};

export default function createReducerAsync(actionAsync, defaultState = _defaultsState) {
    return createReducer({
        [actionAsync.request]: () => Immutable.fromJS(_.defaults({
            loading: true
        }, defaultState)),
        [actionAsync.ok]: (state, payload) => Immutable.fromJS(_.defaults({
            data: payload
        }, defaultState)),
        [actionAsync.error]: (state, payload) => Immutable.fromJS(_.defaults({
            error: payload
        }, defaultState)),
    }, Immutable.fromJS(defaultState));
}

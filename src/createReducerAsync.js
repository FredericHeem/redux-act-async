import _ from 'lodash';
import {createReducer} from 'redux-act';

const defaultsState = {
    loading: false,
    data: []
};

export default function createReducerAsync(actionAsync) {
    return createReducer({
        [actionAsync.request]: () => ({
            loading: true,
            error: null
        }),
        [actionAsync.ok]: (state, payload) => ({
            loading: false,
            data: payload
        }),
        [actionAsync.error]: (state, payload) => ({
            loading: false,
            error: payload
        }),
    }, defaultsState);
}

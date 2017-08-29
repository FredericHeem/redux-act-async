import {createReducer} from 'redux-act';

const defaultsState = {
    loading: false,
    request: null,
    data: null,
    error: null
};

export default function createReducerAsync(actionAsync, defaultState = defaultsState) {
    return createReducer({
        [actionAsync.request]: (state, payload) => ({
            ...state,
            request: payload,
            loading: true,
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
        [actionAsync.reset]: () => (defaultState)
    }, defaultState);
}

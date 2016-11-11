import {createReducer} from 'redux-act';

const defaultsState = {
    loading: false,
    data: []
};

export default function createReducerAsync(actionAsync) {
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
        [actionAsync.reset]: () => (defaultsState)
    }, defaultsState);
}

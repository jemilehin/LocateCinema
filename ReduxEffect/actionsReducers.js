import { CHANGE_LANAGUGAGE } from "./actionTypes"

const initialState = {
    user: {},
    token: null,
    language: 'EN'
}

export const reducers = (state = initialState,action) => {
    switch (action.type) {
        case 'LOGIN_USER':
            return {...state, user: action.payload.user, 
                token: action.payload.token}
        case 'LOG_OUT_USER':
            return {...state, token: null}
        case CHANGE_LANAGUGAGE:
            return {...state, language: action.payload.language}
        default:
            return state
    }
}
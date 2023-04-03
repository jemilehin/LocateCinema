import { LOG_OUT_USER } from "./actionTypes"


export const LOGINUSER = (data) => {
    return ({user: data.payload.user, token: data.payload.token})
}

export const LOGOUTUSER = {type:LOG_OUT_USER}

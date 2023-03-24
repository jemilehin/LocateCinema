

export const LOGINUSER = (data) => {
    return ({user: data.payload.user, token: data.payload.token})
}

export const LOGOUTUSER = () => {
    return ({token: null, data: {}})
}

export const CHANGE_LANAGUGAGE = (data) => ({action: 'CHANGE_LANAGUGAGE', payload: {language: data}})

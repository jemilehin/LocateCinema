import axios from 'axios';
import {LOCALURL} from '@env'
import store from '../ReduxEffect/store';

const apiInstance = axios.create({
  baseURL: LOCALURL, timeout: 3000,
});

apiInstance.interceptors.request.use( (config) => {
    const access_token = store.getState().reducers.token
    config.headers.Authorization = access_token ? `bearer ${access_token}` : null;
    return config
})

export default apiInstance;
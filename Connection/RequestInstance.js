import api from "./movieBaseInstance";
import apiInstance from "./mainInstance";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { callback } from "./ResponseCallbacks/OkAndErrCalback";
import axios from "axios";
import { LOGIN_USER } from "../ReduxEffect/actionTypes";

export const AppRequestCall =  (endpoint,request,callback,errcallback,dispatch,type) => {

    apiInstance[type](endpoint,type === 'get' ? null : request)
    .then(response => response.data)
    .then(async (data) => {
        if(endpoint === 'login'){
            await AsyncStorage.multiSet([['token', data.access_token],['user', JSON.stringify(data.user)]])
            dispatch({type: LOGIN_USER, payload:{user: data.user, token: data.access_token}})
            callback(data)
        }else{
            callback(data)
        }
    })
    .catch(err => errcallback(err))
}

export const MoviegluRequestCall = (CallType,endpoint,setData,property,setStatus) => {
    switch (CallType) {
        case 'single':
            api.get(endpoint)
            .then(response => response)
            .then(data => {
                if(setStatus !== null)setStatus(false)
                callback(data,setData,data.status,property)
            })
            .catch(err => {
                if(setStatus !== null)setStatus(false)
                console.log(err.response)})
            break;
        case 'multiple':
            axios.all(endpoint.map(url => api.get(url)))
            .then(
                axios.spread((...data) =>{
                    for (let i = 0; i < property.length; i++){
                        if(property[i] !== 'null'){
                            if(data[i]['data'][property[i]] !== undefined){
                                setData[i](data[i]['data'][property[i]])
                            }
                        }else {
                            setData[i](data[i]['data'])}
                    }

                    if(setStatus !== null){setStatus(false)}
                }
                )
                
            )
            .catch(err => 
                {
                    if(setStatus !== null)setStatus(false)
                    console.log(`error: ${JSON.stringify(err.message)}}`)}
                )
            break;
        default:
            break;
    }
}
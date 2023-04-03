import api from "./movieBaseInstance";
import apiInstance from "./mainInstance";
import { callback } from "./ResponseCallbacks/OkAndErrCalback";
import axios from "axios";
import { LOGIN_USER } from "../ReduxEffect/actionTypes";

export const AppRequestCall = (endpoint,request,callback,errcallback,dispatch,type) => {

    apiInstance[type](endpoint,type === 'get' ? null : request)
    .then(response => response.data)
    .then(data => {
        if(endpoint === 'login'){
            dispatch({type: LOGIN_USER, payload:{user: data.user, token: data.access_token}})
            callback(data)
        }else{
            callback(data)
        }
    })
    .catch(err => errcallback(err))
}

export const MoviegluRequestCall = (CallType,endpoint,setData,property) => {
    switch (CallType) {
        case 'single':
            api.get(endpoint)
            .then(response => response)
            .then(data => callback(data,setData,data.status,property))
            .catch(err => console.log(err.response))
            break;
        case 'multiple':
            axios.all(endpoint.map(url => api.get(url)))
            .then(
                axios.spread((...data) =>{
                    for (let i = 0; i <= property.length; i++){
                        if(data[i]['data'][property[i]] !== undefined){
                            setData[i](data[i]['data'][property[i]])
                        }
                    }
                }
                )
                
            )
            .catch(err => 
                console.log(`error: ${JSON.stringify(err.message)}}`)
                )
            break;
        default:
            break;
    }
}
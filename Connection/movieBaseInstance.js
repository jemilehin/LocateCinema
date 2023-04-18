import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from "moment/moment";
import { BASEURL, CLIENT, X_API_KEY,AUTHOURIZATION,API_VERSION } from '../config';

let deviceTime = moment().format('yyyy-MM-DDThh:mm:ss.SSSZ')
const URL = BASEURL

const instance = axios.create({
  baseURL: URL, timeout: 1000
});

instance.interceptors.request.use(async config => {
  const location = await AsyncStorage.getItem('geolocation')
  const territory = await AsyncStorage.getItem('country_short')
  let parseLocation = JSON.parse(location)
  config.headers = {
      'client':CLIENT,
      'x-api-key': X_API_KEY,
      'authorization':AUTHOURIZATION,
      'territory': JSON.stringify(territory),
      'geolocation':  parseLocation.coords.latitude+';'+parseLocation.coords.longitude,
      // 'client':'HOLA_0',
      // 'x-api-key':	'snnjkqWVwr45JwJXqtFuo7yOKUtzgin43Fv7Xyo9',
      // 'authorization':	'Basic SE9MQV8wX1hYOjVYWGRvTVMxR1RlWg==',
      // territory:	'XX',
      // geolocation:	-22.0+';'+14.0,
      'api-version':API_VERSION,
      'device-datetime':deviceTime,
  }
  return config
})

export default instance;
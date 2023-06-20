import {useState,useEffect} from 'react'
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LOGIN_USER } from './ReduxEffect/actionTypes';
import * as Location from 'expo-location';
import { I18n } from "i18n-js";
import HomeScreen from './Screens/HomeScreen';
import WelcomeScreen from './Screens/WelcomeScreen';
import DisplayCinemaShowingMovie from './Screens/CinemaShowingMovie';
import LoginScreen from './Screens/LoginScreen';
import RegisterScreen from './Screens/RegisterScreen';
import { Provider, useDispatch, useSelector } from 'react-redux';
import store from './ReduxEffect/store';
import { Alert, Linking, Settings } from 'react-native';
import CinemaDirection from './Screens/CinemaDirection';
import CinemaShowtimes from './Screens/CinemaShowTimes';
import SettingsScreen from './Screens/Settings';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import EditAccountScreen from './Screens/EditAccountScreen';
import ChangePasswordScreen from './Screens/ChangePassword';
import ForgotPasswordScreen from './Screens/ForgetPassword';
import SelectLanguageScreen from './Screens/SelectLanguage';

import { de, en, fr, es, ind } from './assets/Localization/languages';

const Stack = createNativeStackNavigator()
const Tab = createBottomTabNavigator();

const TabScreen = () => {
  const currentLanguage = useSelector((state) => state.reducers.language)
  const [language, setLanguage] = useState(currentLanguage)
  const i18n = new I18n({ ...en, ...de, ...fr, ...es, ...ind })
  i18n.defaultLocale = language
  i18n.locale = language

  useEffect(() =>{
    setLanguage(currentLanguage)
  },[currentLanguage])
  return(
    <Tab.Navigator initialRouteName='home' 
      screenOptions={{
        tabBarActiveTintColor: '#e91e63',
        headerShown:false,
      }}
    >
      <Tab.Screen name='home' component={HomeScreen}
      options={{
        tabBarLabel: i18n.t('Home'),
        tabBarIcon: ({ color, size }) => (
          <MaterialCommunityIcons name="home" color={color} size={size} />
        ),
      }}
      />
      <Tab.Screen name='settings' component={SettingsScreen}
      options={{
        tabBarLabel: i18n.t('More'),
        tabBarIcon: ({ color, size }) => (
          <MaterialCommunityIcons name="apps" color={color} size={size} />
        ),
      }}
      />
    </Tab.Navigator>
  )
}

function StackComponent(){
  const isToken = useSelector((state) => state.reducers.token)
  const dispatch = useDispatch()

  const IsTokenInLocalStorage = async () => {
    const token = await AsyncStorage.getItem('token')
    const user = await AsyncStorage.getItem('user')
    try {
      if(token !== null) {
        dispatch({type: LOGIN_USER, payload:{user: JSON.parse(user), token: token}})
      }
    } catch(e) {
      // error reading value
    }
  }

  useEffect(() => {
    IsTokenInLocalStorage()
  },[])

  return(
    <NavigationContainer>
      {isToken !== null ? 
      
      <Stack.Navigator
        initialRouteName='landingscreen'
        screenOptions={{headerShown:false, statusBarColor: 'grey'}}
      >
        <Stack.Screen name='landingscreen' component={TabScreen} />
        <Stack.Screen name='cinemashowingmovie' component={DisplayCinemaShowingMovie} />
        <Stack.Screen name='cinemadirection' component={CinemaDirection} />
        <Stack.Screen name='cinemashowtimes' component={CinemaShowtimes} />
        <Stack.Screen name='edit_account' component={EditAccountScreen} />
        <Stack.Screen name='select_language' component={SelectLanguageScreen} />

      </Stack.Navigator> 

      : 
      
      <Stack.Navigator 
        screenOptions={{headerShown:false, statusBarColor: 'grey'}}
      >
        <Stack.Screen name='welcome' component={WelcomeScreen}
          
        />
        <Stack.Screen
          name='register'
          component={RegisterScreen} 
        />
        <Stack.Screen
          name='login'
          component={LoginScreen} 
        />
        <Stack.Screen name='forgot_password' component={ForgotPasswordScreen} />
        <Stack.Screen name='change_password' component={ChangePasswordScreen} />
      </Stack.Navigator>
      }
    </NavigationContainer>
  )
}

export default function App() {
  const [location, setLocation] = useState(null);
  const [foreground, requestForeground] = Location.useForegroundPermissions();

  const getLocationPermission = async() => {
    requestForeground().then(p => !p.granted && Linking.openSettings())
    requestLocationPermision()
  }

  const requestLocationPermision = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync()
      if (status !== 'granted') {
        Alert.alert(
          //title
          'Hello',
          //body
          "Permission to access location was denied?",
          
          // [
          //   { text: 'Yes', onPress: () => getLocationPermission() },
          //   {
          //     text: 'No',
          //     onPress: () => console.log('No Pressed'),
          //     style: 'cancel',
          //   },
          // ],
          { cancelable: false }
          //clicking out side of alert will not cancel
        );
      }

          let location = await Location.getCurrentPositionAsync({});
          setLocation(location);
      // }
  }

  // const checkLocationStatusIsEnabled = async () => {
  //   let locationStatus = await Location.hasServicesEnabledAsync()
  //   if(!locationStatus){
  //     requestLocationPermision()
  //   }else{
  //     getLocationPermission()
  //   }
  // }

  useEffect(() => {
    requestLocationPermision()
  }, []);

  // METHOD TO STORE GEOLOCATION OF DEVICE AFTER PERMISSION IS GRANTED
  const storeLocation = async() => {
    let geolocation = await AsyncStorage.getItem('geolocation');
    if(geolocation == null && location !== null){

      await AsyncStorage.setItem('geolocation',JSON.stringify(location))
    }
  }
  useEffect(()=>{
    storeLocation()
  },[location])

  return (
    <Provider store={store}>
      <StackComponent />
    </Provider>
  )
}



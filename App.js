import {useState,useEffect} from 'react'
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import * as Location from 'expo-location';
import HomeScreen from './Screens/HomeScreen';
import WelcomeScreen from './Screens/WelcomeScreen';
import DisplayCinemaShowingMovie from './Screens/CinemaShowingMovie';
import LoginScreen from './Screens/LoginScreen';
import RegisterScreen from './Screens/RegisterScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Provider, useSelector } from 'react-redux';
import store from './ReduxEffect/store';
import { Alert, Linking } from 'react-native';
import CinemaDirection from './Screens/CinemaDirection';
import CinemaShowtimes from './Screens/CinemaShowTimes';

const Stack = createNativeStackNavigator()
const Tab = createBottomTabNavigator();

const TabScreen = () => {
  return(
    <Tab.Navigator initialRouteName='home' 
      screenOptions={{
        tabBarActiveTintColor: '#e91e63',
        headerShown:false,
      }}
    >
      <Tab.Screen name='home' component={HomeScreen}
      options={{
        tabBarLabel: 'Home',
        // tabBarIcon: ({ color, size }) => (
        //   <MaterialCommunityIcons name="home" color={color} size={size} />
        // ),
      }}
      />
    </Tab.Navigator>
  )
}

function StackComponent(){
  const isToken = useSelector((state) => state.reducers.token)

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
      </Stack.Navigator>
      }
    </NavigationContainer>
  )
}

export default function App() {
  const [location, setLocation] = useState(null);
  const [foreground, requestForeground] = Location.useForegroundPermissions();

  const getLocationPermission = async() => {
    // let {status} = await Location.requestForegroundPermissionsAsync()
    // console.log(status)
    // if(status === 'denied'){
    //   await Location.requestForegroundPermissionsAsync()
    // }

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
          "You won't be able to get movies available from the cloud.\
          Give permission to get accesss to movies showing in cinema around you.\
          would you like to give permission?",
          
          [
            { text: 'Yes', onPress: () => getLocationPermission() },
            {
              text: 'No',
              onPress: () => console.log('No Pressed'),
              style: 'cancel',
            },
          ],
          { cancelable: false }
          //clicking out side of alert will not cancel
        );
      }else{
        try{
          let location = await Location.getCurrentPositionAsync({});
          setLocation(location);
        }catch(e){
          console.log('Error while trying to get location: ', e);
        }
      }
  }

  const checkLocationStatusIsEnabled = async () => {
    let locationStatus = await Location.hasServicesEnabledAsync()
    if(!locationStatus){
      requestLocationPermision()
    }else{
      getLocationPermission()
    }
  }

  useEffect(() => {
    checkLocationStatusIsEnabled()
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



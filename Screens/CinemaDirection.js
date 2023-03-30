import React, { useEffect, useRef, useState } from 'react'
import { View } from 'react-native';
import tw from 'twrnc'
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GOOGLE_MAPS_APIKEY } from '../config';



const CinemaDirection = ({ navigation, route }) => {


    const [location, setLocation] = useState()
    const [cinema] = useState(route.params.cinema)

    const getLocation = async () => {
        let location = await AsyncStorage.getItem('geolocation')
        setLocation(JSON.parse(location))
    }

    useEffect(() => {
        getLocation();
    }, [])

    return (
        <View style={tw`flex-1`}>
            {location !== undefined ? <MapView
            style={[tw`border flex-1`]}
                region={{
                    latitude: location.coords?.latitude, longitude: location.coords?.longitude,
                    latitudeDelta: 0.2, longitudeDelta: 0.1
                }}
                showsUserLocation={true}
                provider={PROVIDER_GOOGLE}
                mapType='standard'
            >
                <MapViewDirections
                    origin={{latitude: location.coords?.latitude, longitude: location.coords?.longitude}}
                    destination={{latitude: cinema.lat, longitude: cinema.lng}}
                    apikey={GOOGLE_MAPS_APIKEY}
                />
            </MapView> : null}
        </View>
    )
}

export default CinemaDirection
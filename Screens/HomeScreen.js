import React, { useEffect, useRef, useState } from 'react'
import tw from 'twrnc'
import { I18n } from "i18n-js";
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { View, ScrollView, TextInput,Keyboard, Dimensions, RefreshControl } from "react-native";
import FlexRow from "../Component/Layout/FlexRow";
import { RequestCall } from "../Connection/RequestInstance";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import CardImage from "../Component/ImageViewComponent/CardImage";
import SearchInput from "../Component/SearchComponent/SearchInput";
import Container from "../Component/Container"
import ListItem from "../Component/SearchComponent/ListSearchItem";
import TextView from "../Component/TextView"
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LoginRegisterRequest } from "../Connection/RequestInstance";
import { useSelector } from 'react-redux';

import {de, en,fr,es,ind} from '../assets/Localization/languages';

const HomeScreen = ({route,navigation}) => {
    const [refreshing, setRefreshing] = useState(false);
    const [search, setSearch] = useState('');
    const [searchResult, setSearchResult] = useState([])
    const [cinemasClosest, setCinemasClosest] = useState([])
    const [comingSoon,setComingSoon] = useState([])
    const [offsetX,setOffsetX] = useState()
    const [page,setPage] = useState(0)
    const [currentWidth,setCurrentWidth] = useState(0)
    const [loading,setLoading] = useState(false)
    const [location,setLocation] = useState()
    const user = useSelector((state) => state.reducers.user)
    const selectLanguageFromRedux = useSelector((state) => state.reducers.language)

    const [language, setLanguage] = useState(selectLanguageFromRedux)
    const i18n = new I18n({...en, ...de, ...fr,...es,...ind})
    i18n.defaultLocale = language
    i18n.locale = language

    let scrollRef= useRef(null)
    let {width} = Dimensions.get('window')
    let paging = 0

    const getLocation = async() => {
        let location = await AsyncStorage.getItem('geolocation')
        setLocation(JSON.parse(location))
    }

    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        RequestCall('multiple',
        'comingsoon', ['filmsComingSoon/?n=5','cinemasNearby/?n=5'], null,
        [setComingSoon,setCinemasClosest],['films','cinemas'])
        setTimeout(() => {
          setRefreshing(false);
        }, 2000);
    }, []);

    useEffect(() => {
        getLocation()
        RequestCall('multiple',
        'comingsoon', ['filmsComingSoon/?n=5','cinemasNearby/?n=5'], null,
        [setComingSoon,setCinemasClosest],['films','cinemas'])
    },[])

    const SubmitSearch = () => {
        Keyboard.dismiss()
        if (search !== '') {
            setLoading(true)
            RequestCall('single','livesearch', `filmLiveSearch/?n=5&query=${search}`, null, setSearchResult,'films')
            setTimeout(() => setLoading(false), 1000)
        }

    }

    const LoadFilm = (film) => {
        setTimeout(() => setSearchResult([]),500)
        navigation.navigate('cinemashowingmovie', {film: film})
    }

    const ClearSearcResult = () => {
        setSearchResult([])
    }

    const change = (direction) => {
        const width = 302
        if(comingSoon.length > paging && direction === 'forward'){
            paging++
            scrollRef.current.scrollTo({x: width * paging})
        }if(page <= comingSoon.length && direction === 'backward' && paging > 0){
                paging--
                let position = (width * paging) - width;
                scrollRef.current.scrollTo({x: position})
        }
    }


    return (
        <Container element={ScrollView} refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }>
            <FlexRow style={tw`mb-1`}>
                <TextView text={`${i18n.t("Welcome")} ${user?.fullname}`} size='xs' weight='xs' />
                <MaterialCommunityIcons name='hand-back-left' color='yellow' />
            </FlexRow>
            <TextView
                text={i18n.t(`Relax and get cinemas close to you`)} size='md' weight='sm'
                style={tw`leading-4 `}
            />

            <View style={tw`mt-3`}>
                <SearchInput
                    placeholder={i18n.t('Search movies')}
                    onFocus={ClearSearcResult}
                    setSearch={setSearch}
                    SubmitSearch={SubmitSearch}
                    status={loading}
                />
                {
                    searchResult.length > 0 ? 
                    <View style={[tw`w-1/2`,{backgroundColor: '#373434'}]}>
                        {
                            searchResult.map((item,index) => 
                             (
                                  <ListItem
                                      key={index}
                                      LoadFilm={() => LoadFilm(item)}
                                      title={item.film_name}
                                      conditionStyle={{borderBottomWidth: searchResult.length !== index+1 ? 1 : 0, borderBottomColor: 'white' }}
                                  />
                              )
                          )
                        }
                    </View>
                    : null
                }
            </View>

            <View style={tw`mt-5 mb-1`}>
                <TextView  text={i18n.t(`Coming soon`)} size='md' />
                <FlexRow style={tw`my-3`}>
                    <MaterialCommunityIcons onPress={() => change('backward')} name='chevron-left' size={30} color='white' />
                    <ScrollView
                        ref={scrollRef}
                        horizontal 
                        pagingEnabled 
                        showsHorizontalScrollIndicator={false} 
                        style={{width: width}}
                        onScroll={({nativeEvent}) => {
                            setPage(Math.ceil(nativeEvent.contentOffset.x / nativeEvent.layoutMeasurement.width))
                            paging = Math.ceil(nativeEvent.contentOffset.x / nativeEvent.layoutMeasurement.width)
                           
                        }}
                    >
                    {comingSoon.length > 0 ? comingSoon.map((film,index) =><CardImage key={index}
                        onPress={() => LoadFilm(film)}
                        imageURL={film.images.hasOwnProperty('still') && !Array.isArray(film.images.still)
                         ? {uri: film.images.still["1"].medium.film_image} : film.images.hasOwnProperty('poster') && !Array.isArray(film.images.poster) 
                         ? {uri: film.images.poster["1"].medium.film_image} : require('../assets/error_image.jpg')}
                        imageText={film.film_name} width={width - 110}
                        resizeMode={film.images.hasOwnProperty('still') && !Array.isArray(film.images.still)
                        ? 'cover' : film.images.hasOwnProperty('poster') && !Array.isArray(film.images.still) 
                        ? 'contain' : 'cover'}
                    />) : null}
                    </ScrollView>
                    <MaterialCommunityIcons onPress={() => change('forward')} name='chevron-right' size={30} color='white' />
                </FlexRow>
            </View>

            <View>
                <TextView text={i18n.t('Cinemas Nearer to your location')} size='md'/>
                <View style={tw`mt-2`}>
                    {location !== undefined ? <MapView
                    style={{width: Dimensions.get('window').width, height: Dimensions.get('window').height/2.5, marginBottom: 30}}
                        region={{
                            latitude: location.coords.latitude, longitude: location.coords.longitude,
                            latitudeDelta: 0.05, longitudeDelta: 0.05
                        }}
                        showsUserLocation={true}
                        provider={PROVIDER_GOOGLE}
                        mapType='standard'
                    >
                        <Marker 
                            coordinate={{
                                latitude: location.coords.latitude, longitude: location.coords.longitude,
                            }}
                            title='Me'
                        />
                        {
                            cinemasClosest.length > 0 ? cinemasClosest.map((cinema,index) => 
                            (
                                <Marker
                                    key={index}
                                    coordinate={{
                                        latitude: cinema.lat, longitude:cinema.lng
                                    }}
                                    title={cinema['cinema_name']}
                                    description={cinema.address}
                                    pinColor='yellow'
                                />
                            )) : null
                        }
                    </MapView> : null}
                </View>
            </View>
        </Container>
    )
}

export default HomeScreen
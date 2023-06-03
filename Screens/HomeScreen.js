import React, { useEffect, useRef, useState } from 'react'
import tw from 'twrnc'
import { I18n } from "i18n-js";
import { View, ScrollView, Keyboard, Dimensions, RefreshControl,Text } from "react-native";
import FlexRow from "../Component/Layout/FlexRow";
import { MoviegluRequestCall } from "../Connection/RequestInstance";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import CardImage from "../Component/ImageViewComponent/CardImage";
import SearchInput from "../Component/SearchComponent/SearchInput";
import Container from "../Component/Container"
import ListItem from "../Component/SearchComponent/ListSearchItem";
import TextView from "../Component/TextView"
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSelector } from 'react-redux';
import Ionicons from 'react-native-vector-icons/Ionicons'

import { de, en, fr, es, ind } from '../assets/Localization/languages';
import ListCinemaSingle from '../Component/list/ListCinemaSingle';
import LoadingComponent from '../Component/LoadingComponent';

const HomeScreen = ({ route, navigation }) => {
    const [refreshing, setRefreshing] = useState(false);
    const [search, setSearch] = useState('');
    const [searchResult, setSearchResult] = useState([])
    const [cinemasClosest, setCinemasClosest] = useState([])
    const [comingSoon, setComingSoon] = useState([])
    const [offsetX, setOffsetX] = useState()
    const [page, setPage] = useState(0)
    const [currentWidth, setCurrentWidth] = useState(0)
    const [loading, setLoading] = useState(false)
    const [location, setLocation] = useState()
    const user = useSelector((state) => state.reducers.user)
    const selectLanguageFromRedux = useSelector((state) => state.reducers.language)
    const [status,setStatus] = useState(true)

    const [language, setLanguage] = useState(selectLanguageFromRedux)
    const i18n = new I18n({ ...en, ...de, ...fr, ...es, ...ind })
    i18n.defaultLocale = language
    i18n.locale = language

    let scrollRef = useRef(null)
    let { width } = Dimensions.get('window')
    let paging = 0

    const getLocation = async () => {
        let location = await AsyncStorage.getItem('geolocation')
        setLocation(JSON.parse(location))
    }

    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        MoviegluRequestCall('multiple', ['filmsComingSoon/?n=5', 'cinemasNearby/?n=5'],
            [setComingSoon, setCinemasClosest], ['films', 'cinemas'], setStatus)
        setTimeout(() => {
            setRefreshing(false);
        }, 2000);
    }, []);

    useEffect(() => {
        getLocation()
        MoviegluRequestCall('multiple', ['filmsComingSoon/?n=5', 'cinemasNearby/?n=5'],
            [setComingSoon, setCinemasClosest], ['films', 'cinemas'],setStatus)
    }, [])

    const SubmitSearch = () => {
        Keyboard.dismiss()
        if (search !== '') {
            setLoading(true)
            MoviegluRequestCall('single',`filmLiveSearch/?n=5&query=${search}`, setSearchResult, 'films',null)
            setTimeout(() => setLoading(false), 1000)
        }

    }

    const LoadFilm = (film) => {
        setTimeout(() => setSearchResult([]), 500)
        navigation.navigate('cinemashowingmovie', { film: film })
    }

    const ClearSearcResult = () => {
        setSearchResult([])
    }

    useEffect(() =>{
        setLanguage(selectLanguageFromRedux)
    },[selectLanguageFromRedux])

    const change = (direction) => {
        const width = 302
        if (comingSoon.length > paging && direction === 'forward') {
            paging++
            scrollRef.current.scrollTo({ x: width * paging })
        } if (page <= comingSoon.length && direction === 'backward' && paging > 0) {
            paging--
            let position = (width * paging) - width;
            scrollRef.current.scrollTo({ x: position })
        }
    }

    // console.log(comingSoon,cinemasClosest)

    return (
        <Container element={ScrollView} refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        >
            
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
                        <View style={[tw`w-1/2`, { backgroundColor: '#373434' }]}>
                            {
                                searchResult.map((item, index) =>
                                (
                                    <ListItem
                                        key={index}
                                        LoadFilm={() => LoadFilm(item)}
                                        title={item.film_name}
                                        conditionStyle={{ borderBottomWidth: searchResult.length !== index + 1 ? 1 : 0, borderBottomColor: 'white' }}
                                    />
                                )
                                )
                            }
                        </View>
                        : null
                }
            </View>
            {comingSoon.length < 1 && cinemasClosest.length < 1 ? <OnReadyComponent status={status} children={<TextView style={tw`my-auto mx-auto`} text={i18n.t("Error loading data")} />}/> :<View>
            <View style={tw`mt-5 mb-1`}>
                <TextView text={i18n.t(`Latest Movies`)} size='md' />
                <FlexRow style={tw`my-3`}>
                    <MaterialCommunityIcons onPress={() => change('backward')} name='chevron-left' size={30} color='white' />
                    <ScrollView
                        ref={scrollRef}
                        horizontal
                        pagingEnabled
                        showsHorizontalScrollIndicator={false}
                        style={{ width: width }}
                        onScroll={({ nativeEvent }) => {
                            setPage(Math.ceil(nativeEvent.contentOffset.x / nativeEvent.layoutMeasurement.width))
                            paging = Math.ceil(nativeEvent.contentOffset.x / nativeEvent.layoutMeasurement.width)

                        }}
                    >
                        {comingSoon.length > 0 ? comingSoon.map((film, index) => <CardImage key={index}
                            onPress={() => LoadFilm(film)}
                            imageURL={film.images.hasOwnProperty('still') && !Array.isArray(film.images.still)
                                ? { uri: film.images.still["1"].medium.film_image } : film.images.hasOwnProperty('poster') && !Array.isArray(film.images.poster)
                                    ? { uri: film.images.poster["1"].medium.film_image } : require('../assets/error_image.jpg')}
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
                <TextView text={i18n.t('Cinemas Nearer to your location')} size='md' />
                <View style={tw`mt-2 h-1/2`}>
                    {
                        cinemasClosest.length > 0 ? cinemasClosest.map((cinema, index) =>
                        (
                            <ListCinemaSingle
                            uri={false}
                                key={index}
                                img_source={cinema.logo_url}
                                distance={Math.floor(cinema.distance*1.609)+' Km'}
                                name={cinema.cinema_name}
                                onPress={() => navigation.navigate('cinemashowtimes', {id: cinema.cinema_id, logo: cinema.logo_url,cinema_name: cinema.cinema_name})}
                            />
                        )) : (<View style={tw`m-auto h-30`}>
                            <Ionicons name="ios-location" size={30} color="yellow" style={tw`mx-auto`} />
                            <TextView size='sm' text={i18n.t(`No cinema is close or in your location`)} />
                            </View>)
                    }
                </View>
            </View>
            </View> : <LoadingComponent status={status} children={<TextView style={tw`my-auto mx-auto`} text={i18n.t("Error loading data")} />}/> }
        </Container>
    )
}

export default HomeScreen
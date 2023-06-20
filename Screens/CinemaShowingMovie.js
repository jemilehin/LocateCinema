import React, { useEffect, useRef, useState } from 'react'
import tw from 'twrnc'
import { I18n } from "i18n-js";
import { useSelector } from 'react-redux';
import PagerView from 'react-native-pager-view';
import { Video, ResizeMode } from 'expo-av';
import { View, ScrollView, Image, Dimensions, SafeAreaView, TouchableOpacity, ActivityIndicator } from "react-native";
import Container from "../Component/Container"
import { MoviegluRequestCall } from "../Connection/RequestInstance";
import FlexRow from '../Component/Layout/FlexRow';
import TextView from "../Component/TextView"
import ListCinemaView from '../Component/list/ListCinemas';

import { de, en, fr, es, ind } from '../assets/Localization/languages';
import LoadingComponent from '../Component/LoadingComponent';
import moment from 'moment';

export const getImageUrl = (item, setData) => {
    if (item.images?.hasOwnProperty('still')) {
        if (Array.isArray(item.images?.still)) {
            setData(true)
        } else {
            return item.images?.still["1"].medium.film_image
        }
    } else {
        if (Array.isArray(item.images?.poster)) {
            setData(true)
        } else {
            return item.images?.poster["1"].medium.film_image
        }
    }
}

let { width } = Dimensions.get('window')

const DisplayCinemaShowingMovie = ({ navigation, route }) => {

    const [cinemas, setCinemas] = useState([]);
    const [film] = useState(route.params?.film || {});
    const [filmFullDetails, setFillFullDetails] = useState({});
    const [isUri, setUri] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const viewPage = useRef(null);
    const video = useRef(null);
    const [videoStatus, setVideoStatus] = useState({});
    const [status,setStatus] = useState(true)


    const selectLanguageFromRedux = useSelector((state) => state.reducers.language)

    const [language, setLanguage] = useState(selectLanguageFromRedux)
    const i18n = new I18n({ ...en, ...de, ...fr, ...es, ...ind })
    i18n.defaultLocale = language
    i18n.locale = language

    useEffect(() => {
        navigation.addListener('focus', () => {
            // MoviegluRequestCall('single', `closestShowing/?film_id=${route.params?.film.film_id}`, setCinemas, 'cinemas')
            MoviegluRequestCall('multiple', [`closestShowing/?film_id=${route.params?.film.film_id}`, `filmDetails/?film_id=${route.params?.film.film_id}`],
                [setCinemas, setFillFullDetails], ['cinemas', 'null'],setStatus)
        })
    }, [])

    useEffect(() => {
        setLanguage(selectLanguageFromRedux)
    }, [selectLanguageFromRedux])

    return (
        <Container element={SafeAreaView}>
            <View style={tw``}>
                <Image
                    style={[tw`mb-2`, { width: width, resizeMode: film.images?.hasOwnProperty('still') ? 'cover' : 'contain', height: 200 }]}
                    source={!isUri ? { uri: getImageUrl(film, setUri) } : require('../assets/error_image.jpg')}
                />
                <View style={[tw`pt-1 px-2`, { backgroundColor: "#373434" }]}>
                    <TextView
                        text={`${i18n.t('Title')}: ${film.film_name}`} size='md' weight='xs'
                        style={tw`leading-4 text-white`}
                    />
                    <FlexRow style={tw`my-1 pr-10`}>
                        <TextView
                            text={`${i18n.t("Duration")}: ${filmFullDetails?.duration_mins !== undefined ? `${filmFullDetails?.duration_mins} ${i18n.t(" minutes")}` : `${i18n.t("Not Available")}`} `} size='sm' weight='xs'
                            style={tw`leading-4  text-white`}
                        />
                        <TextView
                            text={`${i18n.t('Age Rating')}: ${film.age_rating === undefined ? null : film.age_rating[0].rating}`} size='sm' weight='xs'
                            style={tw`leading-4 ml-auto text-white`}
                        />
                    </FlexRow>
                </View>
            </View>
            <View style={tw`h-11 bg-white flex-row`}>
                <View style={tw`w-1/2 h-full`}>
                    <TouchableOpacity
                        style={tw`my-auto `}
                        onPress={() => viewPage.current.setPage(0)}
                    >
                        <TextView
                            text={i18n.t("Cinemas Showing")}
                            style={tw`leading-4 text-center text-black`}
                        />
                    </TouchableOpacity>
                    <View style={[tw``, { backgroundColor: currentPage === 1 ? "#f4d44e" : "transparent", height: 3 }]}>

                    </View>
                </View>
                <View style={tw`w-1/2 h-full`}>
                    <TouchableOpacity
                        style={tw`my-auto `}
                        onPress={() => viewPage.current.setPage(1)}
                    >
                        <TextView
                            text={i18n.t("Movie Details")}
                            style={tw`leading-4 text-center text-black`}
                        />
                    </TouchableOpacity>
                    <View style={[tw``, { backgroundColor: currentPage === 2 ? "#f4d44e" : "transparent", height: 3 }]}>

                    </View>
                </View>
            </View>
            <PagerView
                ref={viewPage}
                style={{ flex: 1 }}
                initialPage={0}
                onPageScroll={(e) => setCurrentPage(e.nativeEvent.position + 1)}
            >
                <View key={1}>
                    <ScrollView style={tw`mt-6`}>
                        {
                            cinemas.length > 0 ? cinemas.map((cinema, index) => (<ListCinemaView
                                key={index}
                                cinemaName={cinema.cinema_name}
                                cAddress={cinema.address}
                                distance={cinema.distance}
                                date={moment(cinema.date).format("dddd, MMMM Do YYYY")} time={cinema.time}
                                onPress={() => navigation.navigate('cinemadirection', { cinema: cinema })}
                            />)) : <LoadingComponent status={status} children={<TextView text={i18n.t("Not Available")} />}  />
                        }
                    </ScrollView>
                </View>
                <View key={2}>
                    <ScrollView contentContainerStyle={{paddingBottom: 50}}>
                        <View style={tw`mt-6`}>
                            <TextView
                                text={i18n.t("About Movie")}
                                size='md'
                                weight='md'
                            />
                            <View style={tw`mt-1`}>
                                <TextView
                                    text={filmFullDetails.synopsis_long}
                                />
                            </View>
                        </View>
                        <View style={tw`flex-row border-b pb-3  border-white`}>
                            <View style={tw`mt-6 w-1/2`}>
                                <TextView
                                    text={i18n.t("Movie Producers")}
                                    size='md'
                                    weight='md'
                                />
                                <View>
                                    {filmFullDetails.producers === undefined ? <LoadingComponent status={status} children={<TextView text={i18n.t("Not Available")} />} /> : filmFullDetails.producers.map((producers, i) => (
                                        <TextView key={i} text={producers.producer_name} />
                                    ))}
                                </View>
                            </View>
                            <View style={tw`mt-6 w-1/2`}>
                                <TextView
                                    text={i18n.t("Movie Directors")}
                                    size='md'
                                    weight='md'
                                />
                                <View>
                                    {filmFullDetails.directors !== undefined ? filmFullDetails.directors.map((director, i) => (
                                        <TextView key={i} text={director.director_name} />
                                    )) : <LoadingComponent status={status} children={<TextView text="Not Available" />} />}
                                </View>
                            </View>
                        </View>
                        <View style={tw`mt-6`}>
                            <TextView
                                text="Triller"
                                size='md'
                                weight='md'
                            />
                            <View>
                                {filmFullDetails.trailers !== undefined && filmFullDetails.trailers !== null ? <Video
                                    ref={video}
                                    style={{ alignSelf: 'center', width: width, height: 200 }}
                                    source={ {
                                        uri:  filmFullDetails.trailers !== null ?  filmFullDetails.trailers.hasOwnProperty('high') ? filmFullDetails.trailers.high[0].film_trailer : filmFullDetails.trailers.med[0].film_trailer
                                        : ''}}
                                    useNativeControls
                                    resizeMode={ResizeMode.CONTAIN}
                                    isLooping
                                    onPlaybackStatusUpdate={status => setVideoStatus(() => status)}
                                /> : <LoadingComponent status={status} children={<Image source={require('../assets/error_image.jpg')} style={{width: width, height: 200}}/>} />
                                }
                            </View>
                        </View>
                    </ScrollView>
                </View>
            </PagerView>
        </Container>
    )
}

export default DisplayCinemaShowingMovie
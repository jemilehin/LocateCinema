import React, { useEffect, useRef, useState } from 'react'
import tw from 'twrnc'
import { I18n } from "i18n-js";
import { useSelector } from 'react-redux';
import { View, ScrollView, Image, Dimensions, SafeAreaView } from "react-native";
import Container from "../Component/Container"
import { MoviegluRequestCall } from "../Connection/RequestInstance";
import FlexRow from '../Component/Layout/FlexRow';
import TextView from "../Component/TextView"
import ListCinemaView from '../Component/list/ListCinemas';

import { de, en, fr, es, ind } from '../assets/Localization/languages';

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

    const [cinemas, setCinemas] = useState([])
    const [film] = useState(route.params?.film || {})
    const [isUri, setUri] = useState(false)

    const selectLanguageFromRedux = useSelector((state) => state.reducers.language)

    const [language, setLanguage] = useState(selectLanguageFromRedux)
    const i18n = new I18n({ ...en, ...de, ...fr, ...es, ...ind })
    i18n.defaultLocale = language
    i18n.locale = language

    useEffect(() => {
        navigation.addListener('focus', () => {
            MoviegluRequestCall('single', `closestShowing/?film_id=${route.params?.film.film_id}`, setCinemas, 'cinemas')
        })
    }, [])

    return (
        <Container element={SafeAreaView}>
            <View style={tw``}>
                <Image
                    style={[tw`mb-2`, { width: width, resizeMode: film.images?.hasOwnProperty('still') ? 'cover' : 'contain', height: 200 }]}
                    source={!isUri ? { uri: getImageUrl(film,setUri) } : require('../assets/error_image.jpg')}
                />
                <View style={tw`pt-1 px-2 bg-white`}>
                    <TextView
                        text={`${i18n.t('Title')}: ${film.film_name}`} size='md' weight='xs'
                        style={tw`leading-4 text-black`}
                    />
                    <FlexRow style={tw`my-1 pr-10`}>
                        <TextView
                            text={`${i18n.t("Duration")}: ${film.duration} minutes`} size='sm' weight='xs'
                            style={tw`leading-4  text-black`}
                        />
                        <TextView
                            text={`${i18n.t('Age Rating')}: ${film.age_rating === undefined ? null : film.age_rating[0].rating}`} size='sm' weight='xs'
                            style={tw`leading-4 ml-auto text-black`}
                        />
                    </FlexRow>
                </View>
            </View>
            <ScrollView style={tw`mt-6`}>
                {
                    cinemas.length > 0 ? cinemas.map((cinema, index) => (<ListCinemaView
                        key={index}
                        cinemaName={cinema.cinema_name}
                        cAddress={cinema.address}
                        distance={cinema.distance}
                        date={cinema.date} time={cinema.time}
                        // onPress={() => navigation.navigate('cinemadirection', { cinema: cinema })}
                    />)) : null
                }
            </ScrollView>
        </Container>
    )
}

export default DisplayCinemaShowingMovie
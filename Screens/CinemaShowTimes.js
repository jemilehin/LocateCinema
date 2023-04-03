import React, { useEffect, useRef, useState } from 'react'
import tw from 'twrnc'
import { I18n } from "i18n-js";
import { useSelector } from 'react-redux';
import moment from "moment/moment";
import { Image,SafeAreaView,View,Dimensions, ScrollView, Text,Modal } from 'react-native';

import { de, en, fr, es, ind } from '../assets/Localization/languages';
import Container from '../Component/Container';
import { MoviegluRequestCall } from '../Connection/RequestInstance';
import ListCinemaSingle from '../Component/list/ListCinemaSingle';
import FlexRow from '../Component/Layout/FlexRow';

import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import TextView from '../Component/TextView';

let { width } = Dimensions.get('window')

const CinemaShowtimes = ({ navigation, route }) => {
    const [film,setFilms] = useState([])
    const [isUri, setUri] = useState(false)
    const [modalVisible, setModalVisible] = useState(false);
    const [modalData,setModalData] = useState({})
    const selectLanguageFromRedux = useSelector((state) => state.reducers.language)

    const [language,setLanguage] = useState(selectLanguageFromRedux)
    const i18n = new I18n({...en, ...de, ...fr, ...es,...ind})
    i18n.defaultLocale = language
    i18n.locale = language

    useEffect(() =>{
        setLanguage(selectLanguageFromRedux)
    },[selectLanguageFromRedux])

    let currentTime = moment().format('YYYY-MM-DD')
    useEffect(() => {
        MoviegluRequestCall('single',`cinemaShowTimes/?cinema_id=${route.params?.id}&date=${currentTime}`,setFilms,'films')
    },[])

    const DisplayTimeAndDate = () => {
        return(
            <Modal
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    setModalVisible(!modalVisible);
                }}
            >
                <View style={[tw`bg-slate-800 relative h-5/6 m-auto rounded-3xl`]}>
                    <FlexRow style={tw`justify-end top-3 right-3`}>
                        <MaterialIcons name='cancel' color='yellow'  size={30} 
                            onPress={() => setModalVisible(false)}
                        />
                    </FlexRow>
                <ScrollView>
                <View style={tw`my-2 mx-2`}>
                    <Text style={tw`text-white text-base font-bold my-4`}>{i18n.t('Showing Dates')}</Text>
                    <View style={tw`flex flex-wrap flex-row`}>
                        {film[modalData]?.show_dates.map((day,i)=> 
                            (<Text key={i} style={tw`bg-white p-2 border mx-2 my-2 rounded-lg w-2/5`}>{day.date}</Text>)
                        )}
                    </View>
                </View>
                <View style={tw`my-2 mx-2`}>
                    <Text style={tw`text-white text-base font-bold my-4`}>{i18n.t('Showing Times')}</Text>
                    
                            <View style={tw`flex flex-row flex-wrap`}>
                                {film[modalData]?.showings.Standard.times.map((time,i)=> 
                                    (<View key={i} style={tw`bg-white p-2 border mx-2 my-2 rounded-lg w-2/5`}><Text>Start Time: {time.start_time}</Text><Text>End Time: {time.end_time}</Text></View>)
                                )}
                            </View>
                    
                </View>
                </ScrollView>
                </View>
            </Modal>
        )
    }



    return(
        <Container element={SafeAreaView}>
            <View style={tw`mb-2`}>
                <Image
                    style={{ width: width, resizeMode: 'cover', height: 250 }}
                    source={{uri: route.params?.logo}}
                />
            </View>
            <DisplayTimeAndDate />
            <TextView size="lg" text={`${route.params?.cinema_name}`} />
            <TextView text={i18n.t("Click on a movie and get showing dates and time")} />
            <ScrollView style={tw`mt-6`}>
                {
                    film.length > 0 ? film.map((item,index) => (
                        <ListCinemaSingle
                            key={index}
                            img_source={item.images.hasOwnProperty('still') && !Array.isArray(item.images.still)
                            ? { uri: item.images.still["1"].medium.film_image } : item.images.hasOwnProperty('poster') && !Array.isArray(item.images.poster)
                                ? { uri: item.images.poster["1"].medium.film_image } : require('../assets/error_image.jpg')}
                            name={item.film_name}
                            onPress={() => {
                                    setModalData(index)
                                    setModalVisible(!modalVisible)
                                }
                            }
                            uri={true}
                        />
                    )) : null
                }
            </ScrollView>
        </Container>
    )
}

export default CinemaShowtimes
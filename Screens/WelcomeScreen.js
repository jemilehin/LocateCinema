import {useEffect, useState} from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { I18n } from "i18n-js";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ImageBackground, TouchableOpacity, View } from "react-native"
import tw from 'twrnc'
import Button from "../Component/RoundedButton"
import TextView from "../Component/TextView"

import {de, en,fr,es,ind} from '../assets/Localization/languages';
import SelectLanguage from '../Component/SelectLanguage';
import { CHANGE_LANAGUGAGE } from '../ReduxEffect/actionTypes';


const WelcomeScreen = ({navigation}) => {
    const selectLanguageFromRedux = useSelector(state => state.reducers.language)

    const [language, setLanguage] = useState(selectLanguageFromRedux)
    const i18n = new I18n({...en, ...de,...fr, ...es,...ind})
    i18n.defaultLocale = language
    i18n.locale = language

    const dispatch = useDispatch()
    useEffect(() => {
        navigation.addListener('focus',async () => {
          await AsyncStorage.removeItem('access_token')
        })
    },[])

    useEffect(() => {
        dispatch({type: CHANGE_LANAGUGAGE, payload: {language: language}})
    },[language])

    return (
        <ImageBackground style={tw`flex-1`} source={require('../assets/WelcomeScreen.png')}>
            <SelectLanguage language={language} setLanguage={setLanguage} />
            <View style={tw`flex-1 justify-end pb-20 px-5`}>
                <View style={[tw`rounded-2xl p-8`, { backgroundColor: 'rgba(255,255,255,0.7)' }]}>
                    <View style={tw`mb-8`}>
                        <TextView text={i18n.t('Welcome')+'!'} style={tw`text-center`}
                            size='lg'
                            color='black'
                            weight='md'
                        />
                        <TextView text={i18n.t('See available Movie list at any Cinema close to your Location')}
                            style={tw`text-center`} size='sx' weight='xs'
                        />
                    </View>
                    <View style={tw`mx-auto mt-8`}>
                        <Button
                            element={TouchableOpacity}
                            text={i18n.t('Create Account')}
                            size='sm'
                            color='white'
                            weight='sm'
                            style={tw`mb-5`}
                            textStyle={tw`text-center`}
                            onPress={() => navigation.navigate('register')}
                        />
                        <Button
                            element={TouchableOpacity}
                            text={i18n.t('Sign in')}
                            size='sm'
                            color='white'
                            weight='sm'
                            style={[tw`mt-5`, { backgroundColor: 'rgba(55,52,52,1)' }]}
                            textStyle={tw`text-center`}
                            onPress={() => navigation.navigate('login')}
                        />
                    </View>
                </View>
            </View>
        </ImageBackground>
    )
}

export default WelcomeScreen
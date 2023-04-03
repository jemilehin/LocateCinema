import { ImageBackground, TouchableOpacity, View, Keyboard, Text } from "react-native"
import tw from 'twrnc'
import { I18n } from "i18n-js";
import Ionicons from 'react-native-vector-icons/Ionicons'
import Button from "../Component/RoundedButton"
import TextView from "../Component/TextView"
import FlexRow from "../Component/Layout/FlexRow"
import CurvedTextInputs from "../Component/CurvedSquareInputs"
import { useState } from "react"
import { AppRequestCall } from "../Connection/RequestInstance"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { useEffect } from "react"
import { useDispatch,useSelector } from 'react-redux'

import {de, en,fr,es,ind} from '../assets/Localization/languages';
import SelectLanguage from '../Component/SelectLanguage';
import { CHANGE_LANAGUGAGE } from "../ReduxEffect/actionTypes";

const LoginScreen = ({navigation}) => {
    const selectLanguageFromRedux = useSelector(state => state.reducers.language)

    const [language, setLanguage] = useState(selectLanguageFromRedux)
    const i18n = new I18n({...en, ...de,...fr,...es,...ind})
    i18n.defaultLocale = language
    i18n.locale = language

    
    const [keyboardStatus, setKeyboardStatus] = useState('');
    const [loginCredentials,setLoginCredentials] = useState({email: '', password: ''})
    const [isLoading, setIsLoading] = useState(false);
    const [hidePasword,setHidePasword] = useState(true)
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch({type: CHANGE_LANAGUGAGE, payload: {language: language}})
    },[language])

    useEffect(() => {
        const showSubscription = Keyboard.addListener('keyboardDidShow', () => {
          setKeyboardStatus(true);
        });
        const hideSubscription = Keyboard.addListener('keyboardDidHide', () => {
          setKeyboardStatus(false);
        });
    
        return () => {
          showSubscription.remove();
          hideSubscription.remove();
        };
    }, []);

    const callback = (response) => {
        setIsLoading(false)
        // console.log('login callback:',response)
        // alert(JSON.stringify(response))
    }

    const errcallback = (err) => {
        // console.log('login err:',err.response)
        alert(JSON.stringify(err.response))
        alert(err.message)
        setIsLoading(false)
    }

    const onLogin = () => {
        Keyboard.dismiss()
        let emptyKey = []
        if(loginCredentials.email !== '' && loginCredentials.password !== ''){
            setIsLoading(true)
            AppRequestCall('login',loginCredentials,callback,errcallback,dispatch,'post')
        }else{
            for (const key in loginCredentials) {
                if(loginCredentials[key] === ''){
                    emptyKey.push([key])
                }
            }
        }

        if(emptyKey.length !== 0){
            alert(emptyKey.map(i => (i))+' is empty')
        }
    }


    return (
        <ImageBackground style={tw`flex-1 pt-10 px-6 justify-between`} source={require('../assets/plain.png')}>
            <FlexRow style={{zIndex: 10, justifyContent: "space-between"}}>
                <Ionicons name='arrow-back-outline' color='white' size={20}
                    onPress={() => navigation.goBack()}
                />
                <SelectLanguage 
                    top={-1} 
                    right={-1} 
                    width="auto"
                    textRight={20}
                    textTop={39}
                    language={language} 
                    setLanguage={setLanguage}
                    keyboard={keyboardStatus}
                />
            </FlexRow>
            <View style={tw`flex-1 justify-end pb-30`}>
                <View style={[tw`rounded-2xl`]}>
                    <View style={tw`mb-8`}>
                        <TextView text={i18n.t('Sign In')} style={[tw`text-left`,]}
                            size='xl'
                            color='white'
                            weight='md'
                        />
                        <TextView text={i18n.t("Get access to cinema's in your Location")}
                            style={tw`text-left`} size='sm' weight='xs'
                        />
                    </View>
                    <View style={tw``}>
                        <CurvedTextInputs
                            name='mail'
                            side='top'
                            onChangeText={(text) => setLoginCredentials({...loginCredentials,email: text })}
                        />
                        <CurvedTextInputs
                            name='md-lock-open'
                            secureTextEntry={hidePasword}
                            style={{marginTop: 2}}
                            side='bottom'
                            icon={<Ionicons onPress={() => setHidePasword(!hidePasword)} name={!hidePasword ? 'eye' : 'eye-off'} color='black' size={20} style={tw`my-auto`} />}
                            onChangeText={(text) => setLoginCredentials({...loginCredentials,password: text })}
                        />
                    </View>
                    <View>
                    <Button
                        element={TouchableOpacity}
                        text={i18n.t('Submit')}
                        size='md'
                        color='white'
                        weight='sm'
                        style={[tw`mt-5 mx-auto `, { backgroundColor: 'rgba(55,52,52,1)' }]}
                        textStyle={tw`text-center`}
                        onPress={() => onLogin()}
                        loading={isLoading}
                    />
                    <View>
                    <FlexRow style={tw`mt-1 justify-center`}>
                        <TextView text="Don't have an account?"
                            style={tw`text-center pr-1`} size='sm' weight='xs'
                        />
                        <TextView text={i18n.t(`Create Account`)}
                            style={[tw`text-center`,{color: 'rgba(121,182,243,1)'}]}
                            size='sm'
                            weight='xs'
                            onPress={() => navigation.navigate('register')}
                        />
                    </FlexRow>
                    <FlexRow style={tw`justify-center`}>
                        <View style={[tw`w-1/3`,{height: 1, backgroundColor: "white"}]}></View>
                        <TextView text='Or'
                            style={tw`text-center text-white mx-2`}
                            size='sm'
                            weight='xs'
                            onPress={() => navigation.navigate('register')}
                        />
                        <View style={[tw`w-1/3`,{height: 1, backgroundColor: "white"}]}><Text>hf</Text></View>
                    </FlexRow>
                    <FlexRow style={tw``}>
                        <TextView text='Forgot Password'
                            style={[tw`text-center grow`,{color: 'rgba(121,182,243,1)'}]}
                            size='sm'
                            weight='xs'
                            onPress={() => navigation.navigate('forgot_password')}
                        />
                    </FlexRow>
                    </View>
                    </View>
                </View>
            </View>
        </ImageBackground>
    )
}

export default LoginScreen
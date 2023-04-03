import { ImageBackground, TouchableOpacity, View, Keyboard, KeyboardAvoidingView, Platform } from "react-native"
import tw from 'twrnc'
import { I18n } from "i18n-js";
import { Picker } from '@react-native-picker/picker';
import Ionicons from 'react-native-vector-icons/Ionicons'
import Button from "../Component/RoundedButton"
import TextView from "../Component/TextView"
import FlexRow from "../Component/Layout/FlexRow"
import CurvedTextInputs from "../Component/CurvedSquareInputs"
import { useState, useEffect } from "react"
import { AppRequestCall } from "../Connection/RequestInstance";
import AsyncStorage from "@react-native-async-storage/async-storage";

import {de, en,fr,es,ind} from '../assets/Localization/languages';
import SelectLanguage from '../Component/SelectLanguage';
import { useDispatch, useSelector } from "react-redux";
import { CHANGE_LANAGUGAGE } from "../ReduxEffect/actionTypes";

const countries = require('../assets/Countries.json');

const RegisterScreen = ({ navigation }) => {
    const selectLanguageFromRedux = useSelector(state => state.reducers.language)

    const [language, setLanguage] = useState(selectLanguageFromRedux)
    const i18n = new I18n({...en, ...de, ...fr, ...es,...ind})
    i18n.defaultLocale = language
    i18n.locale = language

    const [newUser, setNewUser] = useState({email : '',fullname : '',country : '',
    password: '', password_confirmation: ''});
    const [isLoading, setIsLoading] = useState(false);
    const [selectedLanguage, setSelectedLanguage] = useState();
    const [countryShort,setCountryShort] = useState('')
    const [keyboardStatus, setKeyboardStatus] = useState('');
    const [hidePasword,setHidePasword] = useState(true)
    const [confirmHidePasword,setConfirmHidePasword] = useState(true)

    const callback = async(response) => {
        setIsLoading(false)
        // console.log(countryShort)
        await AsyncStorage.setItem('country_short',countryShort)
        alert(response.message)
        navigation.navigate('login',{user: response.user})
    }

    const errcallback = (err) => {
        // console.log(err.response.data)
        let errArr = []
        for (const key in err.response.data) {
            errArr.push(err.response.data[key])
        }
        alert(errArr.map(msg => msg[0]))
        setIsLoading(false)
    }

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

      const dispatch = useDispatch()
      useEffect(() => {
        dispatch({type: CHANGE_LANAGUGAGE, payload: {language: language}})
    },[language])
    
    const OnSubmit = () => {
        Keyboard.dismiss()
        let emptyKey = []
        for (const key in newUser) {
            if(newUser !== {}){
                if(newUser[key] === '' && key !== 'password_confirmation'){
                    emptyKey.push([key])
                }if(key === 'password_confirmation'){
                    if(newUser.password === newUser.password_confirmation && 
                        newUser.password !== '' && newUser.password_confirmation !== '' 
                        && emptyKey.length == 0
                    ){
                        setIsLoading(true)
                        AppRequestCall('register',newUser, callback,errcallback,null,'post')
                    }else alert('Password did not match')
                }
            }else alert("all fields can't be empty")
        }

        if(emptyKey.length !== 0){
            alert(emptyKey.map(i => (i))+' is empty')
        }
    }

    return (
        <ImageBackground style={tw`flex-1 pt-10 px-6 justify-between`} source={require('../assets/plain.png')}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'position'}
                style={tw`flex-1`}
                keyboardVerticalOffset={50}
                contentContainerStyle={{position: "relative",flex: 1, top: keyboardStatus ? "33%" : 0}}
            >
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
                        <TextView text={i18n.t('Sign Up')} style={[tw`text-left`,]}
                            size='xl'
                            color='white'
                            weight='md'
                        />
                        <TextView text={i18n.t(`Get access to cinema's in your Location`)}
                            style={tw`text-left`} size='sm' weight='xs'
                        />
                    </View>
                    <View style={tw``}>
                        <CurvedTextInputs
                            placeholder={i18n.t("Name")}
                            name='person-circle-outline'
                            side='top'
                            onChangeText={(text) => setNewUser({...newUser,fullname: text })}
                        />
                        <CurvedTextInputs
                            name='mail'
                            placeholder={i18n.t("Email")}
                            style={{ marginTop: 1, marginBottom: 1 }}
                            onChangeText={(text) => setNewUser({...newUser,email: text })}
                        />
                        <View style={tw`bg-white flex-row`}>
                            <Ionicons name="flag" size={20} style={tw`ml-2 my-auto`} />
                            <Picker
                                selectedValue={selectedLanguage}
                                onValueChange={(itemValue, itemIndex) => {
                                    setSelectedLanguage(itemValue)
                                    setCountryShort(countries[itemIndex - 1].short)
                                    setNewUser({ ...newUser, country: countries[itemIndex - 1].name })
                                }
                                }
                                style={tw`flex-1`}
                            >
                                <Picker.Item label={i18n.t("Choose country")} value="" />
                                {
                                    countries.map((country, idx) =>
                                        (<Picker.Item key={idx} label={country.name} value={country.short} />)
                                    )
                                }
                            </Picker>
                        </View>
                        <CurvedTextInputs
                            placeholder={i18n.t("Password")}
                            secureTextEntry={hidePasword}
                            icon={<Ionicons onPress={() => setHidePasword(!hidePasword)} name={!hidePasword ? 'eye' : 'eye-off'} color='black' size={20} style={tw`my-auto`} />}
                            name='md-lock-open'
                            style={{ marginTop: 1 }}
                            onChangeText={(text) => setNewUser({...newUser,password: text })}
                        />
                        <CurvedTextInputs
                            // name='md-lock-open'
                            secureTextEntry={confirmHidePasword}
                            icon={<Ionicons onPress={() => setConfirmHidePasword(!confirmHidePasword)} name={!confirmHidePasword ? 'eye' : 'eye-off'} color='black' size={20} style={tw`my-auto`} />}
                            placeholder={i18n.t('Confirm password')}
                            style={{ marginTop: 2 }}
                            side='bottom'
                            onChangeText={(text) => setNewUser({...newUser,password_confirmation: text })}
                        />
                    </View>
                    <View>
                        <Button
                            loading={isLoading}
                            element={TouchableOpacity}
                            text={i18n.t('Submit')}
                            size='md'
                            color='white'
                            weight='sm'
                            style={[tw`mt-5 mx-auto `, { backgroundColor: 'rgba(55,52,52,1)' }]}
                            textStyle={tw`text-center`}
                            onPress={() => OnSubmit()}
                        />
                        <FlexRow style={tw`mt-3 justify-center`}>
                            <TextView text={i18n.t(`Already have an account?`)}
                                style={tw`text-center pr-1`} size='sm' weight='xs'
                            />
                            <TextView text={i18n.t(`Login`)}
                                style={[tw`text-center`, { color: 'rgba(121,182,243,1)' }]}
                                size='sm'
                                weight='xs'
                                onPress={() => navigation.navigate('login')}
                            />
                        </FlexRow>
                    </View>
                </View>
            </View>
            </KeyboardAvoidingView>
        </ImageBackground>
    )
}

export default RegisterScreen
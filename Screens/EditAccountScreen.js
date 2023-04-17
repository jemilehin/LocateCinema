import { useEffect, useState } from "react"
import { I18n } from "i18n-js";
import { useDispatch,useSelector } from 'react-redux'
import tw from 'twrnc'
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Picker } from '@react-native-picker/picker';
import Ionicons from 'react-native-vector-icons/Ionicons'
import { Pressable, SafeAreaView, ScrollView, View } from "react-native";
import Container from "../Component/Container";
import TextView from "../Component/TextView";
import { AppRequestCall } from "../Connection/RequestInstance"
import FlexRow from "../Component/Layout/FlexRow";
import CurvedTextInputs from "../Component/CurvedSquareInputs";
import Button from "../Component/RoundedButton";
import {de, en,fr,es,ind} from '../assets/Localization/languages';

const countries = require('../assets/Countries.json');

const EditAccountScreen = ({navigation}) => {
    const selectLanguageFromRedux = useSelector(state => state.reducers.language)
    const user = useSelector(state => state.reducers.user)
    const [profile,setProfile] = useState(user)
    const [isLoading, setIsLoading] = useState(false);
    // const [countryShort,setCountryShort] = useState('')
    const [selectedCountry, setSelectedCountry] = useState(countries.find(n => n.name === user.country).short);

    const [language, setLanguage] = useState(selectLanguageFromRedux)
    const i18n = new I18n({...en, ...de, ...fr, ...es,...ind})
    i18n.defaultLocale = language
    i18n.locale = language

    useEffect(() =>{
        setLanguage(selectLanguageFromRedux)
    },[selectLanguageFromRedux])

    // useEffect(() => {
    //     AppRequestCall('user-profile',null,callback,errcallback,null,'get')
    // },[])

    // const callback = async(response) => {
    //     setIsLoading(false)
        // console.log(countryShort)
        // await AsyncStorage.setItem('country_short',countryShort)
        // alert(response.message)
        // navigation.navigate('login',{user: response.user})
    // }

    // const errcallback = (err) => {
    //     // console.log(err.response.data)
    //     let errArr = []
    //     for (const key in err.response.data) {
    //         errArr.push(err.response.data[key])
    //     }
    //     alert(errArr.map(msg => msg[0]))
    //     setIsLoading(false)
    // }

    return(
        <Container element={SafeAreaView}>
            <FlexRow>
                <Ionicons name='arrow-back-outline' color='white' size={20}
                            onPress={() => navigation.goBack()}
                    />
                    <TextView
                        size="lg"
                        weight='md'
                        text={i18n.t("Profile")}
                        style={tw`ml-3`}
                />
            </FlexRow>
            <ScrollView style={tw`mt-10`}>
                <View style={tw`mb-12`}>
                    <TextView text={i18n.t("Name")} />
                    <CurvedTextInputs
                        placeholder={user.fullname}
                        
                    />
                </View>
                <View style={tw`mb-12`}>
                    <TextView text={i18n.t("Email")} />
                    <CurvedTextInputs
                    placeholder={user.email}
                    
                    />
                </View>
                
                <View >
                    <TextView text={i18n.t("Country")} />
                <View style={tw`bg-white flex-row mb-10`}>
                            <Picker
                                selectedValue={selectedCountry}
                                onValueChange={(itemValue, itemIndex) => {
                                    setSelectedCountry(itemValue)
                                    // setCountryShort(countries[itemIndex - 1].short)
                                    setProfile({ ...profile, country: countries[itemIndex - 1].name })
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
                </View>

                <Button 
                    element={Pressable}
                    text={i18n.t("Update")}
                    size='md'
                    color='white'
                    weight='sm'
                    style={[tw`mt-5 mx-auto `, { backgroundColor: 'rgba(55,52,52,1)' }]}
                    textStyle={tw`text-center`}
                />
            </ScrollView>
        </Container>
    )
}

export default EditAccountScreen
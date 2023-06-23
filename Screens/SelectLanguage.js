import { useState,useEffect } from "react"
import { I18n } from "i18n-js";
import { useDispatch, useSelector } from 'react-redux'
import tw from 'twrnc'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { Pressable, SafeAreaView, ScrollView, TouchableOpacity, View } from "react-native"
import Container from "../Component/Container"
import FlexRow from "../Component/Layout/FlexRow"
import { de, en, fr, es, ind, language } from '../assets/Localization/languages';
import TextView from "../Component/TextView";
import List from "../Component/list/List";
import { CHANGE_LANAGUGAGE } from "../ReduxEffect/actionTypes";
import Button from "../Component/RoundedButton";


const SelectLanguageScreen = ({ navigation }) => {
    const selectLanguageFromRedux = useSelector(state => state.reducers.language)
    const [modal, setModal] = useState(false)
    const [selectedLanguage, setSelectedLanguage] = useState('')
    const dispatch = useDispatch()

    const [currentlanguage, setCurrentLanguage] = useState(selectLanguageFromRedux)
    const i18n = new I18n({ ...en, ...de, ...fr, ...es, ...ind })
    i18n.defaultLocale = currentlanguage
    i18n.locale = currentlanguage

    const Cancel = () => {
        setModal(false)
        setSelectedLanguage('')
    }

    const ConfirmLanguage = () => {
        setModal(false)
        // console.log(selectedLanguage)
        dispatch({type: CHANGE_LANAGUGAGE, payload: {language: selectedLanguage}})
    }

    useEffect(() =>{
        setCurrentLanguage(selectLanguageFromRedux)
    },[selectLanguageFromRedux])

    const ConfirmChangeLanguage = () => {
        // dispatch({type: CHANGE_LANAGUGAGE, payload: })
        return (
            <View style={tw`p-2 bg-white rounded-lg absolute top-1/3 z-10 left-1/8  w-4/5`}>
                <TextView size='lg' color="black" text={i18n.t("Are you sure you want to change language?")} />
                <FlexRow style={tw`h-20 justify-center`}>
                    <Button
                        element={TouchableOpacity}
                        text={i18n.t('Cancel')}
                        size='xm'
                        color='black'
                        weight='sm'
                        style={[tw`w-auto border px-2 mr-3`, { backgroundColor: 'white' }]}
                        textStyle={tw`text-center`}
                        onPress={() => Cancel()}
                        paddingX={tw`px-0`}
                    />

                    <Button
                        element={TouchableOpacity}
                        text={i18n.t('Confirm')}
                        size='xm'
                        color='white'
                        weight='sm'
                        style={[tw`w-auto px-2 ml-3`, { backgroundColor: 'rgba(55,52,52,1)' }]}
                        textStyle={tw`text-center`}
                        onPress={() => ConfirmLanguage()}
                        paddingX='px-0'
                    />
                </FlexRow>
            </View>
        )
    }


    return (
        <Container element={SafeAreaView}>
            <FlexRow style={tw`mb-10`}>
                <Ionicons name='arrow-back-outline' color='white' size={20}
                            onPress={() => navigation.goBack()}
                    />
                    <TextView
                        size="lg"
                        weight='md'
                        text={i18n.t("Select Language")}
                        style={tw`ml-3`}
                />
            </FlexRow>
            {modal && <ConfirmChangeLanguage />}
            <ScrollView style={tw`mt-6`}>
                {
                    language.map((item, i) => (
                        <View key={i} style={[tw`relative`, { overflow: 'scroll' }]}>
                            <List
                                element={Pressable}
                                style={tw`border-b border-white py-4 bg-neutral-600`}
                                text={item?.full}
                                size="md"
                                onPress={() => { 
                                    setModal(true); 
                                    setSelectedLanguage(item.short) 
                                }}
                            />
                        </View>
                    ))
                }
            </ScrollView>
        </Container>
    )
}

export default SelectLanguageScreen
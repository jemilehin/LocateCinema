import { useState,useEffect } from "react"
import AsyncStorage from '@react-native-async-storage/async-storage';
import { I18n } from "i18n-js";
import { useDispatch, useSelector } from 'react-redux'
import tw from 'twrnc'
import { Pressable, SafeAreaView, ScrollView, View } from "react-native"
import Container from "../Component/Container"
import { de, en, fr, es, ind } from '../assets/Localization/languages';
import TextView from "../Component/TextView";
import List from "../Component/list/List";
import { LOGOUTUSER } from "../ReduxEffect/actions";


const SettingsScreen = ({ navigation }) => {
    const selectLanguageFromRedux = useSelector(state => state.reducers.language)
    const dispatch = useDispatch()

    const [language, setLanguage] = useState(selectLanguageFromRedux)
    const i18n = new I18n({ ...en, ...de, ...fr, ...es, ...ind })
    i18n.defaultLocale = language
    i18n.locale = language

    const list = [
        { name: 'Edit Account', route: 'edit_account' },
        // { name: 'Change Password', route: 'change_password' },
        {
            name: 'Language', route: 'select_language', 
        }
    ]

    const navigate = (route, i) => {
        if (route !== '') {
            navigation.navigate(route)
        } 
    }

    useEffect(() =>{
        setLanguage(selectLanguageFromRedux)
    },[selectLanguageFromRedux])

    const Logout = async () => {
        await AsyncStorage.multiRemove(['user','token'])
        dispatch(LOGOUTUSER)
    }


    return (
        <Container element={SafeAreaView}>
            <TextView
                size="xl"
                weight='md'
                text={i18n.t("More Actions")}
                style={tw`ml-3`}
            />
            <ScrollView style={tw`mt-6`}>
                {
                    list.map((item, i) => (
                        <View key={i} style={[tw`relative`,{overflow: 'scroll'}]}>
                            <List
                                element={Pressable}
                                style={tw`border-b border-white py-4 bg-neutral-600`}
                                text={i18n.t(item.name)}
                                size="md"
                                onPress={() => item?.action ? item.action() : navigate(item.route, i)}
                            />
                        </View>
                    ))
                }
                <List
                    element={Pressable}
                    style={tw`border-b border-white py-4 bg-neutral-600`}
                    text={i18n.t('Logout')}
                    size="md"
                    onPress={() => Logout()}
                />
            </ScrollView>
            <View style={tw`p-3`}>
                <TextView
                    size="sm"
                    weight='xs'
                    text={i18n.t('Request for account deletion contact:')}
                    style={tw`text-center`}
                />
                <TextView
                    size="sm"
                    weight='xs'
                    text={"support@locatecinema.com"}
                    style={tw`text-center`}
                />
            </View>
        </Container>
    )
}

export default SettingsScreen
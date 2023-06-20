import { useState,useEffect } from "react"
import AsyncStorage from '@react-native-async-storage/async-storage';
import { I18n } from "i18n-js";
import { useDispatch, useSelector } from 'react-redux'
import tw from 'twrnc'
import { Pressable, SafeAreaView, ScrollView, TouchableOpacity, View } from "react-native"
import Container from "../Component/Container"
import { de, en, fr, es, ind } from '../assets/Localization/languages';
import TextView from "../Component/TextView";
import List from "../Component/list/List";
import { AppRequestCall } from "../Connection/RequestInstance";
import FlexRow from "../Component/Layout/FlexRow";
import Button from "../Component/RoundedButton";


const SettingsScreen = ({ navigation }) => {
    const selectLanguageFromRedux = useSelector(state => state.reducers.language)
    const user = useSelector(state => state.reducers.user)
    const dispatch = useDispatch()
    const [modal,setModal] = useState(false)
    const [loading,setLoading] = useState(false)

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
        dispatch({type: 'LOG_OUT_USER'})
    }

    // function to clean app data from device local storage
    const deleteData = async () => {
        await AsyncStorage.multiRemove(['geolocation','country_short','token','user'])
    }

    const DeleteAcount = () => {
        AppRequestCall(`deleteUser/${user.id}`,null,callback,errcallback,null, 'delete')
        setLoading(!loading)
    }

    const callback = (res) => {
        alert(res.message)
        setModal(false)
        setLoading(false)
        deleteData()
        dispatch({type: DELETE_USER, payload:{user: {}, token: null,}})
    }

    const errcallback = (res) => {
        alert(res.message)
        setModal(false)
        setLoading(false)
    }

    const openModal = () =>{ setModal(!modal)}

    // component to display if user wants to delete account
    const ConfirmAccountDeletion = () => {
        // dispatch({type: CHANGE_LANAGUGAGE, payload: })
        return (
            <View style={tw`p-2 bg-white rounded-lg absolute top-1/3 z-10 left-1/8  w-4/5`}>
                <TextView size='lg' color="black" text={i18n.t("Are you sure you want to delete account?")} />
                <FlexRow style={tw`h-20 justify-center`}>
                    <Button
                        element={TouchableOpacity}
                        text={i18n.t('Cancel')}
                        size='xm'
                        color='black'
                        weight='sm'
                        style={[tw`w-auto border px-2 mr-3`, { backgroundColor: 'white' }]}
                        textStyle={tw`text-center`}
                        onPress={() => openModal()}
                        paddingX={tw`px-0`}
                    />

                    <Button
                        element={TouchableOpacity}
                        text={i18n.t('Proceed')}
                        size='xm'
                        color='white'
                        weight='sm'
                        style={[tw`w-auto px-2 ml-3`, { backgroundColor: 'rgba(55,52,52,1)' }]}
                        textStyle={tw`text-center`}
                        onPress={() => DeleteAcount()}
                        paddingX='px-0'
                        loading={loading}
                    />
                </FlexRow>
            </View>
        )
    }


    return (
        <Container element={SafeAreaView}>
            <TextView
                size="xl"
                weight='md'
                text={i18n.t("More Actions")}
                style={tw`ml-3`}
            />
            {modal && <ConfirmAccountDeletion />}
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
                {/* <List
                    element={Pressable}
                    style={tw`border-b border-white py-4 bg-neutral-600`}
                    text={i18n.t('Delete Account')}
                    size="md"
                    onPress={() => openModal()}
                /> */}
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
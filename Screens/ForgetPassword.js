import { useState } from "react"
import { I18n } from "i18n-js";
import { useDispatch, useSelector } from 'react-redux'
import tw from 'twrnc'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { Pressable, SafeAreaView, ScrollView, View } from "react-native"
import Container from "../Component/Container"
import FlexRow from "../Component/Layout/FlexRow"
import { de, en, fr, es, ind } from '../assets/Localization/languages';
import TextView from "../Component/TextView";
import List from "../Component/list/List";
import SelectLanguage from "../Component/SelectLanguage";
import { LOGOUTUSER } from "../ReduxEffect/actions";
import Button from "../Component/RoundedButton";
import { AppRequestCall } from "../Connection/RequestInstance";
import CurvedTextInputs from "../Component/CurvedSquareInputs";


const ForgotPasswordScreen = ({ navigation }) => {
    const selectLanguageFromRedux = useSelector(state => state.reducers.language)
    const [recoveryEmail, setRecoveryEmail] = useState('')
    const [isLoading, setIsLoading] = useState(false);

    const [language, setLanguage] = useState(selectLanguageFromRedux)
    const i18n = new I18n({ ...en, ...de, ...fr, ...es, ...ind })
    i18n.defaultLocale = language
    i18n.locale = language

    const onSubmitEmail = () => {
        setIsLoading(true)
        AppRequestCall('resetPassword',recoveryEmail,callback,errcallback,null,'post')
    }

    const callback = (response) => {
        setIsLoading(false)
        navigation.navigate('change_password', {token: response.token, email: recoveryEmail.email})
        alert(JSON.stringify(`token successfully recieved: ${response.token}`))
    }

    const errcallback = (err) => {
        alert(err.message)
        setIsLoading(false)
    }
    return (
        <Container element={SafeAreaView}>
            <FlexRow direction='flex-column' center='items-start'>
            <Ionicons name='arrow-back-outline' color='white' size={20}
                    onPress={() => navigation.goBack()}
                />
                <TextView
                    size="xl"
                    weight='md'
                    text='Password Recovery'
                    style={tw`w-1/2`}
                />
            </FlexRow>

            <View style={tw`flex-column my-auto`}>
                <CurvedTextInputs
                    placeholder='Enter email'
                    style={tw``}
                    onChangeText={(text) => setRecoveryEmail({ ...recoveryEmail, email: text })}
                />

                <Button
                    element={Pressable}
                    text={i18n.t('Submit')}
                    size='md'
                    color='white'
                    weight='sm'
                    style={[tw`mt-5 mx-auto `, { backgroundColor: 'rgba(55,52,52,1)' }]}
                    textStyle={tw`text-center`}
                    onPress={() => onSubmitEmail()}
                    loading={isLoading}
                />
            </View>
        </Container>
    )
}

export default ForgotPasswordScreen
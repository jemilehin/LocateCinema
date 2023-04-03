import { useEffect, useState } from "react"
import { I18n } from "i18n-js";
import { useDispatch, useSelector } from 'react-redux'
import tw from 'twrnc'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { Pressable, SafeAreaView, ScrollView, View } from "react-native";
import Container from "../Component/Container";
import TextView from "../Component/TextView";
import { AppRequestCall } from "../Connection/RequestInstance"
import FlexRow from "../Component/Layout/FlexRow";
import CurvedTextInputs from "../Component/CurvedSquareInputs";
import Button from "../Component/RoundedButton";


const ChangePasswordScreen = ({ navigation,route }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [newpassword, setNewPassword] = useState(null);
    // const [passwordConfirmation, setPasswordConfirmation] = useState('');
    const [recoveryCredentials] = useState(route?.params)
    const user = useSelector((state) => state.reducers.user)
    const [errMessage, setErrorMessage] = useState(false)

    const UpdatePassword = () => {
        if (newpassword === null) {
            alert("Fields can't be empty")
        } else {
            if(newpassword.password !== newpassword.password_confirmation){
                setErrorMessage(true)
            }else{
                setErrorMessage(false);
                setIsLoading(true);
                setNewPassword({...newpassword, token: recoveryCredentials.token, email: recoveryCredentials.email});
                AppRequestCall('changePassword', newpassword, callback, errCallback, null, 'post');
            }
        }
    }

    const callback = (response) => {
        setIsLoading(false)
        setNewPassword(null)
        // setPasswordConfirmation('')
        alert('Password successfully reset to your new password.')
        navigation.navigate('login')
    }

    const errCallback = (err) => {
        setIsLoading(false)
        setNewPassword(null)
        // setPasswordConfirmation('')
        // alert(`err: ${JSON.stringify(err)}`)
        alert(err.message)
    }

    return (
        <Container element={SafeAreaView}>
            <FlexRow>
                <Ionicons name='arrow-back-outline' color='white' size={20}
                    onPress={() => navigation.goBack()}
                />
                <TextView
                    size="lg"
                    weight='md'
                    text="Change Password"
                    style={tw`ml-3`}
                />
            </FlexRow>
            <FlexRow direction={'flex-column'} style={tw` mt-12 flex-1`}>
                <TextView text='One time token' />
                <CurvedTextInputs
                    value={recoveryCredentials?.token.toString()}
                    editable={false}
                />

                <CurvedTextInputs
                    style={tw`mt-12`}
                    value={recoveryCredentials['email']}
                    editable={false}
                />

                <CurvedTextInputs
                    placeholder='New password'
                    style={tw`mt-12`}
                    onChangeText={(text) => setNewPassword({ ...newpassword, password: text })}
                    onFocus={() => errMessage && setErrorMessage(!errMessage)}
                />

                <View style={tw`w-full my-12`}>
                    <CurvedTextInputs
                        placeholder='Confirm password'
                        style={tw``}
                        onChangeText={(text) => setNewPassword({...newpassword, password_confirmation: text})}
                        onBlur={() => newpassword.password !== newpassword.password_confirmation ? setErrorMessage(true) : setErrorMessage(false)}
                        onFocus={() => errMessage && setErrorMessage(!errMessage)}
                    />
                    {!errMessage ? null : <TextView weight='xm' text="Password does not match" />}
                </View>

                <Button
                    element={Pressable}
                    text="Update"
                    size='md'
                    color='white'
                    weight='sm'
                    style={[tw`mt-5 mx-auto `, { backgroundColor: 'rgba(55,52,52,1)' }]}
                    textStyle={tw`text-center`}
                    onPress={() => UpdatePassword()}
                    loading={isLoading}
                />
            </FlexRow>

        </Container>
    )
}

export default ChangePasswordScreen
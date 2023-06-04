import { ActivityIndicator, View } from "react-native"
import tw from 'twrnc'

const OnReadyComponent = (props) => {
    return(
        <View style={tw`w-full`}>
            {props?.status ? <ActivityIndicator color={"white"} size={30} /> : props?.children}
        </View>
    )
}

export default OnReadyComponent
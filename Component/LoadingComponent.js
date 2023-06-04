import { ActivityIndicator, View } from "react-native"
import tw from 'twrnc'

const LoadingComponent = (props) => {
    return(
        <View style={tw`w-full`}>
            {props?.status ? <ActivityIndicator color={"white"} size={30} /> : props?.children}
        </View>
    )
}

export default LoadingComponent
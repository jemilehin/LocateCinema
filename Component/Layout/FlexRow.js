import { View } from "react-native";
import tw from 'twrnc'

const FlexRow = (props) => {
    return(
        <View 
            style={[tw`${props?.direction ? props?.direction : 'flex-row'} ${props?.center ? props.center : 'items-center'}`,props?.style]}
        >
            {props.children}
        </View>
    )
}

export default FlexRow
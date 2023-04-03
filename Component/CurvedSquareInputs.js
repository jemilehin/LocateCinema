import FlexRow from "./Layout/FlexRow"
import tw from 'twrnc'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { TextInput, View } from "react-native"


const CurvedTextInputs = (props) => {
    const curvedSides = () => {
        switch (props.side) {
            case 'top':
                return 'rounded-t-lg'
            case 'bottom':
                return 'rounded-b-lg'
            default:
                return ''
        }
    }
    return (
        <FlexRow style={[tw`bg-white px-2 ${curvedSides()}`, props.style]}>
            <Ionicons name={props.name} color='black' size={20} style={tw`mr-2`} />
            <View style={tw`h-13 grow flex-row`}>
                <TextInput
                    {...props}
                    style={[tw`h-13 grow px-1`]}
                />
                {props?.icon}
            </View>
        </FlexRow>
    )
}

export default CurvedTextInputs
import FlexRow from "./Layout/FlexRow"
import tw from 'twrnc'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { TextInput } from "react-native"


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
            <TextInput
                {...props}
                style={[tw`h-13 flex-1 px-1`]}
            />
        </FlexRow>
    )
}

export default CurvedTextInputs
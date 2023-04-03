import { Image, Pressable, View } from "react-native"
import tw from 'twrnc'
import FlexRow from "../Layout/FlexRow"
import TextView from "../TextView"


const ListCinemaSingle = (props) => {
    return (<Pressable {...props} style={[tw`rounded-md px-3 py-2 my-3`, { backgroundColor: '#373434' }]}>
        <FlexRow style={tw`justify-between`}>
            <Image
                style={{resizeMode: "contain", width: 50, height: 50}}
                source={props?.uri ? props?.img_source : {uri: props?.img_source}}
            />
            <View style={tw`w-4/5`}>
                <TextView
                    text={props?.name} size='md' weight='xs'
                    style={tw`leading-4`}
                />
                <TextView
                    text={props?.distance} size='md' weight='xs'
                    style={tw`leading-4 mr-3 my-1`}
                />
            </View>
        </FlexRow>
    </Pressable>)
}

export default ListCinemaSingle
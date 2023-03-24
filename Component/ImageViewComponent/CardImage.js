import tw from 'twrnc';
import { Image, Pressable, View } from "react-native"
import TextView from "../TextView"


const CardImage = (props) => {
    return (
        <Pressable {...props} style={[tw`mx-3 rounded-t-lg`, {backgroundColor: '#ffffff',}]}>
            <Image 
                source={props.imageURL}
                resizeMethod='scale'
                style={[tw`rounded-t-lg`,{ height: 175, resizeMode: props.resizeMode, width: props.width}]}
            />
            <View >
                <TextView
                    text={props.imageText}
                    size='sm'
                    style={tw`text-center`}
                    color='black'
                />
            </View>
        </Pressable>
    )
}

export default CardImage
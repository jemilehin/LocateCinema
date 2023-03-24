import { Pressable,} from "react-native"
import tw from "twrnc"
import TextView from "../TextView"


const ListItem = (props) => {
    return(
        <Pressable
            {...props}
            onPress={() => props.LoadFilm()}
         style={[tw`px-2 py-1`,{backgroundColor: '#373434'},props.conditionStyle]}>
            <TextView
                size='xs'
                weight='xs'
                text={props.title}
                style={tw`text-left`}
            />
        </Pressable>
    )
}

export default ListItem
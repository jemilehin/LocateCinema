import { Pressable, View } from "react-native"
import tw from 'twrnc'
import FlexRow from "../Layout/FlexRow"
import TextView from "../TextView"


const ListCinemaView = (props) => {
    return (<Pressable {...props} style={[tw`rounded-md px-3 py-2 my-3`, { backgroundColor: '#373434' }]}>
        <TextView
            text={props?.cinemaName} size='md' weight='sm'
            style={tw`leading-4 `}
        />
        <FlexRow>
            <TextView
                text={`Date: ${props?.date}`} size='md' weight='xs'
                style={tw`leading-4 mr-3 my-1`}
            />
            <TextView
                text={`Time: ${props?.time}(GMT)`} size='md' weight='xs'
                style={tw`leading-4`}
            />
        </FlexRow>
        <TextView
            text={`Address: ${props?.cAddress}`} size='sm' weight='xs'
            style={tw`leading-4`}
        />
    </Pressable>)
}

 export default ListCinemaView
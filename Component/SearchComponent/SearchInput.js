import { View, TextInput, ActivityIndicator } from "react-native"
import tw from 'twrnc'
import FontAwesome from 'react-native-vector-icons/FontAwesome';


const SearchInput = (props) => {
    return (
        <>
            <TextInput
                onFocus={() => props.onFocus()}
                placeholder={props?.placeholder || 'Search movies'}
                style={tw`rounded-3xl pl-3 bg-gray-300 h-10`}
                onChangeText={(text) => props.setSearch(text)}
            />
           {props.status === false ?  <FontAwesome
                style={tw`absolute right-3.5 top-1`}
                size={30}
                name='search'
                onPress={() => props.SubmitSearch()}
            /> : <ActivityIndicator style={tw`absolute right-3.5 top-2.5`} color='black'/> }
        </>
    )
}

export default SearchInput
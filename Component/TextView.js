import { Text } from "react-native"


const TextView = (props) => {
    const textType = (size) => {
        if(size === 'xs'){
            return 12
        }else if(size === 'sm'){
            return 14
        }else if(size === 'md'){
            return 17
        }else if(size === 'lg'){
            return 18
        }else if(size === 'xl'){
            return 40
        }else return 14
    }

    const fontWeight = (wht) => {
        if(wht === 'xs'){
            return '400'
        }else if(wht === 'sm'){
            return '500'
        }else if(wht === 'md'){
            return '700'
        }else if(wht === 'lg'){
            return '900'
        }else return '500'
    }
    return(
        <Text
        {...props}
        
            style={[{fontSize: textType(props.size), 
                color: props.color ? props.color : 'white',
                fontWeight: fontWeight(props.weight)
            },props.style]}
        >
            {props.text}
        </Text>
    )
}

export default TextView
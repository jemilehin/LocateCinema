import React from "react"
import { ActivityIndicator,View } from "react-native"
import tw from 'twrnc'
import TextView from "./TextView"


const Button = (props) => {
    return (
        React.createElement(props.element,
            {...props, style:[tw`px-20 py-4 rounded-xl`,{ backgroundColor: props.bg !== undefined ? props.bg : 'rgba(188,68,68,1)'},props.style]},
            <View>
            {props.loading ? <ActivityIndicator /> : <TextView
                    text={props.text}
                    size={props.size}
                    color={props.color}
                    weight={props.wght}
                    style={props.textStyle}
            />}
            </View>

        )
    )
}

export default Button
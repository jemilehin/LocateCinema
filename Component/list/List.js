import React, { Children } from "react"
import tw from 'twrnc'
import { View } from "react-native"
import TextView from "../TextView"

const List = (props) => {
    return(
        React.createElement(props?.element, {...props, style: [tw`px-2`,props?.style] },
            <TextView
                text={props?.text}
                color={props?.color}
                size={props?.size}
                style={props?.textStyle}
            />
        )
    )
}

export default List
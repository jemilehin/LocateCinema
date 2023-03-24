import React from "react"
import { StatusBar } from "react-native"

const Container = (props) => {

  return (
    React.createElement(props.element, { ...props, style: { paddingRight: 10, paddingLeft: 10, paddingTop: 20, flex: 1, backgroundColor: "#1A1919" } }, props.children)
  )
}

export default Container
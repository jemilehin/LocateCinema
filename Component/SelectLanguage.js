import { Picker } from "@react-native-picker/picker";
import React, { useState } from "react";
import { Text, View } from "react-native";
import Ionicons from 'react-native-vector-icons/Ionicons'
import tw from "twrnc";

import Countries from '../assets/Countries.json'
import { language } from "../assets/Localization/languages";
import FlexRow from "./Layout/FlexRow";


const SelectLanguage = (props) => {
    const [toggle,setToggle] = useState(false)

    return(
    <View style={[tw`${props?.position ? props?.position : 'relative'} flex  px-2 ${props?.zindex}`,{width: props?.width || '100%'}]}>
        <FlexRow style={[tw`border h-10 rounded border-white absolute px-2`,
         {top: props?.top || 10, right: props?.right || 20}]}>
            <Text style={[tw`text-white`,{fontSize: 20}]}>
                {props?.language}
            </Text>
            <Ionicons onPress={() => setToggle(!toggle)}  style={tw`ml-3 my-auto`} color={'white'} size={20} name={!toggle || props?.keyboard ? "caret-down-outline" : "caret-up"} />
        </FlexRow>
        {toggle && !props?.keyboard ? <View style={[tw`absolute bg-white`,{right: props?.textRight || 40 , top:  props?.textTop || 50, width: 50}]}>
                {language.map((lang,index) =>(
                <Text key={index} onPress={() => {
                    props?.setLanguage(lang.short)
                    setToggle(false)
                    }} style={[tw`text-black text-center`,{fontSize: 20}]}>
                    {lang.short}
                </Text>)
                )}</View> : null}
    </View>
    )
}

export default SelectLanguage
import { I18n } from "i18n-js";
import store from "../../ReduxEffect/store";
import {de, en,fr,es,ind} from '../../assets/Localization/languages';

export const callback = (response,setData,status,property) => {
    const language = store.getState().reducers.language
    const i18n = new I18n({...en, ...de, ...fr, ...es,...ind})
    i18n.defaultLocale = language
    i18n.locale = language
    if(status === 204){
        alert(i18n.t('No data found from cloud'))
    }else
        setData(response.data[property])
}
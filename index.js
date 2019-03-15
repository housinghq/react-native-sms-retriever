Object.defineProperty(exports, "__esModule", {
    value: true
})

 import { NativeModules } from 'react-native';
// export const {SMSRetrieverModule, HintPickerModule} = NativeModules

import OtpRetrieval from './OtpRetrieval'
export default {
    OtpRetrieval: OtpRetrieval,
    SMSRetrieverModule: NativeModules.SMSRetrieverModule
}
// module.exports = {
//     OtpRetrieval: OtpRetrieval,
//     SMSRetrieverModule: NativeModules.SMSRetrieverModule
//   }

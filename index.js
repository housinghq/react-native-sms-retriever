Object.defineProperty(exports, "__esModule", {
    value: true
})

import { NativeModules } from 'react-native';
import OtpRetrieval from './OtpRetrieval'

export const {SMSRetrieverModule, HintPickerModule} = NativeModules
module.exports = {
    OtpRetrieval: OtpRetrieval
  }
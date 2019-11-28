Object.defineProperty(exports, "__esModule", {
    value: true
})

import { NativeModules } from 'react-native';
import OtpRetrieval from './OtpRetrieval'

module.exports = {
    OtpRetrieval: OtpRetrieval,
    HintPickerModule: NativeModules.HintPickerModule,
    OtpRetrieverModule: NativeModules.SMSRetrieverModule
  }
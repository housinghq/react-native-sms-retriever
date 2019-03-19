import { NativeEventEmitter, NativeModules } from 'react-native'
import React, { Component } from 'react'
import GenericTextInput from './GenericTextInput';
import R from 'ramda'
import { Sentry } from 'react-native-sentry'

const isEmpty = R.anyPass([R.isNil, R.isEmpty])

const { SMSRetrieverModule } = NativeModules
 export default class OtpRetrieval extends Component{
      otpRetrievalComplete= false

    componentDidMount(){
        this.startSMSListener()
    }

    extractOTPFromMessage = (message) => {
      const { position } = this.props
      let array = []
      if (!isEmpty(message)) {
        array = message.split(' ')
      }
    
      if (!isEmpty(array) && array.length >= 3) {
        return array[position]
      }
      return null
    }

    onOtpRecieved = (event) => {
        if (!isEmpty(event)) {
          const otp = this.extractOTPFromMessage(event.message)
          this.otpRef.onChangeText(otp)
          this.otpRetrievalComplete= true
        }
      }

      onChangeOtpText = (otp) => {
          if(this.otpRetrievalComplete) {
             this.props.onAutoReadComplete(otp)   
          }
        //this.props.onChangeText(otp)
      }

      setOTPRef = (ref) => {
        this.otpRef = ref
        if (!isEmpty(ref)) {
          ref.clear() // to clear the field when login with otp pressed
        }
      }
    
      startSMSListener() {
        try {
          SMSRetrieverModule.startSMSListener()
          const messageEventEmitter = new NativeEventEmitter(SMSRetrieverModule)
          messageEventEmitter.addListener('com.RNSmsRetriever:otpReceived', this.onOtpRecieved)
        } catch (exception) {
          Sentry.captureException(exception)
        }
      }

    render() {
        const { position, onChangeOtpText, onChangeText , ...others} = this.props
        return(
            <GenericTextInput 
                {...others}
                onChangeText={this.onChangeOtpText}
                ref={this.setOTPRef}
            />
        )
    }

 }
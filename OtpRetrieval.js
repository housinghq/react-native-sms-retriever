import { NativeEventEmitter, NativeModules, Platform, } from 'react-native'
import React, { Component } from 'react'
import GenericTextInput from './GenericTextInput';
import R from 'ramda'
import PropTypes from 'prop-types'

const isEmpty = R.anyPass([R.isNil, R.isEmpty])

const { SMSRetrieverModule } = NativeModules
 export default class OtpRetrieval extends Component{

  static propTypes = {
    refCallback:PropTypes.func,
    onAutoReadComplete:PropTypes.func,
    position:PropTypes.number,
    onChangeText: PropTypes.func,
    onErrorOccured: PropTypes.func
  }

  static defaultProps = {
    refCallback: () => {},
    onAutoReadComplete: () => {},
    position: 2,
    onChangeText: () => {},
    onErrorOccured: () => {}
  }

    componentDidMount(){
      if (Platform.OS==='android') {
        this.startSMSListener()
      }
    }

    isNumeric = (value) => {
      return !isNaN(value)
    }

    extractOTPFromMessage = (message) => {
      const { position } = this.props
      let array = []
      if (!isEmpty(message)) {
        array = message.split(' ')
      }
    
      if (!isEmpty(array) && array.length >= 3 && this.isNumeric(array[position])) {
        return array[position]
      }
      return null
    }

      onOtpRecieved = (event) => {
        if (!isEmpty(event)) {
          const otp = this.extractOTPFromMessage(event.message)
          if (!isEmpty(this.otpRef) && !isEmpty(otp)){
            this.otpRetrievalComplete= true
            this.otpRef.onChangeText(otp)
          } 
        }
      }

      onChangeText = (text) => {
        if (this.otpRetrievalComplete){
          this.props.onAutoReadComplete(text)
          this.otpRetrievalComplete=false
        }
        const { onChangeText } = this.props
        onChangeText(text)
      }

      setOTPRef = (ref) => {
        this.props.refCallback(ref)
        this.otpRef = ref
      }
    
      startSMSListener() {
        try {
          SMSRetrieverModule.startSMSListener()
          const messageEventEmitter = new NativeEventEmitter(SMSRetrieverModule)
          messageEventEmitter.addListener('com.RNSmsRetriever:otpReceived', this.onOtpRecieved)
        } catch (exception) {
          this.props.onErrorOccured(exception)
        }
      }

    resendClicked = () => {
      this.startSMSListener()
    }

    render() {
        const { refCallback, onAutoReadComplete, onErrorOccured, position, onChangeText , ...others} = this.props
        return(
            <GenericTextInput 
                {...others}
                onChangeText={this.onChangeText}
                ref={this.setOTPRef}
                resendClicked={this.resendClicked}
            />
        )
    }

 }
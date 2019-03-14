import { SMSRetrieverModule } from './index'
import { Component, NativeEventEmitter } from 'react-native'
import GenericTextInput from './GenericTextInput';

let otpRetrievalComplete = false
 export default class OtpRetrieval extends Component{
    
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
          this.otpRetrievalComplete = true
        }
      }

      onChangeOtpText = (otp) => {
          if(this.otpRetrievalComplete) {
             this.props.onAutoReadComplete(otp)   
          }  
        this.props.onChangeText()
      }

      setOTPRef = (ref) => {
        this.otpRef = ref
        if (!isEmpty(ref)) {
          ref.clear() // to clear the field when login with otp pressed
        }
      }
    
      async startSMSListener() {
        try {
          SMSRetrieverModule.startSMSListener()
          const messageEventEmitter = new NativeEventEmitter(SMSRetrieverModule)
          messageEventEmitter.addListener('com.RNSmsRetriever:otpReceived', this.onOtpRecieved)
        } catch (exception) {
          Sentry.captureException(exception)
        }
      }

    render() {
        const { position, onChangeOtpText, onChangeText , ...others} = props
        return(
            <GenericTextInput 
                {...others}
                onChangeText={this.onChangeOtpText}
                ref={this.setOTPRef}
            />
        )
    }

 }
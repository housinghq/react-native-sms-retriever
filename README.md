
# react-native-sms-retriever
A library used by Housing Apps to read SMS on Android Platform
## Getting started

`$ npm install @housing/react-native-sms-retriever --save`

### Mostly automatic installation

`$ react-native link @housing/react-native-sms-retriever`

### Manual installation


#### Android

1. Open up `android/app/src/main/java/[...]/MainActivity.java`
  - Add `import com.smsRetriever.reactnative.RNSmsRetrieverPackage;` to the imports at the top of the file
  - Add `new RNSmsRetrieverPackage()` to the list returned by the `getPackages()` method
2. Append the following lines to `android/settings.gradle`:
  	```
  	include ':@housing/react-native-sms-retriever'
  	project(':@housing/react-native-sms-retriever').projectDir = new File(rootProject.projectDir, 	'../node_modules/@housing/react-native-sms-retriever/android')
  	```
3. Insert the following lines inside the dependencies block in `android/app/build.gradle`:
  	```
      implementation project(':@housing/react-native-sms-retriever')
  	```


## Usage
```javascript
import { HintPicker } from '@housing/react-native-sms-retriever';
import { OtpRetrieval } from '@housing/react-native-sms-retriever';

//Usage for hint Picker

async requestHint() {
    try {
      let phoneNumber = await HintPickerModule.requestHint()
      //phoneNumber is the number User selected
      
    } catch (exception) {
      Sentry.captureException(exception)
    }
  }
  
 //Usage for SmsRetriever 
 // The library is wrapped inside a component which is a generic text input.It retrieves and populates the OTP in the text input.
 
 <OtpRetrieval
    onAutoReadComplete={this.onAutoReadComplete}  // callback which returns the retrieved otp back to the app in argument
    refCallback={this.setOTPRef}  // callback which gives the ref of the Generic TextInput in the library.We set the ref to access functions of Generic TextInput
    type="otp"
    autoCorrect={false}
    autoCapitalize="none"
    placeholder={Constants.OTP_PLACEHOLDER}
    errorText={Constants.OTP_ERROR_TEXT}
    position={otpPosition}  // specifies the position of OTP in the text message that user gets while OTP Verification
    onErrorOccured={this.onErrorOccured}  // A callback that gives any error occured during OTP Retrieval.
  />

  // To handle reset, the ref that is set in refCallback must call onResendClicked.
  // Pass onChangeText as props to the library to handle the case when the user enters OTP manually.
  
```
  

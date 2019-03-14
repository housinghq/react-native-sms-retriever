
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
import { SmsRetirever } from '@housing/react-native-sms-retriever';

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
 
 startSMSListener() {
    try {
      SMSRetrieverModule.startSMSListener()
      const messageEventEmitter = new NativeEventEmitter(SMSRetrieverModule)
      messageEventEmitter.addListener(Constants.MESSAGE_EVENT_TAG, (Give callback))
    }
    catch (exception) {
      Sentry.captureException(exception)
    }
  }
  
```
  

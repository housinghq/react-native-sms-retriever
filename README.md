
# react-native-sms-retriever
A library used by Housing Apps to read SMS on Android Platform
## Getting started

`$ npm install react-native-sms-retriever --save`

### Mostly automatic installation

`$ react-native link react-native-sms-retriever`

### Manual installation


#### Android

1. Open up `android/app/src/main/java/[...]/MainActivity.java`
  - Add `import com.smsRetriever.reactnative.RNSmsRetrieverPackage;` to the imports at the top of the file
  - Add `new RNSmsRetrieverPackage()` to the list returned by the `getPackages()` method
2. Append the following lines to `android/settings.gradle`:
  	```
  	include ':react-native-sms-retriever'
  	project(':react-native-sms-retriever').projectDir = new File(rootProject.projectDir, 	'../node_modules/react-native-sms-retriever/android')
  	```
3. Insert the following lines inside the dependencies block in `android/app/build.gradle`:
  	```
      compile project(':react-native-sms-retriever')
  	```


## Usage
```javascript
import RNSmsRetriever from 'react-native-sms-retriever';

// TODO: What to do with the module?
RNSmsRetriever;
```
  
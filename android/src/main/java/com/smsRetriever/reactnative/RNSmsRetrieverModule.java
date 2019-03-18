
package com.smsRetriever.reactnative;

import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.LifecycleEventListener;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableMap;
import com.google.android.gms.auth.api.phone.SmsRetriever;
import com.google.android.gms.auth.api.phone.SmsRetrieverClient;
import com.google.android.gms.tasks.OnFailureListener;
import com.google.android.gms.tasks.OnSuccessListener;
import com.google.android.gms.tasks.Task;
import android.content.BroadcastReceiver;
import android.content.IntentFilter;
import android.support.annotation.NonNull;
import android.util.Log;
import java.util.*;

public class RNSmsRetrieverModule extends ReactContextBaseJavaModule implements LifecycleEventListener{

  private Promise verifyDeviceCallback;
  private BroadcastReceiver mReceiver;
  private boolean isReceiverRegistered = false;
  private SmsRetrieverClient smsRetrieverClient;

  public RNSmsRetrieverModule(ReactApplicationContext reactContext) {
    super(reactContext);
    mReceiver=new RNSmsRetrieverBroadcastReciever(reactContext);
    getReactApplicationContext().addLifecycleEventListener(this);
    registerReceiverIfNecessary(mReceiver);
  }

  @Override
  public String getName() {
    return "SMSRetrieverModule";
  }

  @ReactMethod
  public void startSMSListener(final Promise verifyDeviceSuccess){
    verifyDeviceCallback = verifyDeviceSuccess;
    if(null == smsRetrieverClient) {
      smsRetrieverClient = SmsRetriever.getClient(getReactApplicationContext());
    }
    Task<Void> task = smsRetrieverClient.startSmsRetriever();
    task.addOnSuccessListener(new OnSuccessListener<Void>() {
      @Override
      public void onSuccess(Void aVoid) {
          if (verifyDeviceCallback != null) {
              verifyDeviceCallback.resolve(true);
          }
      }
    });
    task.addOnFailureListener(new OnFailureListener() {
      @Override
      public void onFailure(@NonNull Exception e) {
          if (verifyDeviceCallback != null) {
              verifyDeviceCallback.reject(e);
          }
      }
    });
  }

  @ReactMethod
  public void getHash(Promise promise) {
    try {
      SignatureHelperClass helper = new SignatureHelperClass(getReactApplicationContext());
      ArrayList<String> signatures = helper.getAppSignatures();
      WritableArray arr = Arguments.createArray();
      for (String s : signatures) {
        arr.pushString(s);
      }
      promise.resolve(arr);
    } catch (Exception e) {
      promise.reject(e);
    }
  }

  private void registerReceiverIfNecessary(BroadcastReceiver receiver) {
    if (getCurrentActivity() == null) return;
    try {
      getCurrentActivity().registerReceiver(
              receiver,
              new IntentFilter(SmsRetriever.SMS_RETRIEVED_ACTION)
      );
      isReceiverRegistered = true;
    } catch (Exception e) {
      e.printStackTrace();
    }
  }

  private void unregisterReceiver(BroadcastReceiver receiver) {
    if (isReceiverRegistered && getCurrentActivity() != null && receiver != null) {
      try {
        getCurrentActivity().unregisterReceiver(receiver);
        isReceiverRegistered = false;
      } catch (Exception e) {
        e.printStackTrace();
      }
    }
  }
  @Override
  public void onHostResume() {
    registerReceiverIfNecessary(mReceiver);
  }

  @Override
  public void onHostPause() {
    unregisterReceiver(mReceiver);
  }

  @Override
  public void onHostDestroy() {
    unregisterReceiver(mReceiver);
  }
}
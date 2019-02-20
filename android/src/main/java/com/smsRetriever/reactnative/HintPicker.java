package com.smsRetriever.reactnative;

import android.app.Activity;
import android.app.PendingIntent;
import android.content.Intent;
import android.os.Bundle;
import android.support.annotation.NonNull;
import android.support.annotation.Nullable;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ActivityEventListener;
import com.facebook.react.bridge.BaseActivityEventListener;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.google.android.gms.auth.api.Auth;
import com.google.android.gms.auth.api.credentials.Credential;
import com.google.android.gms.auth.api.credentials.HintRequest;
import com.google.android.gms.common.ConnectionResult;
import com.google.android.gms.common.api.GoogleApiClient;

class HintPicker extends ReactContextBaseJavaModule {

    private Promise requestHintCallback;
    private static final int RESOLVE_HINT = 1001;
    private GoogleApiClient apiClient;

    private final ActivityEventListener mActivityEventListener= new BaseActivityEventListener() {
        @Override
        public void onActivityResult(Activity activity, int requestCode, int resultCode, Intent data) {
            if (requestCode == RESOLVE_HINT) {
                if (resultCode == Activity.RESULT_OK) {
                    getReactApplicationContext().removeActivityEventListener(mActivityEventListener);
                    Credential credential = data.getParcelableExtra(Credential.EXTRA_KEY);
                    if (credential != null) {
                        requestHintCallback.resolve(credential.getId());
                    }
                }
            }
        }
    };

    public HintPicker(ReactApplicationContext reactContext) {
        super(reactContext);
        apiClient = new GoogleApiClient.Builder(getReactApplicationContext())
                .addApi(Auth.CREDENTIALS_API)
                .build();
    }

    @Override
    public String getName() {
        return "HintPickerModule";
    }

    @ReactMethod
    public void requestHint(Promise requestHintCallback){
        Activity currentActivity = getCurrentActivity();
        this.requestHintCallback = requestHintCallback;
        if (currentActivity==null){
            requestHintCallback.reject("No Activity Found",new Throwable());
            return;
        }
        try{
            if (this.apiClient!=null){
                getReactApplicationContext().addActivityEventListener(mActivityEventListener);
                HintRequest hintRequest = new HintRequest.Builder()
                        .setPhoneNumberIdentifierSupported(true).build();
                PendingIntent intent = Auth.CredentialsApi.getHintPickerIntent(apiClient, hintRequest);
                currentActivity.startIntentSenderForResult(intent.getIntentSender(), RESOLVE_HINT, null, 0, 0, 0);
            }

        }
        catch(Exception e){
            requestHintCallback.reject(e);
        }

    }


}

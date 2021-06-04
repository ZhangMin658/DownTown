package com.publigrafiks.findex;

//facebook login libraries
import android.app.Application;
import android.content.pm.PackageInfo;
import android.content.pm.PackageManager;
import android.content.pm.Signature;
import android.util.Base64;
import android.util.Log;

// import com.facebook.ads.AudienceNetworkAds; // <-- add this
// import suraj.tiwari.reactnativefbads.FBAdsPackage; // <-- add this

import com.facebook.CallbackManager;
import com.facebook.FacebookSdk;
import com.facebook.appevents.AppEventsLogger;
//import com.wix.interactable.Interactable;
import com.airbnb.android.react.lottie.LottiePackage;

import io.invertase.firebase.RNFirebasePackage;



//import com.agontuk.RNFusedLocation.RNFusedLocationPackage;
import com.airbnb.android.react.maps.MapsPackage;
import com.facebook.react.ReactApplication;
import com.zaguiini.RNPureJwt.RNPureJwtPackage;
import com.reactnativecommunity.geolocation.GeolocationPackage;
import io.invertase.firebase.RNFirebasePackage;
import com.facebook.reactnative.androidsdk.FBSDKPackage;
import com.avishayil.rnrestart.ReactNativeRestartPackage;
//import com.reactnativecommunity.webview.RNCWebViewPackage;
import co.apptailor.googlesignin.RNGoogleSigninPackage;
import io.invertase.firebase.auth.RNFirebaseAuthPackage;
import io.invertase.firebase.database.RNFirebaseDatabasePackage;
import io.invertase.firebase.messaging.RNFirebaseMessagingPackage;
import io.invertase.firebase.notifications.RNFirebaseNotificationsPackage;

import com.reactnativecommunity.netinfo.NetInfoPackage;
import com.oblador.vectoricons.VectorIconsPackage;
import com.reactnativecommunity.webview.RNCWebViewPackage;
import com.sbugert.rnadmob.RNAdMobPackage;
import com.reactnative.ivpusic.imagepicker.PickerPackage;
import com.dooboolab.RNIap.RNIapPackage;
import com.reactlibrary.RNPaypalPackage;
import com.gettipsi.stripe.StripeReactPackage;
import com.swmansion.gesturehandler.react.RNGestureHandlerPackage;
import com.swmansion.reanimated.ReanimatedPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;

import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.Arrays;
import java.util.List;


public class MainApplication extends Application implements ReactApplication {

  private static CallbackManager mCallbackManager = CallbackManager.Factory.create();

  protected static CallbackManager getCallbackManager() {
    return mCallbackManager;
  }

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
          new MainReactPackage(),
            new RNPureJwtPackage(),
            new GeolocationPackage(),
            new RNFirebasePackage(),
            new FBSDKPackage(),
            new ReactNativeRestartPackage(),
            new RNCWebViewPackage(),
            new RNGoogleSigninPackage(),
            new NetInfoPackage(),
            new VectorIconsPackage(),
            new RNAdMobPackage(),
            new PickerPackage(),
            // new FBAdsPackage(),
            new RNIapPackage(),
            new RNPaypalPackage(),
            new StripeReactPackage(),
             new LottiePackage(),
            new RNGestureHandlerPackage(),
            new ReanimatedPackage(),
            new MapsPackage(),
              new RNFirebaseAuthPackage(),
              new RNFirebaseDatabasePackage(),
              new RNFirebaseMessagingPackage(),
              new RNFirebaseNotificationsPackage()

      );
    }

    @Override
    protected String getJSMainModuleName() {
      return "index";
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    SoLoader.init(this, /* native exopackage */ false);
    // AudienceNetworkAds.initialize(this); // <-- add this
    try {
      PackageInfo info = getPackageManager().getPackageInfo(getPackageName(), PackageManager.GET_SIGNATURES);
      for (Signature signature : info.signatures) {
        MessageDigest md = MessageDigest.getInstance("SHA");
        md.update(signature.toByteArray());
        String hashKey = new String(Base64.encode(md.digest(), 0));
        Log.i("Keyhash", "printHashKey() Hash Key: " + hashKey);
      }
    } catch (NoSuchAlgorithmException e) {
      Log.e("Keyhash", "printHashKey()", e);
    } catch (Exception e) {
      Log.e("Keyhash", "printHashKey()", e);
    }
  }
}

package com.billtrackerapp;

import android.content.Context;
import com.facebook.react.ReactInstanceManager;

/**
 * Class responsible of loading Flipper inside your React Native application. This is the debug
 * flavor of it. Here you can add your own plugins and customize the Flipper setup.
 */
public class ReactNativeFlipper {
  public static void initializeFlipper(Context context, ReactInstanceManager reactInstanceManager) {
    if (BuildConfig.DEBUG) {
      // Debug mode - Flipper integration can be added here if needed
      // For now, we keep it simple
    }
  }
}

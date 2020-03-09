package com.splitbundle;

import android.app.Application;
import android.content.Context;

import com.facebook.react.MyReactNativeHost;
import com.facebook.react.ReactApplication;
import com.facebook.react.ReactNativeHost;

import java.lang.reflect.InvocationTargetException;

public class MainApplication extends Application implements ReactApplication {

    private final MyReactNativeHost mReactNativeHost = new MyReactNativeHost(this);

    @Override
    public ReactNativeHost getReactNativeHost() {
        return (ReactNativeHost) mReactNativeHost;
    }

    @Override
    public void onCreate() {
        super.onCreate();
        // 禁用提升App启动速度，然后在MainActivity初始化
//        SoLoader.init(this, /* native exopackage */ false);
//        initializeFlipper(this); // Remove this line if you don't want Flipper enabled
    }

    /**
     * Loads Flipper in React Native templates.
     *
     * @param context
     */
    public static void initializeFlipper(Context context) {
        if (BuildConfig.DEBUG) {
            try {
        /*
         We use reflection here to pick up the class that initializes Flipper,
        since Flipper library is not available in release mode
        */
                Class<?> aClass = Class.forName("com.facebook.flipper.ReactNativeFlipper");
                aClass.getMethod("initializeFlipper", Context.class).invoke(null, context);
            } catch (ClassNotFoundException e) {
                e.printStackTrace();
            } catch (NoSuchMethodException e) {
                e.printStackTrace();
            } catch (IllegalAccessException e) {
                e.printStackTrace();
            } catch (InvocationTargetException e) {
                e.printStackTrace();
            }
        }
    }
}

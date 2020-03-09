package com.splitbundle.ui;

import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.widget.Toast;

import com.facebook.react.MyReactActivity;
import com.facebook.react.ReactInstanceManager;
import com.facebook.react.bridge.CatalystInstance;
import com.facebook.react.bridge.ReactContext;
import com.facebook.soloader.SoLoader;
import com.splitbundle.MainApplication;
import com.splitbundle.R;
import com.splitbundle.utils.JSBundleLoaderUtil;

import androidx.annotation.Nullable;
import androidx.appcompat.app.AppCompatActivity;

public class MainActivity extends AppCompatActivity {

    private ReactInstanceManager mReactInstanceManage;

    @Override
    protected void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        SoLoader.init(this, /* native exopackage */ false);
        MainApplication.initializeFlipper(this); // Remove this line if you don't want Flipper enabled
    }

    private void initReactContext(MyReactActivity.ReactContextListener listener) {
        mReactInstanceManage = ((MainApplication) getApplication()).getReactNativeHost().getReactInstanceManager();
        if (!mReactInstanceManage.hasStartedCreatingInitialContext()) {
            mReactInstanceManage.addReactInstanceEventListener(new ReactInstanceManager.ReactInstanceEventListener() {
                // 初始化react上下文时调用（所有模块都已注册）
                @Override
                public void onReactContextInitialized(ReactContext context) {
                    Toast.makeText(MainActivity.this, "基础包加载完成", Toast.LENGTH_SHORT).show();
                    if (listener != null) {
                        listener.onComplete();
                    }
                    mReactInstanceManage.removeReactInstanceEventListener(this);
                }
            });
            // 这里预先加载基础包basic.android.bundle
            mReactInstanceManage.createReactContextInBackground();
        } else {
            if (listener != null) {
                listener.onComplete();
            }
        }
    }

    public void onClickBusiness1(View view) {
        initReactContext(new MyReactActivity.ReactContextListener() {
            @Override
            public void onComplete() {
                final CatalystInstance catalystInstance = mReactInstanceManage.getCurrentReactContext().getCatalystInstance();
                JSBundleLoaderUtil.loadScriptFromAssets(catalystInstance, getApplicationContext(), "assets://app1.android.bundle", false);
                Toast.makeText(MainActivity.this, "业务包1加载完成", Toast.LENGTH_SHORT).show();
                startActivity(new Intent(MainActivity.this, App1Activity.class));
            }
        });
    }

    public void onClickBusiness2(View view) {
        startActivity(new Intent(this, App2Activity.class));
    }

    public void onClickBusiness3(View view) {
        startActivity(new Intent(this, App3Activity.class));
    }
}

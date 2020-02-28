
# 基础包
echo "开始打基础包"
cd .. && react-native bundle --dev false --platform android --entry-file src/basics/basics.js --bundle-output ./dist/android/basics.android.bundle --assets-dest ./dist/android --minify true --config split_bundle/metro.config.js --verbose true

# 业务包1
echo "开始打业务包1"
cd .. && react-native bundle --dev false --platform android --entry-file src/business1/business1.js --bundle-output ./dist/android/business1.android.bundle --assets-dest ./dist/android --minify true --config split_bundle/metro.config.js --verbose true

# 业务包2
echo "开始打业务包2"
cd .. && react-native bundle --dev false --platform android --entry-file src/business2/business2.js --bundle-output ./dist/android/business2.android.bundle --assets-dest ./dist/android --minify true --config split_bundle/metro.config.js --verbose true

# 业务包3
echo "开始打业务包3"
cd .. && react-native bundle --dev false --platform android --entry-file src/business3/business3.js --bundle-output ./dist/android/business3.android.bundle --assets-dest ./dist/android --minify true --config split_bundle/metro.config.js --verbose true
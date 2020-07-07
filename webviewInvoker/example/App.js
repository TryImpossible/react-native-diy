/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  StatusBar,
  View,
  Text,
  Button,
} from 'react-native';
import WebView from 'react-native-webview';
import invoker from './invoker';

const styles = StyleSheet.create({
  show: {
    width: '100%',
    height: 100,
    backgroundColor: '#EEEEEE',
    paddingVertical: 10,
    paddingHorizontal: 8,
  },
});

const App = () => {
  const [data, setData] = React.useState('这里显示来自browser的信息');
  const url = 'http://192.168.1.101:8081/example.html';
  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView style={{flex: 1}}>
        <View style={{flex: 1}}>
          <Text style={styles.show}>{data}</Text>
          <Button
            title={'向browser打招呼'}
            onPress={async () => {
              const result = await invoker.call({action: 'hello'});
              setData(result);
            }}
          />
        </View>
        <WebView
          style={{flex: 1}}
          source={{uri: url}}
          ref={ref => {
            invoker.init(ref);
          }}
          injectedJavaScript={invoker.inject()}
          onMessage={e => {
            invoker.handler(e);
          }}
        />
      </SafeAreaView>
    </>
  );
};

export default App;

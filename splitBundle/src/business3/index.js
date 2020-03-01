import React, {Component} from 'react';
import {StyleSheet, View, Text, Button} from 'react-native';

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

let Business2;

class Business extends Component {
  state = {isShow: false};

  render() {
    return (
      <View style={styles.container}>
        <Text>RN业务模块3</Text>
        {this.state.isShow && (
          <View style={{width: '100%', height: 30}}>
            <Business2 />
          </View>
        )}
        <Button
          title="嵌入业务模块2"
          onPress={() => {
            import('../business2').then(module => {
              Business2 = module['default'];
              this.setState({
                isShow: true,
              });
            });
          }}
        />
      </View>
    );
  }
}

export default Business;

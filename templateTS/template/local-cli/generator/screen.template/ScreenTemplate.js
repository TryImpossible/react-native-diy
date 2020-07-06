import React, { PureComponent } from 'react';
import { StyleSheet, View } from 'react-native';
import PropTypes from 'prop-types';
import { Screen } from '../../components';
import IMAGES from '../../resources/images';
import { Lang, Theme } from '../../utilities';
import ServerApi from '../../services';

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%'
  }
});

class ScreenTemplate extends PureComponent {
  static propTypes = {
    navigation: PropTypes.object.isRequired
  };

  static defaultProps = {};

  render() {
    const { navigation } = this.props;
    return (
      <Screen title="ScreenTemplate">
        <View />
      </Screen>
    );
  }
}

export default ScreenTemplate;

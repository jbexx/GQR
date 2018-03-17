import React from 'react';
import {
  Alert,
  AppRegistry,
  Dimensions,
  Linking,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  YellowBox
} from 'react-native';

import  { RNCamera }  from 'react-native-camera';

export default class Scanner extends React.Component {
  constructor() {
    super()

    this.state = {
      data: null
    }

    this.scans = 0;
    YellowBox.ignoreWarnings([
      'Warning: componentWillMount is deprecated',
      'Warning: componentWillReceiveProps is deprecated',
    ]);

    this.openLink = this.openLink.bind(this);
  }

  openLink(e) {
    // will need to check barcode type
    // if not QR then send error
    // give option to reset number of scans so can scan again
    
    if (this.scans < 1) {
      this.setState({
        data: e
      })
    
      this.scans++

      Alert.alert(
        'Would you like to open this link?',
        `${e.data}`,
        [ { text: 'OK', onPress: () => {
          let url = e.data;

          Linking.canOpenURL(url).then( canOpen => {
            if (canOpen) {
              Linking.openURL(url).catch(err => console.error('An error occurred', err));
            }
          } );
        } },
          { text: 'Cancel'}
        ]
      )
    }
  }

  render() {
    console.warn(this.state.data)
    return (
      <View style={styles.full}>
        <View style={styles.camContainer}>
          <RNCamera
            ref={ref => {
              this.camera = ref;
            }}
            style={styles.cam}
            onBarCodeRead={this.openLink}>
          </RNCamera>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  full: {
    backgroundColor: '#3AFC17'
  },
  camContainer: {
    alignItems: 'center',
    height: Dimensions.get('window').height,    
    justifyContent: 'center'
  },
  cam: {
    height: Dimensions.get('window').height / 3,
    width: Dimensions.get('window').width / 1.6
  },
  camBorder: {
    backgroundColor: 'rgb(123, 80, 32)',
    height: Dimensions.get('window').height,
    width: Dimensions.get('window').width
  },
});
import React from 'react';
import {
  Alert,
  AppRegistry,
  AppState,
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

    this.scans = 0;

    YellowBox.ignoreWarnings([
      'Warning: componentWillMount is deprecated',
      'Warning: componentWillReceiveProps is deprecated',
    ]);

    this.openLink = this.openLink.bind(this);
  }

  link(url) {
    this.scans = 0;
    Linking.canOpenURL(url).then( canOpen => {
      if (canOpen) {
        Linking.openURL(url).catch(err => console.error('An error occurred', err));
      }
    });
  }

  openLink(e) {
    // will need to check barcode type
    // if not QR then send error
    // or if not QR then open in amazon or google with barcode number
    // give option to reset number of scans so can scan again

    if (this.scans < 1  && AppState.currentState == 'active') {
      this.scans++

      if (e.type == 'org.iso.QRCode') {

        Alert.alert(
          'Would you like to open this link?',
          `${e.data}`,
          [ { text: 'OK', onPress: () => {
            const url = e.data;
            this.link(url)
          }},
          { text: 'Cancel', onPress: () => { this.scans-- }}
        ])
      } else {
        Alert.alert(
          'Where would you like to search for this item?',
          `${e.data}`,
          [ { text: 'Amazon', onPress: () => {
                const url = `https://www.amazon.com/s/ref=nb_sb_noss?url=search-alias%3Daps&field-keywords=${e.data}`;
                this.link(url)
              }
            },
            { text: 'Google', onPress: () => {
                const url = `https://www.google.com/search?q=${e.data}&ie=UTF-8&oe=UTF-8&hl=en-us&client=safari`;
                this.link(url)
              }
            },
            { text: 'Cancel', onPress: () => { this.scans-- }}
          ]
        )
      }
    }
  }

  render() {
    return (
      <View>
          <RNCamera
            ref={ref => {
              this.camera = ref;
            }}
            style={styles.camContainer}
            onBarCodeRead={this.openLink}>
            <View style={styles.cam} />
          </RNCamera>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  camContainer: {
    alignItems: 'center',
    height: Dimensions.get('window').height,    
    justifyContent: 'center'
  },
  cam: {
    borderColor: 'orange',
    borderWidth: 1,
    height: Dimensions.get('window').height / 3,
    width: Dimensions.get('window').width / 1.6
  },
});
import React, { Component } from 'react';
import {
  Text,
  View,
  TouchableHighlight,
  ScrollView
} from 'react-native';
import { SubmitImageView } from './SubmitImageView';
import CameraRollPicker from 'react-native-camera-roll-picker';
import ReadTheData from 'NativeModules';
import { styles } from './Styles/CameraRollStyle';
let ReadImageData = ReadTheData.ReadImageData;


class CameraRollView extends Component {
  constructor() {
    super();
    this.state = {
      selected: [],
      num: 0,
      imageSelected: false,
      base64: ''
    };
  }
  // Sets the state of imageSelected to the image that is checked. currentImage keeps track of each image object the user touches.
  getSelectedImage(selectedImage, currentImage) {
    console.log(this.state.selectedImage);
    let num = selectedImage.length;
    this.setState({
      num: num,
      selected: selectedImage
    });
    if (!this.state.selected[0]) {
      this.setState({imageSelected: false});
    } else if (this.state.selected[0] && currentImage.uri === this.state.selected[0].uri) {
      this.setState({imageSelected: true});
    }
  }
  // Reads the image data and sets state as base64 encoded string of image
  handleSubmit(name) {
    if (this.state.selected[0]) {
      ReadImageData.readImage(this.state.selected[0].uri, (image) => {
        this.setState({ base64: 'data:image/jpeg;base64,' + image });
        this.props.navigator.push({
          name: name,
          path: this.state.selected[0].uri,
          base64: this.state.base64
        });
      });
    }
  }
  // If an image is selected the submit button is visible. When there is no image selected an empty View
  buttonShow() {
    return this.state.imageSelected ? <TouchableHighlight onPress={() => this.handleSubmit('SubmitImageView')}>
      <View style={styles.bottomNavButton}>
        <Text style={styles.buttonText}>SELECT</Text>
      </View>
    </TouchableHighlight> : <View></View>;
  }
  // CameraRollPicker is a module thatgi adds checkmark over current selected image
  render() {
    return (
      <View style={styles.container}>
        <ScrollView style={styles.container}>
          <TouchableHighlight>
            <View style={styles.imageGrid}>
              <CameraRollPicker
                  callback={this.getSelectedImage.bind(this)}
                  selected={this.state.selected}
                  maximum={1}/>
            </View>
          </TouchableHighlight>
        </ScrollView>
        {this.buttonShow()}
      </View>
    );
  }
}

export { CameraRollView };

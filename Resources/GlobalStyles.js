import {StyleSheet, Text, View} from 'react-native';
import DeviceInfo from 'react-native-device-info';

export const COLORS = {
  primary: '#4F3D56',
  primaryText : '#044D75',
  primaryLight: '#57435C',
  textTitle: '#09244B',
  primaryDark: '#130C2A',
  primaryGradientEnd: '#FFEBB7',
  primaryBackground: '#FFFDF7',
  lightPink: '#FFF9E8',
  secondary: '#5FBAAF',
  secondaryDark: '#298A80',
  secondaryLight: '#92EDE1',
  white: '#FFFFFF',
  gray: '#F0F0F0',
  whiteDark: '#C0C0C0',
  black: '#000000',
  blackText: '#101010',
  redError: '#EF5350',
  mask: '#FFFFFFAA',
  lightGray: 'F2F2F2#',
  grayText: '#8491A5',
  orange: '#FF6E31',
  navyText: '#424242',
  lightGreen:'#29ab3a',
  blue:'#0000FF',
  green:'#32CD32',
  modalBackground:'#00000050',
  
};

export const GlobalStyles = StyleSheet.create({
  shadowBoxContainer: {
    backgroundColor: COLORS.white,
    width: '96.5%',
    paddingHorizontal: 15,
    paddingVertical: 15,
    alignSelf: 'center',
    borderBottomColor: '#F3F3F3',
    borderBottomWidth: 1,
    marginTop: 5,
  },
  batchModalCenterView: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },

});

export const DeviceType = DeviceInfo.getDeviceType();

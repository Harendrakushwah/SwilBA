import { StyleSheet, Text, View , BackHandler,Alert} from 'react-native'
import React, { useCallback, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux';
import NetInfo from '@react-native-community/netinfo';
import {useFocusEffect} from '@react-navigation/native';

export default function NoInternet({navigation}) {

  const isConnected = useSelector(state => state?.commonSlice?.isNetConnected);
  useEffect(() => {
    if (isConnected) {
      navigation.goBack();
    }
  }, [isConnected]);

  const retryNet = async () => {
    const netInfo = await NetInfo.fetch();
    // dispatch(ReduxSliceActions.setIsNetConnected(netInfo.isConnected));
    if (netInfo.isConnected) {
      navigation.goBack();
    }
  };

  /* Listener for exit confirmation */
  useFocusEffect(
    useCallback(() => {
      /* Function that defines what happens when back key is pressed */
      const backAction = () => {
        Alert.alert('Hold on!', 'Are you sure you want to exit?', [
          {text: 'Cancel'},
          {text: 'Yes', onPress: () => BackHandler.exitApp()},
        ]);
        return true;
      };

      const backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        backAction,
      );
      /* Unregister event listener when screen unmounts */
      return () => backHandler.remove();
    }, []),
  );

  return (
    <View>
      <Text>NoInternet</Text>
    </View>
  )
}

const styles = StyleSheet.create({})
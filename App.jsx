import {StyleSheet, Text, View,Dimensions,StatusBar,SafeAreaView,Platform} from 'react-native';
import React, {useEffect,useState} from 'react';
import RootStackNavigator from './src/Components/Router/RootStackNavigator';
import {NavigationContainer} from '@react-navigation/native';
import NetInfo from '@react-native-community/netinfo';
import {CommonSliceActions} from './src/Components/Redux/Common/CommonSlice';
import {useDispatch, useSelector} from 'react-redux';
import {TabContextProvider} from './src/Context/tabContext';
import DeviceInfo from 'react-native-device-info';
import LinearGradient from "react-native-linear-gradient";
import { COLORS } from './src/Components/Resources/GlobalStyles';


export default function App() {
  const dispatch = useDispatch();
  const [orientation, setOrientation] = useState("PORTRAIT");
  const deviceType= useSelector(state => state?.commonSlice?.deviceType);
  const deviceOrientation = useSelector(state => state?.commonSlice?.deviceOrientation);

  const isConnected = useSelector(state => state?.commonSlice?.isNetConnected);
  useEffect(() => {
    const unsubscribe = NetInfo?.addEventListener(state => {
      dispatch(CommonSliceActions?.setIsNetConnected(state.isConnected));
    });
    return () => {
      unsubscribe();
    };
  }, [isConnected]);

  useEffect(() => {
  if(orientation){
    dispatch(CommonSliceActions?.setDeviceOrientation(orientation))
    
  }
  }, [orientation])

  const getDeviceType = async() =>{
    let device = await DeviceInfo?.getDeviceType();
    dispatch(CommonSliceActions?.setDeviceType(device))
   
  }

  getDeviceType()



  const MyStatusBar = ({backgroundColor, ...props}) => (
    <View style={[styles.statusBar, { backgroundColor }]}>
      <SafeAreaView>
        <StatusBar translucent backgroundColor={backgroundColor} {...props} />
      </SafeAreaView>
    </View>
  );


  return (
    <TabContextProvider>
      <NavigationContainer>
        {Platform.OS == "ios" ? (
          <MyStatusBar
            backgroundColor={COLORS.primary}
            barStyle="light-content"
          />
        ) : null}
        <SafeAreaView style={{ flex: 1 }}>
          <View style={styles.container}>
            <LinearGradient
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              colors={["#4F3D56", "#4F3D56", "#4F3D56"]}
              style={{ flex: 1, maxHeight: StatusBar?.currentHeight }}
            >
              <StatusBar barStyle="light-content" backgroundColor={"#4F3D56"} />
            </LinearGradient>
          </View>
          <RootStackNavigator />
        </SafeAreaView>
      </NavigationContainer>
    </TabContextProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 9999, // Ensure the status bar is on top of everything else
  },
});

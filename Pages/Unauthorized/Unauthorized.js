import {
  StyleSheet,
  Text,
  View,
  BackHandler,
  Alert,
  Image,
} from "react-native";
import React, { useCallback,useEffect } from "react";
import { useFocusEffect } from "@react-navigation/native";

// Icons
import MIcon from "react-native-vector-icons/MaterialIcons";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { AllUrls } from "../../Resources/Resources";
import { useState } from "react";
import DeviceInfo from "react-native-device-info";
import Button from "../../../Components/GlobalComponents/Button";
import axios from "axios";
import { COLORS } from "../../Resources/GlobalStyles";
import { useDispatch } from "react-redux";
import { CommonSliceActions } from "../../Redux/Common/CommonSlice";

export default function Unauthorized({ navigation, route }) {
  const dispatch = useDispatch();
  const called = route.params;
  const [refresh, setRefresh] = useState(false);
  const [message,setMessage] = useState()

  useEffect(() => {
    if (called?.Message) {
      var deviceInfoRegex = /\(([^)]+)\)/; // This regex captures text within parentheses
      var newID = called?.Message?.match(deviceInfoRegex);
      var newDeviceID = newID?.[0]?.replace(/^[(]/, '');
      setMessage(newDeviceID);
    }
  }, [called?.Message]);

  const handleLogOut = async () => {
    const value = await AsyncStorage.getItem("logUserData");
    const tokken = JSON.parse(value)?.Tokken;
    const DeviceID = await DeviceInfo.getUniqueId();
    const DeviceName = await DeviceInfo.getDeviceName();
    const URL = message ?  `${AllUrls.MainBaseURL}/api/auth/Logout?AppName=SwilBA&DeviceID=${message}` : `${AllUrls.MainBaseURL}/api/auth/Logout?AppName=SwilBA&DeviceID=${DeviceName}(${DeviceID})`;
    
    var config = {
      method: "post",
      url: URL,

      headers: {
        Authorization: `Bearer ${tokken}`,
      },
      data: null,
    };
    axios(config)
      .then(function (response) {
        if (response?.data?.status !== "success") {
        }
      })
      .catch(function (error) {
        console.log("Error unauthorized --->>", error);
      });
    axios.post("api/auth/logout");
    setRefresh(!refresh);
    dispatch(CommonSliceActions.logUserOut())
    await AsyncStorage.removeItem("logUserData");
    navigation.navigate('SSO')
  };

  /* Listener for exit confirmation */
  useFocusEffect(
    useCallback(() => {
      /* Function that defines what happens when back key is pressed */
      const backAction = () => {
        Alert.alert("Hold on!", "Are you sure you want to exit?", [
          { text: "Cancel" },
          { text: "Yes", onPress: () => BackHandler.exitApp() },
        ]);
        return true;
      };

      const backHandler = BackHandler.addEventListener(
        "hardwareBackPress",
        backAction
      );

      /* Unregister event listener when screen unmounts */
      return () => backHandler.remove();
    }, [])
  );

  return (
    <View style={styles.mainView}>
      <View style={styles.imgView}>
        <Image
          source={require("../../Assets/Images/swil.png")}
          style={styles.swilImg}
        />
      </View>
      <Text style={styles.mainText}>
        This account is currently {called?.called}.
      </Text>
      <Text style={styles.msgText}>
        Message : <Text style={styles.msgText2}>{called?.Message}</Text>
      </Text>
      <Button
        android_ripple={COLORS.primaryDark}
        title="Login with another account"
        style={styles.buttons}
        onPress={handleLogOut}
        color={COLORS.white}
      >
        <MIcon name="navigate-next" size={25} color={COLORS.black} />
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  mainView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.gray,
  },
  addCustomerView: {
    width: "100%",
    alignSelf: "center",
    justifyContent: "flex-end",
  },
  buttons: {
    width: "70%",
    alignSelf: "center",
    borderRadius: 8,
    backgroundColor: COLORS.primary,
    marginVertical: 16,
  },
  mainText: {
    color: COLORS.black,
    fontSize: 20,
    marginVertical: 10,
  },
  msgText: {
    fontWeight: "bold",
    fontSize: 20,
    color: COLORS.blackText,
    width: "98%",
    textAlign: "center",
  },
  msgText2: {
    fontWeight: "bold",
    fontSize: 18,
    color: COLORS.primary,
  },
  swilImg: {
    resizeMode: "contain",
    flex: 1,
  },
  imgView: {
    width: "60%",
    height: "15%",
    alignItems: "center",
    justifyContent: "center",
    marginTop: "-10%",
  },
});

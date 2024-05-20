import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  BackHandler,
  Alert,
  SafeAreaView,
  Image,
  FlatList,
  Dimensions,
} from "react-native";
import React, { useCallback, useState, useRef, useEffect } from "react";
import { AllUrls } from "../Components/Resources/Resources";
import { COLORS } from "../Components/Resources/GlobalStyles";
import { useDispatch } from "react-redux";
// React navigation
import { useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
// To get device information
import DeviceInfo from "react-native-device-info";
import CryptoJS from "crypto-js";
import InAppBrowser from "react-native-inappbrowser-reborn";
import { CommonSliceActions } from "../Components/Redux/Common/CommonSlice";
import { tokenUpdate } from "../Components/Axios/Axios";
import axios from "axios";
import LinearGradient from "react-native-linear-gradient";

export default function SSO({ navigation }) {
  const flatListRef = useRef(null);
  const deviceWidth = Dimensions.get("window").width;
  const [isBrowserRunning, setIsBrowserRunning] = useState(false);
  const [activeIndex, setActiveIndex] = useState(1);
  let iv = "";
  const dispatch = useDispatch();
  useFocusEffect(
    useCallback(() => {
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

      return () => backHandler.remove();
    }, [])
  );
  useEffect(() => {
    let interval = setInterval(() => {
      if (activeIndex === imageData?.length - 1) {
        flatListRef.current?.scrollToIndex({
          index: 0,
          animation: true,
        });
      } else {
        flatListRef.current?.scrollToIndex({
          index: activeIndex < imageData?.length - 1 ? activeIndex + 1 : 0,
          animation: true,
        });
      }
    }, 2000);

    return () => clearInterval(interval);
  });

  const getItemLayout = (data, index) => ({
    length: deviceWidth,
    offset: deviceWidth * index,
    index: index,
  });
  const getData = async () => {
    const data = {
      DeviceId: await DeviceInfo.getUniqueId(),
      Manufac: null,
      Model: DeviceInfo.getModel(),
      AndroidVersion: `${DeviceInfo.getSystemName()} ${DeviceInfo.getSystemVersion()}`,
      Notifaction: "",
      /* getVersion gives app version which shown to user of the app */
      AppVersion: DeviceInfo.getVersion(),
      /* getBuildNumber gives a positive number which is used as a version number by android and google play store */
      // AppVersion: DeviceInfo.getBuildNumber(),
      Tokken: "",
    };

    await DeviceInfo.getManufacturer()
      .then((response) => (data.Manufac = response))
      .catch((error) => {
        console.error(error.message);
        return {};
      });

    return data;
  };

  const generateKey = () => {
    let str = "";

    str += "SwilERPApp";
    // Last digits of year
    str += new Date().getFullYear().toString().substring(2, 4).padStart(8, "0");
    // Current day of year
    str += (
      (Date.UTC(
        new Date().getFullYear(),
        new Date().getMonth(),
        new Date().getDate()
      ) -
        Date.UTC(new Date().getFullYear(), 0, 0)) /
      24 /
      60 /
      60 /
      1000
    )
      .toString()
      .padStart(3, "0");
    // App version
    str += /*DeviceInfo.getVersion()*/ "010101"
      .replace(".", "")
      .substring(0, 6);
    // Month
    str += (new Date().getMonth() + 3).toString().padStart(3, "3");
    str += "SW";

    return str;
  };

  /* Get app link with deep link (react navigation) if specified */
  const getReturnLink = (deepLinkPath = "") => {
    /* KEEP THESE VARIABLES SYNCED WITH INTENT FILTER IN AndroidManifest.xml */
    const scheme = "open.swilba";
    const prefix =
      // Platform.OS === 'android' ? `${scheme}://SWILBA/` : `${scheme}://`;
      `${scheme}://SwilBA/`;
    return prefix + deepLinkPath;
  };

  /* Extract encrypted data from all params */
  const extractDataFromParam = (params, requiredParam) => {
    for (let i = 0; i < params?.length; ++i) {
      const [paramName, paramValue] = params[i].split("=");
      if (paramName.substring(1) === requiredParam) {
        return paramValue;
      }
    }
  };

  const handleencription = (_data, _Key) => {
    let cipher = CryptoJS.AES.encrypt(_data, CryptoJS.enc.Utf8.parse(_Key), {
      iv: CryptoJS.enc.Utf8.parse(iv),
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    });

    return cipher?.toString();

    // return ${SSODETAILS.Domine}/?ReturnUrl=${SSODETAILS.ReturnUrl}&App=${SSODETAILS.AppName}&data=${cipher}
  };

  const handleDecryption = (data, key) => {
    let decryption = CryptoJS.AES.decrypt(data, CryptoJS.enc.Utf8.parse(key), {
      iv: CryptoJS.enc.Utf8.parse(iv),
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    });

    return decryption.toString(CryptoJS.enc.Utf8);
  };

  const checkPermission = async () => {
    try {
      const value = await AsyncStorage.getItem("logUserData");
      const BranchID = JSON.parse(value)?.BranchID;
      const tokken = JSON.parse(value)?.Tokken;
      const DeviceID = await DeviceInfo.getUniqueId();
      const DeviceName = await DeviceInfo.getDeviceName();
      
      var config = {
        method: "post",
        url: `${AllUrls.MainBaseURL}/api/auth/CheckAppPermission?AppName=SwilBA&BranchID=${BranchID}&DeviceID=${DeviceName}(${DeviceID})`,
        headers: {
          Authorization: `Bearer ${tokken}`,
        },
        data: null,
      };

     await axios(config)
        .then(function (response) {
          if (response?.data?.status !== "success" ) {
            navigation.navigate("unauthorized", {
              called:'unauthorized',
              Message: response?.data.message,
            });
          }else{
            dispatch(CommonSliceActions.setIsAuthorized(true));
          }
        })
        .catch(function (error) {
          navigation.navigate("unauthorized", {
            called:'unauthorized',
            Message: error.message,
          });
          console.error("Check Permission Error ->", error.message);
        });
    } catch (error) {
      console.error("Check Permission Error ->", error.message);
      navigation.navigate("unauthorized", {
        called:'unauthorized',
        Message: error.message,
      });
    }
  };


  const validationCheck = async(convertDataObj) => {
    let newBaseURL = convertDataObj.WebApi;
    var config = {
      method: "post",
      url: `${newBaseURL}api/auth/Validate`,
      headers: {
        Authorization: `Bearer ${convertDataObj.Tokken}`,
      },
    };

   await axios(config)
      .then(function (response) {
        if (response.data.Status !== "success") {
          Alert.alert(response.data.Message);
          navigation.navigate(("unauthorized", {
            called:'not valid !',
            Message: response?.data.message,
          }));
        } else {
       checkPermission()
        }
      })
      .catch(function (error) {
        navigation.navigate("unauthorized", "not valid");
        console.error("check validation error ->", error.message);
      });
  };

  const openSignIn = async () => {
    setIsBrowserRunning(true);
    const key = generateKey();
    const data = await getData();
    const encryptedData = handleencription(JSON.stringify(data), key);
    const baseUrl = AllUrls.SSOBaseURL;
    const redirectUrl = getReturnLink();
    const URL = `${baseUrl}/Home/LogOut?ReturnUrl=${encodeURIComponent(
      redirectUrl
    )}&App=SWILBA&encp=${encodeURIComponent(encryptedData)}`;

    try {
      if (await InAppBrowser.isAvailable()) {
        const result = await InAppBrowser?.openAuth(URL, redirectUrl, {
          // iOS Properties
          dismissButtonStyle: "close",
          ephemeralWebSession: false,
          // Android Properties
          showTitle: false,
          enableUrlBarHiding: true,
          enableDefaultShare: false,
          navigationBarColor: COLORS.black,
        });

        // console.log("Result ==>>", result);

        /* Things to do after in-app browser closes */
        if (result.type === "success" && result?.url) {
          const returnUrl = result.url;
          const queryRegex = /[?&]([^=#]+)=([^&#]*)/g;
          /* Array of all params present in url received in response */
          const urlParams = returnUrl.match(queryRegex);
          /* Encrypted data */
          const encryptedReturnData = extractDataFromParam(urlParams, "code");
          /* Decrypting data */
          const decryptedData = handleDecryption(encryptedReturnData, key);
          var convertDataObj = JSON.parse(decryptedData);
          try {
            await AsyncStorage.setItem(
              "logUserData",
              JSON.stringify(convertDataObj)
            );
          } catch (err) {
            console.log("SSO Err======>>>>", err);
          }
          tokenUpdate().then((res) => {
            if (res) {
              dispatch(
                CommonSliceActions.setUserLogState({
                  result: true,
                  loguserDtl: convertDataObj,
                })
              );
            }
          });
          validationCheck(convertDataObj);
        }
        setIsBrowserRunning(false);
      } else {
        Alert.alert("Error", "InAppBrowser is not supported");
        setIsBrowserRunning(false);
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Authentication failed, try again");
      setIsBrowserRunning(false);
    }
  };
  const imageData = [
    { id: "01", image: require("../../src/Components/Assets/Images/SwilBA1.png") },
    {
      id: "02",
      image: require("../../src/Components/Assets/Images/SwilBA2.png"),
    },
    {
      id: "03",
      image: require("../../src/Components/Assets/Images/SwilBA3.png"),
    },
    { id: "04", image: require("../../src/Components/Assets/Images/SwilBA4.png") },
  ];

  const renderItem = ({ item, index }) => {
    return (
      <>
        <View key={index}>
          <Image
            source={item?.image}
            style={styles.carouselImage(deviceWidth)}
          />
        </View>
      </>
    );
  };

  const renderDots = () => {
    return imageData.map((dot, index) => {
      if (activeIndex == index) {
        return (
          <View
            key={index}
            style={{ ...styles.dotStyles(), backgroundColor: COLORS.orange }}
          />
        );
      } else {
        return <View key={index} style={styles.dotStyles()} />;
      }
    });
  };
  const handleScroll = (event) => {
    const scrollPosition = event.nativeEvent.contentOffset.x;
    const index = Math.round(scrollPosition / deviceWidth);
    setActiveIndex(index);
  };

  return (
    <SafeAreaView style={styles.mainContainer}>
      <View style={styles.topContainer}>
        <LinearGradient
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          colors={['#57435C', '#4F3D56','#130C2A']}
          style={styles.linearStyles}
        >
          <View style={styles.headerContainer}>
            <View style={styles.swilLogoContainer}>
              <Image
                source={require("../../src/Components/Assets/Images/swilWhite.png")}
                style={styles.swilLogo}
              />
            </View>
          </View>
          <View style={styles.sliderContainer}>
            <FlatList
              data={imageData}
              ref={flatListRef}
              renderItem={renderItem}
              keyExtractor={(item) => item.id}
              getItemLayout={getItemLayout}
              horizontal={true}
              pagingEnabled={true}
              onScroll={handleScroll}
              showsHorizontalScrollIndicator={false}
            />
            <View
              style={{
                flexDirection: "row",
                justifyContent: "center",
                marginVertical: 5,
              }}
            >
              {renderDots()}
            </View>
          </View>
          <View style={styles.tagLineView}>
          <Text style={styles.tagLineText}>Unlocking Insights</Text>
          <Text style={styles.tagLineText}>Driving Decisions : Your Business</Text>
          <Text style={styles.tagLineText}>SwilBA Analytics</Text>

          </View>
        </LinearGradient>
      </View>
      <View style={styles.boxContainer}>
        <View style={styles.bubbleContainer}>
          <Text style={styles.bubbleText}>BETA VERSION</Text>
        </View>
        <View style={styles.logoContainer}>
          <Image
            style={styles.swilBALogo()}
            source={require("../../src/Components/Assets/Images/SwilBALogo.png")}
          />
        </View>
        <View style={styles.signInTextContainer}>
          <Text style={styles.singInText}>Sign in to access your account</Text>
        </View>

        <TouchableOpacity
          style={styles.signInBtnOpacity}
          onPress={() => openSignIn()}
        >
          <Text
            style={{
              padding: 8,
              color: COLORS.white,
              fontWeight: "bold",
              fontSize: 16,
            }}
          >
            SIGN IN
          </Text>
        </TouchableOpacity>
      </View>
      <View style={styles.footerTextContainer}>
        <Text style={styles.footerText}> Version : 1.1</Text>
        <Text style={styles.footerText}>
          Powered By Softworld India Pvt. Ltd.
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    alignItems: "center",
  },
  topContainer: {
    width: "100%",
    height: "70%",
  },
  linearStyles: {
    flex: 1,
    // alignItems: "center",
  },
  headerContainer: {},
  swilLogoContainer: {
    margin: 12,
    marginTop: 5,
  },
  swilLogo: {
    width: 42,
    height: 50,
    resizeMode: "contain",
    marginLeft:8
  },
  sliderContainer: {
    height: "50%",
    alignItems: "center",
    justifyContent: "center",
  },
  carouselImage: (deviceWidth) => ({
    flex: 1,
    height: 200,
    width: deviceWidth,
    resizeMode: "contain",
  }),
  dotStyles: () => ({
    backgroundColor: COLORS.white,
    height: 10,
    width: 10,
    borderRadius: 5,
    marginHorizontal: 5,
  }),
  tagLineView: {
    alignItems: "center",
    justifyContent: "center",
    // marginVertical: 4,
    marginTop:15
  },
  tagLineText: {
    fontWeight: "bold",
    fontSize: 18,
    color: COLORS.white,
  },
  boxContainer: {
    backgroundColor: COLORS.white,
    alignItems: "center",
    height: "32%",
    position: "absolute",
    width: "90%",
    bottom: "8%",
    borderRadius: 10,
    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.17,
    shadowRadius: 3.05,
    elevation: 4,
  },
  footerTextContainer: {
    position: "absolute",
    bottom: "0.6%",
  },
  footerText: {
    fontWeight: "bold",
    fontSize: 15,
    textAlign: "center",
  },
  bubbleContainer: {
    backgroundColor: "gray",
    borderRadius: 20,
    alignSelf: "flex-start",
    margin: "2%",
    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 18,
    },
    shadowOpacity: 0.25,
    shadowRadius: 20.0,
    elevation: 10,
    backgroundColor: COLORS.orange,
  },
  bubbleText: {
    padding: 2,
    margin: 2,
    marginLeft: 6,
    marginRight: 6,
    fontSize: 13,
    fontWeight: "bold",
    color: COLORS.white,
  },
  logoContainer: {
    alignItems: "baseline",
    width: "80%",
    justifyContent: "center",
    marginTop: "-20%",
  },
  swilBALogo: () => ({
    width: "65%",
    height: "65%",
    resizeMode: "contain",
    alignSelf: "center",

  }),
  singInText: {
    fontSize: 20,
    textAlign: "center",
    fontWeight: "400",
    color: COLORS.black,
    width: "98%",
    marginTop: "-4%",
  },
  signInTextContainer: () => ({
    width: "95%",
    alignItems: "center",
  }),
  signInBtnOpacity: {
    backgroundColor: COLORS.primary,
    width: "60%",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
  },
});

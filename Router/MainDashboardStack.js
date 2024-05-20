import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Dashboard from '../Pages/Dashboard/Dashboard';
import SalesDashboard from '../Pages/Dashboard/SalesDashboard';
import {COLORS} from '../Resources/GlobalStyles';
import Temp from '../Pages/Temp';
import DailyReportView from '../Pages/Dashboard/DailyReportView';
import PurchaseOrderView from '../Pages/Dashboard/PurchaseOrderView';
import Inventory from '../Pages/Dashboard/Inventory';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DeviceInfo from 'react-native-device-info'; 
import Unauthorized from '../Pages/Unauthorized/Unauthorized';
import { AllUrls } from '../Resources/Resources';
import axios from 'axios';
import LinearGradient from "react-native-linear-gradient";
import AntDesign from "react-native-vector-icons/AntDesign"; 
import Accounts from '../Pages/Dashboard/Accounts';
import SalesBelowCostRate from '../Pages/Dashboard/SalesBelowCostRate';
import MCI from "react-native-vector-icons/MaterialCommunityIcons";


export default function MainDashboardStack({navigation}) {
  const Stack = createNativeStackNavigator();
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

      axios(config)
        .then(function (response) {
          if (response?.data?.status !== "success" ) {
            navigation.navigate("unauthorized", {
              called:'unauthorized',
              Message: response?.data.message,
            });
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

  checkPermission();

  const GradientHeader = ({name,iconName, headerRight}) => (
    <View style={{}}>
      <LinearGradient
        colors={["#F1F6FF", "#F1F6FF", "#F1F6FF"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={[{ alignItems: "flex-start",justifyContent:'center', maxHeight: 80 }]}
      >
        <View style={styles.headerView}>
        <TouchableOpacity onPress={()=>navigation.goBack()} style={{justifyContent:'center'}}>
          <View style={styles.backButton}>
            <AntDesign name={iconName} size={15} color={'#1F2C37'} />
          </View>
        </TouchableOpacity>
          <Text style={styles.headerText}> {name} </Text>
        {headerRight=='yes' ? 
          <View style={{flex: 1, justifyContent: 'flex-end'}}>
          <View style={{flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', paddingRight: 15}}>
              <TouchableOpacity onPress={() => navigation.navigate('mainDashboard')}>
                  <MCI
                      name='fullscreen-exit'
                      size={30}
                      color={COLORS.primary}
                      style={styles.fullScreenExit}
                  />
              </TouchableOpacity>
          </View>
      </View>
      : null  
      }
        
        </View>
      </LinearGradient>
    </View>
  );
    
  return (
    <>
      <Stack.Navigator>

        <Stack.Screen
          name="mainDashboard"
          component={Dashboard}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="temp"
          component={Temp}
          options={{
            title: 'Reports',
            headerShown: true,
            header: () => <GradientHeader name="Sales Reports" iconName={"left"} />,
          }}
        />

        <Stack.Screen
          name="purchaseorderview"
          component={PurchaseOrderView}
          options={{
            title: 'Purchase Reports',
            headerShown: true,
            header: () => <GradientHeader name="Purchase Reports" iconName={"left"} />,
            
          }}
        />
        <Stack.Screen
          name="dailyreport"
          component={DailyReportView}
          options={{
            title: 'Daily Report',
            headerShown: true,
            header: () => <GradientHeader name="Daily Report" iconName={"left"} headerRight={'yes'} />,
         
          }}
        />

        <Stack.Screen
          name="inventory"
          component={Inventory}
          options={{
            title: 'Inventory',
            headerShown: true,
            header: () => <GradientHeader name="Inventory" iconName={"left"} />,
         
          }}
        />
        <Stack.Screen
          name="accounts"
          component={Accounts}
          options={{
            title: 'Accounts',
            headerShown: true,
            header: () => <GradientHeader name="Accounts" iconName={"left"} />,
         
          }}
        />
        <Stack.Screen name="salesDashboard" component={SalesDashboard} />
         <Stack.Screen
              name="unauthorized"
              component={Unauthorized}
              options={{ headerShown: false }}
            />
      </Stack.Navigator>
    </>
  );
}

const styles = StyleSheet.create({
  headerView: {
    alignItems: "center",
    flexDirection: "row",
    margin: 2,
    padding: 2,
    marginVertical: 5,
  },
  headerText: {
    fontWeight: "600",
    fontSize: 19,
    color: '#1F2C37',
    marginLeft: 8,
  },
  backButton: {
    borderRadius: 50,
    backgroundColor: 'white',
    padding: 12,
    marginLeft: 8,
    marginRight: 5,
    marginVertical: 5,
  },
});

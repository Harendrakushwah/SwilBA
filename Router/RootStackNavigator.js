import React from "react";
import { Text} from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import SSO from "../../SSO/SSO";
import { useDispatch, useSelector } from "react-redux";
import Temp from "../Pages/Temp";
import Unauthorized from "../Pages/Unauthorized/Unauthorized";
import NoInternet from "../Pages/NoInternet/NoInternet";
import BottomTabNavigator from "./BottomTabNavigator";
import InventoryStack from "./InventoryStack";
import AccountsStack from "./AccountsStack";
import SettingStack from "./SettingStack";
import { COLORS } from "../Resources/GlobalStyles";


export default function RootStackNavigator({ navigation }) {
  const Stack = createNativeStackNavigator();
  const dispatch = useDispatch();

  const isLogged = useSelector((state) => state.commonSlice.isLogged);


  return (
    <>
      <Stack.Navigator>
        {isLogged ? (
          <>
            <Stack.Screen
              name="bottomTabNavigator"
              component={BottomTabNavigator}
              options={{ headerShown: false }}
            />

            <Stack.Screen
              name="noInternetScreen"
              component={NoInternet}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Temp"
              component={Temp}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="inventoryStack"
              component={InventoryStack}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="accountsStack"
              component={AccountsStack}
              options={{ headerShown: false }}
            />

            <Stack.Screen
              name="settingStack"
              component={SettingStack}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="unauthorized"
              component={Unauthorized}
              options={{ headerShown: false }}
            />
          </>
        ) : (
          <>
            <Stack.Screen
              name="SSO"
              component={SSO}
              options={{
                headerShown: false,
              }}
            />
          </>
        )}
      </Stack.Navigator>
    </>
  );
}

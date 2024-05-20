import {StyleSheet, Text, View, TouchableOpacity,StatusBar} from 'react-native';
import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Dashboard from '../Pages/Dashboard/Dashboard';
import {COLORS} from '../Resources/GlobalStyles';
import ADIcon from 'react-native-vector-icons/AntDesign';
import EIcon from 'react-native-vector-icons/Entypo';
import FeatherIcon from 'react-native-vector-icons/Feather';
import CreateTabBarButton from '../GlobalComponents/CreateTabBarButton';
import {useTabMenu} from '../../Context/tabContext';
import AddTransactionStack from './AddTransactionStack';
import MainDashboardStack from './MainDashboardStack';
import { useDispatch } from 'react-redux';
import ProfileStack from './ProfileStack';



const Tab = createBottomTabNavigator();
export default function BottomTabNavigator({navigation}) {
  const dispatch = useDispatch()
  const {opened, toggleOpened} = useTabMenu();
  
  const addTransactionNaviagteHandler = screenName => {
    navigation.navigate('addTransactionStack', {screen: screenName});
  };
  return (
    <>
      <Tab.Navigator
        screenOptions={{
          tabBarShowLabel: false,
          tabBarActiveTintColor: COLORS.primary,
          style: {
            ...styles.shadow,
          },
        }}
        // tabBar={(props) => <CustomTabBar {...props} onPressButton={() => console.log('Button pressed')} />}
      >
        <Tab.Screen
          name="dashboard"
          component={MainDashboardStack}
          options={{
            headerShown: false,
            tabBarLabel: "Dashboard",
            tabBarOptions: {
              keyboardHidesTabBar: true,
            },
            tabBarIcon: ({ color, size }) => (
              <ADIcon
                name="home"
                color={color}
                size={size}
                style={styles.tabIcon}
              />
            ),
          }}
          listeners={{
            tabPress: (e) => opened && e.preventDefault(),
          }}
        />
        {/* <Tab.Screen
        name="dashboard1"
        component={Dashboard}
        options={{
            headerShown: false,
          tabBarLabel: 'Dashboard',
          tabBarIcon: ({color, size}) => (
            <EIcon name="calendar" color={color} size={size} />
          ),
        }}
        listeners={{
          tabPress: e => opened && e.preventDefault(),
        }}
      /> */}
        <Tab.Screen
          name="addTransactionStack"
          component={AddTransactionStack}
          options={{
            headerShown: false,
            tabBarOptions: {
              keyboardHidesTabBar: true,
            },
            tabBarItemStyle: {
              height: 0,
            },

            tabBarButton: () => (
              <CreateTabBarButton
                opened={opened}
                toggleOpened={toggleOpened}
                navigationStack={addTransactionNaviagteHandler}
              />
            ),
          }}
        />
        {/* <Tab.Screen
        name="dashboard2"
        component={Dashboard}
        options={{
            headerShown: false,
          tabBarLabel: 'Dashboard',
          tabBarIcon: ({color, size}) => (
            <EIcon name="wallet" color={color} size={size} />
          ),
        }}
        listeners={{
          tabPress: e => opened && e.preventDefault(),
        }}
      /> */}
        <Tab.Screen
          name="profileStack"
          component={ProfileStack}
          options={{
            headerShown: false,
            tabBarLabel: "Profile",
            tabBarIcon: ({ color, size }) => (
              <FeatherIcon name="user" size={size} color={color} />
            ),
            tabBarOptions: {
              keyboardHidesTabBar: true,
            },
          }}
          listeners={{
            tabPress: (e) => opened && e.preventDefault(),
          }}
        />
      </Tab.Navigator>
    </>
  );
}

const styles = StyleSheet.create({
  shadow: {
    shadowColor: COLORS.black,
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOffset: 0.25,
    shadowRadius: 3.5,
    elevation: 5,
  },
  tabIcon: {
    // padding:5
    // backgroundColor:"red"
  },
});

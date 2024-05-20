import React, {useState, useEffect} from 'react'
import { StyleSheet, Text, View, TouchableOpacity, TextInput, Alert, SafeAreaView} from 'react-native'
import { useDispatch, useSelector } from 'react-redux';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import LinearGradient from 'react-native-linear-gradient';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Profile from '../Pages/Profile'
import Setting from '../Pages/Setting';

const SettingStack = ({navigation}) => {
    const Stack = createNativeStackNavigator();

    const GradientHeader = ({name,iconName}) => (
        <View>
          <LinearGradient
            colors={["#F1F6FF", "#F1F6FF", "#F1F6FF"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={[{ alignItems: "flex-start",justifyContent:'center', maxHeight: 80 }]}
          >
            <View style={styles.headerView}>
                <TouchableOpacity onPress={()=>navigation?.navigate('dashboard', {screen: 'mainDashboard'})} style={{justifyContent:'center'}}>
                <View style={styles.backButton}>
                    <AntDesign name={iconName} size={15} color={'#1F2C37'}/>
                </View>
                </TouchableOpacity>
                <SafeAreaView>
                    <Text style={styles.headerText}> {name} </Text>
                </SafeAreaView>
            </View>
        </LinearGradient>
        </View>
    )

  return (
    <Stack.Navigator>
        <Stack.Screen 
            name='setting'
            component={Setting}
            options={{
                title: 'Setting',
                headerShown: true,
                header: () => <GradientHeader name="Settings" iconName={"left"} flag={false}/>
            }}
        />
    </Stack.Navigator>
  )
}

export default SettingStack

const styles = StyleSheet.create({
    headerText: {
        fontWeight: "600",
        fontSize: 19,
        color: '#1F2C37',
        marginLeft: 8,
        width: '93%'
      },
      headerView: {
        alignItems: "center",
        flexDirection: "row",
        margin: 2,
        padding: 2,
        marginVertical: 5,
      },
      backButton: {
        borderRadius: 50,
        backgroundColor: 'white',
        padding: 12,
        marginLeft: 8,
        marginRight: 5,
        marginVertical: 5,
      },
})
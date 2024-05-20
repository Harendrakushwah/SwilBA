import React from 'react'
import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView} from 'react-native'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LinearGradient from 'react-native-linear-gradient';
import { UseSelector, useSelector } from 'react-redux';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Accounts from '../Pages/Dashboard/Accounts';
import AccReceivableList from '../Pages/Dashboard/AccReceivableList';
import { COLORS } from '../Resources/GlobalStyles';
import AccReceivableOrderView from '../Pages/Dashboard/AccReceivableOrderView';
import { CommonNavigationAction } from '@react-navigation/native';
import AccPayableList from '../Pages/Dashboard/AccPayableList';
import AccPayableOrderView from '../Pages/Dashboard/AccPayableOrderView';

const AccountsStack = ({navigation}) => {
    const Stack = createNativeStackNavigator();
    const headerData = useSelector(state => state?.commonSlice?.headerData)

    const GradientHeader = ({name,iconName, flag, payOrRec, listPayOrRec}) => (
        <View>
          <LinearGradient
            colors={["#F1F6FF", "#F1F6FF", "#F1F6FF"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={[{ alignItems: "flex-start",justifyContent:'center', maxHeight: 80 }]}
          >
            <View style={styles.headerView}>
            {payOrRec == 'rec'
            ? 
            (flag) ? 
              <TouchableOpacity onPress={()=>navigation?.navigate('accreceivablelist')} style={{justifyContent:'center'}}>
                <View style={styles.backButton}>
                  <AntDesign name={iconName} size={15} color={'#1F2C37'}/>
                </View>
              </TouchableOpacity>
              :
              (listPayOrRec == 'rec') ?
                <TouchableOpacity onPress={()=>navigation?.navigate('accounts')} style={{justifyContent:'center'}}>
                  <View style={styles.backButton}>
                    <AntDesign name={iconName} size={15} color={'#1F2C37'}/>
                  </View>
                </TouchableOpacity> 
                :
                <TouchableOpacity onPress={()=>navigation?.goBack()} style={{justifyContent:'center'}}>
                  <View style={styles.backButton}>
                    <AntDesign name={iconName} size={15} color={'#1F2C37'}/>
                  </View>
                </TouchableOpacity> 
            :
            (flag) ? 
            <TouchableOpacity onPress={()=>navigation?.navigate('accpayablelist')} style={{justifyContent:'center'}}>
              <View style={styles.backButton}>
                <AntDesign name={iconName} size={15} color={'#1F2C37'}/>
              </View>
            </TouchableOpacity>
            :

            (listPayOrRec == 'pay') ?
                <TouchableOpacity onPress={()=>navigation?.navigate('accounts')} style={{justifyContent:'center'}}>
                  <View style={styles.backButton}>
                    <AntDesign name={iconName} size={15} color={'#1F2C37'}/>
                  </View>
                </TouchableOpacity> 
                :
                
            <TouchableOpacity onPress={()=>navigation?.goBack()} style={{justifyContent:'center'}}>
              <View style={styles.backButton}>
                <AntDesign name={iconName} size={15} color={'#1F2C37'}/>
              </View>
            </TouchableOpacity> 
            }  
            <SafeAreaView>
              <Text style={styles.headerText}> {name} </Text>
            </SafeAreaView>
            </View>
          </LinearGradient>
        </View>
      );

  return (
    <Stack.Navigator>
        <Stack.Screen 
            name='accounts'
            component={Accounts}
            options={{
                title: 'Accounts',
                headerShown: true,
                header: () => <GradientHeader name="Accounts" iconName={"left"} flag={false}/>
            }}
        />
        <Stack.Screen 
            name='accreceivablelist'
            component={AccReceivableList}
            options={{
                title: 'Receivables List',
                headerShown: true,
                header: () => <GradientHeader name="Receivables List" iconName={"left"} flag={false} payOrRec={'rec'} listPayOrRec={'rec'}/>
            }}
        />
        <Stack.Screen 
            name='accrecorderview'
            component={AccReceivableOrderView}
            options={{
                title: 'accrecorderview',
                headerShown: true,
                header: () => <GradientHeader name={headerData} iconName={"left"} flag={true} payOrRec={'rec'}/>
            }}
        />
        <Stack.Screen 
            name='accpayablelist'
            component={AccPayableList}
            options={{
                title: 'Payable List',
                headerShown: true,
                header: () => <GradientHeader name="Payables List" iconName={"left"} flag={false} listPayOrRec={'pay'}/>
            }}
        />
        <Stack.Screen 
            name='accpayorderview'
            component={AccPayableOrderView}
            options={{
                title: 'accpayorderview',
                headerShown: true,
                header: () => <GradientHeader name={headerData} iconName={"left"} flag={true} payOrRec={'pay'}/>
            }}
        />
    </Stack.Navigator>
  )
}

export default AccountsStack

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
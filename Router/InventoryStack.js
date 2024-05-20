import React, {useState, useEffect} from 'react'
import { StyleSheet, Text, View, TouchableOpacity, TextInput, Alert} from 'react-native'
import { useDispatch, useSelector } from 'react-redux';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import LinearGradient from 'react-native-linear-gradient';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Inventory from '../Pages/Dashboard/Inventory';
import SalesBelowCostRate from '../Pages/Dashboard/SalesBelowCostRate';
import RateDifference from '../Pages/Dashboard/RateDifference';
import ExcessDiscount from '../Pages/Dashboard/ExcessDiscount';
import ExcessScheme from '../Pages/Dashboard/ExcessScheme';


const InventoryStack = ({navigation}) => {
    const dispatch = useDispatch();
    const Stack = createNativeStackNavigator();

    const GradientHeader = ({name,iconName, dateInputFlag, tranAlias}) => (
        <View style={{}}>
          <LinearGradient
            colors={["#F1F6FF", "#F1F6FF", "#F1F6FF"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={[{alignItems: 'flex-start', justifyContent:'center', maxHeight: 180}]}
          >

            {(name == 'Sales Below Cost Rate' || name == 'Excess Discount' || name == 'Rate Difference' || name == 'Excess Scheme') 
            ? 
            <View style={styles.headerView}>
            <View>
            <TouchableOpacity onPress={()=>navigation?.navigate('inventory')} style={{justifyContent:'center'}}>
              <View style={styles.backButton}>
                <AntDesign name={iconName} size={15} color={'#1F2C37'}/>
              </View>
            </TouchableOpacity>
            </View>
            <View style={{flex: 1, marginRight: 45}}>
              <Text style={styles.headerText}> {name} </Text>
            </View>

          </View>
          :
          <View style={styles.headerView}>
          <View>
          <TouchableOpacity onPress={()=>navigation?.goBack()} style={{justifyContent:'center'}}>
            <View style={styles.backButton}>
              <AntDesign name={iconName} size={15} color={'#1F2C37'}/>
            </View>
          </TouchableOpacity>
          </View>
          <View style={{flex: 1, marginRight: 45}}>
            <Text style={styles.headerText}> {name} </Text>
          </View>

        </View>
          }
          </LinearGradient>
        </View>
      );

  return (
    <Stack.Navigator>
        <Stack.Screen 
            name="inventory"
            component={Inventory}
            options={{
                title: 'Inventory',
                headerShown: true,
                header: () => <GradientHeader name="Inventory" iconName={"left"}/>,
             
              }}
        />
        
        <Stack.Screen 
            name="salesBelowCostRate"
            component={SalesBelowCostRate}
            options={{
                title: 'Sales Below Cost Rate',
                headerShown: true,
                header: () => <GradientHeader name="Sales Below Cost Rate" iconName={"left"} dateInputFlag={true} tranAlias={'sbcr'}/>,
             
              }}
        />

        <Stack.Screen 
            name='excessDiscount'
            component={ExcessDiscount}
            options={{
                title: 'Excess Discount',
                headerShown: true,
                header: () => <GradientHeader name="Excess Discount" iconName={"left"} dateInputFlag={true} tranAlias={'excDis'}/>
            }}
        />
            <Stack.Screen 
                name='rateDifference'
                component={RateDifference}
                options={{
                    title: 'Rate Difference',
                    headerShown: true,
                    header: () => <GradientHeader name="Rate Difference" iconName={"left"} dateInputFlag={true} tranAlias={'rateDiff'}/>
                }}
            />
            <Stack.Screen 
                name='excessScheme'
                component={ExcessScheme}
                options={{
                    title: 'Excess Scheme',
                    headerShown: true,
                    header: () => <GradientHeader name="Excess Scheme" iconName={"left"} dateInputFlag={true} tranAlias={'excSch'}/>
                }}
            />
    </Stack.Navigator>
  )
}

export default InventoryStack

const styles = StyleSheet.create({
    headerText: {
        fontWeight: "600",
        fontSize: 19,
        color: '#1F2C37',
        marginLeft: 8,
      },
      headerView: {
        alignItems: "center",
        flexDirection: "row",
        margin: 2,
        padding: 2,
        marginVertical: 5,
        width:'100%',
        zIndex: 1
      },
      backButton: {
        borderRadius: 50,
        backgroundColor: 'white',
        padding: 12,
        marginLeft: 8,
        marginRight: 5,
        marginVertical: 5,
      },
      dateContainer: {
        flexDirection: 'row',
        alignSelf: 'flex-end'
      },
      dateInput: {
        flex: 0.1,
        justifyContent: 'center',
        alignItems: 'flex-end',
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 8,
        backgroundColor: 'white',
        marginHorizontal: 10,
      },
})
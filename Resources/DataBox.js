import {StyleSheet, Text, View, Image, TouchableOpacity, ActivityIndicator} from 'react-native';
import React, {useEffect, useState} from 'react';
import {COLORS, GlobalStyles} from './GlobalStyles';
import EIcon from 'react-native-vector-icons/Entypo';
import AccountsStack from '../Router/AccountsStack';
import { useNavigation } from '@react-navigation/native';

const DataBox = ({title, data, InvOrAcc}) => {
  const [boxOpen, setBoxOpen] = useState(title == 'Expiry Stock' ? true : InvOrAcc=='Inventory' ? false : false);
  const navigation = useNavigation();
  switch(InvOrAcc){    
    case 'Inventory':
      return (
        <View
          style={{...GlobalStyles.shadowBoxContainer, paddingVertical: -13}}
        >
          <TouchableOpacity 
            style={{backgroundColor: '#F1EFF3', marginHorizontal: -17, paddingVertical: 13}}
            onPress={() => setBoxOpen(!boxOpen)}
          >
          <View style={styles.headerContainer}>
            <Text style={styles.headingText}>{title}</Text>
            <View>
              {boxOpen ? (
                <TouchableOpacity onPress={() => setBoxOpen(!boxOpen)}>
                  <EIcon
                    name="chevron-up"
                    size={24}
                    color={COLORS.primary}
                    style={styles.collapseIcon}
                  />
                </TouchableOpacity>
              ) : (
                <TouchableOpacity onPress={() => setBoxOpen(!boxOpen)}>
                  <EIcon
                    name="chevron-down"
                    size={24}
                    color={COLORS.primary}
                    style={styles.collapseIcon}
                  />
                </TouchableOpacity>
              )}
            </View>
          </View>
          </TouchableOpacity>
          {boxOpen ? (
            <>
      {data ?
      <>
              <View style={styles.primaryRow}>
                <View style={styles.primarySecondContainer}>
                  <Text style={styles.rowHeadingText}>Total Products</Text>
                </View>
                <Text style={styles.rowText}>{(data?.TotalCount)?.toFixed(2) || 'N/A'}</Text>
              </View>
              <View style={styles.primaryRow}>
                <View style={styles.primarySecondContainer}>
                  <Text style={styles.amtstock}>Total Amount</Text>
                </View>
                <Text style={styles.rowText}>
                  {(data?.TotalAmount)?.toFixed(2) || 0}
                </Text>
              </View>
              <View style={styles.primaryRow}>
                <View style={styles.primarySecondContainer}>
                  <Text style={styles.amtstock}>Total Stock (Unit1)</Text>
                </View>
                <Text style={styles.rowText}>
                    {(data?.TotalStockUnit1)?.toFixed(2) || 0}
                </Text>
              </View>
              <View style={styles.primaryRow}>
                <View style={styles.primarySecondContainer}>
                  <Text style={styles.amtstock}>Total Stock (Unit2)</Text>
                </View>
                <Text style={styles.rowText}>
                  {(data?.TotalStockUnit2)?.toFixed(2) || 0}
                </Text>
              </View>
              </>
              : <View style={styles.loaderView}>
                <ActivityIndicator size='small' color={COLORS.primary}/>
                <Text style={styles.loaderText}>Loading...</Text>
              </View>}
            </>
    
          ) : null}
        </View>
      );

      break;

      case 'Accounts':
        return (
          <View
            style={{
              ...GlobalStyles.shadowBoxContainer, paddingVertical: -13
            }}
          >
          <TouchableOpacity 
            style={{backgroundColor: '#F1EFF3', marginHorizontal: -17, paddingVertical: 13}}
            onPress={() => setBoxOpen(!boxOpen)}
          >
            <View 
              style={styles.headerContainer}
            >
              <View style={styles.titleContainer}>
                <Text style={styles.headingText}>{title}</Text>
              </View>
              <View>
                {boxOpen ? (
                  <TouchableOpacity onPress={() => setBoxOpen(!boxOpen)}>
                    <EIcon
                      name="chevron-up"
                      size={24}
                      color={COLORS.primary}
                      style={styles.collapseIcon}
                    />
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity onPress={() => setBoxOpen(!boxOpen)}>
                    <EIcon
                      name="chevron-down"
                      size={24}
                      color={COLORS.primary}
                      style={styles.collapseIcon}
                    />
                  </TouchableOpacity>
                )}
              </View>
            </View>
          </TouchableOpacity>
            {boxOpen ? (
              <>
        {data ?
        <>
          
          
                <View style={styles.primaryRow}>
                  <View style={styles.primarySecondContainer}>
                    <Text style={styles.amtstock}>Total Due Amount</Text>
                  </View>
                  <Text style={styles.rowText}>{(parseFloat(data?.TotalDueAmt))?.toFixed(2) || 0}</Text>
                </View>
                <View style={styles.primaryRow}>
                  <View style={styles.primarySecondContainer}>
                    <Text style={styles.amtstock}>Total Net Amount</Text>
                  </View>
                  <Text style={styles.rowText}>
                    {(parseFloat(data?.TotalNetAmt))?.toFixed(2) || 0}
                  </Text>
                </View>
                <View style={styles.primaryRow}>
                  <View style={styles.primarySecondContainer}>
                    <Text style={styles.amtstock}>Total PDC Amount</Text>
                  </View>
                  <Text style={styles.rowText}>
                    {(parseFloat(data?.TotalPDCAmt))?.toFixed(2) || 0}
                  </Text>
                </View>
                  <View style={{flex: 1, alignItems: 'center',  alignSelf: 'center', borderWidth: 1, width: '28%', marginTop: 20, borderRadius: 5, backgroundColor: COLORS.primary, paddingVertical: 5}}>
                    {title == 'Payables' 
                    ? 
                      <TouchableOpacity onPress={()=>navigation.navigate('accountsStack', {screen : "accpayablelist"})}>
                        <Text style={{color: COLORS.white, fontWeight: 'bold'}}>Show reports</Text>
                      </TouchableOpacity>
                    : 
                      <TouchableOpacity onPress={()=>navigation.navigate('accountsStack', {screen : "accreceivablelist"})}>
                        <Text style={{color: COLORS.white, fontWeight: 'bold'}}>Show reports</Text>
                      </TouchableOpacity>
                    }
                    
                  </View>

                </>
                : <View style={styles.loaderView}>
                  <ActivityIndicator size='small' color={COLORS.primary}/>
                  <Text style={styles.loaderText}>Loading...</Text>
                </View>}
              </>
      
            ) : null}
          </View>
        );
  }  
};

export default DataBox;

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginHorizontal: 27,
    // backgroundColor: 'purple',
  },
  primaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 5,
  },
  rowText: {
    color: '#1A1A1A',
    fontSize: 17,
    fontWeight: "400",
    marginHorizontal: 10,
    marginRight: 15,
    marginTop: 8,
  },
  rowHeadingText: {
    color: '#444444',
    fontSize: 17,
    fontWeight: "600",
    marginTop: 8,
  },
  headingText: {
    fontSize: 17,
    fontWeight: '500',
    color: "#000000",
    flex: 9,
  },
  amtstock: {
    fontSize: 18,
    fontWeight: '600',
    color: '#444444'
  },
  stock2Style: {
    fontSize: 19,
    fontWeight: '700',
    color: '#444444'
  },
  secondryRowText: {
    color: COLORS.textTitle,
    fontSize: 15,
    fontWeight: "500",
    marginHorizontal: 10,
    marginRight: 15,
  },
  primarySecondContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 5,
    marginTop: 5,
    marginLeft: 5,
  },
  loaderView: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 15
  },
  loaderText: {
    marginTop: 10,
    fontSize: 19,
    fontWeight: '500',
    color: COLORS.black,
  },
  stock2StyleValue: {
    fontSize: 18,
    fontWeight: "700",
    color: '#4E2459',
    marginHorizontal: 10,
    marginRight: 15,
    marginTop: 5,
  },
});

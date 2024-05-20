import {StyleSheet, Text, View, Image, TouchableOpacity, ActivityIndicator} from 'react-native';
import React, {useEffect, useState} from 'react';
import {COLORS, GlobalStyles} from './GlobalStyles';
import EIcon from 'react-native-vector-icons/Entypo';


const GlobalDataBox = ({title, data}) => {
  const [boxOpen, setBoxOpen] = useState(false);

  
  return (
    <View
      style={{
        ...GlobalStyles.shadowBoxContainer,paddingVertical: -13
      }}
      >
      <TouchableOpacity 
            style={{backgroundColor: '#F1EFF3', marginHorizontal: -17, paddingVertical: 13}}
            onPress={() => setBoxOpen(!boxOpen)}
      >
      <View 
        style={styles.headerContainer}
        onPress={() => setBoxOpen(!boxOpen)}
      >
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
              <Image
                source={require('../Assets/Images/boximg.png')}
                style={styles.mainiconStyle}
              />
              <Text style={styles.rowHeadingText}>No. of Bills</Text>
            </View>
            <Text style={styles.rowText}>{data?.TotalBills || 'N/A'}</Text>
          </View>
          <View style={styles.primaryRow}>
            <View style={styles.primarySecondContainer}>
              <Image
                source={require('../Assets/Images/boximg.png')}
                style={styles.mainiconStyle}
              />
              <Text style={styles.rowHeadingText}>Total Amount</Text>
            </View>
            <Text style={styles.rowText}>
              {' '}
              {'\u20B9'} {data?.Amt?.toFixed(2) || 0}
            </Text>
          </View>
          <View style={styles.primaryRow}>
            <View style={styles.secondryContainer}>
              <Image
                source={require('../Assets/Images/cash2.png')}
                style={styles.iconStyle}
              />
              <Text style={styles.secondryRowHeadingText}>Cash</Text>
            </View>
            <Text style={styles.secondryRowText}>
              {'\u20B9'} {data?.CashAmt?.toFixed(2) || 0}
            </Text>
          </View>
          <View style={styles.primaryRow}>
            <View style={styles.secondryContainer}>
              <Image
                source={require('../Assets/Images/cards.png')}
                style={styles.iconStyle}
              />
              <Text style={styles.secondryRowHeadingText}>Cards</Text>
            </View>
            <Text style={styles.secondryRowText}>
              {'\u20B9'} {data?.CardAmt?.toFixed(2) || 0}
            </Text>
          </View>
          <View style={styles.primaryRow}>
            <View style={styles.secondryContainer}>
              <Image
                source={require('../Assets/Images/cheque.png')}
                style={styles.iconStyle}
              />
              <Text style={styles.secondryRowHeadingText}>Cheque</Text>
            </View>
            <Text style={styles.secondryRowText}>
              {'\u20B9'} {data?.ChequeAmt?.toFixed(2) || 0}
            </Text>
          </View>
          <View style={styles.primaryRow}>
            <View style={styles.secondryContainer}>
              <Image
                source={require('../Assets/Images/credit.png')}
                style={styles.iconStyle}
              />
              <Text style={styles.secondryRowHeadingText}>Credit</Text>
            </View>
            <Text style={styles.secondryRowText}>
              {'\u20B9'} {data?.CreditAmt?.toFixed(2) || 0}
            </Text>
          </View>
          </>
          : <View style={styles.loaderView}>
            <ActivityIndicator size='large' color={COLORS.primary}/>
          </View>}
        </>

      ) : null}
    </View>
  );
};

export default GlobalDataBox;

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginHorizontal: 10,
  },
  primaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 7,
  },
  rowText: {
    color: COLORS.textTitle,
    fontSize: 16,
    fontWeight: "500",
    marginHorizontal: 10,
    marginRight: 15,
  },
  rowHeadingText: {
    color: COLORS.primary,
    fontSize: 18,
    fontWeight: "500",
  },
  headingText: {
    textAlign: "center",
    fontWeight: "500",
    fontSize: 19,
    color: COLORS.primaryDark,
    flex: 9,
  },
  secondryRowHeadingText: {
    fontSize: 16,
    fontWeight: "bold",
    color: COLORS.primary,
    marginLeft: 10,
  },
  iconStyle: {
    resizeMode: "contain",
    height: 20,
    width: 20,
    marginHorizontal: 4,
  },
  mainiconStyle: {
    resizeMode: "contain",
    height: 22,
    width: 22,
    marginRight: 8,
  },
  secondryContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 30,
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
  },
  loaderView: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    margin:10
  },
});

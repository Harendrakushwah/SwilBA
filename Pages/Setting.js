import React, { useEffect, useLayoutEffect, useState } from "react";
import { SafeAreaView, StyleSheet,View,Text } from 'react-native'
import ActionButton from '../GlobalComponents/ActionButton';
import MCIcon from "react-native-vector-icons/MaterialCommunityIcons";
import { COLORS } from '../Resources/GlobalStyles';
import { useDispatch, useSelector } from 'react-redux';
import { getSeriesListByTranAlias, logOutHandler } from '../Redux/Common/CommonAction';
import CustomPicker from "../GlobalComponents/CustomPicker";
import { TranSliceActions } from "../Redux/Transaction/TransactionSlice";



const Setting = ({navigation}) => {
const dispatch = useDispatch();

// const getInputDays = useSelector(state => state.commonSlice?.inputDays)
    
// const [inputDays,setInputDays] = useState(1);
// const [days,setDays] = useState(getInputDays)

const voucherSeriesList = useSelector(
  (state) => state.transactionSlice.vouchers.voucherSeriesList
);
const selectedVoucherSeries = useSelector(
  (state) => state.transactionSlice.vouchers.selectedVoucherSeries
);
const creditNoteSeriesList = useSelector(
  (state) => state.transactionSlice.creditNote.creditNoteSeriesList
);
const selectedCreditNoteSeries = useSelector(
  (state) => state.transactionSlice.creditNote.selectedCreditNoteSeries
);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: `Settings`,
      headerLeft: () => (
        <>
          <ActionButton
            onPress={() => navigation.goBack()}
            icon={<MCIcon name="arrow-left" size={24} color={COLORS.white} />}
            android_ripple={COLORS.primaryDark}
            style={{ borderRadius: 1000, marginRight: 10 }}
          />
        </>
      ),
    });
  }, []);


  return (
    <SafeAreaView style={styles.mainContainer}>
  
      {/* <SeriesSelector />
      <CreditNoteSeries /> */}

      <View style={styles.mainView}>
        <View style={styles.textView}>
          <Text style={styles.firstViewText}>Voucher Series</Text>
        </View>
        <View style={styles.dropDownView}>
          <CustomPicker
            data={voucherSeriesList}
            labelField="Series"
            valueField="PKID"
            selectedValue={selectedVoucherSeries}
            onChange={(item) => {
              dispatch(TranSliceActions.setSelectedVoucherSeries(item));
            }}
            selectedTextStyle={{
              marginLeft: 5,
              fontWeight: "bold",
              color: COLORS.primary,
              fontSize: 20,
            }}
            containerStyle={{ marginTop: 2 }}
            search={true}
            searchPlaceholder="Search Series"
            flatListProps={{
              keyboardShouldPersistTaps: "handled",
              automaticallyAdjustKeyboardInsets: "true",
            }}
            placeholder="Search Series"
          />
        </View>
      </View>

      <View style={styles.mainView}>
          <View style={styles.textView}>
            <Text style={styles.firstViewText}>Credit Note Series</Text>
          </View>
          <View style={styles.dropDownView}>
            <CustomPicker
              data={creditNoteSeriesList}
              labelField="Series"
              valueField="PKID"
              selectedValue={selectedCreditNoteSeries}
              onChange={(item) => {
                dispatch(TranSliceActions.setSelectedCreditNoteSeries(item));
              }}
              selectedTextStyle={{
                marginLeft: 5,
                fontWeight: "bold",
                color: COLORS.primary,
                fontSize: 20,
              }}
              containerStyle={{ marginTop: 2 }}
              search={true}
              searchPlaceholder="Search Series"
              flatListProps={{
                keyboardShouldPersistTaps: "handled",
                automaticallyAdjustKeyboardInsets: "true",
              }}
              placeholder="Search Series"
            />
          </View>
        </View>

    </SafeAreaView>
  )
}

export default Setting;

const styles = StyleSheet.create({
    mainContainer:{
      flex:1
    },

    titleContainer: {
      borderColor: COLORS.white,
      shadowOffset: {
          width: 1,
          height: 1,
        },
        shadowOpacity:  0.17,
        shadowRadius: 3.05,
        marginHorizontal: 8,
  },
  title: {
      textAlign: 'center',
      fontSize: 18,
      fontWeight: '500',
      marginVertical: 15,
      marginLeft: 15,
      color: '#1F2C37',
  },

  mainView: {
    // flex: 1,
    margin: 2,
  },
  textView: {
    justifyContent: "center",
    margin: 2,
    padding: 2,
  },
  firstViewText: {
    fontSize: 18,
    color: COLORS.navyText,
    fontWeight: "bold",
  },

  dropDownView: {
    borderRadius: 2,
    borderWidth: 0.5,
    borderColor: COLORS.gray,
    margin: 2,
    padding: 2,
  },
})
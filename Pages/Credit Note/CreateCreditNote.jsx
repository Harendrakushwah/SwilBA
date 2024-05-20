import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { ScrollView, StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { useFocusEffect } from "@react-navigation/native";
import MCIcon from "react-native-vector-icons/MaterialCommunityIcons";
import { COLORS, GlobalStyles } from "../../Resources/GlobalStyles";
import ActionButton from "../../GlobalComponents/ActionButton";
import SelectCustomer from "../../GlobalComponents/SelectCustomer";
import SelectProduct from "../../GlobalComponents/SelectProduct";
import PaymentSection from "../../GlobalComponents/PaymentSection";
import { getSeriesListByTranAlias } from "../../Redux/Common/CommonAction";
import { TranSliceActions } from "../../Redux/Transaction/TransactionSlice";
import axios from "axios";

export default function CreateCreditNote({ navigation }) {
  const dispatch = useDispatch();
  const scrollViewRef = useRef();
  const selectedCreditNoteSeries = useSelector(state => state.transactionSlice?.creditNote?.selectedCreditNoteSeries)
  const selectedCustomer = useSelector(state => state.transactionSlice?.creditNote?.selectedCustomer)
  const paymentEnabled = useSelector(state => state.transactionSlice?.creditNote?.paymentOptionEnabled)
  
  /* Set header title before render completes using useLayoutEffect */


  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: `Credit note`,
      headerLeft: () => (
        <>
          <ActionButton
            onPress={() => navigation.goBack()
            }

            icon={<MCIcon name="arrow-left" size={24} color={COLORS.white} />}
            android_ripple={COLORS.primaryDark}
            style={{ borderRadius: 1000 }}
          />
        </>
      ),
    });
  }, []);

  useEffect(() => {
    dispatch(getSeriesListByTranAlias("SCRN"));
  }, [navigation]);

  useEffect(() => {
    dispatch(TranSliceActions.setEmptyLastAddedProductAndCustomer());
    dispatch(TranSliceActions.emptyCart());
    dispatch(TranSliceActions.setPaymentOptionEnabled(false));
  }, [navigation])



  return (
    <View style={{ ...styles.mainContainer }}>
      <ScrollView
      ref={scrollViewRef}
      nestedScrollEnabled={true}
      showsVerticalScrollIndicator={false}
      onContentSizeChange={() => paymentEnabled ? scrollViewRef.current.scrollToEnd({ animated: true }) : null}
     >
      
        <View style={styles.creditSeriesContainer}>
          <Text style={{ ...styles.creditNoteTitle }}>Credit Note Series</Text>
          <TouchableOpacity
            style={styles.seriesOpacity}
            onPress={() => navigation.navigate("addTransactionStack", {screen: "setting", tranAlias: 'credit'})}
          >
            <Text style={styles.seriesText}>
              {selectedCreditNoteSeries?.Series || "Select Series"}
            </Text>
          </TouchableOpacity>
        </View>
      
        <SelectCustomer tranAlias={"creditNote"} /> 
        {selectedCustomer ? <SelectProduct tranAlias={"creditNote"} /> : null}
        {paymentEnabled ? <PaymentSection /> : null}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  mainHeaderText: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
  },
  mainContainer: {
    flex: 1,
    padding: 0,
    margin: 0,
    backgroundColor: COLORS.white,
    margin: 5,
    borderRadius: 15,
  },
  creditSeriesContainer: {
    flex: 1,
    width: "95%",
    alignSelf: "center",
    backgroundColor: COLORS.white,
    borderRadius: 10,
    margin: 4,
    padding: 4,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  seriesText: {
    fontWeight: "bold",
    fontSize: 16,
    marginRight: 12,
    color: COLORS.primary,
  },
  creditNoteTitle: {
    fontWeight: "bold",
    fontSize: 15,
    color: COLORS.primary,
    margin: 4,
    padding: 2,
  },
});

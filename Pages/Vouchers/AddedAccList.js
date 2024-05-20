import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  Alert,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { COLORS } from "../../Resources/GlobalStyles";
import { TranSliceActions } from "../../Redux/Transaction/TransactionSlice";
import Swipeable from "react-native-gesture-handler/Swipeable";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import MIcon from "react-native-vector-icons/MaterialIcons";

const AddedAccList = () => {
  const dispatch = useDispatch();
  const [showAmt, setShowAmt] = useState(0.00)

  const addedAccToLedger = useSelector(
    (state) => state.transactionSlice.addedAccToLedger
  );

  const swipeableRefArray = useRef([]);
  let prevOpenedRow = null;

  useEffect(() => {
    if(showAmt){
      dispatch(TranSliceActions.setInputAmt(showAmt))
    }
  }, [showAmt])

  useEffect(() => {
    if(addedAccToLedger){
      let amt=0;
      addedAccToLedger?.forEach((acc) => {
        amt = amt + parseFloat(acc.VoucherAmt)
      })
      // console.log("Amt----", amt)

      if(amt < 0){
        setShowAmt(-1 * amt)
      } 
      else{
        setShowAmt(amt)
      }

  }
  }, [addedAccToLedger])

  const closeRow = (index) => {
    /* Close if there exist a previous row and is different from currently opened row */
    if (prevOpenedRow && prevOpenedRow !== swipeableRefArray.current[index]) {
      prevOpenedRow.close();
    }
    /* Assign currently opened row to previous opened row */
    prevOpenedRow = swipeableRefArray.current[index];
  };

  const LeftSwipeActions = () => {
    return (
      <View style={styles.swipeLeftAction}>
        <MIcon name="delete" size={32} color={COLORS.white} />
      </View>
    );
  };
  const rightSwipeActions = (index) => {
    return (
      <View style={styles.swipeRightAction}>
        <MIcon name="edit" size={32} color={COLORS.white} />
      </View>
    );
  };
  const editDetails = (item, index) => {
    Alert.alert(null, "Edit Details ?", [
      {
        text: "Cancel",
        onPress: () => {
          swipeableRefArray.current[index].close();
        },
      },
      {
        text: "Yes",
        onPress: () => {
          dispatch(TranSliceActions.editAccountFromLedger(item));
          swipeableRefArray.current[index]?.close();
        },
      },
    ]);
  };
  const deleteDetails = (item, index) => {
    Alert.alert(null, "Delete Details ?", [
      {
        text: "Cancel",
        onPress: () => {
          swipeableRefArray.current[index].close();
        },
      },
      {
        text: "Yes",
        onPress: () => {
          dispatch(TranSliceActions.deleteAccFromLedger(item));
          swipeableRefArray.current[index]?.close();
        },
      },
    ]);
  };
  return (
    <View style={styles.mainContainer}>
      {addedAccToLedger?.length ? (
        <>
          <TouchableOpacity
            onPress={() =>
              Alert.alert(
                "Alert !",
                "Do you want to clear all selected details",
                [
                  {
                    text: "Cancel",
                    onPress: () => console.log("Cancel Pressed"),
                    style: "cancel",
                  },
                  {
                    text: "OK",
                    onPress: () =>
                      dispatch(TranSliceActions.setBlankAddedAccToLedger()),
                  },
                ]
              )
            }
            style={styles.clearOpacity}
          >
            <Text style={styles.clearText}>Clear All</Text>
          </TouchableOpacity>
          <GestureHandlerRootView>
            {addedAccToLedger?.map((item, index) => {
              return (
                <>
                  <Swipeable
                    ref={(ref) => (swipeableRefArray.current[index] = ref)}
                    renderLeftActions={LeftSwipeActions}
                    renderRightActions={rightSwipeActions}
                    onSwipeableWillOpen={() => closeRow(index)}
                    onSwipeableOpen={(direction) => {
                      direction === "right"
                        ? editDetails(item, index)
                        : deleteDetails(item, index);
                    }}
                  >
                    <View key={index} style={styles.voucherContainer}>
                      <Text style={styles.accText}>{item?.Account}</Text>
                      <Text
                        style={{
                          ...styles.accText,
                          color:
                            item?.Debit > 0 ? COLORS.redError : COLORS.green,
                          flex: 2,
                          textAlign: "right",
                        }}
                      >
                        {item?.Debit > 0
                          ? (-1 * item?.VoucherAmt)?.toFixed(2)
                          : (1 * item?.VoucherAmt)?.toFixed(2)}
                      </Text>
                    </View>
                  </Swipeable>
                </>
              );
            })}
          </GestureHandlerRootView>
        </>
      ) : null}
    </View>
  );
};

export default AddedAccList;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,

    width: "95%",
    alignSelf: "center",

    marginVertical: 4,
  },
  voucherContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    margin: 4,
    padding: 4,
    backgroundColor: COLORS.white,
    borderRadius: 10,
    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.17,
    shadowRadius: 3.05,
    elevation: 4,
  },
  accText: {
    flex: 8,
    fontWeight: "bold",
    fontSize: 16,
    color: COLORS.primary,
    marginHorizontal: 6,
    padding: 2,
    marginVertical: 4,
  },
  clearOpacity: {
    alignSelf: "flex-end",
    marginHorizontal: 8,
    margin: 4,
  },
  clearText: {
    fontWeight: "bold",
    fontSize: 18,
    textDecorationLine: "underline",
    color: COLORS.primary,
  },
  swipeRightAction: {
    backgroundColor: COLORS.primary,
    width: "50%",
    paddingRight: 16,
    justifyContent: "center",
    alignItems: "flex-end",
    marginVertical: 1.5,
  },
  swipeLeftAction: {
    backgroundColor: COLORS.redError,
    width: "50%",
    paddingLeft: 16,
    justifyContent: "center",
    alignItems: "flex-start",
    marginVertical: 1.5,
  },
});

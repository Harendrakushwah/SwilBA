import {
    StyleSheet,
    Text,
    View,
    FlatList,
    TouchableOpacity,
    Alert,
  } from "react-native";
  import React, { useRef } from "react";
  import { useDispatch, useSelector } from "react-redux";
  import { COLORS } from "../../Resources/GlobalStyles";
  import { TranSliceActions } from "../../Redux/Transaction/TransactionSlice";
  import Swipeable from "react-native-gesture-handler/Swipeable";
  import { GestureHandlerRootView } from "react-native-gesture-handler";
  import MIcon from "react-native-vector-icons/MaterialIcons";
  
  const EditAddedAccList = ({openLedger}) => {
    const dispatch = useDispatch();
  
    const editAddedAcc = useSelector(
      (state) => state.transactionSlice?.editVoucher?.editAddedAccToLedger
    );
    const editAddedAccToLedger = editAddedAcc?.filter((item)=> item?.ModeForm !== 2) 
    const swipeableRefArray = useRef([]);
    let prevOpenedRow = null;
  
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
            dispatch(TranSliceActions.editAccFromEditableList(item));
            openLedger()
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
            dispatch(TranSliceActions.deleteAccFromEditableList(item));
            swipeableRefArray.current[index]?.close();
          },
        },
      ]);
    };

    return (
      <View style={styles.mainContainer}>
        {editAddedAccToLedger?.length ? (
          <>
      
            <GestureHandlerRootView>
              {editAddedAccToLedger?.map((item, index) => {
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
                      <View key={item.SrNo} style={styles.voucherContainer}>
                        <Text style={styles.accText}>{item?.Account}</Text>
                        <Text
                          style={{
                            ...styles.accText,
                            color:
                              item?.Debit > 0 ? COLORS.redError : COLORS.green,
                              flex:2,
                              textAlign:'right'
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
  
  export default EditAddedAccList;
  
  const styles = StyleSheet.create({
    mainContainer: {
      flex: 1,
  
      width: "95%",
      alignSelf: "center",
  
      marginVertical: 4,
    },
    voucherContainer: {
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
      fontWeight: "bold",
      fontSize: 16,
      color: COLORS.primary,
      marginHorizontal: 6,
      padding: 2,
      marginVertical: 4,
      flex:8
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
  
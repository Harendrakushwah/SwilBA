import {
    StyleSheet,
    Text,
    View,
    Modal,
    TextInput,
    TouchableOpacity,
    FlatList,
    Alert,
    ScrollView
  } from "react-native";
  import React, { useState, useRef, useEffect } from "react";
  import { useDispatch, useSelector } from "react-redux";
  import Swipeable from "react-native-gesture-handler/Swipeable";
  import { GestureHandlerRootView } from "react-native-gesture-handler";
  import MIcon from "react-native-vector-icons/MaterialIcons";
import { COLORS } from "../../Resources/GlobalStyles";
import CustomPicker from "../../GlobalComponents/CustomPicker";
import { TranSliceActions } from "../../Redux/Transaction/TransactionSlice";
  
  const EditCostCenter = ({
    isCostCenterOpen,
    setIsCostCenterOpen,
    srNo,
    ledgerAmt,
    isSendCCDetail,
    uniqueID,
    isEditing
  }) => {
    const dispatch = useDispatch();
    const selectedAccount = useSelector(
      (state) => state?.transactionSlice?.vouchers?.selectedAccount
    );
    const costCenterList = useSelector(
      (state) => state?.transactionSlice?.costCenter?.costCenterList
    );
    const selectedVoucherSeries = useSelector(
      (state) => state.transactionSlice?.vouchers?.selectedVoucherSeries
    );
    const addedCostCenter = useSelector(
      (state) => state.transactionSlice?.costCenter?.addedCostCenterList
    );
    const [selectedCostCenter, setSelectedCostCenter] = useState();
    const [remarkInput, setRemarkInput] = useState("");
    const [amountInput, setAmountInput] = useState("");
    const [balanceAmt,setBalanceAmt] = useState(ledgerAmt);
  
    const costCenterBody = {
      FKCostCenterID: selectedCostCenter?.PKID,
      CostCenter: selectedCostCenter?.CostCenter,
      Amount: amountInput,
      ModeForm:isEditing ? 1 : 0,
      SrNo: srNo  ,
      Remarks: remarkInput,
      UniqueID:uniqueID
    };
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
    const editCostCenterDetails = (item, index) => {
      // console.log("Edit Order Details ---===>>>",index,PKID,Batch)
      Alert.alert(null, "Edit Cost Center ?", [
        {
          text: "Cancel",
          onPress: () => {
            swipeableRefArray.current[index].close();
          },
        },
        {
          text: "Yes",
          onPress: () => {
            var dummy = {
              PKID: item?.FKCostCenterID,
              CostCenter: item?.CostCenter,
            };
            setSelectedCostCenter(dummy);
            setRemarkInput(item?.Remarks);
            setAmountInput(item?.Amount);
            dispatch(TranSliceActions.editCostCenter(item));
  
            swipeableRefArray.current[index]?.close();
          },
        },
      ]);
    };
    const deleteCostCenterDetails = (item, index) => {
      Alert.alert(null, "Delete Cost Center ?", [
        {
          text: "Cancel",
          onPress: () => {
            swipeableRefArray.current[index].close();
          },
        },
        {
          text: "Yes",
          onPress: () => {
            dispatch(TranSliceActions.deleteCostCenter(item));
            swipeableRefArray.current[index]?.close();
          },
        },
      ]);
    };
    useEffect(() => {
    if(ledgerAmt){
      setBalanceAmt(ledgerAmt);
    }
    }, [ledgerAmt])
    useEffect(() => {
   if(addedCostCenter?.length ){
    var ccAmount = 0
    addedCostCenter?.forEach(item => {
  
      if(uniqueID === item.UniqueID){
        ccAmount = JSON.parse(ccAmount) + JSON.parse(item.Amount)
  
      }
    })
    setBalanceAmt(ledgerAmt - ccAmount)
   }
    }, [addedCostCenter,ledgerAmt])
  const newCCList = addedCostCenter?.filter(item => item?.UniqueID === uniqueID)
    return (
      <View>
        <Modal
          animationType="slide"
          transparent={true}
          presentationStyle="overFullScreen"
          visible={isCostCenterOpen}
          onRequestClose={setIsCostCenterOpen}
        >
          <View style={styles.filterModalBackgroundBox}>
            <View style={styles.modalView}>
              <View style={styles.headerview}>
                <Text style={styles.headinText}>Cost Center </Text>
                <Text style={{ ...styles.headinText, color: COLORS.primary }}>
                  Account : {selectedAccount?.Account}
                </Text>
              </View>
              <View style={styles.partition} />
              <View>
                <CustomPicker
                  data={costCenterList}
                  labelField="CostCenter"
                  valueField="PKID"
                  selectedValue={selectedCostCenter}
                  onChange={(item) => setSelectedCostCenter(item)}
                  style={styles.dropDownPicker}
                  containerStyle={{
                    ...styles.dropDownContainer,
                  }}
                  search={true}
                  searchPlaceholder="Search Cost Center"
                  inputSearchStyle={styles.dropDownSearchBar}
                  flatListProps={{
                    keyboardShouldPersistTaps: "handled",
                    automaticallyAdjustKeyboardInsets: "true",
                  }}
                  placeholder={"Select Cost Center"}
                  itemContainerStyle={{margin:-4}}
                />
              </View>
              <View style={styles.remarkContainer}>
                <Text style={styles.remarktext}>Remarks</Text>
                <TextInput
                  style={styles.remarkInput}
                  value={remarkInput}
                  onChangeText={(remark) => setRemarkInput(remark)}
                />
              </View>
              <View style={styles.secondryContainer}>
                <View
                  style={{ flexDirection: "row", alignItems: "center", flex: 6 }}
                >
                  <Text style={styles.amtText}>Amount : </Text>
                  <TextInput
                    style={styles.costCenterAmt}
                    placeholder="0.00"
                    value={amountInput}
                    onChangeText={(amt) => 
                      setAmountInput(amt)
                     
                    }
                    keyboardType="numeric"
                  />
                </View>
                <TouchableOpacity
                  onPress={() => {
                    if (selectedCostCenter) {
                      if (amountInput > 0) {
                        dispatch(
                          TranSliceActions.setAddedCostCenterList(costCenterBody)
                        );
                        setAmountInput();
                        setSelectedCostCenter();
                        setRemarkInput();
                      } else {
                        Alert.alert(
                          "Hold On !",
                          "Please input amount to cost center"
                        );
                      }
                    } else {
                      Alert.alert("Hold On !", "Please select cost center");
                    }
                  }}
                  style={styles.addOpacity}
                >
                  <Text style={styles.addText}>Add</Text>
                </TouchableOpacity>
              </View>
  
              <GestureHandlerRootView style={styles.listContainer}>
            
  
                <FlatList
                  data={newCCList}
                  style={{maxHeight:200}}
                  renderItem={({ item, index }) => {
                    return (
                      <>
  
                        <Swipeable
                          ref={(ref) => (swipeableRefArray.current[index] = ref)}
                          renderLeftActions={LeftSwipeActions}
                          renderRightActions={rightSwipeActions}
                          onSwipeableWillOpen={() => closeRow(index)}
                          onSwipeableOpen={(direction) => {
                            direction === "right"
                              ? editCostCenterDetails(item, index)
                              : deleteCostCenterDetails(item, index);
                          }}
                        >
                          <View key={index} style={styles.itemContainer}>
                            <Text style={styles.itemText}>
                              {item?.CostCenter}
                            </Text>
                            <Text
                              style={{
                                ...styles.itemText,
                                color: COLORS.primary,
                              }}
                            >
                              {" "}
                              {"\u20B9"} {JSON.parse(item?.Amount)?.toFixed(2)}
                            </Text>
                          </View>
                        </Swipeable>
  
                      </>
                    );
                  }}
                />
           
  
              </GestureHandlerRootView>
              <Text style={styles.balanceText}>
                Balance Amount : {"\u20B9"}{" "}
                {(balanceAmt * 1)?.toFixed(2) || ledgerAmt?.toFixed(2)}{" "}
              </Text>
              <View style={styles.bottomBtnPrimaryView}>
                {addedCostCenter?.length ? (
                  <View style={styles.bottomBtnView}>
                    <TouchableOpacity
                      style={styles.bottomBtnOpacity}
                      onPress={() => {
                        if(balanceAmt === 0){
                          isSendCCDetail(true)
                          setIsCostCenterOpen();
                        }else{
                          Alert.alert('Hold On !',`Total amount is not same as accountvoucher amount.`)
                        }
                    
                      }}
                    >
                      <Text style={styles.bottomBtnText}>Ok</Text>
                    </TouchableOpacity>
  
                  </View>
                ) : null}
              </View>
            </View>
          </View>
        </Modal>
      </View>
    );
  };
  
  export default EditCostCenter;
  
  const styles = StyleSheet.create({
    filterModalBackgroundBox: {
      flex: 1,
      backgroundColor: "#00000050",
      alignItems: "center",
      justifyContent: "center",
    },
  
    modalView: {
      margin: 20,
      backgroundColor: "white",
      borderRadius: 20,
      padding: 10,
      width: "95%",
      maxHeight: "80%",
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5,
    },
    partition: {
      borderWidth: 0.25,
      borderRadius: 10,
      shadowColor: COLORS.black,
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.2,
      shadowRadius: 3.05,
      elevation: 2,
      margin: 2,
      width: "100%",
      alignSelf: "center",
    },
    dropDownContainer: {
      elevation: 6,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: COLORS.primary,
      marginTop: 17,
    },
    dropDownPicker: {
      borderWidth: 0.5,
      margin: 4,
      padding: 2,
      borderRadius: 5,
      borderColor: COLORS.primary,
    },
    headerview: {
      flexDirection: "row",
      justifyContent: "space-between",
      margin: 2,
      padding: 2,
    },
    headinText: {
      fontWeight: "bold",
      fontSize: 18,
      color: COLORS.navyText,
    },
    secondryContainer: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    costCenterAmt: {
      borderBottomWidth: 1,
      borderColor: COLORS.primary,
      width: "50%",
      fontSize: 18,
      fontWeight: "bold",
      color: COLORS.primary,
    },
    addOpacity: {
      flex: 4,
      alignItems: "center",
      justifyContent: "center",
      borderWidth: 2,
      borderRadius: 200,
      alignSelf: "center",
      maxWidth: "40%",
      marginHorizontal: 10,
      borderColor: COLORS.primary,
    },
    addText: {
      fontWeight: "bold",
      fontSize: 22,
      margin: 2,
      padding: 2,
      color: COLORS.primary,
    },
    amtText: {
      fontWeight: "bold",
      fontSize: 18,
      color: COLORS.navyText,
    },
    remarkContainer: {
      margin: 2,
      padding: 2,
      justifyContent: "center",
    },
    remarktext: {
      fontWeight: "bold",
      fontSize: 18,
      color: COLORS.navyText,
    },
    remarkInput: {
      borderBottomWidth: 1,
      borderColor: COLORS.primary,
      fontWeight: "bold",
      fontSize: 18,
      color: COLORS.navyText,
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
    itemContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      margin: 4,
      padding: 2,
      borderRadius: 5,
      shadowColor: COLORS.grayText,
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 2.05,
      elevation: 2,
    },
    itemText: {
      fontWeight: "bold",
      fontSize: 18,
      margin: 10,
      color: COLORS.navyText,
    },
    bottomBtnPrimaryView: {
      alignItems: "center",
      justifyContent: "center",
    },
    bottomBtnOpacity: {
      backgroundColor: COLORS.primary,
      borderRadius: 4,
      width: "35%",
      alignItems: "center",
      justifyContent: "center",
      margin: 4,
      padding: 2,
    },
    bottomBtnText: {
      fontWeight: "bold",
      fontSize: 20,
      color: COLORS.white,
      padding: 4,
    },
    balanceText:{
      textAlign: "center",
      fontWeight: "bold",
      fontSize: 16,
      margin:2,
      padding : 2,
    },
    bottomBtnView:{
      flexDirection:'row',
      alignItems:'center',
      justifyContent:'space-evenly',
    }
  });
  
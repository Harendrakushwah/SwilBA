import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TextInput,
  Modal,
  FlatList,
  Alert,
  ActivityIndicator,
  Image,
} from "react-native";
import React, { useState, useEffect, useCallback } from "react";
import { COLORS } from "../../Resources/GlobalStyles";
import { formattedDate } from "../../Resources/Resources";
import MCIcon from "react-native-vector-icons/MaterialCommunityIcons";
import IIcon from "react-native-vector-icons/Ionicons";
import CustomPicker from "../../GlobalComponents/CustomPicker";
import axios from "../../Axios/Axios";
import {
  getAccountsList,
  getAccountsListByPKID,
  getAdjustmentList,
  getDefaultPartyList,
  getAccPartyList,
} from "../../Redux/Transaction/TransactionAction";
import { useDispatch, useSelector } from "react-redux";
import { TranSliceActions } from "../../Redux/Transaction/TransactionSlice";
import AddedAccList from "./AddedAccList";
import CostCenter from "../../GlobalComponents/CostCenter";


const LedgerBox = ({ navigation }) => {
  const dispatch = useDispatch();
  const [accountList, setAccountList] = useState([]);
  const [isAccountListLoading, setIsAccountListLoading] = useState(false);
  // const [ledgerOpen, setLedgerOpen] = useState(true);
  const [selectedPaymentMode, setSelectedPaymentMode] = useState("Dr");
  const [adjustModalOpen, setAdjustModalOpen] = useState(false);
  const [selectedAdjustments, setSelectedAdjustments] = useState([]);
  const [partyList, setPartyList] = useState([]);
  const [partyListLoading, setPartyListLoading] = useState(false);
  const [selectedParty, setSelectedParty] = useState([]);
  const [ledgerNarration, setLedgerNarration] = useState("");
  const [partyFlg, setPartyFlg] = useState();
  const [adjustmentList, setAdjustmentList] = useState([]);
  const [adjustmentListLoading, setAdjustmentListLoading] = useState(false);
  const [adjustmentAmount, setAdjustmentAmount] = useState();
  const [isCostCenterModalOpen, setIsCostCenterModalOpen] = useState(false);
  const [srNo, setSrNo] = useState("");
  const [sendCostCenterDetails, setIsSendCostCenterDetails] = useState(false);
  const [serialNo, setSerialNo] = useState(0);
  const [uniqueID, setUniqueID] = useState();
  const [payRcptAmt, setPayRcptAmt] = useState(0.00);
  const [prev, setPrev] = useState(true);
  const [curr, setCurr] = useState(true);
  // const [showAmt, setShowAmt] = useState(0.00);

  
  const inputAmt = useSelector(
    (state) => state?.transactionSlice?.vouchers?.inputAmt
  );
  const selectedAccount = useSelector(
    (state) => state?.transactionSlice?.vouchers?.selectedAccount
  );
  const selectedAccountDetails = useSelector(
    (state) => state?.transactionSlice?.vouchers?.selectedAccountDetails
  );
  const selectedVoucherSeries = useSelector(
    (state) => state?.transactionSlice?.vouchers?.selectedVoucherSeries
  );
  const accToEditDetails = useSelector(
    (state) => state?.transactionSlice?.vouchers?.accountToEditInLedger
  );
  const addedCostCenter = useSelector(
    (state) => state?.transactionSlice?.costCenter?.addedCostCenterList
  );

  // console.log("Selected Adjustments -------" , selectedAdjustments)
  // console.log("RCPT amount ------", adjustmentList)

  function generateUniqueId() {
    const timestamp = new Date().getTime().toString(36);
    const random = Math.random().toString(36).slice(2);
    return setUniqueID(timestamp + random);
  }
  const getCurrentDate = () => {
    // Create a new Date object to get the current date and time
    var currentDate = new Date();

    // Get the individual components of the date and time
    var month = currentDate?.getMonth() + 1; // Months are zero-indexed, so we add 1
    var day = currentDate?.getDate();
    var year = currentDate?.getFullYear();
    var hours = currentDate?.getHours();
    var minutes = currentDate?.getMinutes();
    var seconds = currentDate?.getSeconds();
    var meridiem = hours >= 12 ? "PM" : "AM"; // Determine if it's AM or PM

    // Format the components into the desired string format
    var formattedDate =
      month +
      "/" +
      day +
      "/" +
      year +
      " " +
      hours +
      ":" +
      minutes +
      ":" +
      seconds +
      " " +
      meridiem;

    // Print the formatted date and time
    return formattedDate;
  };
  const getAdjustmentBody = {
    FKSeriesID: selectedVoucherSeries?.PKID,
    Series: selectedVoucherSeries?.Series,
    FkLocationId: 1,
    TranAlias: "V_JR",
    EntryDate: getCurrentDate(),
    dtVoucherDtl: [
      {
        FKAccountID: selectedAccount?.PKID,
        FKPartyID: selectedParty,
        PartyFlag: partyFlg,
        FKVoucherID: 0,
      },
    ],
  };
  const singleLedgerBody = {
    FKAccountID: selectedAccount?.PKID,
    Account: selectedAccount?.Account,
    VoucherAmt: selectedPaymentMode === "Dr" ? -1 * inputAmt : inputAmt,
    // CreditDebit: selectedPaymentMode,
    SrNo: serialNo,
    Debit: selectedPaymentMode === "Dr" ? parseFloat(inputAmt) : 0,
    Credit: selectedPaymentMode === "Cr" ? parseFloat(inputAmt) : 0,
    FKPartyID: selectedParty || 0,
    VoucherNarration: ledgerNarration ? ledgerNarration : " ",
    ModeForm: 0,
    PartyFlag: partyFlg,
    InvoiceList: selectedAdjustments,
    AccountGroupMaster: selectedAccountDetails?.[0]?.AccountGroupMaster,
    FKAccGrpID: selectedAccountDetails?.[0]?.FkaccGrpId,
    UniqueID: uniqueID,
  };

  const addLedgerHandler = () => {
    if (
      (selectedAccountDetails?.[0]?.ApplyCostCenter && sendCostCenterDetails) ||
      !selectedAccountDetails?.[0]?.ApplyCostCenter
    ) {
      if (selectedAdjustments?.length > 0) {
        var adjustmentAmt = 0;
        selectedAdjustments.forEach((adj) => {
          adjustmentAmt += adj?.CreditAmt;
        });
        // console.log("Single ledger body-----", singleLedgerBody)
          dispatch(TranSliceActions.setAddedAccToLedger(singleLedgerBody));
          setSelectedParty();
          dispatch(TranSliceActions.setInputAmt([]));
          setLedgerNarration();
          setIsSendCostCenterDetails(false);
          setSelectedPaymentMode(selectedPaymentMode === "Dr" ? "Cr" : "Dr");
          dispatch(TranSliceActions.setBlankSelectedAccount());
      } else {
        if (
          (selectedAccountDetails?.[0]?.ApplyCostCenter &&
            sendCostCenterDetails) ||
          !selectedAccountDetails?.[0]?.ApplyCostCenter
        ) {
          if (selectedAccount?.Account && inputAmt > 0) {
            dispatch(TranSliceActions.setAddedAccToLedger(singleLedgerBody));
            setSelectedParty();
            dispatch(TranSliceActions.setInputAmt([]));
            setLedgerNarration();
            setSelectedAdjustments([]);
            setIsSendCostCenterDetails(false);
            setSelectedPaymentMode(selectedPaymentMode === "Dr" ? "Cr" : "Dr");
            dispatch(TranSliceActions.setBlankSelectedAccount());
          } else {
            Alert.alert(
              "Hold On !",
              "Please add account and amount to add ledger."
            );
          }
        } else {
          Alert.alert("Hold On !", "Please add cost center details");
        }
      }
    } else {
      Alert.alert("Hold On !", "Please add cost center details");
    }
  };

  useEffect(() => {
    setIsAccountListLoading(true);
    dispatch(TranSliceActions.setInputAmt([]));
    dispatch(TranSliceActions.setBlankSelectedAccount());
    setSerialNo(0);
    dispatch(TranSliceActions.setInputAmt([]));
    setLedgerNarration();
    dispatch(getAccountsList()).then((res) => {
      if (res.isSuccessful) {
        setAccountList(res.response);
        setIsAccountListLoading(false);
      } else {
        Alert.alert("Error !", `${res?.response}`);
      }
    });
  }, []);

  const searchCustomer = (searchString) => {
    // console.log("search strinf-------->", searchString)
    setIsAccountListLoading(true);
    const URL = `api/master/customer/CustomListMobile?pageno=1&pagesize=50&search=${searchString}`;
    axios
      .post(URL)
      .then((response) => {
        setIsAccountListLoading(false);
        setAccountList(response.data);
      })
      .catch((error) => {
        setIsAccountListLoading(false);
        console.error("Leadger Search Api Error =====>>>>>", error.message);
      });
  };

  const debounce = (func, timeout = 500) => {
    let timer;
    return function (...args) {
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => {
        timer = null;
        func.apply(this, args);
      }, timeout);
    };
  };

  /* Debounce function used for searching */
  const debouncedSearch = useCallback(
    debounce(
      (searchString) => searchCustomer(searchString, 300)
      // console.log("search string ------>", searchString)
    ),
    []
  );


  const adjustmentAddToCart = (item) => {
    // console.log("Item --------->>>>>>",(item))
    // console.log("Add -------")
    item.CheckIt = true;
    // item.PayRcptAmt = item.CreditAmt;
    // item.Amount = item.CreditAmt;
    // item.AmountCrDr = item.CreditAmt;
    // item.VoucherAmountCrDr = -1 * item.CreditAmt;
    item.FKLinkSrID = selectedVoucherSeries?.PKID;
    item.LinkSrNo = serialNo;
    var checkAdjustments = selectedAdjustments?.filter(
      (item2) =>
        item2?.FKInvID === item?.FKInvID && item2?.FKInvSrID === item?.FKInvSrID
    );
    if (selectedAdjustments) {
      var tempAdjustments = JSON.parse(JSON.stringify(selectedAdjustments));
    } else {
      var tempAdjustments = [];
    }

    if (checkAdjustments?.length) {
      tempAdjustments = tempAdjustments?.filter(
        (item3) => item3?.FKInvID !== checkAdjustments[0]?.FKInvID
      );
    } else {
      tempAdjustments?.push(item);
    }
    var srno = 1;
    let num;
    // console.log("Input amount------", typeof(parseInt(inputAmt)))
    if(prev && curr){
       num = parseFloat(inputAmt);
      // console.log("num------", num)
      setPayRcptAmt(num)
      setCurr(false)
      setPrev(true)
    }

    tempAdjustments?.forEach((adj) => {
      // adj.LinkedSrNo = srno;
      adj.SrNo = srno;
      setSrNo(adj?.SrNo);
      srno += 1;
      if(item.FKInvID == adj.FKInvID){
        if(item.CrDrDesc == 'Dr'){
        // console.log("---payRcptAmt----before---", payRcptAmt)
        if(payRcptAmt>=adj.CreditAmt || num >= adj.CreditAmt){
          // console.log('222222222')
          adj.PayRcptAmt = adj.CreditAmt
          adj.Amount = adj.CreditAmt
          adj.AmountCrDr = adj.CreditAmt
          adj.VoucherAmountCrDr =  -1 * adj.CreditAmt
          adj.CrDr = (item.CrDrDesc == 'Dr') ? 1 : -1
          // setPayRcptAmt(payRcptAmt || parseFloat(inputAmt) - adj.CreditAmt);                // Same as below
          setPayRcptAmt(payRcptAmt > 0 ? payRcptAmt - adj.CreditAmt : num - adj.CreditAmt);
        }
        else{
          // console.log("3333333333")
          adj.PayRcptAmt = payRcptAmt || num
          adj.Amount = payRcptAmt || num 
          adj.AmountCrDr = payRcptAmt || num
          adj.VoucherAmountCrDr =  -1 * adj.CreditAmt
          adj.CrDr = (item.CrDrDesc == 'Dr') ? 1 : -1
          setPayRcptAmt(0);
        }
      }
      else{
        // console.log("444444")
        adj.PayRcptAmt = adj.CreditAmt
        adj.Amount = adj.CreditAmt
        adj.AmountCrDr = -1 * adj.CreditAmt
        adj.VoucherAmountCrDr =  adj.CreditAmt
        adj.CrDr = (item.CrDrDesc == 'Dr') ? 1 : -1
        setPayRcptAmt(payRcptAmt > 0 ? payRcptAmt + adj.CreditAmt : num + adj.CreditAmt);
      }
      } 
    });

    setSelectedAdjustments(tempAdjustments);
  };

  const adjustmentRemFromCart = (item) => {
    // console.log("Remove------")
    item.CheckIt = false;
    setPayRcptAmt(payRcptAmt + item.PayRcptAmt)

    let filteredAdjustments = selectedAdjustments?.filter((adj) => adj.FKInvID != item?.FKInvID)


    setSelectedAdjustments(filteredAdjustments)
  }
  
  useEffect(() => {
    if (accToEditDetails?.Account) {
      setPartyListLoading(true);
      const item = {
        PKID: accToEditDetails?.FKAccountID,
        Account: accToEditDetails?.Account,
      };
      dispatch(getAccountsListByPKID(item)).then((res1) => {
        if (res1.isSuccessful) {
          dispatch(TranSliceActions.setSelectedAccountDetails(res1.response));
          var AcGroup = res1?.response?.map((itm) => itm?.AccountGroup);
          var PartyFlag;

          if (AcGroup[0]?.includes("Debtors")) {
            PartyFlag = "C";
            setPartyFlg("C");
          } else if (AcGroup[0]?.includes("Creditors")) {
            PartyFlag = "V";
            setPartyFlg("V");
          } else {
            PartyFlag = "";
            setPartyFlg("");
          }
          dispatch(getDefaultPartyList(item, PartyFlag)).then((res2) => {
            if (res2.isSuccessful) {
              dispatch(getAccPartyList(item)).then((addParty) => {
                if (addParty?.isSuccessful) {
                  let PartyName = addParty?.response[0]?.Party
                  if(PartyName?.endsWith("C") || PartyName?.endsWith("V")) {
                    PartyName = PartyName?.slice(0, -1);
                  }
                  let addedPartyArr = [];
                  let addedPartyObj = {};
                  if(addParty?.response?.length){
                    addedPartyObj.PKID = addParty?.response[0]?.PKID;
                    addedPartyObj.Party = PartyName;
                    addedPartyArr.push(addedPartyObj);
                  }

                  setPartyList(addedPartyArr);
                  setSelectedParty(
                    accToEditDetails?.FKPartyID
                      ? accToEditDetails?.FKPartyID
                      : res2?.response?.[0]?.PartyId
                  );
                  setPartyListLoading(false);
                } else {
                  Alert.alert("Error !", `${addParty?.response}`);
                  setPartyListLoading(false);
                }
              });
            } else {
              Alert.alert("Error !", `${res2.response}`);
            }
          });
        } else {
          Alert.alert("Error !", `${res1.response}`);
        }
      });
      dispatch(TranSliceActions.setSelectedAccount(item));
      dispatch(TranSliceActions.setInputAmt(
        accToEditDetails?.Credit > 0
          ? accToEditDetails?.VoucherAmt
          : JSON.stringify(-1 * accToEditDetails?.VoucherAmt)
      ));
      setLedgerNarration(accToEditDetails?.VoucherNarration);
      setSelectedPaymentMode(accToEditDetails?.Credit > 0 ? "Cr" : "Dr");
      setSelectedAdjustments(accToEditDetails?.InvoiceList);
      var CCDetails = addedCostCenter?.filter(
        (cc) => cc?.UniqueID === accToEditDetails?.UniqueID
      );
      dispatch(TranSliceActions.setCostCenterInAccEditing(CCDetails));
    }
  }, [accToEditDetails]);

  useEffect(() => {
    if (inputAmt > 0) {
      var amt = inputAmt;
      var dummyAmt = 0;
      selectedAdjustments?.forEach((item) => {
        if(item.CrDrDesc=='Dr'){
          dummyAmt += item.CreditAmt;
        }
        else{
          dummyAmt -= item.CreditAmt;
        }
      });
      amt = inputAmt - dummyAmt;

      if(amt<=0){
        setAdjustmentAmount(0)
      }
      else{
        setAdjustmentAmount(JSON.parse(amt));

      }
    }
  }, [selectedAdjustments, inputAmt]);

  const costCenterModal = () => {
    setIsCostCenterModalOpen(!isCostCenterModalOpen);
  };
  const costCenterDetails = (sendCCDetail) => {
    setIsSendCostCenterDetails(sendCCDetail);
  };

  return (
    <>
      <View style={styles.mainContainer}>
        <CostCenter
          isCostCenterOpen={isCostCenterModalOpen}
          setIsCostCenterOpen={costCenterModal}
          selectedAmtType={selectedPaymentMode}
          srNo={serialNo}
          ledgerAmt={inputAmt}
          isSendCCDetail={costCenterDetails}
          uniqueID={uniqueID}
        />
        {/* *****Adjustment Modal************ */}
        <Modal
          animationType="slide"
          transparent={true}
          presentationStyle="overFullScreen"
          visible={adjustModalOpen}
          onRequestClose={() => setAdjustModalOpen(!adjustModalOpen)}
        >
          <View style={styles.filterModalBackgroundBox}>
          <View style={{alignSelf:'flex-end',marginRight:20}}>
          <TouchableOpacity onPress={()=>setAdjustModalOpen(!adjustModalOpen)}>
            <MCIcon name='close-circle-outline' size={36} color={COLORS.white} />
          </TouchableOpacity>
          </View>
            <View style={styles.modalView}>
              <View style={styles.adjustmentHeaderView}>
                <Text style={styles.adjustmentHeadingText}>Adjustments</Text>
                <View style={styles.partition} />
              </View>
              {adjustmentListLoading ? (
                <ActivityIndicator size="large" color={COLORS.primary} />
              ) : (
                <>
                  <FlatList
                    data={adjustmentList}
                    style={{ width: "100%" }}
                    showsVerticalScrollIndicator={false}
                    renderItem={({ item }) => {
                      return (
                        <>
                          <View style={styles.adjustmentMainItemView}>
                            <View
                              style={{
                                flexDirection: "row",
                                marginVertical: 2,
                                // alignItems: "center",
                              }}
                            >
                              <View style={{marginVertical: 2}}>
                                <TouchableOpacity
                                  onPress={() => {
                                    // !item?.CheckIt ? (adjustmentAmount>0) ? adjustmentAddToCart(item) : item?.CrDrDesc=='Cr' ? adjustmentAddToCart(item) :  Alert.alert('Balance amount is not available') : adjustmentRemFromCart(item);
                                    !item?.CheckIt ? (adjustmentAmount>0) ? adjustmentAddToCart(item) :  Alert.alert('Negative Balance Not Allowed') : adjustmentRemFromCart(item);
                                  }}
                                >
                                  { 
                                  selectedAdjustments?.filter(
                                    (vouch) =>
                                      vouch?.FKLinkedSrID ===
                                        item?.FKLinkedSrID &&
                                      vouch?.FKLinkedID === item?.FKLinkedID
                                  ).length 
                                  ? (
                                    <MCIcon
                                      name="checkbox-marked"
                                      size={24}
                                      color={COLORS.primary}
                                    />
                                  ) : (
                                    <MCIcon
                                      name="checkbox-blank-outline"
                                      size={24}
                                      color={COLORS.primary}
                                    />
                                  )}
                                </TouchableOpacity>
                              </View>
                              <View
                                style={{
                                  marginLeft: 4,
                                  padding: 2,
                                }}
                              >
                                <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                                <View style={{alignSelf: 'center', flexDirection: 'row'}}>
                                  <Text style={styles.adjustmentEntrytitleText}>
                                    Entry No : 
                                  </Text>
                                  <Text style={{...styles.adjustmentValueText, marginHorizontal: 4}}>{item?.SeriesNoDesc}</Text>
                                </View>
                                <View style={{alignSelf: 'center', flexDirection: 'row'}}>
                                  <Text style={styles.adjustmentEntrytitleText}>
                                        Entry Date : 
                                  </Text>
                                  <Text style={{...styles.adjustmentValueText, marginHorizontal: 4}}>{formattedDate(item?.EntryDate?.slice(0, 10))}</Text>
                                </View>
                                </View>
                                  <View
                                    style={{
                                      flexDirection: "row",
                                      alignItems: "center",
                                      flex: 1,
                                    }}
                                  >
                                    <Text style={styles.adjustmentEntrytitleText}>Party : </Text>
                                    <Text style={styles.adjustmentValueText}>{item?.Party}</Text>
                                  </View>
                                  <View>
                                        {item?.CreditAmt > 0 ?
                                          <View style={{flexDirection: 'row'}}>
                                            <Text style={styles.adjustmentEntrytitleText}>Credit Amt : </Text>
                                            <Text style={styles.adjustmentValueText}>{item?.CreditAmt?.toFixed(2)}</Text>
                                          </View>
                                      : 
                                          <View style={{flexDirection: 'row'}}>
                                            <Text style={styles.adjustmentEntrytitleText}>Due Amt : </Text> 
                                            <Text style={styles.adjustmentValueText}>{item?.DueAmt?.toFixed(2)}</Text>
                                          </View>
                                    }

                                  </View>
                                  <View
                                    style={{
                                      flexDirection: "row",
                                      alignItems: "center",
                                      flex: 1,
                                    }}
                                  >
                                    <Text style={styles.adjustmentEntrytitleText}>Net Amt : </Text>
                                    <Text style={styles.adjustmentValueText}>{item.NetAmt.toFixed(2)}</Text>
                                  </View>

                                  <View  
                                    style={{
                                      flexDirection: "row",
                                      alignItems: "center",
                                      flex: 1,
                                    }}>
                                    <Text style={styles.adjustmentEntrytitleText}>Acc Type : </Text>
                                    <Text style={{...styles.adjustmentValueText, fontWeight: 'bold', alignSelf: 'center'}}>{item.CrDrDesc}</Text>
                                  </View>
                                </View>
                              </View>
                            </View>
                        </>
                      );
                    }}
                  />
                  <Text style={styles.balanceAmtText}>
                    Balance Amount : {"\u20B9"} {adjustmentAmount?.toFixed(2)}{" "}
                  </Text>
                  <TouchableOpacity
                    style={styles.continueOpacity}
                    onPress={() => {
                      setCurr(true);
                      setAdjustModalOpen(!adjustModalOpen)
                    }}
                  >
                    <Text style={styles.continueText}>Continue</Text>
                  </TouchableOpacity>
                </>
              )}
            </View>
          </View>
        </Modal>

        {/* ********Ledger Main View******** */}
        {/* <View style={styles.headerView}>
          <Text style={styles.ledgerText}>Ledger</Text>
          <TouchableOpacity onPress={() => setLedgerOpen(!ledgerOpen)}>
            <MCIcon
              name={ledgerOpen ? "chevron-up" : "chevron-down"}
              size={28}
              color={COLORS.primary}
            />
          </TouchableOpacity>
        </View> */}
          <>
            {/* <View style={styles.partition} /> */}
            <View style={styles.accountContainer}>
              <View style={{}}>
                {/* *********Account Picker********** */}
                <Text style={styles.titleText}>Account</Text>
                <View>
                  <CustomPicker
                    data={accountList}
                    labelField="Account"
                    valueField="PKID"
                    selectedValue={selectedAccount}
                    onChange={(item) => {
                      if (selectedVoucherSeries) {
                        setPartyListLoading(true);
                        setSerialNo(serialNo + 1);
                        generateUniqueId();
                        dispatch(getAccountsListByPKID(item)).then((res1) => {
                          if (res1.isSuccessful) {
                            dispatch(
                              TranSliceActions.setSelectedAccountDetails(
                                res1.response
                              )
                            );

                            var AcGroup = res1?.response?.map(
                              (itm) => itm?.AccountGroup
                            );
                            var PartyFlag;

                            if (AcGroup[0]?.includes("Debtors")) {
                              PartyFlag = "C";
                              setPartyFlg("C");
                            } else if (AcGroup[0]?.includes("Creditors")) {
                              PartyFlag = "V";
                              setPartyFlg("V");
                            } else {
                              PartyFlag = "";
                              setPartyFlg("");
                            }

                            dispatch(getDefaultPartyList(item, PartyFlag)).then(
                              (res2) => {
                                if (res2.isSuccessful) {
                                  dispatch(getAccPartyList(item)).then(
                                    (addParty) => {
                                      if (addParty.isSuccessful) {
                                        // console.log("Added party -----", addParty);

                                        let PartyName = addParty?.response[0]?.Party
                                        if(PartyName?.endsWith("C") || PartyName?.endsWith("V")) {
                                          PartyName = PartyName?.slice(0, -1);
                                        }
                                        let addedPartyArr = [];
                                        let addedPartyObj = {};
                                        if(addParty?.response?.length){
                                          addedPartyObj.PKID = addParty?.response[0]?.PKID;
                                          addedPartyObj.Party = PartyName;
                                          addedPartyArr.push(addedPartyObj);
                                        }

                                        setPartyList(addedPartyArr);
                                        setSelectedParty(
                                          res2?.response[0]?.PartyId
                                        );
                                        setPartyListLoading(false);
                                      } else {
                                        Alert.alert(
                                          "Error !",
                                          `${addParty?.response}`
                                        );
                                        setPartyListLoading(false);
                                      }
                                    }
                                  );
                                } else {
                                  Alert.alert("Error !", `${res2.response}`);
                                  setPartyListLoading(false);
                                }
                              }
                            );
                          } else {
                            Alert.alert("Error !", `${res1.response}`);
                          }
                        });
                        dispatch(TranSliceActions.setSelectedAccount(item));
                      } else {
                        Alert.alert(
                          "Hold On !",
                          "Please select Voucher Series ."
                        );
                      }
                    }}
                    style={styles.dropDownPicker}
                    containerStyle={{
                      ...styles.dropDownContainer,
                    }}
                    maxHeight={360}
                    search={true}
                    // onChangeText={debouncedSearch}
                    searchPlaceholder="Search Account"
                    inputSearchStyle={styles.dropDownSearchBar}
                    flatListProps={{
                      keyboardShouldPersistTaps: "handled",
                      automaticallyAdjustKeyboardInsets: "true",
                    }}
                    placeholder={"Search Account"}
                    itemContainerStyle={{margin:-5}}
                  />
                  <View style={styles.partition2} />
                </View>
                {/* ***********Party Picker*************** */}
                {selectedAccount?.PKID ? (
                  <>
                    <Text style={styles.titleText}>Party</Text>
                    <View>
                      {partyList?.length ? (
                        <CustomPicker
                          data={partyList}
                          labelField="Party"
                          valueField="PKID"
                          selectedValue={selectedParty}
                          onChange={(item) => setSelectedParty(item.PKID)}
                          style={styles.dropDownPicker}
                          itemContainerStyle={{}}
                          containerStyle={{
                            ...styles.dropDownContainer,
                          }}
                          search={true}
                          searchPlaceholder="Search Party"
                          inputSearchStyle={styles.dropDownSearchBar}
                          flatListProps={{
                            keyboardShouldPersistTaps: "handled",
                            automaticallyAdjustKeyboardInsets: "true",
                          }}
                        />
                      ) : partyListLoading ? (
                        <ActivityIndicator
                          size="large"
                          color={COLORS.primary}
                        />
                      ) : (
                        <Text style={styles.noPartyText}>
                          No Party Available
                        </Text>
                      )}

                      <View style={styles.partition2} />
                    </View>
                  </>
                ) : null}

                <Text style={styles.titleText}>Amount</Text>

                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      width: "30%",
                      alignItems: "center",
                    }}
                  >
                    <Text
                      style={{
                        fontWeight: "bold",
                        color: COLORS.navyText,
                        fontSize: 20,
                      }}
                    >
                      {"\u20B9"}
                    </Text>
                    <TextInput
                      style={styles.amountInput}
                      value={inputAmt?.toString()}
                      onChangeText={(amt) => dispatch(TranSliceActions.setInputAmt(amt))}
                      keyboardType="numeric"
                      placeholder="0.00"
                    />
                  </View>

                  <View style={styles.crDrView(selectedPaymentMode)}>
                    <TouchableOpacity
                      onPress={() => setSelectedPaymentMode("Dr")}
                    >
                      <View style={styles.DrsecondryView(selectedPaymentMode)}>
                        <Text style={styles.DrText(selectedPaymentMode)}>
                          Dr
                        </Text>
                      </View>
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={() => setSelectedPaymentMode("Cr")}
                    >
                      <View style={styles.CrsecondryView(selectedPaymentMode)}>
                        <Text style={styles.CrText(selectedPaymentMode)}>
                          Cr
                        </Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                  <TouchableOpacity
                    style={{ marginRight: 8 }}
                    onPress={() => {
                      if (selectedAccount?.PKID && selectedParty && inputAmt) {
                        setAdjustmentListLoading(true);
                        // setSelectedAdjustments([]);
                        dispatch(getAdjustmentList(getAdjustmentBody)).then(
                          (res) => {
                            if (res.isSuccessful) {
                              // console.log("response-----", res.response)
                              if(selectedAdjustments.length && res.response){
                                res.response.forEach((item) => {
                                  selectedAdjustments?.forEach((val) => {
                                    if(item.FKLinkedSrID == val.FKLinkedSrID && item.FKLinkedID == val.FKLinkedID){
                                      item.CheckIt = true;

                                    }
                                  })
                                })
                              }
                              setAdjustmentList(res.response);
                              setAdjustmentListLoading(false);
                            } else {
                              Alert.alert("Error !", `${res.response}`);
                              setAdjustmentListLoading(false);
                              setAdjustModalOpen(false);
                            }
                          }
                        );
                        setAdjustModalOpen(!adjustModalOpen);
                      } else {
                        if (!selectedAccount.PKID) {
                          Alert.alert(
                            "Hold On !",
                            "Please select account to open adjustments"
                          );
                        } else if (!selectedParty) {
                          Alert.alert(
                            "Hold On !",
                            "Please select party to open adjustments"
                          );
                        } else if (!inputAmt) {
                          Alert.alert(
                            "Hold On !",
                            "Please input amount to open adjustments"
                          );
                        }
                      }
                    }}
                  >
                    <View style={{borderWidth: 2, borderRadius: 10, borderColor: COLORS.primary}}>
                      <Image 
                        source={require('../../Assets/Images/adjustments.png')}
                        style={{resizeMode: 'contain', width: 28, height: 28}}
                      />
                    </View>
                  </TouchableOpacity>
                </View>
                <View style={styles.partition2} />

                <Text style={styles.titleText}>Narration</Text>
                <TextInput
                  value={ledgerNarration}
                  onChangeText={(txt) => setLedgerNarration(txt)}
                />
                <View style={styles.partition2} />
                <View style={styles.addBtnView}>
                  <TouchableOpacity
                    onPress={() => {
                      if (
                        selectedAccountDetails?.[0]?.ApplyCostCenter === true
                      ) {
                        if (selectedAccount?.PKID) {
                          if (inputAmt > 0) {
                            setIsCostCenterModalOpen(!isCostCenterModalOpen);
                          } else {
                            Alert.alert(
                              "Hold On !",
                              "Please input amount to open cost center."
                            );
                          }
                        } else {
                          Alert.alert(
                            "Hold On !",
                            "Please select account to open cost center."
                          );
                        }
                      } else {
                        Alert.alert(
                          "Hold On !",
                          "Cost Center is not available for this account."
                        );
                      }
                    }}
                  >
                    <View>
                      <Image source={require('../../Assets/Images/costcenter.png')} 
                        style={{width: 40}}    
                      />
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => {
                      addLedgerHandler()
                      setSelectedAdjustments([]);
                    }}
                    style={styles.addOpacity}
                  >
                    <Text style={styles.addText}>Add</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </>
      </View>
      <AddedAccList />
    </>
  );
};

export default LedgerBox;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderRadius: 10,
    width: "95%",
    alignSelf: "center",
    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.17,
    shadowRadius: 3.05,
    elevation: 4,
    // height:200,
    marginVertical: 4,
  },
  headerView: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginHorizontal: 8,
    margin: 5,
    padding: 5,
  },
  ledgerText: {
    fontWeight: "bold",
    fontSize: 20,
    color: COLORS.primary,
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
  accountContainer: {
    margin: 5,
    padding: 5,
  },
  titleText: {
    fontWeight: "500",
    fontSize: 18,
    color: COLORS.primary,
  },
  dropDownContainer: {
    elevation: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.primary,
    marginTop: 4,
  },
  partition2: {
    borderWidth: 0.25,
    borderColor: COLORS.primary,
    borderRadius: 10,
    shadowColor: COLORS.primary,
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
    marginBottom: 6,
  },
  crDrView: (selectedPaymentMode) => ({
    backgroundColor: COLORS.white,
    borderRadius: 20,
    flexDirection: "row",
    margin: 4,
    borderWidth: 1.3,
    borderColor: COLORS.primary,
  }),
  CrsecondryView: (selectedPaymentMode) => ({
    backgroundColor: selectedPaymentMode === "Cr" ? COLORS.green : COLORS.white,
    borderRadius: 40,
    margin: 2,
    padding: 2,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 2,
  }),
  DrsecondryView: (selectedPaymentMode) => ({
    backgroundColor:
      selectedPaymentMode === "Dr" ? COLORS.redError : COLORS.white,
    borderRadius: 40,
    margin: 2,
    padding: 2,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 2,
  }),
  DrText: (selectedPaymentMode) => ({
    textAlign: "center",
    fontSize: 16,
    fontWeight: "bold",
    marginHorizontal: 6,
    color: selectedPaymentMode === "Dr" ? COLORS.white : COLORS.redError,
  }),
  CrText: (selectedPaymentMode) => ({
    textAlign: "center",
    fontSize: 16,
    fontWeight: "bold",
    marginHorizontal: 6,
    color: selectedPaymentMode === "Cr" ? COLORS.white : COLORS.green,
  }),
  addOpacity: {
    borderWidth: 1,
    borderRadius: 20,
    width: 100,
    borderColor: COLORS.primary,
    margin: 4,
    alignSelf: "flex-end",
    justifyContent: "center",
    alignItems: "center",
  },
  addText: {
    textAlign: "center",
    fontSize: 18,
    color: COLORS.primary,
    fontWeight: "500",
    margin: 5,
  },
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
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    marginTop:5
  },
  adjustmentHeaderView: {
    width: "100%",
  },
  adjustmentHeadingText: {
    fontWeight: "bold",
    fontSize: 20,
    color: COLORS.navyText,
    margin: 4,
  },
  adjustmentMainItemView: {
    shadowColor: COLORS.primary,
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.17,
    shadowRadius: 3.05,
    elevation: 4,
    backgroundColor: "white",
    borderColor: COLORS.gray,
    borderWidth: 0.5,
    borderRadius: 6,
    marginVertical: 5,
    padding: 4,
  },
  adjustmentEntrytitleText: {
    color: COLORS.navyText,
    fontWeight: "bold",
    fontSize: 16,
  },
  adjustmentValueText: {
    color: COLORS.primary,
    alignSelf: 'center',
    fontWeight: '500'
  },
  continueText: {
    fontWeight: "bold",
    fontSize: 22,
    color: COLORS.white,
  },
  continueOpacity: {
    backgroundColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
    padding: 4,
    margin: 4,
    width: "85%",
    borderRadius: 6,
  },
  amountInput: {
    borderColor: COLORS.gray,
    fontWeight: "bold",
    width: "100%",
    fontSize: 18,
    color: COLORS.primary,
  },
  noPartyText: {
    fontWeight: "bold",
    fontSize: 18,
    margin: 2,
  },
  balanceAmtText: {
    fontWeight: "bold",
    fontSize: 18,
    color: COLORS.primary,
    margin: 4,
  },
  addBtnView: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginHorizontal: 5,
  },
});

import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Alert,
  TextInput,
  Modal,
  FlatList,
  ActivityIndicator,
  ScrollView,
  BackHandler,
  Image
} from "react-native";
import React, { useEffect, useState } from "react";
import { COLORS, GlobalStyles } from "../../Resources/GlobalStyles";
import { useDispatch, useSelector } from "react-redux";
import {
  createVoucher,
  getAccPartyList,
  getAccountsList,
  getAccountsListByPKID,
  getAdjustmentList,
  getDefaultPartyList,
  getPartyList,
  getVoucherDetailByID,
  getVoucherList,
} from "../../Redux/Transaction/TransactionAction";
import MCIcon from "react-native-vector-icons/MaterialCommunityIcons";
import CustomPicker from "../../GlobalComponents/CustomPicker";
import { TranSliceActions } from "../../Redux/Transaction/TransactionSlice";
import EditAddedAccList from "./EditAddedAccList";
import CostCenter from "../../GlobalComponents/CostCenter";
import BlinkingText from "../../GlobalComponents/BlinkingText";

const EditVoucher = ({ navigation, route }) => {

  const dispatch = useDispatch();
  const mainEditVoucherDetails = route?.params?.data || useSelector(state => state?.transactionSlice?.vouchers?.selectedVoucher);
  const singleVoucherDetail = useSelector(
    (state) => state?.transactionSlice?.vouchers?.singleVoucherDetail
  );
  const editSelectedAccount = useSelector(
    (state) => state?.transactionSlice?.editVoucher?.editSelectedAccount
  );
  const selectedAccountDetails = useSelector(
    (state) => state?.transactionSlice?.vouchers?.selectedAccountDetails
  );
  const editAddedAcc = useSelector(
    (state) => state?.transactionSlice?.editVoucher?.editAddedAccToLedger
  );
  const addedCostCenter = useSelector(
    (state) => state?.transactionSlice?.costCenter?.addedCostCenterList
  );
  const singleAccEditDetails = useSelector(
    (state) => state?.transactionSlice?.editVoucher?.accToEditInEditableAccount
  );
  const [isLoading,setIsLoading] = useState(false);
  const [isDetailsLoading,setIsDetailsLoading] = useState(false);
  const [ledgerOpen, setLedgerOpen] = useState(false);
  const [accountList, setAccountList] = useState([]);
  const [isAccountListLoading, setIsAccountListLoading] = useState(false);
  const [inputAmt, setInputAmt] = useState();
  const [ledgerNarration, setLedgerNarration] = useState();
  const [selectedPaymentMode, setSelectedPaymentMode] = useState("Dr");
  const [partyFlg, setPartyFlg] = useState();
  const [partyList, setPartyList] = useState([]);
  const [selectedParty, setSelectedParty] = useState();
  const [adjustmentList, setAdjustmentList] = useState([]);
  const [adjustmentListLoading, setAdjustmentListLoading] = useState(false);
  const [selectedAdjustments, setSelectedAdjustments] = useState([]);
  const [adjustModalOpen, setAdjustModalOpen] = useState(false);
  const [adjustmentAmount, setAdjustmentAmount] = useState();
  const [uniqueID, setUniqueID] = useState();
  const [sendCostCenterDetails, setIsSendCostCenterDetails] = useState(false);
  const [isCostCenterModalOpen, setIsCostCenterModalOpen] = useState(false);
  const [serialNo, setSerialNo] = useState();
  const [isEditingAcc, setIsEditingAcc] = useState(false);
  const [voucherNarration, setVoucherNarration] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [isVoucherEditing, setIsVoucherEditing] = useState(true);
  const [isPartyLoading, setIsPartyLoading] = useState(false);
  const [srNo, setSrNo] = useState("");
  const [payRcptAmt, setPayRcptAmt] = useState(0.00);
  const [prev, setPrev] = useState(true);
  const [curr, setCurr] = useState(true);
  const [loadModalVisible, setLoadModalVisible] = useState(false);


  useEffect(() => {
    if (mainEditVoucherDetails) {
      setIsDetailsLoading(true)
      dispatch(getVoucherDetailByID(mainEditVoucherDetails)).then(res => {
        if(res.isSuccessful){
      setIsDetailsLoading(false)
        }else{
          Alert.alert("Error !",`Message : ${res.response}`)
      setIsDetailsLoading(false)

        }
      })
    }
  }, [mainEditVoucherDetails]);


  useEffect(() => {
    dispatch(TranSliceActions.setBlankEditSelectedAccount());
    setIsAccountListLoading(true);
    dispatch(getAccountsList()).then((res) => {
      if (res.isSuccessful) {
        setAccountList(res.response);
        setIsAccountListLoading(false);
      } else {
        Alert.alert("Error !", `${res?.response}`);
        setIsAccountListLoading(false);
      }
    });
  }, [mainEditVoucherDetails]);
  function generateUniqueId() {
    const timestamp = new Date().getTime().toString(36);
    const random = Math.random().toString(36).slice(2);
    return setUniqueID(timestamp + random);
  }
  const singleLedgerBody = {
    FKAccountID: editSelectedAccount?.PKID,
    Account: editSelectedAccount?.Account,
    VoucherAmt: selectedPaymentMode === "Dr" ? -1 * inputAmt : inputAmt,
    SrNo: serialNo,
    Debit: selectedPaymentMode === "Dr" ? parseFloat(inputAmt) : 0,
    Credit: selectedPaymentMode === "Cr" ? parseFloat(inputAmt) : 0,
    FKPartyID: selectedParty || 0,
    VoucherNarration: ledgerNarration ? ledgerNarration : "",
    ModeForm: isEditingAcc ? 1 : 0,
    PartyFlag: partyFlg,
    InvoiceList: selectedAdjustments,
    AccountGroupMaster: selectedAccountDetails?.[0]?.AccountGroupMaster,
    FKAccGrpID: selectedAccountDetails?.[0]?.FkaccGrpId,
    UniqueID: uniqueID,
  };
  // console.log("Main edit Voucher details ------------>>>>>>>>",mainEditVoucherDetails)

  useEffect(() => {
    if (inputAmt > 0) {
      var amt = inputAmt;
      var dummyAmt = 0;
      selectedAdjustments?.forEach((item) => {
        dummyAmt += item.CreditAmt;
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
   


  // ********Back Button handler********
  useEffect(() => {
    const backAction = () => {
      navigation.setParams({ data: null });
      dispatch(TranSliceActions.setBlankEditSelectedAccount());
      dispatch(TranSliceActions.setBlankAddedAccToLedger());
      dispatch(TranSliceActions.setBlankAccFromEditablelist())
      setVoucherNarration("");
      navigation.goBack();
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove();
  }, []);

  useEffect(() => {
    if (singleVoucherDetail) {
      setIsLoading(true)
      dispatch(
        TranSliceActions.setEditAddedAccToLedger(
          singleVoucherDetail?.dtVoucherDtl
        )
      );
      setVoucherNarration(singleVoucherDetail?.VoucherNarration);
      dispatch(
        TranSliceActions.setCostCenterInAccEditing(
          singleVoucherDetail?.dtCostCenter
        )
      )
    setIsLoading(false)

    }
  }, [singleVoucherDetail]);
  // console.log("Single Voucher details --------->>>",singleVoucherDetail)
  useEffect(() => {
    if (isEditingAcc) {
      setSerialNo(singleAccEditDetails?.SrNo);
    } else {
      const srOfAcc = editAddedAcc?.map((item) => item?.SrNo);
      const maxSerialNo = Math.max(...srOfAcc);
      setSerialNo(maxSerialNo + 1);
    }
  }, [isEditingAcc, editAddedAcc, singleAccEditDetails]);

  useEffect(() => {
    if (singleAccEditDetails?.Account) {
      setIsPartyLoading(true)
      const item = {
        PKID: singleAccEditDetails?.FKAccountID,
        Account: singleAccEditDetails?.Account,
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
                if (addParty.isSuccessful) {
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
                  setSelectedParty(singleAccEditDetails?.FKPartyID ? singleAccEditDetails?.FKPartyID  : res2?.response?.[0]?.PartyId);
                     setIsPartyLoading(false)

                } else {
                  Alert.alert("Error !", `${addParty?.response}`);
                  setIsPartyLoading(false)

                }
              });
            } else {
              Alert.alert("Error !", `${res2.response}`);
              setIsPartyLoading(false)

            }
          });
        } else {
          Alert.alert("Error !", `${res1.response}`);
          setIsPartyLoading(false)

        }
      });
      setIsEditingAcc(true);
      dispatch(TranSliceActions.setEditSelectedAccount(item));
      setInputAmt(
        singleAccEditDetails?.Credit > 0
          ? JSON.stringify(singleAccEditDetails?.VoucherAmt)
          : JSON.stringify(-1 * singleAccEditDetails?.VoucherAmt)
      );
      setLedgerNarration(singleAccEditDetails?.VoucherNarration);
      setSelectedPaymentMode(singleAccEditDetails?.Credit > 0 ? "Cr" : "Dr");
      setSelectedAdjustments(singleAccEditDetails?.InvoiceList);
      setIsEditingAcc(true);
      dispatch(
        TranSliceActions.setCostCenterInAccEditing(
          singleVoucherDetail?.dtCostCenter
        )
      );
    }
  }, [singleAccEditDetails]);


  const voucherBody = {
    PKID: singleVoucherDetail?.PKID,
    VoucherNarration: voucherNarration,
    FKSeriesID: singleVoucherDetail?.FKSeriesID,
    GRNo: null,
    Series: singleVoucherDetail?.Series,
    NetAmt: "",
    dtVoucherDtl: editAddedAcc?.slice()?.sort((a, b) => a.SrNo - b.SrNo),
    dtCostCenter: addedCostCenter,
  };
  const addLedgerHandler = () => {
    dispatch(TranSliceActions.addAccToLedgerInEditing(singleLedgerBody));
    setIsEditingAcc(false);
    setSelectedParty();
    setInputAmt();
    setLedgerNarration();
    setSelectedAdjustments([]);
    setIsSendCostCenterDetails(false);
    setSelectedPaymentMode(selectedPaymentMode === "Dr" ? "Cr" : "Dr");
    dispatch(TranSliceActions.setBlankEditSelectedAccount());
  };

  const getCurrentDate = () => {
    // Create a new Date object to get the current date and time
    var currentDate = new Date();

    // Get the individual components of the date and time
    var month = currentDate.getMonth() + 1; // Months are zero-indexed, so we add 1
    var day = currentDate.getDate();
    var year = currentDate.getFullYear();
    var hours = currentDate.getHours();
    var minutes = currentDate.getMinutes();
    var seconds = currentDate.getSeconds();
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

  const formattedDate = (date) => {
    const today = new Date(date);
    const yyyy = today.getFullYear();
    let mm = today.getMonth() + 1; // Months start at 0!
    let dd = today.getDate();

    if (dd < 10) dd = "0" + dd;
    if (mm < 10) mm = "0" + mm;
    var formattedToday;
    return (formattedToday = dd + "/" + mm + "/" + yyyy);
  };
  const costCenterModal = () => {
    setIsCostCenterModalOpen(!isCostCenterModalOpen);
  };
  const costCenterDetails = (sendCCDetail) => {
    setIsSendCostCenterDetails(sendCCDetail);
  };
  const ledgerOpenHandler = () => {
    setLedgerOpen(true);
  }
  
  const getAdjustmentBody = {
    FKSeriesID: mainEditVoucherDetails?.FKSeriesID,
    Series: mainEditVoucherDetails?.Series,
    FkLocationId: 1,
    TranAlias: "V_JR",
    EntryDate: getCurrentDate(),
    dtVoucherDtl: [
      {
        FKAccountID: editSelectedAccount?.PKID,
        FKPartyID: selectedParty,
        PartyFlag: partyFlg,
        FKVoucherID: mainEditVoucherDetails?.PKID,
      },
    ],
  };

  const adjustmentAddToCart = (item) => {
    item.CheckIt = true;
    item.FKLinkSrID = singleVoucherDetail?.FKSeriesID;
    item.LinkSrNo = 1;

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

        // console.log("---payRcptAmt----before---", payRcptAmt)
        if(num >= adj.CreditAmt || parseFloat(inputAmt) >= adj.CreditAmt){
          // console.log('222222222')
          adj.PayRcptAmt = adj.CreditAmt
          adj.Amount = adj.CreditAmt
          adj.AmountCrDr = adj.CreditAmt
          adj.VoucherAmountCrDr = adj.CrDrDesc == 'Dr' ? -1 * adj.CreditAmt : adj.CreditAmt
          // setPayRcptAmt(payRcptAmt || parseFloat(inputAmt) - adj.CreditAmt);                // Same as below
          setPayRcptAmt(payRcptAmt > 0 ? payRcptAmt - adj.CreditAmt : parseFloat(inputAmt) - adj.CreditAmt);
        }
        else{
          // console.log("3333333333")
          adj.PayRcptAmt = payRcptAmt
          adj.Amount = payRcptAmt
          adj.AmountCrDr = payRcptAmt
          adj.VoucherAmountCrDr = adj.CrDrDesc == 'Dr' ? -1 * adj.CreditAmt : adj.CreditAmt
          setPayRcptAmt(0);
        }
      } 
    });
    setSelectedAdjustments(tempAdjustments);
  };

  const adjustmentRemFromCart = (item) => {
    // console.log("Remove----" );
    item.CheckIt = false;
    setPayRcptAmt(payRcptAmt + item.PayRcptAmt)

    let filteredAdjustments = selectedAdjustments?.filter((adj) => adj.FKInvID != item?.FKInvID)

    // console.log("FilteredAdjustments---------", filteredAdjustments)

    setSelectedAdjustments(filteredAdjustments)
  }

  var dummyDr = 0;
  var dummyCr = 0;
  const voucherUpdateHandler = () => {
    if(!isUpdating){
      setLoadModalVisible(true)
    setIsUpdating(true);
    if (editAddedAcc?.length) {
      editAddedAcc?.forEach((item) => {
        dummyDr += parseFloat(item?.Debit);
        dummyCr += parseFloat(item?.Credit);
      });

      if (dummyDr === dummyCr) {
        voucherBody.NetAmt = dummyDr;
        dispatch(createVoucher(JSON.stringify(voucherBody))).then((res) => {
          if (res?.isSuccessful) {
            setIsUpdating(false);
          // dispatch(TranSliceActions.setBlankAccFromEditablelist())
            Alert.alert(`Voucher`, 
                        `Updated successfully`);
            // navigation.setParams({data: null});
            // dispatch(TranSliceActions.setBlankSingleVoucherDetail())
            // dispatch(TranSliceActions.setBlankEditAddedAccToLedger());
            dispatch(TranSliceActions.setBlankEditSelectedAccount())
            setVoucherNarration();
          dispatch(TranSliceActions.setBlankAccFromEditablelist())
            navigation.navigate("voucherslist");
            dispatch(getVoucherList())
            setLoadModalVisible(false)

          } else {
            Alert.alert("Error !", `Message : ${res.response}`);
            setIsUpdating(false);
           setLoadModalVisible(false)

          }
        });
      } else {
        Alert.alert(
          "Hold On !",
          "Voucher can't save beacuse credit and debit amounts are different."
        );
        setIsUpdating(false);
      setLoadModalVisible(false)

      }
    } else {
      Alert.alert("Hold On !", "Please add ledger to create voucher");
      setLoadModalVisible(false)
      setIsUpdating(false);
    }
  }

  };
  return (
    <View style={styles.mainContainer}>
      {/* // ------------------------Loading Modal ----------------------- */}
 <Modal
        visible={loadModalVisible}
        animationType="slide"
        onRequestClose={() => {
           
        }}
        transparent={true}>
        <View style={{...GlobalStyles.batchModalCenterView}}>
          <View>
            <ActivityIndicator color={COLORS.primary} size={'large'} />
            <BlinkingText text="Please wait...." duration={1000} />
          </View>
        </View>
      </Modal>

      {isDetailsLoading ? (
        <View style={{flex:1,alignItems:'center',justifyContent:'center'}}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      ) : (
        <ScrollView>
          {/* *********************Cost Center****************** */}
          <CostCenter
            isCostCenterOpen={isCostCenterModalOpen}
            setIsCostCenterOpen={costCenterModal}
            selectedAmtType={selectedPaymentMode}
            srNo={serialNo}
            ledgerAmt={inputAmt}
            isSendCCDetail={costCenterDetails}
            uniqueID={uniqueID}
            isEditing={isEditingAcc}
            isVoucherEditing={isVoucherEditing}
          />

          {/* ************Adjustment Modal ********************* */}
          <Modal
            animationType="slide"
            transparent={true}
            presentationStyle="overFullScreen"
            visible={adjustModalOpen}
            onRequestClose={() => setAdjustModalOpen(!adjustModalOpen)}
          >
            <View style={styles.filterModalBackgroundBox}>
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
                                  alignItems: "center",
                                }}
                              >
                                <View>
                                  <TouchableOpacity
                                    onPress={() => {
                                      !item?.CheckIt ? (adjustmentAmount>0) ? adjustmentAddToCart(item) : Alert.alert('Balance amount is not available') : adjustmentRemFromCart(item);
                                    }}
                                  >
                                    {selectedAdjustments?.filter(
                                      (vouch) =>
                                        vouch?.FKLinkedSrID ===
                                          item?.FKLinkedSrID &&
                                        vouch?.FKLinkedID === item?.FKLinkedID
                                    )?.length ? (
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
                      onPress={() => setAdjustModalOpen(!adjustModalOpen)}
                    >
                      <Text style={styles.continueText}>Continue</Text>
                    </TouchableOpacity>
                  </>
                )}
              </View>
            </View>
          </Modal>
          {isLoading ? (
            <ActivityIndicator
              size={32}
              color={COLORS.primary}
              style={{ margin: 2, alignSelf: "center" }}
            />
          ) : (
            <>
              {/* **************Main Ledger View*********************** */}
              {mainEditVoucherDetails?.PKID ? (
                <View style={styles.topContainer}>
                  <View style={styles.topSecondryContainer}>
                    <Text style={styles.headingText}>Entry No.</Text>
                    <Text style={styles.headingFieldText}>
                      {singleVoucherDetail?.Series}-
                      {singleVoucherDetail?.EntryNo}
                    </Text>
                  </View>
                  <View style={styles.topSecondryContainer}>
                    <Text style={styles.headingText}>Entry Date</Text>
                    <Text style={styles.headingFieldText}>
                      {formattedDate(singleVoucherDetail?.EntryDate)}
                    </Text>
                  </View>
                </View>
              ) : null}

              <View style={styles.ledgerBox}>
                {/* <TouchableOpacity 
                  style={styles.ledgerHeader}
                  onPress={() => setLedgerOpen(!ledgerOpen)}
                >
                  <Text style={styles.ledgerText}>Ledger</Text>
                  <View >
                    <MCIcon
                      name={ledgerOpen ? "chevron-up" : "chevron-down"}
                      size={28}
                      color={COLORS.primary}
                    />
                  </View>
                </TouchableOpacity> */}

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
                            selectedValue={editSelectedAccount}
                            onChange={(item) => {
                              // setSerialNo(serialNo + 1)
                              generateUniqueId();
                              dispatch(getAccountsListByPKID(item)).then(
                                (res1) => {
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
                                    } else if (
                                      AcGroup[0]?.includes("Creditors")
                                    ) {
                                      PartyFlag = "V";
                                      setPartyFlg("V");
                                    } else {
                                      PartyFlag = "";
                                      setPartyFlg("");
                                    }
                                    dispatch(
                                      getDefaultPartyList(item, PartyFlag)
                                    ).then((res2) => {
                                      if (res2.isSuccessful) {
                                        dispatch(getAccPartyList(item)).then(
                                          (addParty) => {
                                            if (addParty.isSuccessful) {
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
                                                res2?.response?.[0]?.PartyId
                                              );
                                            } else {
                                              Alert.alert(
                                                "Error !",
                                                `${addParty?.response}`
                                              );
                                            }
                                          }
                                        );
                                      } else {
                                        Alert.alert(
                                          "Error !",
                                          `${res2.response}`
                                        );
                                      }
                                    });
                                  } else {
                                    Alert.alert("Error !", `${res1.response}`);
                                  }
                                }
                              );
                              dispatch(
                                TranSliceActions.setEditSelectedAccount(item)
                              );
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
                        {editSelectedAccount?.PKID ? (
                          <>
                            <Text style={styles.titleText}>Party</Text>
                            <View>
                              {partyList?.length ? (
                                <CustomPicker
                                  data={partyList}
                                  labelField="Party"
                                  valueField="PKID"
                                  selectedValue={selectedParty}
                                  onChange={(item) =>
                                    setSelectedParty(item.PKID)
                                  }
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
                              value={inputAmt}
                              onChangeText={(amt) => setInputAmt(amt)}
                              keyboardType="numeric"
                              placeholder="0.00"
                            />
                          </View>

                          <View style={styles.crDrView(selectedPaymentMode)}>
                            <TouchableOpacity
                              onPress={() => setSelectedPaymentMode("Dr")}
                            >
                              <View
                                style={styles.DrsecondryView(
                                  selectedPaymentMode
                                )}
                              >
                                <Text
                                  style={styles.DrText(selectedPaymentMode)}
                                >
                                  Dr
                                </Text>
                              </View>
                            </TouchableOpacity>

                            <TouchableOpacity
                              onPress={() => setSelectedPaymentMode("Cr")}
                            >
                              <View
                                style={styles.CrsecondryView(
                                  selectedPaymentMode
                                )}
                              >
                                <Text
                                  style={styles.CrText(selectedPaymentMode)}
                                >
                                  Cr
                                </Text>
                              </View>
                            </TouchableOpacity>
                          </View>
                          <TouchableOpacity
                            style={{ marginRight: 8 }}
                            onPress={() => {
                              if (
                                editSelectedAccount?.PKID &&
                                selectedParty &&
                                inputAmt
                              ) {
                                setAdjustmentListLoading(true);
                                // console.log("Adjustment body-----", getAdjustmentBody)
                                dispatch(
                                  getAdjustmentList(getAdjustmentBody)
                                ).then((res) => {
                                  if (res.isSuccessful) {
                                    // console.log("response --------", res.response)
                                    let adjArr;
                                    adjArr = res.response
                                    // console.log("Add arr before-----", adjArr)
                                    adjArr.forEach((item) => {
                                      if(item.Selected == true){
                                        adjArr.splice(adjArr.indexOf(item), 1)
                                      }
                                      item.Select = item.CheckIt = false;
                                      item.PayRcptAmt = item.CreditAmt;
                                      item.SrNo = 0;
                                    })
                                    // console.log("Add arr after-----", adjArr)
                                    setAdjustmentList(adjArr);
                                    setAdjustmentListLoading(false);
                                  } else {
                                    Alert.alert("Error !", `${res.response}`);
                                    setAdjustmentListLoading(false);
                                    setAdjustModalOpen(false);
                                  }
                                });
                                setAdjustModalOpen(!adjustModalOpen);
                              } else {
                                if (!editSelectedAccount?.PKID) {
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
                            <MCIcon
                              name="dots-horizontal-circle-outline"
                              size={28}
                              color={COLORS.primary}
                            />
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
                                selectedAccountDetails?.[0]?.ApplyCostCenter ===
                                true
                              ) {
                                if (editSelectedAccount?.PKID) {
                                  if (inputAmt > 0) {
                                    setIsCostCenterModalOpen(
                                      !isCostCenterModalOpen
                                    );
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

              <EditAddedAccList openLedger={ledgerOpenHandler} /> 
              <View style={styles.mainNarrationView}>
                <Text style={styles.titleText}>Narration</Text>
                <TextInput
                  value={voucherNarration}
                  onChangeText={(text) => setVoucherNarration(text)}
                />
                <View style={styles.partition2} />
              </View>
              <TouchableOpacity
                onPress={voucherUpdateHandler}
                style={styles.saveOpacity}
              >
              
                  <Text style={styles.saveText}>Update</Text>
              </TouchableOpacity>
            </>
          )}
        </ScrollView>
      )}
    </View>
  );
};

export default EditVoucher;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,

  },
  topContainer: {
    flexDirection: "row",
    backgroundColor: COLORS.white,
    width: "95%",
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: 10,
    margin: 5,
    padding: 5,
    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.17,
    shadowRadius: 3.05,
    elevation: 4,
  },
  topSecondryContainer: {
    // backgroundColor:'red',
    flex: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  headingText: {
    color: COLORS.primary,
    fontWeight: "500",
    fontSize: 16,
    textAlign: "center",
  },
  headingFieldText: {
    color: COLORS.navyText,
    fontWeight: "500",
    fontSize: 18,
    textAlign: "center",
  },
  ledgerBox: {
    // flexDirection: "row",
    backgroundColor: COLORS.white,
    width: "95%",
    alignSelf: "center",
    // alignItems: "center",
    borderRadius: 10,
    margin: 5,
    padding: 5,
    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.17,
    shadowRadius: 3.05,
    elevation: 4,
  },
  ledgerHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    margin: 2,
    padding: 2,
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
    borderRadius: 40,
    flexDirection: "row",
    margin: 4,
    borderWidth: 1.3,

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
    color: selectedPaymentMode === "Cr" ? COLORS.white : COLORS.lightGreen,
  }),
  addOpacity: {
    borderWidth: 1.3,
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
  titleText: {
    fontWeight: "500",
    fontSize: 18,
    color: COLORS.primary,
  },
  mainNarrationView: {
    backgroundColor: COLORS.white,
    width: "95%",
    alignSelf: "center",
    borderRadius: 10,
    margin: 4,
    padding: 4,
  },
  saveOpacity: {
    backgroundColor: COLORS.primary,
    width: "80%",
    borderRadius: 10,
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
    margin: 4,
    padding: 4,
    marginBottom: 40,
  },
  saveText: {
    fontWeight: "bold",
    fontSize: 24,
    color: COLORS.white,
    margin: 2,
    padding: 2,
  },
});

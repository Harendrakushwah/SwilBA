import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  BackHandler,
  Modal,
} from "react-native";
import React, { useEffect, useLayoutEffect, useState } from "react";
import MCIcon from "react-native-vector-icons/MaterialCommunityIcons";
import ActionButton from "../../GlobalComponents/ActionButton";
import { COLORS, GlobalStyles } from "../../Resources/GlobalStyles";
import LedgerBox from "./LedgerBox";
import { useDispatch, useSelector } from "react-redux";
import LinearGradient from "react-native-linear-gradient";
import {
  createVoucher,
  getCostCenterList,
  getVoucherList,
} from "../../Redux/Transaction/TransactionAction";
import { TranSliceActions } from "../../Redux/Transaction/TransactionSlice";
import BlinkingText from "../../GlobalComponents/BlinkingText";

const Voucher = ({ navigation, route }) => {
  const dispatch = useDispatch();
  const [voucherNarration, setVoucherNarration] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [debitAmt, setDebitAmt] = useState(0.0);
  const [creditAmt, setCreditAmt] = useState(0.0);
  const [loadModalVisible, setLoadModalVisible] = useState(false);

  const selectedVoucherSeries = useSelector(
    (state) => state.transactionSlice?.vouchers?.selectedVoucherSeries
  );
  const addedAccToLedger = useSelector(
    (state) => state.transactionSlice?.addedAccToLedger
  );
  const addedCostCenter = useSelector(
    (state) => state?.transactionSlice?.costCenter?.addedCostCenterList
  );

  var dummyDr = 0.0;
  var dummyCr = 0.0;

  // console.log("Added account to ledger------", addedAccToLedger)

  useEffect(() => {
    dispatch(getCostCenterList());
  }, []);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: `Create Voucher`,
      headerLeft: () => (
        <>
          <ActionButton
            onPress={() => {
              navigation.goBack();
            }}
            icon={<MCIcon name="arrow-left" size={24} color={COLORS.white} />}
            android_ripple={COLORS.primaryDark}
            style={{ borderRadius: 1000, marginRight: 10 }}
          />
        </>
      ),
    });
  }, []);

  useEffect(() => {
    const backAction = () => {
      navigation.setParams({ data: null });
      dispatch(TranSliceActions.setBlankSelectedAccount());
      dispatch(TranSliceActions.setBlankAddedAccToLedger());
      navigation.goBack();
      setVoucherNarration("");
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove();
  }, []);

  useEffect(() => {
    if (addedAccToLedger) {
      let debit = 0.0;
      let credit = 0.0;
      addedAccToLedger?.forEach((item) => {
        debit += parseFloat(item.Debit);
        credit += parseFloat(item.Credit);
      });

      // console.log("Debit------, Credit------", debit, credit);
      setCreditAmt(credit);
      setDebitAmt(debit);
    }
  }, [addedAccToLedger]);
  const voucherBody = {
    PKID: 0,
    VoucherNarration: voucherNarration,
    FKSeriesID: selectedVoucherSeries?.PKID,
    GRNo: null,
    Series: selectedVoucherSeries?.Series,
    NetAmt: "",
    dtVoucherDtl: addedAccToLedger,
    dtCostCenter: addedCostCenter,
  };

  const voucherSaveHandler = () => {
    if (!isLoading) {
      setLoadModalVisible(true);
      if (selectedVoucherSeries?.PKID) {
        setIsLoading(true);
        if (addedAccToLedger?.length) {
          addedAccToLedger?.forEach((item) => {
            dummyDr += parseFloat(item.Debit);
            dummyCr += parseFloat(item.Credit);
          });

          if (dummyDr === dummyCr) {
            voucherBody.NetAmt = dummyDr;
            dispatch(createVoucher(JSON.stringify(voucherBody))).then((res) => {
              if (res.isSuccessful) {
                Alert.alert(`Voucher`, `Created successfully`);
                dispatch(TranSliceActions.setBlankSelectedAccount());
                setVoucherNarration([]);
                dispatch(TranSliceActions.setBlankAddedAccToLedger());
                setVoucherNarration("");
                dispatch(TranSliceActions.setBlankCostCenter());
                dispatch(TranSliceActions.setInputAmt([]));
                navigation.setParams({ data: null });
                setIsLoading(false);
                navigation.navigate("voucherslist");
                dispatch(getVoucherList());
                setLoadModalVisible(false);
              } else {
                Alert.alert("Error !", `Message : ${res.response}`);
                setIsLoading(false);
                setLoadModalVisible(false);
              }
            });
          } else {
            Alert.alert(
              "Hold On !",
              "Voucher can't save beacuse credit and debit amounts are different."
            );
            setIsLoading(false);
            setLoadModalVisible(false);
          }
        } else {
          Alert.alert("Hold On !", "Please add ledger to create voucher");
          setIsLoading(false);
          setLoadModalVisible(false);
        }
      } else {
        Alert.alert("Hold On !", "Please select voucher Series");
        setLoadModalVisible(false);

        setIsLoading(false);
      }
    }
  };

  // console.log("selected Voucher series----->>>>>>>>", selectedVoucherSeries.PKID);

  return (
    <View style={styles.mainContainer}>
      {/* // ------------------------Loading Modal ----------------------- */}
      <Modal
        visible={loadModalVisible}
        animationType="slide"
        onRequestClose={() => {}}
        transparent={true}
      >
        <View style={{ ...GlobalStyles.batchModalCenterView }}>
          <View>
            <ActivityIndicator color={COLORS.primary} size={"large"} />
            <BlinkingText text="Please wait...." duration={1000} />
          </View>
        </View>
      </Modal>

      <ScrollView nestedScrollEnabled={true}>
        <View style={styles.voucherSeriesContainer}>
          <Text style={{ ...styles.voucherTitle }}>Voucher Series</Text>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate("addTransactionStack", {
                screen: "setting",
                tranAlias: "voucher",
              })
            }
          >
            <Text style={styles.seriesText}>
              {selectedVoucherSeries?.Series || "Select Series"}
            </Text>
          </TouchableOpacity>
        </View>

        <LedgerBox />

        {debitAmt > 0 && creditAmt > 0 ? (
          <>
            <View style={styles.mainNarrationView}>
              <Text style={styles.titleText}>Narration</Text>
              <TextInput
                value={voucherNarration}
                onChangeText={(text) => setVoucherNarration(text)}
              />
              <View style={styles.partition2} />
            </View>
            <TouchableOpacity
              onPress={voucherSaveHandler}
              style={styles.saveOpacity}
            >
              <LinearGradient
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                colors={["#57435C", "#4F3D56", "#130C2A"]}
                style={{ ...styles.linearStyles, justifyContent: "center" }}
              >
                <Text style={styles.saveText}>Save</Text>
              </LinearGradient>
            </TouchableOpacity>
          </>
        ) : null}
      </ScrollView>
    </View>
  );
};

export default Voucher;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
  partition: {
    borderWidth: 1,
    width: "85%",
    borderRadius: 10,
    alignSelf: "center",
    borderColor: COLORS.primary,
    margin: 4,
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
    width: "80%",
    borderRadius: 10,
    alignSelf: "center",
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
  voucherSeriesContainer: {
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
    marginRight: 15,
    color: COLORS.primary,
  },
  voucherTitle: {
    fontWeight: "bold",
    fontSize: 15,
    color: COLORS.primary,
    margin: 4,
    padding: 2,
  },
  linearStyles: {
    borderRadius: 6,
    alignItems: "center",
    width: "100%",
  },
});

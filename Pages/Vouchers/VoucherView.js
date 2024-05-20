import { StyleSheet, Text, View, ActivityIndicator, TouchableOpacity } from 'react-native'
import React, {useEffect, useState} from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { COLORS } from '../../Resources/GlobalStyles';
import { formattedDate } from '../../Resources/Resources';
import { getVoucherDetailByID } from '../../Redux/Transaction/TransactionAction';
import { TranSliceActions } from '../../Redux/Transaction/TransactionSlice';
import { GestureHandlerRootView } from "react-native-gesture-handler";

const VoucherView = ({navigation, route}) => {
    const dispatch = useDispatch();
    const mainEditVoucherDetails = route.params.data;

    const [isDetailsLoading, setIsDetailsLoading] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [voucherNarration, setVoucherNarration] = useState("");

    const accounts = useSelector(
        (state) => state.transactionSlice?.editVoucher?.editAddedAccToLedger)
    const editAcc = accounts?.filter((item)=> item?.ModeForm !== 2);

    const singleVoucherDetail = useSelector(
        (state) => state?.transactionSlice?.vouchers?.singleVoucherDetail
      );

    useEffect(() => {
        if (mainEditVoucherDetails) {
          setIsDetailsLoading(true)
          dispatch(TranSliceActions.setSelectedVoucher(mainEditVoucherDetails));
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

  return (
    <View style={{flex: 1}}>
      {isDetailsLoading ? (
             <View style={{flex:1,alignItems:'center',justifyContent:'center'}}>
                <ActivityIndicator size="large" color={COLORS.primary} />
             </View>
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

        <View style={styles.mainContainer}>
        {editAcc?.length ? (
          <>
            <GestureHandlerRootView>
              {editAcc?.map((item, index) => {
                return (
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
                );
              })}
            </GestureHandlerRootView>
          </>
        ) : null}
            <View style={styles.mainNarrationView}>
                <Text style={styles.titleText}>Narration</Text>
                <Text style={{paddingVertical: 8, paddingLeft: 2, color: COLORS.black}}>{voucherNarration}</Text>
                <View style={styles.partition2} />
            </View>
      </View>
            </>
          )}
    </View>
  )
}

export default VoucherView

const styles = StyleSheet.create({
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
        flex:8,
        fontWeight: "bold",
        fontSize: 16,
        color: COLORS.primary,
        marginHorizontal: 6,
        padding: 2,
        marginVertical: 4,
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
        borderRadius: 8,
        margin: 4,
        padding: 6,
      },
})
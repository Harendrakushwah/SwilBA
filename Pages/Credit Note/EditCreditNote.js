import { StyleSheet, Text, View, Alert, ActivityIndicator, ScrollView} from 'react-native'
import React, {useState, useEffect, useRef} from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { TranSliceActions } from '../../Redux/Transaction/TransactionSlice'
import { getCreditNoteDetailsbyID } from '../../Redux/Transaction/TransactionAction'
import { COLORS } from '../../Resources/GlobalStyles'
import { formattedDate } from '../../Resources/Resources'
import SelectCustomer from '../../GlobalComponents/SelectCustomer'
import SelectProduct from '../../GlobalComponents/SelectProduct'
import PaymentSection from '../../GlobalComponents/PaymentSection'
import EditPaymentSection from '../../GlobalComponents/EditPaymentSection'

const EditCreditNote = ({navigation, route}) => {
  const scrollViewRef = useRef();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const mainCreditNoteDetails = route?.params?.data || useSelector(state => state?.transactionSlice?.creditNote?.selectedCreditNote)
  const singleCreditNoteDetail = useSelector((state) => state?.transactionSlice?.objectDetails)
  const selectedCustomer = useSelector(state => state?.transactionSlice?.creditNote?.selectedCustomer)
  const paymentEnabled = useSelector(state => state?.transactionSlice?.creditNote?.paymentOptionEnabled)

  
  useEffect(() => {
    if (mainCreditNoteDetails) {
      setIsLoading(true)
      dispatch(TranSliceActions.setSelectedCreditNote(mainCreditNoteDetails));
      dispatch(getCreditNoteDetailsbyID(mainCreditNoteDetails)).then(res => {
        if(res.isSuccessful){
          setIsLoading(false)
        }
        else{
          setIsLoading(false)
          Alert.alert('Error! ');
        }
      })
    }
  }, [mainCreditNoteDetails]);
  
  useEffect(() => {
    dispatch(TranSliceActions?.setPaymentOptionEnabled(false));
  },[navigation])

  useEffect(() => {
    dispatch(TranSliceActions?.setProdToCart(singleCreditNoteDetail?.TransDetail));
  }, [singleCreditNoteDetail])

  return (
    <View style={{flex:1}}>
    {isLoading 
      ? 
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <ActivityIndicator size={'large'} color={COLORS.primary} />  
      </View>
      
      : 
      <>
      {
      mainCreditNoteDetails?.PKID ?

        <View style={styles.topContainer}>
        <View style={styles.topSecondryContainer}>
          <Text style={styles.headingText}>Entry No.</Text>
          <Text style={styles.headingFieldText}>
            {mainCreditNoteDetails?.Series}-
            {mainCreditNoteDetails?.EntryNo}
          </Text>
        </View>
        <View style={styles.topSecondryContainer}>
          <Text style={styles.headingText}>Entry Date</Text>
          <Text style={styles.headingFieldText}>
            {formattedDate(mainCreditNoteDetails?.EntryDate)}
          </Text>
        </View>
      </View>
    : null  
    }
    <ScrollView nestedScrollEnabled
    style={{}}
    ref={scrollViewRef}
      showsVerticalScrollIndicator={false}
    onContentSizeChange={() => paymentEnabled ? scrollViewRef.current.scrollToEnd({ animated: true }) : null}

    >
      <SelectCustomer tranAlias={'editCreditNote'}/> 
      {selectedCustomer ? <SelectProduct tranAlias={'editCreditNote'} /> : null}
      {paymentEnabled ? <EditPaymentSection tranAlias={'editCreditNote'} orderDetails={mainCreditNoteDetails} /> : null}
    </ScrollView>
    </>
  }
    </View>
  )
}

export default EditCreditNote

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
})
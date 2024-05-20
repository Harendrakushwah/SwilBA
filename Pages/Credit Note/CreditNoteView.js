import { Alert, StyleSheet, Text, View, ActivityIndicator, ScrollView } from 'react-native'
import React, {useState, useEffect } from 'react'
import { COLORS } from '../../Resources/GlobalStyles';
import { formattedDate } from '../../Resources/Resources';
import { useDispatch, useSelector } from 'react-redux';
import { getCreditNoteDetailsbyID } from '../../Redux/Transaction/TransactionAction';
import { TranSliceActions } from '../../Redux/Transaction/TransactionSlice';

const CreditNoteView = ({navigation, route}) => {
    const dispatch = useDispatch();
    const creditNoteDetail = route.params.data;
    const [isLoading, setIsLoading] = useState(false);

    const singleCreditNoteDetail = useSelector((state) => state?.transactionSlice?.objectDetails)


    useEffect(() => {
      if (creditNoteDetail) {
        setIsLoading(true)
        dispatch(TranSliceActions.setSelectedCreditNote(creditNoteDetail));
        dispatch(getCreditNoteDetailsbyID(creditNoteDetail)).then(res => {
          if(res.isSuccessful){
            setIsLoading(false)
          }
          else{
            setIsLoading(false)
            Alert.alert('Error! ');
          }
          
        })
      }
    }, [creditNoteDetail]);

  return (
    <View style={{flex: 1}}>
      {isLoading ? 
         <View style={{flex:1,alignItems:'center',justifyContent:'center'}}>
            <ActivityIndicator size="large" color={COLORS.primary} />
          </View>
      :
      <>
      {creditNoteDetail?.PKID ? 
        <View style={styles.topContainer}>
        <View style={styles.topSecondryContainer}>
          <Text style={styles.headingText}>Entry No.</Text>
          <Text style={styles.headingFieldText}>
            {creditNoteDetail?.Series}-
            {creditNoteDetail?.EntryNo}
          </Text>
        </View>
        <View style={styles.topSecondryContainer}>
          <Text style={styles.headingText}>Entry Date</Text>
          <Text style={styles.headingFieldText}>
            {formattedDate(creditNoteDetail?.EntryDate)}
          </Text>
        </View>
      </View>
    : null  
    }
  <ScrollView>
    {
      singleCreditNoteDetail?.ModeForm !=2 
      ? 
      singleCreditNoteDetail?.TransDetail?.map(item => {
      return (
      <View style={styles.infoContainer}>
       {/* <View style={styles.itemContainer}>
         <Text style={styles.titleText}>Customer - </Text>
         <Text style={styles.infoText}>{singleCreditNoteDetail?.Party}</Text>
       </View> */}
       <View style={styles.itemContainer}>
         <Text style={styles.titleText}>Product - </Text>
         <View style={{flex: 1}}>
          <Text style={{...styles.infoText, flexWrap: 'wrap'}}>{item?.NameToDisplay}</Text>
         </View>
       </View>
       <View style={styles.itemContainer}>
         <Text style={styles.titleText}>Batch - </Text>
         <Text style={styles.infoText}>{item?.Batch || 'NA'}</Text>
       </View>
       <View style={styles.itemContainer}>
         <Text style={styles.titleText}>Qty - </Text>
         <Text style={styles.infoText}>{item?.Qty}</Text>
       </View>
       <View style={styles.itemContainer}>
         <Text style={styles.titleText}>Return type - </Text>
         <Text style={styles.infoText}>{item?.ReturnType}</Text>
       </View>
       <View style={styles.itemContainer}>
         <Text style={styles.titleText}>MRP - </Text>
         <Text style={styles.infoText}>{(item?.MRP)?.toFixed(2)}</Text>
       </View>
       <View style={styles.itemContainer}>
         <Text style={styles.titleText}>Rate - </Text>
         <Text style={styles.infoText}>{(item?.Rate)?.toFixed(2)}</Text>
       </View>
       <View style={styles.itemContainer}>
         <Text style={styles.titleText}>Amount - </Text>
         <Text style={styles.infoText}>{(parseFloat(item?.Rate)*parseFloat(item?.Qty))?.toFixed(2)}</Text>
       </View>
     </View>
      );
    })
  : null
  }
  </ScrollView>
    </>

    }
      
    </View>
  )
}

export default CreditNoteView

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
  infoContainer: {
    backgroundColor: COLORS.white,
    width: "95%",
    alignSelf: "center",
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
  itemContainer: {
    flexDirection: 'row', 
    justifyContent: "flex-start",
    alignItems: 'center',
    marginVertical: 3
  },
  titleText: {
    fontSize: 18, 
    color: COLORS.primary, 
    fontWeight: '500', 
    marginLeft: 5
  },
  infoText: {
    fontSize: 16, 
    color: COLORS.black, 
    fontWeight: '500', 
    width: '90%'
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
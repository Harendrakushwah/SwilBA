import { StyleSheet, Text, View, ScrollView } from 'react-native'
import React, {useEffect} from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getReceivablesReport, getPayablesReport} from '../../Redux/Common/CommonAction';
import DataBox from '../../Resources/DataBox';
import { COLORS } from '../../Resources/GlobalStyles';

const Accounts = ({navigation}) => {
  const dispatch = useDispatch();
  
  const receivablesReport = useSelector(state => state?.commonSlice?.Accounts?.receivablesReport);
  const payablesReport = useSelector(state => state?.commonSlice?.Accounts?.payablesReport);

  useEffect(() => {
    dispatch(getReceivablesReport());
    dispatch(getPayablesReport());  
  }, []);

  return (
    <View style={styles.mainContainer}>
      <ScrollView>
        <DataBox title={'Payables'} data={payablesReport} InvOrAcc={'Accounts'}/>
        <DataBox title={'Receivables'} data={receivablesReport} InvOrAcc={'Accounts'}/>
      </ScrollView>
    </View>
  )
}

export default Accounts

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: COLORS.white
    },
})
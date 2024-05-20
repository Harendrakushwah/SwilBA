import { StyleSheet, Text, View } from 'react-native'
import React,{useEffect,useState,useLayoutEffect} from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { getVoucherDetailByID } from '../../Redux/Transaction/TransactionAction';

const SingleVoucherDetails = ({route}) => {
    const dispatch = useDispatch()
    const voucher = route.params?.data ;
    const voucherDetail = useSelector(state => state?.transactionSlice?.vouchers?.singleVoucherDetail)
    useEffect(() => {
    dispatch(getVoucherDetailByID(voucher))
    }, [])
 

    console.log("Voucher Detailss ===>>",voucherDetail)
  return (
    <View style={styles.mainContainer}>
      
     <View>

     </View>
    </View>
  )
}

export default SingleVoucherDetails

const styles = StyleSheet.create({})
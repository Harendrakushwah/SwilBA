import {StyleSheet, Text, View,Alert} from 'react-native';
import React, {useEffect} from 'react';
import { useDispatch } from 'react-redux';
import { getTranWiseSummary } from '../../Redux/Transaction/TransactionAction';

export default function SalesDashboard() {
    const dispatch = useDispatch()
  useEffect(() => {
dispatch(getTranWiseSummary('SINV'))
  }, []);

  return (
    <View>
      <Text>SalesDashboard</Text>
    </View>
  );
}

const styles = StyleSheet.create({});

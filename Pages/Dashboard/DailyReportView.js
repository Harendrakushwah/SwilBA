import {StyleSheet, Text, View,ScrollView,Alert, TouchableOpacity} from 'react-native';
import React from 'react';
import {useSelector} from 'react-redux';
import MCI from 'react-native-vector-icons/MaterialCommunityIcons';
import {COLORS, GlobalStyles} from '../../Resources/GlobalStyles';


const DailyReportView = ({navigation}) => {

  const dashboardData = useSelector(
    state => state?.commonSlice?.dashboard?.dashboardData,
  );
  
  return (
    <View style={styles.mainContainer}>
        <ScrollView
        showsVerticalScrollIndicator={false}>
          {/* <TouchableOpacity
              onPress={() => navigation.navigate('mainDashboard')}>
            <MCI
              name='fullscreen-exit'
              size={30}
              color={COLORS.primary}
              style={styles.fullScreenExit}
            />
          </TouchableOpacity> */}
          <View style={{backgroundColor: '#F1F6FF'}}>
          <View style={styles.primaryRow}>
              <Text style={styles.rowHeadingText}>Total Brk Exp</Text>
              <Text style={styles.rowText}>{dashboardData?.BrkExp}</Text>
          </View>
          </View>
          <View style={styles.primaryRow}>
              <Text style={styles.rowHeadingText}>Total Cash Bills</Text>
              <Text style={styles.rowText}>{dashboardData?.TotalCashBills}</Text>
          </View>
          <View style={{backgroundColor: '#F1F6FF'}}>
          <View style={styles.primaryRow}>
            <Text style={styles.rowHeadingText}>Total Cash Sales</Text>
            <Text style={styles.rowText}>{dashboardData?.CashSales?.toFixed(2)}</Text>
          </View>
          </View>
          <View style={styles.primaryRow}>
            <Text style={styles.rowHeadingText}>Total Credit Bills</Text>
            <Text style={styles.rowText}>
              {dashboardData?.TotalCreditBills}
            </Text>
          </View>
          <View style={{backgroundColor: '#F1F6FF'}}>
            <View style={styles.primaryRow}>
              <Text style={styles.rowHeadingText}>Total Credit Sales</Text>
              <Text style={styles.rowText}>{dashboardData?.CreditSales?.toFixed(2)}</Text>
            </View>
          </View>
          <View style={styles.primaryRow}>
            <Text style={styles.rowHeadingText}>Total Sales Credit Note </Text>
            <Text style={styles.rowText}>{dashboardData?.SalesRet}</Text>
          </View>
          <View style={{backgroundColor: '#F1F6FF'}}>
          <View style={styles.primaryRow}>
            <Text style={styles.rowHeadingText}>Total Sales Bills</Text>
            <Text style={styles.rowText}>{dashboardData?.TotalSalesBills}</Text>
          </View>
          </View>
            <View style={styles.primaryRow}>
              <Text style={styles.rowHeadingText}>Total Sales Challan</Text>
              <Text style={styles.rowText}>
                {dashboardData?.TotalSalesChallan}
              </Text>
            </View>
          <View style={{backgroundColor: '#F1F6FF'}}>
          <View style={styles.primaryRow}>
            <Text style={styles.rowHeadingText}>Total Sales Credit Note Bills</Text>
            <Text style={styles.rowText}>{dashboardData?.TotalSalesRtn}</Text>
          </View>
          </View>
            <View style={styles.primaryRow}>
              <Text style={styles.rowHeadingText}>Total Purchase Bills</Text>
              <Text style={styles.rowText}>{dashboardData?.TotalPurchBills}</Text>
            </View>
          <View style={{backgroundColor: '#F1F6FF'}}>
          <View style={styles.primaryRow}>
            <Text style={styles.rowHeadingText}>Total Purchase Challan</Text>
            <Text style={styles.rowText}>
              {dashboardData?.TotalPurchChallan}
            </Text>
          </View>
          </View>
            <View style={styles.primaryRow}>
              <Text style={styles.rowHeadingText}>Total Purchase Debit Note Bills</Text>
              <Text style={styles.rowText}>{dashboardData?.TotalPurchRtn}</Text>
            </View>

          <View style={{backgroundColor: '#F1F6FF'}}>
          <View style={styles.primaryRow}>
            <Text style={styles.rowHeadingText}>Total Product Converted</Text>
            <Text style={styles.rowText}>{dashboardData?.TotalProdConv}</Text>
          </View>
          </View>
            <View style={styles.primaryRow}>
              <Text style={styles.rowHeadingText}>Total Local Transfer</Text>
              <Text style={styles.rowText}>
                {dashboardData?.TotalLocTransfer}
              </Text>
            </View>
          <View style={{backgroundColor: '#F1F6FF'}}>
          <View style={styles.primaryRow}>
            <Text style={styles.rowHeadingText}>Total Receipt</Text>
            <Text style={styles.rowText}>{dashboardData?.TotalReceipt}</Text>
          </View>
          </View> 
          <View style={styles.primaryRow}>
              <Text style={styles.rowHeadingText}>Total Payment Bills</Text>
              <Text style={styles.rowText}>{dashboardData?.TotalPayment}</Text>
          </View>
          <View style={{backgroundColor: '#F1F6FF'}}>
            <View style={styles.primaryRow}>
              <Text style={styles.rowHeadingText}>Total Shortage Surplus</Text>
              <Text style={styles.rowText}>{dashboardData?.TotalShrtSurp}</Text>
            </View>
          </View>
          <View style={styles.primaryRow}>
            <Text style={styles.rowHeadingText}>Total Vouchers</Text>
            <Text style={styles.rowText}>{dashboardData?.TotalVouchers}</Text>
          </View>
        </ScrollView>
    </View>
  );
};

export default DailyReportView;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: 'white'
  },
  primaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 30,
    paddingVertical: 16
  },
  rowText: {
    color: COLORS.textTitle,
    fontSize: 19,
    fontWeight: '600',
  },
  rowHeadingText: {
    color: COLORS.grayText,
    fontSize: 18,
    fontWeight: '500',
  },
  fullScreenExit: {
    alignSelf: 'flex-end',
    marginRight: 20,
    marginTop: 15,
    marginBottom: 15,
  },
});

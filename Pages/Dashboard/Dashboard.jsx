import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  FlatList,
  Image,
  SafeAreaView,
  RefreshControl
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {getDashboardData, getDefaultDashboardData, getSeriesListByTranAlias, logOutHandler} from '../../Redux/Common/CommonAction';
import {COLORS, DeviceType, GlobalStyles} from '../../Resources/GlobalStyles';
import MCI from 'react-native-vector-icons/MaterialCommunityIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { getReturnTypeList } from '../../Redux/Transaction/TransactionAction';
import DeviceInfo from 'react-native-device-info';


export default function Dashboard({navigation}) {
  const dispatch = useDispatch();
  const [dailyReportCollapse, setDailyReportCollapse] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const isOnline = useSelector((state) => state?.commonSlice?.isNetConnected);
  const dashboardData = useSelector(
    (state) => state?.commonSlice?.dashboard?.dashboardData
  );
  const isDashboardDataLoding = useSelector(
    (state) => state?.commonSlice?.dashboard?.isDashboardDataLoding
  );

  const defaultDashboardData = useSelector(
    (state) => state?.commonSlice?.defaultDashboardData
  );

  const creditNoteSeriesList = useSelector(
    (state) => state.transactionSlice.creditNote.creditNoteSeriesList
  );
  const voucherSeriesList = useSelector(
    (state) => state.transactionSlice.vouchers.voucherSeriesList
  );

  // console.log("default dashboard data---->>>>", defaultDashboardData);

  useEffect(() => {
    if (!isOnline) {
      navigation.navigate("noInternetScreen");
    }
  }, [isOnline]);

  useEffect(() => {
    dispatch(getDashboardData());
    dispatch(getDefaultDashboardData());
    dispatch(getReturnTypeList());
  }, []);


  const fetchSeriesData = () =>{
    try {
      if(!voucherSeriesList?.length){
        dispatch(getSeriesListByTranAlias('V_JR'));
      }
      if(!creditNoteSeriesList?.length){
        dispatch(getSeriesListByTranAlias('SCRN'));
      }
    } catch (error) {
      console.error('Error fetching series list:', error);
    }
  }

  useEffect(() => {
  fetchSeriesData()
  }, [voucherSeriesList,creditNoteSeriesList]);

  const SecondryDashBtn = [
    {
      label: "Sales",
      onPress: () => {
        navigation.navigate("temp");
      },
      icon: require("../../Assets/Images/sales.png"),
    },
    {
      label: "Purchase",
      onPress: () => navigation.navigate("purchaseorderview"),
      icon: require("../../Assets/Images/purchase.png"),
    },
    {
      label: "Inventory Reports",
      onPress: () => navigation.navigate("inventoryStack"),
      icon: require("../../Assets/Images/inventory.png"),
    },
    // {
    //   label: 'Reports',
    //   onPress: () => console.log('check'),
    //   icon: require('../../Assets/Images/Reports.png'),
    // },
    {
      label: "Account Reports",
      onPress: () => navigation.navigate("accountsStack"),
      icon: require("../../Assets/Images/Accounts.png"),
    },
    {
      label: "Settings",
      onPress: () => {
        try {
          navigation.navigate("settingStack");
        } catch (error) {
          console.error('Error navigating to "settingStack":', error);
        }
      },
      icon: require("../../Assets/Images/settings.png"),
    },
  ];

  const onRefresh = () => {
    setRefreshing(true);
    dispatch(getDashboardData());
    // Perform your data fetching or any other tasks you want to do on refresh

    // Simulate a delay for demonstration purposes
    setTimeout(() => {
      setRefreshing(false);
    }, 1000); // 2 seconds delay
  };

  return (
    <>
      <SafeAreaView style={styles.mainContainer}>
        <View style={styles.headerContainer}>
          <View style={styles.userLogoView}>
            <Image
              source={require("../../Assets/Images/SwilBAlogo1.png")}
              style={styles.userLogo}
            />
          </View>
          <View style={styles.welcomeContainer}>
            <Text style={styles.userNameText}>
              {defaultDashboardData?.CompanyName?.toUpperCase()}
            </Text>
            <Text
              style={{ ...styles.userNameText, fontSize: 14, marginLeft: 2 }}
            >
              {defaultDashboardData?.UserName?.toUpperCase()}
            </Text>
          </View>
          <TouchableOpacity style={styles.logOutBtn}>
            <Text
              onPress={() => dispatch(logOutHandler())}
              style={styles.logOutText}
            >
              Logout
            </Text>
            <MCI
              name={"logout"}
              size={24}
              color={COLORS.primary}
              style={{ alignSelf: "center", marginLeft: 3 }}
            />
          </TouchableOpacity>
        </View>
        <View
          style={{
            flex: 1,
            paddingHorizontal: 12,
            marginTop: 10,
            borderBottomColor: COLORS.primary,
            borderBottomWidth: 0.8,
          }}
        >
          <View
            style={{
              ...GlobalStyles.shadowBoxContainer,
              ...styles.dailyReportContainer,
            }}
          >
            <View style={styles.mainPrimaryRow}>
              <Text style={styles.titleText}>Daily Report</Text>
              <View style={{ flexDirection: "row" }}>
                <TouchableOpacity
                  onPress={() => navigation.navigate("dailyreport")}
                >
                  <MCI
                    name="fullscreen"
                    size={30}
                    color={"#000000"}
                    style={styles.fullScreen}
                  />
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => setDailyReportCollapse(!dailyReportCollapse)}
                >
                  {dailyReportCollapse ? (
                    <AntDesign
                      name="down"
                      size={23}
                      color={"#000000"}
                      style={styles.collapseUp}
                    />
                  ) : (
                    <AntDesign
                      name="up"
                      size={23}
                      color={"#000000"}
                      style={styles.collapseDown}
                    />
                  )}
                </TouchableOpacity>
              </View>
            </View>
            <View style={{ flex: dailyReportCollapse ? 1 : null, height: 280 }}>
              {dashboardData ? (
                <ScrollView
                  refreshControl={
                    <RefreshControl
                      refreshing={refreshing}
                      onRefresh={onRefresh}
                    />
                  }
                  showsVerticalScrollIndicator={false}
                >
                  <View style={styles.primaryRow}>
                    <Text style={styles.rowHeadingText}>Total Brk Exp</Text>
                    <Text style={styles.rowText}>
                      {dashboardData?.BrkExp?.toFixed(2)}
                    </Text>
                  </View>
                  <View style={styles.primaryRow}>
                    <Text style={styles.rowHeadingText}>Total Cash Bills</Text>
                    <Text style={styles.rowText}>
                      {dashboardData?.TotalCashBills}
                    </Text>
                  </View>
                  <View style={styles.primaryRow}>
                    <Text style={styles.rowHeadingText}>Total Cash Sales</Text>
                    <Text style={styles.rowText}>
                      {dashboardData?.CashSales?.toFixed(2)}
                    </Text>
                  </View>
                  <View style={styles.primaryRow}>
                    <Text style={styles.rowHeadingText}>
                      Total Credit Bills
                    </Text>
                    <Text style={styles.rowText}>
                      {dashboardData?.TotalCreditBills}
                    </Text>
                  </View>
                  <View style={styles.primaryRow}>
                    <Text style={styles.rowHeadingText}>
                      Total Credit Sales
                    </Text>
                    <Text style={styles.rowText}>
                      {dashboardData?.CreditSales?.toFixed(2)}
                    </Text>
                  </View>
                  <View style={styles.primaryRow}>
                    <Text style={styles.rowHeadingText}>Total Sales Bills</Text>
                    <Text style={styles.rowText}>
                      {dashboardData?.TotalSalesBills}
                    </Text>
                  </View>
                  <View style={styles.primaryRow}>
                    <Text style={styles.rowHeadingText}>
                      Total Sales Challan
                    </Text>
                    <Text style={styles.rowText}>
                      {dashboardData?.TotalSalesChallan}
                    </Text>
                  </View>
                  <View style={styles.primaryRow}>
                    <Text style={styles.rowHeadingText}>
                      Total Sales Credit Note{" "}
                    </Text>
                    <Text style={styles.rowText}>
                      {dashboardData?.SalesRet?.toFixed(2)}
                    </Text>
                  </View>
                  <View style={styles.primaryRow}>
                    <Text style={styles.rowHeadingText}>
                      Total Sales Credit Note Bills
                    </Text>
                    <Text style={styles.rowText}>
                      {dashboardData?.TotalSalesRtn}
                    </Text>
                  </View>
                  <View style={styles.primaryRow}>
                    <Text style={styles.rowHeadingText}>
                      Total Purchase Bills
                    </Text>
                    <Text style={styles.rowText}>
                      {dashboardData?.TotalPurchBills}
                    </Text>
                  </View>
                  <View style={styles.primaryRow}>
                    <Text style={styles.rowHeadingText}>
                      Total Purchase Challan
                    </Text>
                    <Text style={styles.rowText}>
                      {dashboardData?.TotalPurchChallan}
                    </Text>
                  </View>
                  <View style={styles.primaryRow}>
                    <Text style={styles.rowHeadingText}>
                      Total Purchase Debit Note Bills
                    </Text>
                    <Text style={styles.rowText}>
                      {dashboardData?.TotalPurchRtn}
                    </Text>
                  </View>
                  <View style={styles.primaryRow}>
                    <Text style={styles.rowHeadingText}>
                      Total Product Converted
                    </Text>
                    <Text style={styles.rowText}>
                      {dashboardData?.TotalProdConv}
                    </Text>
                  </View>
                  <View style={styles.primaryRow}>
                    <Text style={styles.rowHeadingText}>
                      Total Local Transfer
                    </Text>
                    <Text style={styles.rowText}>
                      {dashboardData?.TotalLocTransfer}
                    </Text>
                  </View>
                  <View style={styles.primaryRow}>
                    <Text style={styles.rowHeadingText}>
                      Total Payment Bills
                    </Text>
                    <Text style={styles.rowText}>
                      {dashboardData?.TotalPayment}
                    </Text>
                  </View>
                  <View style={styles.primaryRow}>
                    <Text style={styles.rowHeadingText}>Total Receipt</Text>
                    <Text style={styles.rowText}>
                      {dashboardData?.TotalReceipt}
                    </Text>
                  </View>
                  <View style={styles.primaryRow}>
                    <Text style={styles.rowHeadingText}>
                      Total Shortage Surplus
                    </Text>
                    <Text style={styles.rowText}>
                      {dashboardData?.TotalShrtSurp}
                    </Text>
                  </View>
                  <View style={styles.primaryRow}>
                    <Text style={styles.rowHeadingText}>Total Vouchers</Text>
                    <Text style={styles.rowText}>
                      {dashboardData?.TotalVouchers}
                    </Text>
                  </View>
                </ScrollView>
              ) : (
                <View
                  style={{
                    flex: 1,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <ActivityIndicator size="large" color={COLORS.primary} />
                </View>
              )}
            </View>
          </View>
          <View style={styles.flatListView}>
            <FlatList
              showsVerticalScrollIndicator={false}
              data={SecondryDashBtn}
              key={"#"}
              numColumns={2}
              style={{ marginBottom: 10 }}
              renderItem={({ item, index }) => {
                return (
                  <View
                    style={{
                      ...(item.label == "Settings"
                        ? styles.flatlistItemContainer1
                        : styles.flatlistItemContainer),
                    }}
                  >
                    <TouchableOpacity
                      style={{
                        ...(item.label == "Settings"
                          ? styles.secondryDashView1
                          : styles.secondryDashView),
                      }}
                      onPress={() => {
                        item.onPress();
                      }}
                    >
                      <View style={styles.iconContainer}>
                        <Image
                          source={item.icon}
                          style={styles.secondryDashIcon}
                        />
                      </View>
                      <Text style={styles.itemLabelText}>{item.label}</Text>
                    </TouchableOpacity>
                  </View>
                );
              }}
            />
          </View>
      
        </View>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  headerContainer: {
    marginTop: 15,
    alignItems: "flex-start",
    flexDirection: "row",
  },
  userLogoView: {
    borderRadius: 100,
    // borderWidth: 1,
    // marginVertical: 20,
    marginTop: 7,
    marginLeft: 15,
    borderColor: COLORS.primary,
    // backgroundColor: COLORS.whiteDark,
  },
  userLogo: {
    resizeMode: "contain",
    height: 50,
    width: 50,
    // borderRadius:100
  },
  welcomeContainer: {
    flex: 1,
    margin: 8,
  },

  userNameText: {
    fontWeight: "600",
    fontFamily: "Inter",
    color: "#1F2C37",
    fontSize: 19,
  },
  logOutBtn: {
    flexDirection: "row",
    margin: 13,
    width: 85,
    height: 35,
    // borderColor: COLORS.primary,
    borderRadius: 10,
    // backgroundColor: COLORS.primary
  },
  logOutText: {
    fontWeight: "bold",
    paddingTop: 4,
    marginLeft: 9,
    fontSize: 16,
    color: COLORS.primary,
  },
  mainPrimaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  primaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 6,
  },
  rowText: {
    color: COLORS.textTitle,
    fontSize: 17,
    fontWeight: "700",
    marginHorizontal: 10,
    marginRight: 13,
  },
  titleText: {
    color: "#09244B",
    fontFamily: "Montserrat",
    fontSize: 24,
    fontWeight: "600",
    marginBottom: 4,
  },
  rowHeadingText: {
    color: "#8491A5",
    fontFamily: "Montserrat",
    fontSize: 17,
    fontWeight: "500",
  },
  collapseUp: {
    marginHorizontal: 5,
    marginTop: 4,
  },
  collapseDown: {
    marginHorizontal: 5,
    marginTop: 6,
  },
  fullScreen: {
    marginHorizontal: 10,
  },
  flatListView: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 9,
    backgroundColor: COLORS.white,
    shadowColor: COLORS.black,
    marginVertical: 5,
    marginHorizontal: 16,
    paddingHorizontal: 10,
  },
  secondryDashIcon: {
    flex: 0.5,
    resizeMode: "contain",
    height: DeviceType == "Tablet" ? 40 : 30,
    width: DeviceType == "Tablet" ? 45 : 25,
    marginHorizontal: 7,
    marginVertical: 3,
  },
  flatlistItemContainer: {
    width: "50%",
    shadowColor: "black",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3.84,
    elevation: 2,
  },
  flatlistItemContainer1: {
    width: "100%",
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3.84,
    elevation: 2,
    alignSelf: "flex-end",
  },
  secondryDashView: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: DeviceType == "Tablet" ? 15 : 25,
    paddingVertical: DeviceType == "Tablet" ? 65 : 28,
    marginVertical: DeviceType == "Tablet" ? 15 : 7,
    marginHorizontal: DeviceType == "Tablet" ? 15 : 10,
    borderRadius: 16,
    borderColor: "#E3E9ED",
    borderWidth: 2,
  },
  secondryDashView1: {
    flex: 1,
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: DeviceType == "Tablet" ? 15 : 25,
    paddingVertical: DeviceType == "Tablet" ? 65 : 28,
    marginVertical: DeviceType == "Tablet" ? 15 : 7,
    marginHorizontal: DeviceType == "Tablet" ? 15 : 10,
    borderRadius: 16,
    borderColor: "#E3E9ED",
    borderWidth: 2,
    width: "45%",
  },
  itemLabelText: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.black,
    fontFamily: "Inter",
    textAlign: "center",
  },
  dailyReportContainer: {
    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.17,
    shadowRadius: 2.54,
    elevation: 3,
  },
  iconContainer: {
    borderRadius: 5,
  },
});

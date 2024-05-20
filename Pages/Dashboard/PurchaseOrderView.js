import {
    StyleSheet,
    Text,
    View,
    ScrollView,
    Alert, 
    TouchableOpacity,
    Pressable,
    Modal,

  } from 'react-native';
  import React, {useState, useEffect} from 'react';
  import {useDispatch, useSelector} from 'react-redux';
  import GlobalDataBox from '../../Resources/GlobalDataBox';
  import DateTimePicker from '@react-native-community/datetimepicker';
  import { COLORS } from '../../Resources/GlobalStyles';
  import { getTranWiseSummary } from '../../Redux/Transaction/TransactionAction';
  import Fontisto from 'react-native-vector-icons/Fontisto';
  import { TranSliceActions } from '../../Redux/Transaction/TransactionSlice';
import { isDateValid } from '../../Resources/Resources';
  
  
  export default function PurchaseOrderView() {
    const dispatch = useDispatch();
    const purchaseOrderReport = useSelector(
      state => state.transactionSlice?.purchaseReport?.purchaseOrderReports,
    );
    const purchaseInvoiceReport = useSelector(
      state => state.transactionSlice?.purchaseReport?.purchaseInvoiceReports,
    );
    const purchaseChallanReport = useSelector(
      state => state.transactionSlice?.purchaseReport?.purchaseChallanReports,
    );


    const fromDateTextRedux = useSelector(state => state.transactionSlice.fromDatePur);
    const toDateTextRedux = useSelector(state => state.transactionSlice.toDatePur);

  // const [modalVisible, setModalVisible] = useState(false);
  const [showPickerFrom, setShowPickerFrom] = useState(false);
  const [showPickerTo, setShowPickerTo] = useState(false);
  const [fromDate, setFromDate] = useState(new Date());
  const [toDate, setToDate] = useState(new Date());
  const [fromDateText, setFromDateText] = useState('');
  const [toDateText, setToDateText] = useState('');
  const [press, setPress] = useState(0);

  const formatDate = (date) => {
      let day = date.getDate().toString().padStart(2, '0');
      let month = (date.getMonth() + 1).toString().padStart(2, '0');
      let year = date.getFullYear();
      let formattedDate = `${day}-${month}-${year}`;
      // console.log(formattedDate);
      return formattedDate;
  }

  const onChangeDate1 = (event, selectedDate) => {
    const currentDate = selectedDate || fromDate;
    setShowPickerFrom(false);
    if(isDateValid(currentDate)){
      setFromDate(currentDate);
      setFromDateText(formatDate(currentDate));
    }
  
  };

  const onChangeDate2 = (event, selectedDate) => {
    const currentDate = selectedDate || toDate;
    setShowPickerTo(false);
    if(isDateValid(currentDate)){
      setToDate(currentDate);
      setToDateText(formatDate(currentDate));
    }
  };

    useEffect(() => {
      setFromDateText(formatDate(fromDateTextRedux))
      setToDateText(formatDate(toDateTextRedux))
    }, [fromDateTextRedux, toDateTextRedux])
  
    useEffect(() => {
      dispatch(getTranWiseSummary ('PORD'));
      dispatch(getTranWiseSummary('PINV'));
      dispatch(getTranWiseSummary('PPSL'));
    }, [press]);
  
    return (
      <View style={styles.mainContainer}>
        {/* <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={{textAlign: 'center', marginBottom: 25, fontSize: 20, color: COLORS.primary, fontWeight: 'bold'}}>Select Date</Text>
            <View style={{ flexDirection: 'row', marginBottom: 15 }}>
                <Text style={styles.modalText}>From</Text>
                <TouchableOpacity
                style={{ borderWidth: 0.5, borderColor: COLORS.primary, borderRadius: 5, paddingHorizontal: 5, marginLeft: 15 }}
                onPress={() => setShowPickerFrom(true)}
                >
                <Text style={{marginTop: 5, color: COLORS.primary}}>{fromDateText || formatDate(new Date())}</Text>
                </TouchableOpacity>

                {showPickerFrom &&
                <DateTimePicker
                    testID="dateTimePicker1"
                    value={fromDate}
                    mode={'date'}
                    is24Hour={false}
                    onChange={onChangeDate1}
                />}
            </View>
            <View style={{ flexDirection: 'row', marginBottom: 30 }}>
                <Text style={styles.modalText}>To</Text>
                <TouchableOpacity
                    style={{ borderWidth: 0.5, borderColor: COLORS.primary, borderRadius: 5, paddingHorizontal: 5, marginLeft: 38 }}
                    onPress={() => setShowPickerTo(true)}
                >
                    <Text style={{marginTop: 5, color: COLORS.primary}}>{toDateText || formatDate(new Date())}</Text>
                </TouchableOpacity>

                {showPickerTo &&
                    <DateTimePicker
                        testID="dateTimePicker2"
                        value={toDate}
                        mode={'date'}
                        is24Hour={false}
                        onChange={onChangeDate2}
                    />
                }
            </View>
            <Pressable
              style={[styles.button, styles.buttonClose]}
              onPress={() => {
                        dispatch(TranSliceActions.setFromDate(fromDate));
                        dispatch(TranSliceActions.setToDate(toDate));
                        dispatch(TranSliceActions.setPurchaseReport({Data: null, tranAlias: 'PINV'}));
                        dispatch(TranSliceActions.setPurchaseReport({Data: null, tranAlias: 'PORD'}));
                        dispatch(TranSliceActions.setPurchaseReport({Data: null, tranAlias: 'PPSL'}));
                        setPress(press + 1);
                        setModalVisible(!modalVisible);
                }}>
              <Text style={styles.textStyle}>Proceed</Text>
            </Pressable>
          </View>
        </View>
      </Modal> */}
                  <View style={styles.dateContainer}>
                {/* <TouchableOpacity 
                    style={{marginVertical: 15, marginRight: 20}}
                    onPress={()=>setModalVisible(!modalVisible)}
                >
                    <Fontisto name={'date'} size={22} color={COLORS.primary}/>
                </TouchableOpacity> */}
                {/* <View style={{marginHorizontal: 10, marginVertical: 5}}>
                    <Text style={{fontSize: 16, fontWeight: 'bold', color: COLORS.primary}}>Date range</Text>
                </View> */}
                <View style={{flexDirection: 'row', marginLeft: 10, marginVertical: 10}}>
                <TouchableOpacity 
                    style={{flexDirection: 'row', borderWidth: 0.8, width: '33%', borderRadius: 5, borderColor: COLORS.primary}}
                    onPress={() => setShowPickerFrom(true)}
                >
                <Fontisto name={'date'} size={14} color={COLORS.black} style={{alignSelf: 'center', marginHorizontal: 10}}/>
                    <Text style={{alignSelf: 'center', color: COLORS.primary, fontWeight: 'bold'}}>{fromDateText || formatDate(new Date())}</Text>
                </TouchableOpacity>
                {showPickerFrom &&
                <DateTimePicker
                    testID="dateTimePicker1"
                    value={fromDateTextRedux}
                    mode={'date'}
                    is24Hour={false}
                    onChange={onChangeDate1}
                />}
                <Text style={{alignSelf: 'center', color: COLORS.black}}>  --  </Text>
                <TouchableOpacity 
                    style={{flexDirection: 'row', borderWidth: 0.8, width: '33%', borderRadius: 5, borderColor: COLORS.primary}}
                    onPress={() => setShowPickerTo(true)}
                >
                <Fontisto name={'date'} size={14} color={COLORS.black} style={{alignSelf: 'center', marginHorizontal: 10}}/>
                    <Text style={{alignSelf: 'center', color: COLORS.primary, fontWeight: 'bold'}}>{toDateText || formatDate(new Date())}</Text>
                </TouchableOpacity>
                {showPickerTo &&
                    <DateTimePicker
                        testID="dateTimePicker2"
                        value={toDateTextRedux}
                        mode={'date'}
                        is24Hour={false}
                        onChange={onChangeDate2}
                    />
                }
                <View style={{flex: 1}}>
                <TouchableOpacity
              style={styles.button}
              onPress={() => {
                  dispatch(TranSliceActions.setFromDatePur(fromDate));
                  dispatch(TranSliceActions.setToDatePur(toDate));
                  dispatch(TranSliceActions.setPurchaseReport({Data: null, tranAlias: 'PINV'}));
                  dispatch(TranSliceActions.setPurchaseReport({Data: null, tranAlias: 'PORD'}));
                  dispatch(TranSliceActions.setPurchaseReport({Data: null, tranAlias: 'PPSL'}));
                  setPress(press + 1);
                        // setModalVisible(!modalVisible);
                }}>
              <Text style={styles.textStyle}>View</Text>
            </TouchableOpacity>
            </View>
                </View>
            </View>
        <ScrollView style={{marginBottom: 60}}>
          <GlobalDataBox title={'Purchase Invoice'} data={purchaseInvoiceReport} />
          <GlobalDataBox title={'Purchase Order'} data={purchaseOrderReport} />
          <GlobalDataBox title={'Purchase Challan'} data={purchaseChallanReport} />
        </ScrollView>
      </View>
    );
  }
  
  const styles = StyleSheet.create({
    mainContainer: {
      flex: 1,
      backgroundColor: COLORS.white
    },
    // centeredView: {
    //   flex: 1,
    //   justifyContent: 'center',
    //   alignItems: 'center',
    //   backgroundColor: COLORS.modalBackground,
    // },
    // modalView: {
    //   // margin: 20,
    //   backgroundColor: COLORS.white,
    //   borderRadius: 20,
    //   padding: 30,
    //   paddingHorizontal: 50,
    //   // alignItems: 'center',
    //   shadowColor: '#000',
    //   shadowOffset: {
    //     width: 0,
    //     height: 2,
    //   },
    //   shadowOpacity: 0.25,
    //   shadowRadius: 4,
    //   elevation: 5,
    // },
    dateContainer: {
      backgroundColor: COLORS.white,
      borderColor: COLORS.white,
      shadowOffset: {
          width: 1,
          height: 1,
        },
        shadowOpacity:  0.17,
        shadowRadius: 3.05,
      //   alignSelf: 'center'
  },
    button: {
      borderRadius: 10,
      padding: 10,
      paddingHorizontal: 18,
      elevation: 2,
      backgroundColor: COLORS.primary,
      alignSelf: 'flex-end',
      marginHorizontal: 10,
    },
    textStyle: {
      color: 'white',
      fontWeight: 'bold',
      textAlign: 'center',
    },
    modalText: {
      marginBottom: 15,
      textAlign: 'center',
      fontSize: 18,
      fontWeight: '600',
      color: COLORS.primary,
  
    },

  });
  
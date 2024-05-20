import { ScrollView, StyleSheet, Text, TextInput, View, TouchableOpacity, Alert, Modal, Pressable, DatePickerAndroid} from 'react-native'
import React, {useState, useEffect} from 'react'
import { useDispatch, useSelector } from 'react-redux'
import DateTimePicker from '@react-native-community/datetimepicker';
import Fontisto from 'react-native-vector-icons/Fontisto';
import { getExpiryStock, getExcessStock, getNonMovingStock, getSaleBelowCostRate, getExcessDiscount, getRateDifference, getExcessScheme} from '../../Redux/Common/CommonAction';
import { COLORS } from '../../Resources/GlobalStyles';
import { isDateValid } from '../../Resources/Resources';
import DataBox from '../../Resources/DataBox';
import FlatListBox from '../../Resources/FlatListBox';
import { CommonSliceActions } from '../../Redux/Common/CommonSlice';

const Inventory = ({navigation}) => {
    const dispatch = useDispatch();

    const [state, setState] = useState(
        {
            isExpiryLoading: false,
            isExcessStockLoading: false,
            isNonMovingLoading: false,
            isSbcrLoading: false,
            sbcrLength: 0,
            isExcessDisLoading: false,
            excessDisLength: 0,
            isRateDiffLoading: false,
            rateDiffLength: 0,
            isExcessSchLoading: false,
            excessSchLength: 0,
        }
    )

    // const [modalVisible, setModalVisible] = useState(false);
    // console.log("SetState---->>>>", state?.rateDiffLength)

    const expiryStock = useSelector(state => state.commonSlice?.Inventory?.expiryStock);
    const excessStock = useSelector(state => state.commonSlice?.Inventory?.excessStock);
    const nonMovingStock = useSelector(state => state.commonSlice?.Inventory?.nonMovingStock);
    const saleBelowCostRate = useSelector(state => state.commonSlice?.Inventory?.saleBelowCostRate);
    const excessDiscount = useSelector(state => state.commonSlice?.Inventory?.excessDiscount);
    const rateDifference = useSelector(state => state.commonSlice?.Inventory?.rateDifference);
    const excessScheme = useSelector(state => state.commonSlice?.Inventory?.excessScheme);
        
    const fromDateTextRedux = useSelector(state => state.commonSlice.fromDate);
    const toDateTextRedux = useSelector(state => state.commonSlice.toDate);
    const fromDateTextReduxExpiry = useSelector(state => state.commonSlice.fromDateExpiry);
    const toDateTextReduxExpiry = useSelector(state => state.commonSlice.toDateExpiry);


    const [showPickerFrom, setShowPickerFrom] = useState(false);
    const [showPickerTo, setShowPickerTo] = useState(false);
    const [showPickerFromExpiry, setShowPickerFromExpiry] = useState(false);
    const [showPickerToExpiry, setShowPickerToExpiry] = useState(false);
    const [fromDate, setFromDate] = useState(new Date());
    const [toDate, setToDate] = useState(new Date());
    const [fromDateExpiry, setFromDateExpiry] = useState(new Date());
    const [toDateExpiry, setToDateExpiry] = useState(new Date());
    const [fromDateText, setFromDateText] = useState('');
    const [toDateText, setToDateText] = useState('');
    const [fromDateTextExpiry, setFromDateTextExpiry] = useState('');
    const [toDateTextExpiry, setToDateTextExpiry] = useState('');
    const [press, setPress] = useState(0);
  
    const formatDate = (date) => {
        let formattedDate;
        if(date){
            let day = date.getDate().toString().padStart(2, '0');
            let month = (date.getMonth() + 1).toString().padStart(2, '0');
            let year = date.getFullYear();
            formattedDate = `${day}-${month}-${year}`;
            
        }
        else{
            formattedDate = null;
        }

        return formattedDate;
        
    }

    const onChangeDate1 = (event, selectedDate) => {
      const currentDate = selectedDate || fromDate;
      setShowPickerFrom(false);
      if(isDateValid(currentDate)) {
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

    const onChangeDate3 = (event, selectedDate) => {
      const currentDate = selectedDate || fromDateExpiry ;
      setShowPickerFromExpiry(false);
      if(isDateValid(currentDate)) {
          setFromDateExpiry(currentDate);
          setFromDateTextExpiry(currentDate ? formatDate(currentDate) : null);
      }
    };
  
    const onChangeDate4 = (event, selectedDate) => {
      const currentDate = selectedDate || toDateExpiry;
      setShowPickerToExpiry(false);
      if(isDateValid(currentDate)){
          setToDateExpiry(currentDate);
          setToDateTextExpiry(formatDate(currentDate));
      }
    };

    useEffect(() => {
        setFromDateText(formatDate(fromDateTextRedux))
        setToDateText(formatDate(toDateTextRedux))
      }, [fromDateTextRedux, toDateTextRedux])

    useEffect(() => {
        setFromDateTextExpiry(formatDate(fromDateTextReduxExpiry))
        setToDateTextExpiry(formatDate(toDateTextReduxExpiry))
      }, [fromDateTextReduxExpiry, toDateTextReduxExpiry])

    useEffect(() => {

        setState((prevState => ({...prevState, isExpiryLoading: true})));
        dispatch(getExpiryStock()).then((response)=> {
            setState((prevState => ({...prevState, isExpiryLoading: false})));
        });

        setState((prevState => ({...prevState, isExcessStockLoading: true})));
        dispatch(getExcessStock()).then((response)=>{
            setState((prevState => ({...prevState, isExcessStockLoading: false})));
        });

        setState((prevState => ({...prevState, isNonMovingLoading: true})));
        dispatch(getNonMovingStock()).then((response)=>{
            setState((prevState => ({...prevState, isNonMovingLoading: false})));
        });

        setState((prevState => ({...prevState, isSbcrLoading: true})));
        dispatch(getSaleBelowCostRate()).then((response)=>{
            // console.log("Response: ", response.data)
            setState((prevState => ({...prevState, isSbcrLoading: false})));
            if(response?.data?.length){
                // console.log("Sbrc length--->>>", response?.data?.length)
                setState((prevState => ({...prevState, sbcrLength: response?.data?.length})));
            }
            else{
                setState((prevState => ({...prevState, sbcrLength: 0})));
            }
        });

        setState((prevState => ({...prevState, isExcessDisLoading: true})));
        dispatch(getExcessDiscount()).then((response)=>{
            setState((prevState => ({...prevState, isExcessDisLoading: false})));
            if(response?.data?.length){
                setState((prevState => ({...prevState, excessDisLength: response?.data?.length})));
            }
            else{
                setState((prevState => ({...prevState, excessDisLength: 0})));
            }
        });

        setState((prevState => ({...prevState, isRateDiffLoading: true})));
        dispatch(getRateDifference()).then((response)=>{
            // console.log("Response rateDiff2", response.data);
            setState((prevState => ({...prevState, isRateDiffLoading: false})));
            if(response?.data?.length){
                setState((prevState => ({...prevState, rateDiffLength: response?.data?.length})));
            }
            else{
                setState((prevState => ({...prevState, rateDiffLength: 0})));
            }
        });

        setState((prevState => ({...prevState, isExcessSchLoading: true})));
        dispatch(getExcessScheme()).then((response)=>{
            setState((prevState => ({...prevState, isExcessSchLoading: false})));
            if(response?.data?.length){
                setState((prevState => ({...prevState, excessSchLength: response?.data?.length})));
            }
            else{
                setState((prevState => ({...prevState, excessSchLength: 0})));
            }
        });
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
                        dispatch(CommonSliceActions.setFromDate(fromDate));
                        dispatch(CommonSliceActions.setToDate(toDate));
                        dispatch(CommonSliceActions.setExpiryStock(null));
                        dispatch(CommonSliceActions.setExcessStock(null));
                        dispatch(CommonSliceActions.setNonMovingStock(null));
                        dispatch(CommonSliceActions.setSaleBelowCostRate([]));
                        dispatch(CommonSliceActions.setExcessDiscount([]));
                        dispatch(CommonSliceActions.setRateDifference([]));
                        dispatch(CommonSliceActions.setExcessScheme([]));
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
                {/* <View style={{marginHorizontal: 8, marginVertical: 5}}>
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
                        dispatch(CommonSliceActions.setFromDate(fromDate));
                        dispatch(CommonSliceActions.setToDate(toDate));
                        dispatch(CommonSliceActions.setExpiryStock(null));
                        dispatch(CommonSliceActions.setExcessStock(null));
                        dispatch(CommonSliceActions.setNonMovingStock(null));
                        dispatch(CommonSliceActions.setSaleBelowCostRate([]));
                        dispatch(CommonSliceActions.setExcessDiscount([]));
                        dispatch(CommonSliceActions.setRateDifference([]));
                        dispatch(CommonSliceActions.setExcessScheme([]));
                        setPress(press + 1);
                        // setModalVisible(!modalVisible);
                }}>
              <Text style={styles.textStyle}>View</Text>
            </TouchableOpacity>
            </View>
                </View>
            </View>
           
        <ScrollView nestedScrollEnabled>
            <DataBox title={'Excess Stock'} data={excessStock} InvOrAcc={'Inventory'} />
            <DataBox title={'Non-Moving Stock'} data={nonMovingStock} InvOrAcc={'Inventory'} />
            <FlatListBox title={'Sale Below Cost Rate'} data={saleBelowCostRate?.[0]} route='salesBelowCostRate' fullData={saleBelowCostRate} choice='sbcr' dataLength={state.sbcrLength} dataLoading={state.isSbcrLoading}/>
            <FlatListBox title={'Excess Discount'} data={excessDiscount?.[0]} route='excessDiscount' fullData={excessDiscount} choice='excDis' dataLength={state.excessDisLength} dataLoading={state.isExcessDisLoading}/>
            <FlatListBox title={'Rate Difference'} data={rateDifference?.[0]} route='rateDifference' fullData={rateDifference} choice='rateDiff' dataLength={state.rateDiffLength} dataLoading={state.isRateDiffLoading}/>
            <FlatListBox title={'Excess Scheme'} data={excessScheme?.[0]} route='excessScheme' fullData={excessScheme} choice='excSch' dataLength={state.excessSchLength} dataLoading={state.isExcessSchLoading}/>
            
            <View style={{...styles.dateContainer, marginTop: 20}}>
                {/* <TouchableOpacity 
                    style={{marginVertical: 15, marginRight: 20}}
                    onPress={()=>setModalVisible(!modalVisible)}
                >
                    <Fontisto name={'date'} size={22} color={COLORS.primary}/>
                </TouchableOpacity> */}
                {/* <View style={{marginHorizontal: 8, marginVertical: 5}}>
                    <Text style={{fontSize: 16, fontWeight: 'bold', color: COLORS.primary}}>Date range</Text>
                </View> */}
                <View style={{flexDirection: 'row', marginLeft: 10, marginVertical: 10}}>
                <TouchableOpacity 
                    style={{flexDirection: 'row', borderWidth: 0.8, width: '33%', borderRadius: 5, borderColor: COLORS.primary}}
                    onPress={() => setShowPickerFromExpiry(true)}
                >
                <Fontisto name={'date'} size={14} color={COLORS.black} style={{alignSelf: 'center', marginHorizontal: 10}}/>
                    <Text style={{alignSelf: 'center', color: COLORS.primary, fontWeight: 'bold'}}>{fromDateTextExpiry}</Text>
                </TouchableOpacity>
                {showPickerFromExpiry &&
                <DateTimePicker
                    testID="dateTimePicker3"
                    value={fromDateTextReduxExpiry || new Date(Date.now())}
                    mode={'date'}
                    is24Hour={false}
                    onChange={onChangeDate3}
                />}
                <Text style={{alignSelf: 'center', color: COLORS.black}}>  --  </Text>
                <TouchableOpacity 
                    style={{flexDirection: 'row', borderWidth: 0.8, width: '33%', borderRadius: 5, borderColor: COLORS.primary}}
                    onPress={() => setShowPickerToExpiry(true)}
                >
                <Fontisto name={'date'} size={14} color={COLORS.black} style={{alignSelf: 'center', marginHorizontal: 10}}/>
                    <Text style={{alignSelf: 'center', color: COLORS.primary, fontWeight: 'bold'}}>{toDateTextExpiry || formatDate(new Date())}</Text>
                </TouchableOpacity>
                {showPickerToExpiry &&
                    <DateTimePicker
                        testID="dateTimePicker4"
                        value={toDateTextReduxExpiry}
                        mode={'date'}
                        is24Hour={false}
                        onChange={onChangeDate4}
                    />
                }
                <View style={{flex: 1}}>
                <TouchableOpacity
              style={styles.button}
              onPress={() => {
                        dispatch(CommonSliceActions.setFromDateExpiry(fromDateExpiry));
                        dispatch(CommonSliceActions.setToDateExpiry(toDateExpiry));
                        dispatch(CommonSliceActions.setExpiryStock(null));
                        setPress(press + 1);
                        // setModalVisible(!modalVisible);
                }}>
              <Text style={styles.textStyle}>View</Text>
            </TouchableOpacity>
            </View>
                </View>
            </View>
            <DataBox title={'Expiry Stock'} data={expiryStock} InvOrAcc={'Inventory'} />
      </ScrollView>
    </View>
  );
}

export default Inventory

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: COLORS.white,
    },
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
    title: {
        textAlign: 'center',
        fontSize: 20,
        fontWeight: '500',
        marginVertical: 15,
        marginLeft: 5,
        color: '#1F2C37',
    },

    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: COLORS.modalBackground,
      },
      modalView: {
        // margin: 20,
        backgroundColor: COLORS.white,
        borderRadius: 20,
        padding: 30,
        paddingHorizontal: 50,
        // alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
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
})
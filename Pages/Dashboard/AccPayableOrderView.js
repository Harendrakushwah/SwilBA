import { StyleSheet, Text, View, SafeAreaView, TouchableOpacity, ActivityIndicator, FlatList} from 'react-native'
import React, {useState, useEffect, useLayoutEffect} from 'react'
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import MIcon from 'react-native-vector-icons/MaterialIcons';
import MCIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import { CommonSliceActions } from '../../Redux/Common/CommonSlice';
import { getSinglePayableData } from '../../Redux/Common/CommonAction';
import { COLORS, DeviceType } from '../../Resources/GlobalStyles';
import ActionButton from '../../GlobalComponents/ActionButton';

const AccPayableOrderView = ({route}) => {
    const dispatch = useDispatch();
    const navigation = useNavigation();

    const data = route?.params?.data;
    // console.log("data----->>>", data);
    dispatch(CommonSliceActions.setHeaderData(data?.Account))

    const fullReportData = useSelector(state => state?.commonSlice?.Accounts?.customerPayableData);
    const reportData = fullReportData?.slice(0, -1);
    const totalAmt = fullReportData?.slice(-1)?.[0];
    const [autoAdjust, setAutoAdjust] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    
  useEffect(() => {
    setIsLoading(true);
    dispatch(getSinglePayableData(data, autoAdjust)).then((response)=>{
      setIsLoading(false);
    })
  }, [data, autoAdjust]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: `Settings`,
      headerLeft: () => (
        <>
          <ActionButton
            onPress={() => navigation.goBack()}
            icon={<MCIcon name="arrow-left" size={24} color={COLORS.white} />}
            android_ripple={COLORS.primaryDark}
            style={{ borderRadius: 1000, marginRight: 10 }}
          />
        </>
      ),
    });
  }, []);

  const headerComponent = () => {
    return (
      <View style={{...styles.headerView, ...styles.headerFooterView}}>
        <View style={{...styles.headerChild, flex: 0.2}}>
          <Text style={{...styles.headerLabeltext}}>Transaction</Text>
        </View>
        <View style={{...styles.headerChild, flex: 0.2}}>
          <Text style={{...styles.headerLabeltext}}>Invoice No. / Date</Text>
        </View>
        <View style={{flex: 0.6, flexDirection: 'row'}}>
          <View style={{...styles.headerChild, flex: 0.25}}>
            <Text style={{...styles.headerLabeltext}}>Net Amt.</Text>
          </View>

          <View style={{...styles.headerChild, flex: 0.25}}>
            <Text style={{...styles.headerLabeltext}}>Due Amt.</Text>
          </View>

          <View style={{...styles.headerChild, flex: 0.25}}>
            <Text style={{...styles.headerLabeltext}}>PDC Amt.</Text>
          </View>

          <View style={{...styles.headerChild, flex: 0.25}}>
            <Text style={{...styles.headerLabeltext}}>Due Date</Text>
          </View>
        </View>
      </View>
    );
  };

  const dateFormatter = inputDate => {
    const date = new Date(inputDate);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Adding 1 because months are 0-based
    const year = date.getFullYear();

    const formattedDate = `${day}/${month}/${year}`;
    return formattedDate;
  };


  return (
    <SafeAreaView style={styles.mainContainer}>
    {!isLoading ? (
      <>
        <View style={styles.titleView}>
          <Text style={styles.titleText}>Payables Report</Text>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <TouchableOpacity onPress={() => setAutoAdjust(!autoAdjust)}>
              <MIcon
                name={autoAdjust ? 'check-box' : 'check-box-outline-blank'}
                color={COLORS.primary}
                size={24}
                style={{margin: 2}}
              />
            </TouchableOpacity>
            <Text
              style={{
                fontWeight: 'bold',
                fontSize: 18,
                color: COLORS.blackText,
              }}>
              Auto Adjust
            </Text>
          </View>
        </View>
        {reportData?.length ? (
          <>
            <View style={styles.secondryMainContainer}>
              <View style={{flex: 0.92, flexDirection: 'row'}}>
                <FlatList
                  style={{flex: 1}}
                  data={reportData}
                  showsVerticalScrollIndicator={false}
                  ListHeaderComponent={headerComponent}
                  renderItem={({item}) => (
                    <>
                      <View style={{flex: 1, flexDirection: 'row'}}>
                        <View style={{...styles.itemContainer, flex: 0.2}}>
                          <Text style={styles.itemLabeltext}>
                            {item?.TranName}
                          </Text>
                        </View>

                        <View
                          style={{
                            ...styles.itemContainer,
                            flex: 0.2,
                            borderRightWidth: 1,
                          }}>
                          <Text
                            style={{
                              ...styles.itemLabeltext,
                              marginVertical: 1,
                              padding: 2,
                            }}>
                            {item?.EntryNo}
                          </Text>
                          <Text
                            style={{
                              ...styles.itemLabeltext,
                              marginVertical: 1,
                              padding: 2,
                            }}>
                            {dateFormatter(item?.EntryDate)}
                          </Text>
                        </View>

                        <View style={{flex: 0.6, flexDirection: 'row'}}>
                          <View style={{...styles.secondryChildContainer}}>
                            <Text style={styles.secondryChildLabelText}>
                              {' '}
                              {item?.NetAmt?.toFixed(2)}
                            </Text>
                          </View>

                          <View style={styles.secondryChildContainer}>
                            <Text style={styles.secondryChildLabelText}>
                              {' '}
                              {item?.DueAmt?.toFixed(2)}
                            </Text>
                          </View>

                          <View style={styles.secondryChildContainer}>
                            <Text style={styles.secondryChildLabelText}>
                              {' '}
                              {item?.PDCAmt?.toFixed(2)}
                            </Text>
                          </View>

                          <View style={styles.secondryChildContainer}>
                            <Text style={styles.secondryChildLabelText}>
                              {' '}
                              {dateFormatter(item?.DueDate)}
                            </Text>
                          </View>
                        </View>
                      </View>
                    </>
                  )}
                  stickyHeaderIndices={[0]}
                />
              </View>

              {/* ***** Footer view ******/}

              <View style={{...styles.headerFooterView, flex: 0.08}}>
                <View style={{...styles.headerView}}>
                  <View style={{...styles.headerChild, flex: 0.4}}>
                    <Text style={{...styles.headerLabeltext}}>Total</Text>
                  </View>
                  <View style={{flexDirection: 'row', flex: 0.6}}>
                    <View style={{...styles.headerChild, flex: 0.25}}>
                      <Text
                        style={{
                          ...styles.headerLabeltext,
                          color:
                            totalAmt?.NetAmt >= 0
                              ? COLORS.blackText
                              : COLORS.redError,
                          fontWeight: 'bold',
                        }}>
                        {totalAmt?.NetAmt?.toFixed(2)}
                      </Text>
                    </View>
                    <View style={{...styles.headerChild, flex: 0.25}}>
                      <Text
                        style={{
                          ...styles.headerLabeltext,
                          color:
                            totalAmt?.DueAmt >= 0
                              ? COLORS.blackText
                              : COLORS.redError,
                          fontWeight: 'bold',
                        }}>
                        {totalAmt?.DueAmt?.toFixed(2)}
                      </Text>
                    </View>
                    <View style={{...styles.headerChild, flex: 0.25}}>
                      <Text
                        style={{
                          ...styles.headerLabeltext,
                          color:
                            totalAmt?.PDCAmt >= 0
                              ? COLORS.blackText
                              : COLORS.redError,
                          fontWeight: 'bold',
                        }}>
                        {totalAmt?.PDCAmt?.toFixed(2)}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            </View>
          </>
        ) : (
          <View
            style={{alignItems: 'center', justifyContent: 'center', flex: 1}}>
              <Text
                style={{
                  fontWeight: '500',
                  fontSize: 18,
                  color: COLORS.primary,
                }}>
                No Reports Available
              </Text>
          </View>
        )}
      </>
    ) : (
      <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
        <ActivityIndicator color={COLORS.primary} size={'large'} />
      </View>
    )}
  </SafeAreaView>
  )
}

export default AccPayableOrderView

const styles = StyleSheet.create({
    mainContainer: {
      flex: 1,
      margin: 4,
    },
    secondryMainContainer: {
      flex: 1,
      borderWidth: 0.5,
      borderRadius: 1,
      borderColor: COLORS.gray,
      shadowColor: '#000000',
      shadowOffset: {
        width: 0,
        height: 3,
      },
      shadowOpacity: 0.17,
      shadowRadius: 3.05,
      elevation: 4,
      backgroundColor: 'white',
    },
    headerFooterView: {
      borderWidth: 0.5,
      borderRadius: 1,
      borderColor: COLORS.gray,
      shadowColor: '#000000',
      shadowOffset: {
        width: 0,
        height: 3,
      },
      shadowOpacity: 0.17,
      shadowRadius: 3.05,
      elevation: 4,
    },
    titleView: {
      margin: 5,
      padding: 4,
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    titleText: {
      fontWeight: 'bold',
      fontSize: 20,
      color: COLORS.blackText,
      textDecorationLine: 'underline',
      letterSpacing: 0.2,
    },
    headerView: {
      flex: 1,
      flexDirection: 'row',
      backgroundColor: COLORS.primaryGradientEnd,
      height: 40,
    },
    headerChild: {
      borderRightWidth: 0.5,
      borderColor: COLORS.grayLight,
      justifyContent: 'center',
    },
    headerLabeltext: {
      fontSize: DeviceType === 'Handset' ? 14 : 16,
      textAlign: 'center',
      margin: 2,
      color: COLORS.blackText,
      fontWeight: '500',
    },
    itemContainer: {
      borderWidth: 0.3,
      borderColor: COLORS.grayLight,
      justifyContent: 'center',
    },
    itemLabeltext: {
      fontWeight: '500',
      marginVertical: 5,
      padding: 5,
      fontSize: DeviceType === 'Handset' ? 14 : 18,
      color: COLORS.blackText,
    },
    secondryChildContainer: {
      borderWidth: 0.3,
      borderColor: COLORS.grayLight,
      justifyContent: 'center',
      flex: 0.25,
    },
    secondryChildLabelText: {
      fontWeight: '500',
      color: COLORS.grayText,
      fontSize: DeviceType === 'Handset' ? 14 : 18,
      textAlign: 'center',
    },
  
  })
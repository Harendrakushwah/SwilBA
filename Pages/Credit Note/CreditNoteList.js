import {
    StyleSheet,
    Text,
    View,
    Alert,
    FlatList,
    ActivityIndicator,
    TouchableOpacity,
  } from "react-native";
  import React, { useState, useEffect, useRef } from "react";
  import { useDispatch, useSelector } from "react-redux";
  import {
    deleteSbcrVJR,
    getCreditNoteList,
  } from "../../Redux/Transaction/TransactionAction";
  import { COLORS } from "../../Resources/GlobalStyles";
  import Swipeable from "react-native-gesture-handler/Swipeable";
  import { GestureHandlerRootView } from "react-native-gesture-handler";
  import MIcon from "react-native-vector-icons/MaterialIcons";
  import IIcon from "react-native-vector-icons/Ionicons";
import { TranSliceActions } from "../../Redux/Transaction/TransactionSlice";
  
  const CreditNoteList = ({ navigation }) => {
    const dispatch = useDispatch();
    const creditNoteList = useSelector(state => state?.transactionSlice?.creditNote?.creditNoteList)
    const [isLoading, setIsLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    
    // console.log("Credit Note List ------", creditNoteList);

    const swipeableRefArray = useRef([]);
    let prevOpenedRow = null;
    const closeRow = (index) => {
      /* Close if there exist a previous row and is different from currently opened row */
      if (prevOpenedRow && prevOpenedRow !== swipeableRefArray.current[index]) {
        prevOpenedRow.close();
      }
      /* Assign currently opened row to previous opened row */
      prevOpenedRow = swipeableRefArray.current[index];
    };
  
    const LeftSwipeActions = () => {
      return (
        <View style={styles.swipeLeftAction}>
          <MIcon name="delete" size={32} color={COLORS.white} />
        </View>
      );
    };
    const rightSwipeActions = (index) => {
      return (
        <View style={styles.swipeRightAction}>
          <MIcon name="edit" size={32} color={COLORS.white} />
        </View>
      );
    };
    const editDetails = (item, index) => {
      Alert.alert(null, "Edit Details ?", [
        {
          text: "Cancel",
          onPress: () => {
            swipeableRefArray.current[index]?.close();
          },
        },
        {
          text: "Yes",
          onPress: () => {
            dispatch(TranSliceActions.setEmptyLastAddedProductAndCustomer());
            dispatch(TranSliceActions.emptyCart());
            dispatch(TranSliceActions.setPaymentOptionEnabled(false));
            navigation.navigate("editcreditNote", { data: item });
            swipeableRefArray.current[index]?.close();
          },
        },
      ]);
    };
    const deleteDetails = (item, index) => {
      // console.log("Item-----", item);
      Alert.alert(null, "Delete Details ?", [
        {
          text: "Cancel",
          onPress: () => {
            swipeableRefArray.current[index].close();
          },
        },
        {
          text: "Yes",
          onPress: () => {
            swipeableRefArray.current[index]?.close();
            setIsLoading(true);
            dispatch(deleteSbcrVJR(item, 'SCRN')).then((res) => {
              if (res.isSuccessful) {
                dispatch(getCreditNoteList()).then((response) => {
                  if(response.isSuccessful) {
                    setIsLoading(false);
                  }
                });
                if(res.response.Response){
                  Alert.alert(res.response.Response);
                }
                else{
                  Alert.alert(`Credit Note`, 
                  `Deleted Successfully!`);
                }
              } else{
                Alert.alert("Error !", `Message: ${res.response}`);
                setIsLoading(false);
              }
            });
          },
        },
      ]);
    };
  
    useEffect(() => {
      setIsLoading(true);
      dispatch(getCreditNoteList()).then((res) => {
        if (res.isSuccessful) {
          setIsLoading(false);
          setRefreshing(false);
        } else {
          setIsLoading(false);
          setRefreshing(false);
          Alert.alert("Error !", `Message: ${res.response}`);
        }
  
      });
    }, [refreshing]);
  
    const formattedDate = (date)=>{
      const today = new Date(date);
      const yyyy = today.getFullYear();
      let mm = today.getMonth() + 1; // Months start at 0!
      let dd = today.getDate();
      
      if (dd < 10) dd = '0' + dd;
      if (mm < 10) mm = '0' + mm;
      var formattedToday ;
      return  formattedToday = dd + '/' + mm + '/' + yyyy;
      
    }
    return (
      <View style={styles.mainContainer}>
        <GestureHandlerRootView style={{flex: 1}}>
          {isLoading ? (
            <View style={styles.loaderView}>
            <ActivityIndicator size={"large"} color={COLORS.primary} />
            </View>
          ) : 
          
          (creditNoteList?.length>0) ?
          (
            <>
            <FlatList
              
              data={creditNoteList}
              renderItem={({ item, index }) => {
                return (
                  <>
                    <Swipeable
                      ref={(ref) => (swipeableRefArray.current[index] = ref)}
                      renderLeftActions={LeftSwipeActions}
                      renderRightActions={rightSwipeActions}
                      onSwipeableWillOpen={() => closeRow(index)}
                      onSwipeableOpen={(direction) => {
                        direction === "right"
                          ? editDetails(item, index)
                          : deleteDetails(item, index);
                      }}
                    >
                      <View style={styles.itemContainer}>
                        <TouchableOpacity
                          onPress={() => navigation.navigate('creditnoteview', {data: item})}
                        >
                          <View style={styles.primaryContainer}>
                              <Text style={{...styles.titleTextLabel, color: COLORS.primary, fontSize: 17}}>{(item?.Party)?.trim()}</Text>
                          </View>
                          <View style={styles.primaryContainer}>
                            <View style={{ flexDirection: "row", flex: 5 }}>
                              <Text style={styles.titleTextLabel}>
                                Entry No :{" "}
                              </Text>
                              <Text style={styles.titleTextValue}>
                                {item?.Series}
                              </Text>
  
                              <Text style={styles.titleTextValue}>
                                {item?.EntryNo}
                              </Text>
                            </View>
                            <View
                              style={{
                                flexDirection: "row",
                                alignItems: "center",
                                justifyContent: "center",
                              }}
                            >
                              <IIcon
                                name="calendar-outline"
                                size={18}
                                color={COLORS.primary}
                              />
                              <Text
                                style={{
                                  ...styles.titleTextValue,
                                  textAlign: "right",
                                }}
                              >
                                {" "}
                                {formattedDate(item?.EntryDate)}
                              </Text>
                            </View>
                          </View>
                          <View style={styles.primaryContainer}>
                            <View style={{ flex: 5, flexDirection: "row" }}>
                              <Text style={styles.titleTextLabel}>Amount :</Text>
                              <Text style={styles.titleTextValue}>
                                {" "}
                                {"\u20B9"} {item?.NetAmt?.toFixed(2)}{" "}
                              </Text>
                            </View>
                          </View>
                          {item?.Remarks ? 
                            <View
                            style={{
                              flexDirection: "row",
                            }}
                          >
                            <Text
                              style={{
                                ...styles.titleTextLabel,
                                marginLeft: 4,
                              }}
                            >
                              Remarks :{" "}
                            </Text>
                            <Text
                              numberOfLines={2} 
                              ellipsizeMode='tail'
                              style={{
                                ...styles.titleTextValue,
                                textAlign: "left",
                                flex: 1,
                              }}
                            >
                              {item?.Remarks || 'N/A'}
                            </Text>
                          </View>
                          : null}
                            
                        </TouchableOpacity>
                      </View>
                    </Swipeable>
                  </>
                );
              }}
              refreshing={refreshing}
              onRefresh={() => setRefreshing(true)}
            />
            </>
          )
        :
        <View style={{height: '100%', alignItems: 'center', justifyContent: 'center'}}>
          <View>
            <Text style={{fontSize: 19, color: COLORS.primary, fontWeight: '500'}}>No data found</Text>
          </View>
        </View>
        }

        <View style={styles.plusBtn}>
          <TouchableOpacity 
            onPress={() => {
              navigation.navigate('creditNote')
            }}
          >
            <MIcon name="add" size={36} color={COLORS.black}/>
          </TouchableOpacity>
      </View>
        </GestureHandlerRootView>
      </View>
    );
  };
  
  export default CreditNoteList;
  
  const styles = StyleSheet.create({
    mainContainer: {
      flex: 1,
      marginTop: 5,
      marginBottom: 10,
    },
    loaderView: {
      alignItems: "center",
      justifyContent: "center",
      height: "100%",
    },
    itemContainer: {
      flex: 1,
      borderRadius: 6,
      borderWidth: 0.5,
      backgroundColor: "white",
      borderColor: COLORS.primary,
      margin: 4,
      padding: 4,
      shadowColor: "#000000",
      shadowOffset: {
        width: 0,
        height: 3,
      },
      shadowOpacity: 0.17,
      shadowRadius: 3.05,
      elevation: 4,
      width: "95%",
      alignSelf: "center",
      height: "100%",
    },
    primaryContainer: {
      flex: 1,
      flexDirection: "row",
      justifyContent: "space-between",
      margin: 2,
      padding: 2,
    },
    titleTextLabel: {
      fontWeight: "bold",
      fontSize: 16,
      color: COLORS.navyText,
    },
    titleTextValue: {
      fontWeight: "bold",
      fontSize: 16,
      color: COLORS.primary,
    },
    swipeRightAction: {
      backgroundColor: COLORS.primary,
      width: "50%",
      paddingRight: 16,
      justifyContent: "center",
      alignItems: "flex-end",
      marginVertical: 1.5,
    },
    swipeLeftAction: {
      backgroundColor: COLORS.redError,
      width: "50%",
      paddingLeft: 16,
      justifyContent: "center",
      alignItems: "flex-start",
      marginVertical: 1.5,
    },
    plusBtn: {
      position: 'absolute',
      padding: 13,
      right: 25,
      bottom: 25,
      elevation: 6,
      backgroundColor: '#D8D1E6',
      borderRadius: 1000,
  },
  });
  
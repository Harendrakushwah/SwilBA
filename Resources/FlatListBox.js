import {StyleSheet, Text, View, TouchableOpacity, ActivityIndicator} from 'react-native';
import React, {useEffect, useState} from 'react';
import EIcon from 'react-native-vector-icons/Entypo';
import {COLORS, GlobalStyles} from './GlobalStyles';
import { useNavigation } from '@react-navigation/native';


const FlatListBox = ({title, data, route, fullData, choice, dataLength, dataLoading}) => {
  const [boxOpen, setBoxOpen] = useState(false);
  const navigation = useNavigation();

  return (

    <View
      style={{...GlobalStyles.shadowBoxContainer, paddingVertical: -13}}
      onPress={() => setBoxOpen(!boxOpen)}
    >
      <TouchableOpacity 
            style={{backgroundColor: '#F1EFF3', marginHorizontal: -17, paddingVertical: 13}}
            onPress={() => setBoxOpen(!boxOpen)}
      >
      <View
        style={styles.headerContainer}
        onPress={() => setBoxOpen(!boxOpen)}
      >
        <Text style={styles.headingText}>{title}</Text>
        <View>
          {boxOpen ? (
            <TouchableOpacity onPress={() => setBoxOpen(!boxOpen)}>
              <EIcon
                name="chevron-up"
                size={24}
                color={COLORS.primary}
                style={styles.collapseIcon}
              />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity onPress={() => setBoxOpen(!boxOpen)}>
              <EIcon
                name="chevron-down"
                size={24}
                color={COLORS.primary}
                style={styles.collapseIcon}
              />
            </TouchableOpacity>
          )}
        </View>
      </View>
      </TouchableOpacity>

    
    {(boxOpen && data && !dataLoading) ? (
    <>
       <View style={styles.flatListContainer}>
            <View style={styles.boxContainer}>
                {(choice === 'excDis' || choice === 'excSch') ?   
                        <View style={{ flexDirection: "row", flex: 5}}>
                              <Text style={styles.rowHeadingText}>
                                TranAlias :{" "}
                              </Text>
                              <Text style={styles.rowText}>
                                {data?.TranAlias || 'NA'}
                              </Text>
                        </View>
                  : null
                }
                {(choice === 'sbcr' || choice === 'excDis' || choice === 'rateDiff' || choice === 'excSch') ?
                        <View style={{ flexDirection: "row", flex: 1, justifyContent: 'flex-end'}}>
                              <Text style={styles.rowHeadingText}>
                                Entry No :{" "}
                              </Text>
  
                              <Text style={styles.rowText}>
                                {data?.EntryNo || 'NA'}
                              </Text>
                        </View>

                        : null
                }

                {(choice === 'sbcr' || choice === 'excDis' || choice === 'rateDiff') ?
                        <View style={{ flexDirection: "row", flex: 5 }}>
                              <Text style={styles.rowHeadingText}>
                                Customer :{" "}
                              </Text>
  
                              <Text style={styles.rowText}>
                                {data?.Customer || 'NA'}
                              </Text>
                        </View>
                  : null
                }

                {(choice === 'excSch') ?
                        <View style={{ flexDirection: "row", flex: 5 }}>
                              <Text style={styles.rowHeadingText}>
                                Party :{" "}
                              </Text>
                              <Text style={styles.rowText}>
                                {data?.Party || 'NA'}
                              </Text>
                        </View>
                  : null
                }
                {(choice === 'sbcr' || choice === 'rateDiff' || choice === 'excSch') ?
                        <View style={{ flexDirection: "row", flex: 5 }}>
                              <Text style={styles.rowHeadingText}>
                                Name To Display :{" "}
                              </Text>
                              <Text style={styles.rowText}>
                                {data?.NameToDisplay || 'NA'}
                              </Text>
                        </View>
                  : null
                }
                {/* {(choice === 'sbcr') ?
                        <View style={{ flexDirection: "row", flex: 5 }}>
                              <Text style={styles.rowHeadingText}>
                                Strength :{" "}
                              </Text>
                              <Text style={styles.rowText}>
                                {data?.Strength || 'NA'}
                              </Text>
                        </View>
                  : null
                } */}
                {(choice === 'excSch') ?
                        <View style={{ flexDirection: "row", flex: 5 }}>
                              <Text style={styles.rowHeadingText}>
                                Qty :{" "}
                              </Text>
                              <Text style={styles.rowText}>
                                {data?.Qty || 'NA'} + {data?.FreeQty}
                              </Text>
                        </View>
                  : null
                } 
                {(choice === 'excSch') ?
                        <View style={{ flexDirection: "row", flex: 5 }}>
                              <Text style={styles.rowHeadingText}>
                              Scheme Qty :{" "}
                              </Text>
                              <Text style={styles.rowText}>
                                {(parseFloat(data?.SchemeQty))?.toFixed(0)|| 'NA'} + {(parseFloat(data?.SchemeFreeQty))?.toFixed(0)}
                              </Text>
                        </View>
                  : null
                } 
                {(choice === 'excSch') ?
                        <View style={{ flexDirection: "row", flex: 5 }}>
                              <Text style={styles.rowHeadingText}>
                              Total Qty :{" "}
                              </Text>
                              <Text style={styles.rowText}>
                                {(parseFloat(data?.TotQty))?.toFixed(0)|| 'NA'}
                              </Text>
                        </View>
                  : null
                } 
                {/* {(choice === 'sbcr' || choice === 'rateDiff') ?
                        <View style={{ flexDirection: "row", flex: 5 }}>
                              <Text style={styles.rowHeadingText}>
                                FreeQty :{" "}
                              </Text>
                              <Text style={styles.rowText}>
                                {data?.FreeQty || 'NA'}
                              </Text>
                        </View>
                  : null
                } */}
                {(choice === 'sbcr' || choice === 'rateDiff') ?  
                        <View style={{ flexDirection: "row", flex: 5 }}>
                              <Text style={styles.rowHeadingText}>
                                Rate :{" "}
                              </Text>
                              <Text style={styles.rowText}>
                                {(data?.Rate)?.toFixed(2) || 'NA'}
                              </Text>
                        </View>
                  : null
                }
                {(choice === 'sbcr') ? 
                        <View style={{ flexDirection: "row", flex: 5 }}>
                              <Text style={styles.rowHeadingText}>
                                Net Rate :{" "}
                              </Text>
                              <Text style={styles.rowText}>
                                {(data?.NetRate)?.toFixed(2) || 'NA'}
                              </Text>
                        </View>
                  : null
                }
                {(choice === 'sbcr' || choice === 'rateDiff') ?
                        <View style={{ flexDirection: "row", flex: 5 }}>
                              <Text style={styles.rowHeadingText}>
                                Cost Rate :{" "}
                              </Text>
                              <Text style={styles.rowText}>
                                {(data?.CostRate)?.toFixed(2) || 'NA'}
                              </Text>
                        </View>
                  : null
                }
                {/* {(choice === 'sbcr' || choice === 'rateDiff') ?   
                        <View style={{ flexDirection: "row", flex: 5 }}>
                              <Text style={styles.rowHeadingText}>
                                MRP :{" "}
                              </Text>
                              <Text style={styles.rowText}>
                                {data?.MRP || 'NA'}
                              </Text>
                        </View>
                  : null
                } */}
                {(choice === 'rateDiff') ?   
                        <View style={{ flexDirection: "row", flex: 5}}>
                              <Text style={styles.rowHeadingText}>
                                Lot Rate :{" "}
                              </Text>
                              <Text style={styles.rowText}>
                                {(data?.LotRate)?.toFixed(2) || 'NA'}
                              </Text>
                        </View>
                  : null
                }
                {(choice === 'sbcr' || choice === 'rateDiff' || choice === 'excDis' || choice == 'excSch') ?   
                        <View style={{ flexDirection: "row", flex: 5}}>
                              <Text style={styles.rowHeadingText}>
                                Username :{" "}
                              </Text>
                              <Text style={styles.rowText}>
                                {data?.UserName || 'NA'}
                              </Text>
                        </View>
                  : null
                }
                {(choice === 'excDis') ?   
                        <View style={{ flexDirection: "row", flex: 5}}>
                              <Text style={styles.rowHeadingText}>
                                Product :{" "}
                              </Text>
                              <Text style={styles.rowText}>
                                {data?.Product || 'NA'}
                              </Text>
                        </View>
                  : null
                }
                {/* {(choice === 'excDis') ?   
                        <View style={{ flexDirection: "row", flex: 5}}>
                              <Text style={styles.rowHeadingText}>
                                Group Name :{" "}
                              </Text>
                              <Text style={styles.rowText}>
                                {data?.GroupName || 'NA'}
                              </Text>
                        </View>
                  : null
                } */}
                {/* {(choice === 'excDis') ?   
                        <View style={{ flexDirection: "row", flex: 5}}>
                              <Text style={styles.rowHeadingText}>
                                Sales Amount :{" "}
                              </Text>
                              <Text style={styles.rowText}>
                                {data?.SalesAmt || 'NA'}
                              </Text>
                        </View>
                  : null
                } */}
                {(choice === 'excDis') ?   
                        <View style={{ flexDirection: "row", flex: 5}}>
                              <Text style={styles.rowHeadingText}>
                                Inv Disc :{" "}
                              </Text>
                              <Text style={styles.rowText}>
                                {(data?.TradeDisc)?.toFixed(2) || 'NA'}
                              </Text>
                        </View>
                  : null
                }
                {(choice === 'excDis') ?   
                        <View style={{ flexDirection: "row", flex: 5}}>
                              <Text style={styles.rowHeadingText}>
                                Std Disc :{" "}
                              </Text>
                              <Text style={styles.rowText}>
                                {(data?.PromoDisc)?.toFixed(2) || 'NA'}
                              </Text>
                        </View>
                  : null
                }
                {/* {(choice === 'excDis') ?   
                        <View style={{ flexDirection: "row", flex: 5}}>
                              <Text style={styles.rowHeadingText}>
                                Promo Disc :{" "}
                              </Text>
                              <Text style={styles.rowText}>
                                {data?.PromoDisc || 'NA'}
                              </Text>
                        </View>
                  : null
                } */}
            </View>
                      <View>
                        <TouchableOpacity onPress={() => navigation.navigate(route, {Item: fullData, Choice: choice})}>
                            <View style={styles.loadMoreContainer}>
                              <Text style={styles.loadMoreButton}>Show all</Text>
                            </View>
                        </TouchableOpacity>
                      </View>
                    </View>
    </>) : 
    (boxOpen) ? 
      dataLoading ?
      <View style={styles.dataLoadingContainer}>
          <ActivityIndicator 
            color={COLORS.primary}
            size="small"
            style={{flex: 1, paddingVertical: 8, marginTop: 5}}>
          </ActivityIndicator>
        <Text style={styles.dataLoadingText}>Loading...</Text>
      </View>
      
      : 
      
    (dataLength<=0) ?

    <View style={styles.notFound}>
      <Text style={styles.notFoundText}>Data not Found</Text>
    </View>
    :
    dataLoading
      
      : null}

    </View>
  );
};

export default FlatListBox;

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginHorizontal: 27,
  },
  headingText: {
    fontWeight: "500",
    fontSize: 17,
    color: '#000000',
    flex: 9,
  },

  flatListContainer: {
    flex: 1,
    borderRadius: 7,
    marginVertical: 10,
  },
 
  rowText: {
    flex: 1,
    color: COLORS.textTitle,
    fontSize: 16,
    fontWeight: "500",
    justifyContent: 'space-between',
    alignSelf: 'center',
  },
  rowHeadingText: {
    flex: 1,
    color: COLORS.primary,
    fontSize: 18,
    fontWeight: "500",
    marginVertical: 3,
    marginHorizontal: 8,
  },
  boxContainer: {
    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity:  0.17,
    shadowRadius: 2.54,
    elevation: 3
  },
  loadMoreContainer: {
    flex: 1,
    marginTop: 15,
    borderWidth: 2.4,
    borderColor: COLORS.primary,
    width: 120,
    height: 35,
    alignSelf: "center",
    borderRadius: 20,
  },

  loadMoreButton: {
    fontSize: 16,
    alignSelf: "center",
    marginTop: 4,
    fontWeight: '700',
    color: COLORS.primary,

  },
  loaderView: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    margin:10
  },
  dataLoadingContainer: {
    flex: 1,
    marginTop: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  dataLoadingText: {
    fontSize: 20,
    color: COLORS.black,
    fontWeight: '600',
  },
  notFound: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 15,
  },
  notFoundText: {
    fontSize: 15,
    color: COLORS.primary
  },
});

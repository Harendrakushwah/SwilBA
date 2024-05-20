import { View, Text, StyleSheet, SafeAreaView, FlatList, TouchableOpacity, ActivityIndicator} from 'react-native'
import React, {useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { CommonSliceActions } from '../../Redux/Common/CommonSlice'
import SearchBar from '../../GlobalComponents/SearchBar'
import { getCustomerList } from '../../Redux/Common/CommonAction'
import { COLORS } from '../../Resources/GlobalStyles'

const AccReceivableList = ({navigation}) => {

    const dispatch = useDispatch();
    
    const customerList = useSelector(state => state?.commonSlice?.Accounts?.customerList);

    // console.log("customerList----->>>>", customerList);


    const [searchString, setSearchString] = useState('');
    const [isCustomerListLoading, setIsCustomerListLoading] = useState(false);

    useEffect(() =>{
        setIsCustomerListLoading(true)
        dispatch(getCustomerList()).then((res) => {
          setIsCustomerListLoading(false);
        });
    },[])
    
    useEffect(() => {
      setIsCustomerListLoading(true)
      dispatch(getCustomerList( searchString)).then((res)=>{
        setIsCustomerListLoading(false);
      });
    }, [searchString]);

  return (
    <SafeAreaView style={styles.mainContainer}>

    {/* Search Bar View  */}
    <View style={styles.searchBarWrapper}>
      <SearchBar
        style={styles.searchBar}
        value={searchString}
        placeholder={'Search Account Name'}
        onChangeText={value => setSearchString(value)}
      />
    </View>

    {/* Customer List  */}
    <View style={{flex: 1}}>
      {!isCustomerListLoading ? (
        <FlatList
          data={customerList}
          showsVerticalScrollIndicator={false}
          style={{flex: 1}}
          onRefresh={() => dispatch(getCustomerList())}
          refreshing={isCustomerListLoading}
          renderItem={({item: cust}) => (
            <View style={{...styles.cardRow, flex: 1}}>
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate('accountsStack', {screen : "accrecorderview", params : {data: cust}})
                  dispatch(CommonSliceActions.setFullReportData(null))
                }
                }
              >
                <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                  <View style={{width: '78%'}}>
                    <Text style={{...styles.customerName}}>{cust?.Account}</Text>
                  </View>
                  {/* { cust?.CurrBalCrDr == 'Dr' ?
                  <View>
                    <Text style={{...styles.customerName, color: 'red'}}>{cust?.CurrBal?.toFixed(2) || 'NA'}</Text>   
                  </View>
                  :
                  <View>
                    <Text style={{...styles.customerName, color: 'green'}}>{cust?.CurrBal?.toFixed(2) || 'NA'}</Text>   
                  </View>
                  } */}
                </View>
              </TouchableOpacity>
            </View>
          )}
        />
      ) : (
        <View
          style={{alignItems: 'center', justifyContent: 'center', flex: 1}}>
          <ActivityIndicator size={'large'} color={COLORS.primary} />
        </View>
      )}
    </View>
   

  </SafeAreaView>
  )
}

export default AccReceivableList;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
  searchBarWrapper: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    margin: 8,
    // padding:6,
    borderRadius: 4,
    overflow: 'hidden',
  },
  searchBar: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderRadius: 4,
    overflow: 'hidden',
  },
  cardRow: {
    backgroundColor: COLORS.white,
    padding: 10,
    // paddingHorizontal: 15,
    width: '95%',
    alignSelf: 'center',
    marginBottom: 10,
    borderRadius: 8,
    shadowColor: COLORS.blackText,

    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.15,
    shadowRadius: 3.0,
    elevation: 2,
  },
  customerName: {
    fontWeight: '700',
    fontSize: 16,
    color: COLORS.grayText,
    flex: 1,
  },
})
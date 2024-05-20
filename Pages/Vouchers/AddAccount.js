import {
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useLayoutEffect, useState} from 'react';
import ActionButton from '../../GlobalComponents/ActionButton';
import MCIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import {COLORS} from '../../Resources/GlobalStyles';

export const AddAccountLedger = ({onAmountChange, onTypeChange, item}) => {
  const [selectedPayment, setSelectedPayment] = useState('dr');
  return (
    <View style={styles.addMainContainer}>
      <Text style={styles.addHeadingText}>Account</Text>
      <Text style={styles.accNoText}>{item.AccountNo}</Text>
      <View style={{flexDirection: 'row'}}>
        <View style={{flex: 1, marginLeft: 5}}>
          <TextInput></TextInput>
        </View>
        <View style={styles.drCrBtnView}>
          <View style={styles.drView(selectedPayment)}>
            <TouchableOpacity onPress={() => setSelectedPayment('dr')}>
              <Text style={styles.drText(selectedPayment)}>Dr</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.crView(selectedPayment)}>
            <TouchableOpacity onPress={() => setSelectedPayment('cr')}>
              <Text style={styles.crText(selectedPayment)}>Cr</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <View style={styles.partition} />
    </View>
  );
};

const AddAccount = ({navigation}) => {
  const [tempArray, setTempArray] = useState([
    {
      id: 1,
      AccountNo: '123456789654',
    },
  ]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: `Add Account`,
      headerLeft: () => (
        <>
          <ActionButton
            onPress={() => navigation.goBack()}
            icon={<MCIcon name="arrow-left" size={24} color={COLORS.white} />}
            android_ripple={COLORS.primaryDark}
            style={{borderRadius: 1000, marginRight: 10}}
          />
        </>
      ),
    });
  }, []);
  const dummyData = {
    id: 4,
    AccountNo: '',
  };

  //   const tempArray = [  
  //   {
  //     id:2,
  //     AccountNo : '987456123565'
  //   },
  //   {
  //     id:3,
  //     AccountNo : '58582578898555'
  //   },
  // ]
  const addAccountfunction = () => {
    let tempTempArray = [...tempArray]
    tempTempArray.push(dummyData);
    setTempArray(tempTempArray)
  };

  console.log('TempArray ------------------->>>>>>>', tempArray);  
  return (
    <View style={styles.mainContainer}>
      <FlatList
        data={tempArray}
        renderItem={({item}) => (
          <AddAccountLedger onAmountChange onTypeChange item={item} />
        )}
      />
      <View style={styles.addBtnView}>
        <TouchableOpacity onPress={addAccountfunction}>
          <Text style={styles.addAccountText}>Add Account</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default AddAccount;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
  addMainContainer: {
    backgroundColor: COLORS.white,
    width: '95%',
    alignSelf: 'center',
    margin: 10,
    padding: 10,
    borderRadius: 10,
  },
  drCrBtnView: {
    backgroundColor: COLORS.primary,
    flexDirection: 'row',
    margin: 4,
    padding: 4,
    borderRadius: 40,
  },
  drText: selectedPayment => ({
    fontSize: 18,
    marginHorizontal: 8,
    fontWeight: 'bold',
    color: selectedPayment === 'dr' ? COLORS.primary : COLORS.white,
  }),
  crText: selectedPayment => ({
    fontSize: 18,
    marginHorizontal: 8,
    fontWeight: 'bold',
    color: selectedPayment === 'cr' ? COLORS.primary : COLORS.white,
  }),
  drView: selectedPayment => ({
    backgroundColor: selectedPayment === 'dr' ? 'white' : COLORS.primary,
    borderRadius: 1000,
    alignItems: 'center',
    justifyContent: 'center',
  }),
  crView: selectedPayment => ({
    backgroundColor: selectedPayment === 'cr' ? 'white' : COLORS.primary,
    borderRadius: 1000,
    alignItems: 'center',
    justifyContent: 'center',
  }),
  partition: {
    borderColor: COLORS.primary,
    borderWidth: 0.8,
    margin: 6,
    marginBottom: 15,
  },
  addHeadingText: {
    fontWeight: '500',
    fontSize: 22,
    color: COLORS.primary,
    marginTop: 6,
    marginLeft: 5,
  },
  accNoText: {
    fontWeight: '500',
    fontSize: 18,
    color: COLORS.black,
    marginLeft: 5,
    marginTop: 4,
  },
  addBtnView: {
    alignSelf: 'flex-end',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderRadius: 40,
    borderColor: COLORS.primary,
    margin: 4,
    padding: 4,
    marginRight: 10,
  },
  addAccountText: {
    fontWeight: 'bold',
    color: COLORS.primary,
    margin: 4,
    fontSize: 18,
  },
});

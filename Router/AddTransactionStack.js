import React from "react";
import { StyleSheet, Text, View,TouchableOpacity,} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LinearGradient from "react-native-linear-gradient";
import CreateCreditNote from "../Pages/Credit Note/CreateCreditNote";
import { COLORS, DeviceType } from "../Resources/GlobalStyles";
import { onShare } from "../Resources/Resources";
import Voucher from "../Pages/Vouchers/Voucher";
import AddAccount from "../Pages/Vouchers/AddAccount";
import Setting from "../Pages/Setting";
import VoucherList from "../Pages/Vouchers/VoucherList";
import SingleVoucherDetails from "../Pages/Vouchers/SingleVoucherDetails";
import EditVoucher from "../Pages/Vouchers/EditVoucher";
import VoucherView from '../Pages/Vouchers/VoucherView';
import Feather from 'react-native-vector-icons/Feather';
import AntDesign from "react-native-vector-icons/AntDesign"; 
import CreditNoteList from "../Pages/Credit Note/CreditNoteList";
import { TranSliceActions } from "../Redux/Transaction/TransactionSlice";
import CreditNoteView from "../Pages/Credit Note/CreditNoteView";
import EditCreditNote from "../Pages/Credit Note/EditCreditNote";


export default function AddTransactionStack({navigation, route}) {
  const Stack = createNativeStackNavigator();
  const dispatch = useDispatch();

  const tranAlias = route.params.tranAlias;
  // console.log("TranAlias: ", tranAlias);

  const voucherDetails = useSelector(state => state?.transactionSlice?.vouchers?.selectedVoucher)
  const creditNoteDetails = useSelector(state => state?.transactionSlice?.creditNote?.selectedCreditNote)

  const GradientHeader = ({name,iconName, navBack, editNav, tranAlias}) => (
    <LinearGradient
    colors={["#F1F6FF", "#F1F6FF", "#F1F6FF"]}
    start={{ x: 0, y: 0 }}
    end={{ x: 1, y: 0 }}
    style={[{ alignItems: "flex-start",justifyContent:'center', maxHeight: 80 }]}
  >
        <View style={styles.headerView}>
        {(navBack=='voucherslist') ? 
        <TouchableOpacity
          onPress={()=>{
            navigation.navigate('voucherslist')
          }}
          style={{justifyContent:'center'}}
        >
           <View style={styles.backButton}>
            <AntDesign name={iconName} size={15} color={'#1F2C37'} />
          </View>
        </TouchableOpacity>
        : navBack == 'creditNoteList' ?
          <TouchableOpacity
            onPress={()=>navigation.navigate('creditNoteList')}
            style={{justifyContent:'center'}}
          >
            <View style={styles.backButton}>
              <AntDesign name={iconName} size={15} color={'#1F2C37'} />
            </View>
          </TouchableOpacity>
        : (tranAlias == 'credit') ?
        <TouchableOpacity
          onPress={()=>navigation.navigate('creditNote')}
          style={{justifyContent:'center'}}
        >
          <View style={styles.backButton}>
            <AntDesign name={iconName} size={15} color={'#1F2C37'} />
          </View>
        </TouchableOpacity>
        : 
        (tranAlias == 'voucher') 
        ?
        <TouchableOpacity
          onPress={()=>{
            navigation.navigate('vouchers')
          }}
          style={{justifyContent:'center'}}
        >
          <View style={styles.backButton}>
            <AntDesign name={iconName} size={15} color={'#1F2C37'} />
          </View>
        </TouchableOpacity>

        :
        <TouchableOpacity onPress={()=>{navigation.goBack()
          dispatch(TranSliceActions.setEmptyLastAddedProductAndCustomer());
          dispatch(TranSliceActions.emptyCart());
          dispatch(TranSliceActions.setPaymentOptionEnabled(false));
          navigation.setParams({ data: null });
          dispatch(TranSliceActions.setBlankSelectedAccount());
          dispatch(TranSliceActions.setBlankAddedAccToLedger([]));

          dispatch(TranSliceActions.setInputAmt([]));
      }
        } style={{justifyContent:'center'}}>
           <View style={styles.backButton}>
            <AntDesign name={iconName} size={15} color={'#1F2C37'} />
          </View>
        </TouchableOpacity>}
        
          <Text style={styles.headerText}> {name} </Text>
        {editNav ? 

          editNav=='editvoucher' ?
          <View style={{flexDirection: 'row', width: DeviceType == 'Tablet' ? '69%' : '45%', justifyContent: 'flex-end', alignItems: 'center'}}>
            <TouchableOpacity 
              style={{marginHorizontal: 25}}
              onPress={onShare(voucherDetails, 'V_JR')}
            >
              <Feather name="share-2" size={24} color={COLORS.primary}/>
            </TouchableOpacity>
            <TouchableOpacity 
              onPress={() => navigation.navigate('editvoucher')}
              style={{marginRight: 10}}>
              <Feather name="edit" size={24} color={COLORS.primary}/>
            </TouchableOpacity> 
          </View> 
          :
          <View style={{flexDirection: 'row', width: DeviceType == 'Tablet' ? '66%' : '39%', justifyContent: 'flex-end', alignItems: 'center'}}>
            <TouchableOpacity 
              style={{marginHorizontal: 25}}
              onPress={onShare(creditNoteDetails, 'SCRN')}
            >
              <Feather name="share-2" size={24} color={COLORS.primary}/>
            </TouchableOpacity>
            <TouchableOpacity 
              onPress={() => {
              dispatch(TranSliceActions.setEmptyLastAddedProductAndCustomer());
            dispatch(TranSliceActions.emptyCart());
            dispatch(TranSliceActions.setPaymentOptionEnabled(false));
                navigation.navigate('editcreditNote')}}
              style={{marginRight: 10}}>
              <Feather name="edit" size={24} color={COLORS.primary}/>
            </TouchableOpacity> 
          </View> 
        : null }
        
        </View>
      </LinearGradient>
  );
    
  return (
    <>
      <Stack.Navigator>
        <Stack.Screen
          name="creditNote"
          component={CreateCreditNote}
          options={{
            title: "Credit Note",
            headerShown: true,
            header: () => <GradientHeader name="Create Credit Note" iconName={"left"} navBack={'creditNoteList'}/>,
            
          }}
        />
        <Stack.Screen
          name="creditNoteList"
          component={CreditNoteList}
          options={{
            title: "Credit Note",
            headerShown: true,
            header: () => <GradientHeader name="Credit Note" iconName={"left"} />,
           
          }}
        />
        <Stack.Screen
          name="creditnoteview"
          component={CreditNoteView}
          options={{
            title: "Credit Note View",
            headerShown: true,
            header: () => <GradientHeader name="Credit Note Details" iconName={"left"} navBack={'creditNoteList'} editNav={'editSCRN'}/>,
           
          }}
        />
        <Stack.Screen
          name="editcreditNote"
          component={EditCreditNote}
          options={{
            title: "Edit Credit Note",
            headerShown: true,
            header: () => <GradientHeader name="Edit Credit Note" iconName={"left"} navBack={'creditNoteList'} />,
           
          }}
        />
        <Stack.Screen
          name="vouchers"
          component={Voucher}
          options={{
            title: "Voucher",
            headerShown: true,
            header: () => <GradientHeader name="Create voucher" iconName={"left"} navBack={'voucherslist'}/>,
           
          }}
        />
        <Stack.Screen
          name="voucherslist"
          component={VoucherList}
          options={{
            title: "Vouchers List",
            headerShown: true,
            header: () => <GradientHeader name="Vouchers" iconName={"left"} />
          }}
        />
        <Stack.Screen
          name="voucherview"
          component={VoucherView}
          options={{
            title: "Vouchers View",
            headerShown: true,
            header: () => <GradientHeader name="Voucher Details" iconName={"left"} navBack={'voucherslist'} editNav={'editvoucher'}/>
          }}
        />

        <Stack.Screen
          name="singlevoucherdetails"
          component={SingleVoucherDetails}
          options={{
            title: "Voucher",
            headerShown: true,
            header: () => <GradientHeader name="Voucher" iconName={"left"} />
          }}
        />
        <Stack.Screen
          name="editvoucher"
          component={EditVoucher}
          options={{
            title: "Edit Voucher",
            headerShown: true,
            header: () => <GradientHeader name="Edit Voucher" iconName={"left"} navBack={'voucherslist'}/> 
          }}
        />
        <Stack.Screen
          name="setting"
          component={Setting}
          options={{
            title: "Setting",
            headerShown: true,
            header: () => <GradientHeader name="Settings" iconName={"left"} tranAlias={tranAlias}/>
          }}
        />
        <Stack.Screen
          name="addaccount"
          component={AddAccount}
          options={{
            title: "Vouchers",
            headerShown: true,
            header: () => <GradientHeader name="Vouchers" iconName={"left"} />  
          }}
        />
      </Stack.Navigator>
    </>
  );
}

const styles = StyleSheet.create({
  headerView: {
    alignItems: "center",
    flexDirection: "row",
    margin: 2,
    padding: 2,
    marginVertical: 5,
  },
  headerText: {
    fontWeight: "600",
    fontSize: 19,
    color: '#1F2C37',
    marginLeft: 8,
  },
  backButton: {
    borderRadius: 50,
    backgroundColor: 'white',
    padding: 12,
    marginLeft: 8,
    marginRight: 5,
    marginVertical: 5,
  },
  iconStyle: {
    marginLeft: 15,
  },
});

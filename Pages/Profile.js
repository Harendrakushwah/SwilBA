import { SafeAreaView, StyleSheet, Text, View, Image, ScrollView } from 'react-native'
import React from 'react'
import { COLORS } from '../Resources/GlobalStyles'
import { useSelector } from 'react-redux'

const Profile = () => {
    const userData = useSelector(state => state?.commonSlice?.defaultDashboardData)
  return (
    <SafeAreaView style={{flex: 1,}}>
        <View style={styles.mainDetailContainer}>
            <View style={{marginTop: 5, marginBottom: 35}}>
            <View style={{marginHorizontal: 5}}>
                <Text 
                    style={{...styles.titleText, color: '#343434', marginTop: 15, fontSize: 20, fontWeight: '700', marginBottom: 7}}
                >User Details:
                </Text>
            </View>
            <View style={{flexDirection: 'row', marginBottom: 20}}>
                <View>
                <View style={styles.userLogoView}>
                    <Image
                        source={require("../Assets/Images/SwilBAlogo1.png")}
                        style={styles.userLogo}
                    />
                </View>
                </View>
                <View style={{marginTop: 8}}>
                    <Text style={{fontWeight: '700', fontSize: 18, color: '#343434', marginHorizontal: 12}}>{(userData?.UserName)?.toUpperCase()}</Text>
                    <Text style={{fontSize: 15, flexShrink: 1, marginHorizontal: 12}}>{userData?.Email}</Text>
                </View>
            </View>
            {/* <View style={styles.detailContainer}>
                <Text style={styles.titleText}>User Designation:</Text>   
                <Text style={styles.titleValue}>{userData?.UserDesignation}</Text>   
            </View>
            <View style={styles.partition} /> */}
            <ScrollView style={{marginTop: 20}}>
            <View style={styles.detailContainer}>
                <Text style={styles.titleText}>Emp Name:</Text>   
                <Text style={styles.titleValue}>{userData?.EmpName}</Text>   
            </View>
            {/* <View style={styles.partition} />    */}
            <View>
            <View style={styles.detailContainer}>
                {userData?.Mobile ? 
                    <Text style={styles.titleText}>Mobile:</Text>
                : null} 
                {userData?.Mobile ? 
                    <Text style={styles.titleValue}>{userData?.Mobile}</Text>  
                : null}   
                 
            </View>
           
            </View>
            <View style={styles.detailContainer}>
                <Text style={styles.titleText}>Refer By:</Text>   
                <Text style={styles.titleValue}>{userData?.ReferBy}</Text>   
            </View>
            <View style={styles.partition} />

            <View style={{marginHorizontal: 5}}>
                <Text 
                    style={{...styles.titleText, color: '#343434', marginTop: 15, fontSize: 20, fontWeight: '700', marginBottom: 7}}
                >Company Details:
                </Text>
            </View>
            <View style={styles.detailContainer}>
                {/* <Text style={styles.titleText}>Company Name:</Text>    */}
                <Text style={styles.titleValue}>{userData?.CompanyName}</Text>   
            </View>
            {/* <View style={styles.partition} /> */}
            <View style={styles.detailContainer}>
                {/* <Text style={styles.titleText}>Company Address:</Text>    */}
                <Text style={styles.titleValue}>{userData?.CompanyAddress}</Text>   
            </View>
            <View style={styles.partition} />
            <View style={{marginHorizontal: 5}}>
                <Text 
                    style={{...styles.titleText, color: '#343434', marginTop: 15, fontSize: 20, fontWeight: '700', marginBottom: 7}}
                >Branch Details:
                </Text>
            </View>
            <View style={styles.detailContainer}>
                {/* <Text style={styles.titleText}>Branch Name:</Text>    */}
                <Text style={styles.titleValue}>{userData?.Branch}</Text>   
            </View>
            {/* <View style={styles.partition} /> */}
            <View style={styles.detailContainer}>
                {/* <Text style={styles.titleText}>Branch Address:</Text>    */}
                <Text style={styles.titleValue}>{userData?.BranchAdd}</Text>   
            </View>
            <View style={styles.partition} />
            </ScrollView>
            </View>
        </View>
    </SafeAreaView>
  )
}

export default Profile

const styles = StyleSheet.create({
  partition: {
    borderWidth: 0.25,
    borderRadius: 10,
    shadowColor: COLORS.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 3.05,
    elevation: 2,
    margin: 10,
    width: "96%",
    alignSelf: "center",
  },
  titleText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#828282",
    marginHorizontal: 6,
    paddingVertical: 6
  },
  titleValue: {
    fontSize: 18,
    fontWeight: "500",
    color: "#222222",
    marginHorizontal: 6,
    flexShrink: 1,
    paddingVertical: 6
  },
  mainDetailContainer: {
    margin: 10,
    borderWidth: 1,
    borderRadius: 7,
    borderColor: COLORS.grayText,
    backgroundColor: COLORS.white,
    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.2,
    shadowRadius: 3.05,
    elevation: 6,
    flex: 1
  },
  detailContainer: {
    flexDirection: "row",
    // justifyContent: 'center',
    alignItems: "center",
    marginHorizontal: 5
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
});
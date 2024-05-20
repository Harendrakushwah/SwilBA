import React from 'react'
import { StyleSheet, View, Text } from 'react-native'
import Grid from '../../GlobalComponents/Grid.js'
import { COLORS } from '../../Resources/GlobalStyles.js'

const ExcessScheme = ({route}) => {
    const routeData = route.params?.Item
    const choice = route.params?.Choice

    return (
      
   <View style={styles.mainContainer}>
      <Grid data={routeData} choice={choice}/>
    </View>
    )
  }

export default ExcessScheme

const styles = StyleSheet.create({
   mainContainer: {
      flex: 1,
   }
})
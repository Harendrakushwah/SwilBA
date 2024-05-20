import React from 'react'
import { StyleSheet, View, Text } from 'react-native'
import Grid from '../../GlobalComponents/Grid.js'
import { COLORS } from '../../Resources/GlobalStyles.js'

const RateDifference = ({route}) => {
    const routeData = route.params?.Item
    const choice = route.params?.Choice

    return (
      
      <View style={styles.mainContainer}>
        <Grid data={routeData} choice={choice}/>
      </View>
  )
}

export default RateDifference

const styles = StyleSheet.create({
   mainContainer: {
      flex: 1,
   },
})

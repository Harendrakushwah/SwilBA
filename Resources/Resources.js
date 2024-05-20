import {Dimensions, Share, Alert} from 'react-native';
const DH = Dimensions?.get('window')?.height;
const DW = Dimensions?.get('window')?.width;
export const DeviceHeight = DH > DW ? DH : DW;
export const DeviceWidth = DH > DW ? DW : DH;

export const AllUrls = {
  //Release URLs

  //  MainBaseURL : "https://api.swilerp.com/LMSAPI",
  //  SSOBaseURL : "https://accounts.swilerp.com",

  //  shop URLs

  MainBaseURL: 'https://api-test.swilerp.com/lmsapi',
  SSOBaseURL: 'https://test.swilerp.com',
};

export const formattedDate = (dateInput) => {
  const date = new Date(dateInput);
  let dd = date.getDate();
  let mm = date.getMonth() + 1;
  let yyyy = date.getFullYear();

  if(dd<10)dd='0' + dd;
  if(mm<10)mm='0' + mm;

  const formatDate = `${dd}-${mm}-${yyyy}`;
  return formatDate;
}

export const dateFormatter = text => {
  // Replace any non-numeric characters with an empty string
  var cleanedText = text.replace(/[^0-9]/g, '');
  // Add slashes after the second and fourth characters
  if (cleanedText.length > 2 && cleanedText.length < 5) {
    cleanedText = cleanedText.slice(0, 2) + '/' + cleanedText.slice(2);
  } else if (cleanedText.length >= 4) {
    cleanedText =
      cleanedText.slice(0, 2) +
      '/' +
      cleanedText.slice(2, 4) +
      '/' +
      cleanedText.slice(4);
  }

  // Update state with the formatted date
  return cleanedText;
};

export const onShare = (Details, tranAlias) => async () => {
  try {
    const result = await Share.share({

      message: 
      tranAlias=='V_JR' 
      ? `M/s ${(Details?.UserName)?.toUpperCase()}, A ${(Details?.VoucherType)?.toLowerCase()} has been created of Rs.${Details?.NetAmt} Entry No. ${Details?.Series}-${Details?.EntryNo} Dated ${new Date()
        .toJSON()
        .slice(0, 10)}, SOFTWORLD (INDIA) PVT.LTD.` 
      : `M/s ${(Details?.Party)?.toUpperCase()}, A sales credit note has been raised of Rs.${Details?.NetAmt}, Entry No. ${Details?.Series}-${Details?.EntryNo}, Dated ${new Date()
          .toJSON()
          .slice(0, 10)}, SOFTWORLD (INDIA) PVT.LTD.`,
    });
    if (result.action === Share.sharedAction) {
      if (result.activityType) {
        // shared with activity type of result.activityType
      } else {
        // shared
      }
    } else if (result.action === Share.dismissedAction) {
      // dismissed
    }
  } catch (error) {
    Alert.alert(error.message);
  }
};

export const isDateValid = (selectedDate) => {
  // Add your validation logic here
  const currentDate = new Date();
  if (selectedDate > currentDate) {
    Alert.alert('Invalid Date', 'Please select a date in the past.');
    return false;
  }
  return true;
};


// for android 
// npx react-native bundle --platform android --dev false --entry-file index.js --bundle-output android/app/src/main/assets/index.android.bundle

// for ios 
//  npx react-native bundle --entry-file='index.js' --bundle-output='./ios/main.jsbundle' --dev=false --platform='ios' --assets-dest='./ios'
import {Alert} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {CommonSliceActions} from './CommonSlice';
import axios from '../../Axios/Axios';
import { TranSliceActions } from '../Transaction/TransactionSlice';
import DeviceInfo from 'react-native-device-info';
import { AllUrls } from '../../Resources/Resources';


// export const logOutHandler = () => async (dispatch, getState) => {
//   dispatch(CommonSliceActions.logUserOut());
//   await AsyncStorage.removeItem('logUserData');
//   axios.post(`api/auth/logout`);
// };

export const logOutHandler = () => async (dispatch,getState) => {
  dispatch(CommonSliceActions.logUserOut());
  try {
    const value = await AsyncStorage.getItem('logUserData');
    const tokken = JSON.parse(value).Tokken;
    const DeviceID = await DeviceInfo.getUniqueId();
    const DeviceName = await DeviceInfo.getDeviceName();
    const URL = `${AllUrls?.MainBaseURL}/api/auth/Logout?AppName=SWILBA&DeviceID=${DeviceName}(${DeviceID})`;
    var config = {
      method: 'post',
      url: URL,

      headers: {
        Authorization: `Bearer ${tokken}`,
      },
      data: null,
    };
   await axios(config)
      .then(function (response) {
        if (response?.data?.status !== 'success') {
          axios.post('api/auth/logout');        
        }
      })
      .catch(function (error) {
        axios.post('api/auth/logout');

      });
  } catch (e) {
    axios.post('api/auth/logout');
  }
  await AsyncStorage.removeItem('logUserData');
 

};

export const getDefaultDashboardData = () => async (dispatch, getState) => {
  var result = {
    isSuccessful: false,
    data: null,
  }

  await axios
    .post(`api/master/Dashboard/GetDashBoardHeaderMobileData?EntryDateTo=&EntryDate=${new Date(Date.now()).toJSON()}`
    )
    .then(response => {
      if(response?.data?.Data){
        // console.log("Response1111111 -------", response.data.Data)
        dispatch(CommonSliceActions.setDefaultDashboardData(response.data.Data));
        result.data = response.data.Data;
        result.isSuccessful = true;
      }
      else {
        dispatch(
          CommonSliceActions.setDefaultDashboardDataFailure(response.data.Message),
        );
        console.error('getDefaultDashboardData error ------>', response.data.Message);
      }
    })
    .catch(error => {
      dispatch(CommonSliceActions.setDefaultDashboardDataFailure(error.message));
      console.error('getDefaultDashboardData error ------>', error);
    })
};

export const getDashboardData = () => async (dispatch, getState) => {
  if (!getState().commonSlice.dashboard.isDashboardDataLoding) {
    var CreditNoteSeriesDetail = {
      Series: null,
      PKID: null,
    }
    var VoucherSeriesDetail = {
      Series: null,
      PKID: null,
    }
    let URL = `api/master/Dashboard/GetDashBoardHeaderMobileData?EntryDate=${new Date(Date.now()).toJSON()}&&dashboardFlag=dashboarddailysummary`;
    dispatch(CommonSliceActions.setIsDashboardDataLoding(true));
    // console.log("URL ----", URL);
    await axios
      .post(URL)
      .then(response => {
        if (response.data.Data) {
          // console.log("Response 222222222", response.data.Data);
          dispatch(
            CommonSliceActions.setDashboardDataSuccess(
              JSON.parse(response.data.Data.Table).Table[0],
            ),
          );
        
        CreditNoteSeriesDetail.Series = (response.data.Data.SalesCredit);
        CreditNoteSeriesDetail.PKID = (response.data.Data.SalesCreditID);
        VoucherSeriesDetail.Series = (response.data.Data.Voucher)
        VoucherSeriesDetail.PKID = (response.data.Data.VoucherID);

        dispatch(TranSliceActions.setSelectedCreditNoteSeries(CreditNoteSeriesDetail))
        dispatch(TranSliceActions.setSelectedVoucherSeries(VoucherSeriesDetail))

        } else {
          dispatch(
            CommonSliceActions.setDashboardDataFailure(response.data.Message),
          );
          console.error('getDashboardData error ------>', response.data.Message);
        }
      })
      .catch(error => {
        dispatch(CommonSliceActions.setDashboardDataFailure(error.message));
        console.error('getDashboardData error ------>', error);
      });
  }
};

export const getCustomerList = (searchText) => async(dispatch, getState) => {
 
  let FKReferByID = getState()?.defaultDashboardData?.FkreferById;
  let IsValidReferBy = getState()?.defaultDashboardData?.ReferByWiseCustomer;
  let URL;

    if(searchText){
      URL = `api/master/Account/CustomList?pageno=1&pagesize=50&search=${searchText}`;
    }
    else{
      URL = `api/master/Account/CustomList?pageno=1&pagesize=50`;
    }

    await axios
    .post(URL)
    .then((response) => {
      // console.log("Response: ", response.data);
      dispatch(CommonSliceActions.setCustomerList(response.data))
    })
  .catch((error) => {
    console.error("Customer List Error---->", error.message);
    dispatch(CommonSliceActions.setCustomerListError(error.message));
  })
  
}

export const getProductList = () => async (dispatch, getState) => {
  if (!getState().commonSlice.product.isProductListLoading) {
    var result = {
      isSuccessful: false,
      data: null,
    };
    const URL = `api/master/product/CustomList?pageNo=1&pageSize=50&Search=`;
    dispatch(CommonSliceActions.setProductListLoading(true));
    await axios
      .post(URL)
      .then(response => {
       
        dispatch(CommonSliceActions.setProductListSuccess(response.data));
        result.data = response.data
      })
      .catch(error => {
        dispatch(CommonSliceActions.setProductListFailure(error));

        console.error('Product Order Creation ===>> ', error.message);
      });
      return result
  }
};

//<<<<<<<<<<<-------------- Inventory APIs start from here ----------------------->>>>>>>>>>>>>>>>>>>>>>>

export const getExpiryStock = () => async (dispatch, getState) => {

  let fromDateExpiry = getState()?.commonSlice?.fromDateExpiry
  let toDateExpiry = getState()?.commonSlice?.toDateExpiry
  // console.log("From Date To Date------", fromDate, toDate);

    var result = {
      isSuccessful: false,
      data: null,
    };
    let bodyJson = {
      AsOnDate: fromDateExpiry,
      toDate: toDateExpiry,
    }

    const URL = `api/Report/ExpiryDetailReport/GetExpiryStockReportAppData`;
    await axios
      .post(URL, bodyJson)
      .then(response => {
        dispatch(CommonSliceActions.setExpiryStock(response.data));
        result.data = response.data

      })
      .catch(error => {
        dispatch(CommonSliceActions.setProductListFailure(error));
      });
      return result

};

export const getExcessStock = () => async (dispatch, getState) => {

  let fromDate = getState()?.commonSlice?.fromDate
  let toDate = getState()?.commonSlice?.toDate
  // console.log("From Date To Date------", fromDate, toDate);
  

  var result = {
    isSuccessful: false,
    data: null,
  };
  let bodyJson = {
    DateFrom: fromDate,
    toDate: toDate,
  }

  const URL = `api/Report/ExcessStockReport/GetExcessStockReportAppData`;
  await axios
    .post(URL, bodyJson)
    .then(response => {
      // console.log("Response: ", response.data);
      dispatch(CommonSliceActions.setExcessStock(response.data));
      result.data = response.data
    })
    .catch(error => {
      dispatch(CommonSliceActions.setProductListFailure(error));
    });
    return result

};

export const getNonMovingStock = () =>   async (dispatch, getState) => {

  let fromDate = getState()?.commonSlice?.fromDate
  let toDate = getState()?.commonSlice?.toDate
  // console.log("From Date To Date------", fromDate, toDate);

  var result = {
    isSuccessful: false,
    data: null,
  };
  let bodyJson = {
    DumpDays: 30,
    DateFrom: fromDate,
    toDate: toDate,
  }

  // console.log("Body Json------", bodyJson)

  const URL = `api/Report/NonMovingItemsReport/GetNonMovingItemsReportAppData`;
  await axios
  .post(URL, bodyJson)
  .then(response => {
      dispatch(CommonSliceActions.setNonMovingStock(response.data));
      result.data = response.data
    })
    .catch(error => {
      dispatch(CommonSliceActions.setProductListFailure(error));
    });
    return result

};  

export const getSaleBelowCostRate = () =>   async (dispatch, getState) => {

  let fromDate = getState()?.commonSlice?.fromDate
  let toDate = getState()?.commonSlice?.toDate
  // console.log("From Date To Date------", fromDate, toDate);


  var result = {
    isSuccessful: false,
    data: [],
  };

  let bodyJson = {
    LocationID: 0,
    DateFrom: fromDate,
    toDate: toDate,
  }
  const URL = `api/Report/DailySummaryReport/GetSaleRateBelowCostRateAppData`;
  await axios
    .post(URL, bodyJson)
    .then(response => {
      // console.log("Response Sales----->", response.data)
      dispatch(CommonSliceActions.setSaleBelowCostRate(response.data.Table));
      result.data = response.data.Table;
    })
    .catch(error => {
      dispatch(CommonSliceActions.setProductListFailure(error));

      console.error('Non Moving Stock Value  ===>> ', error.message);
    });
    return result

};

export const getExcessDiscount = () =>  async (dispatch, getState) => {
  
  let inputDays = getState()?.commonSlice?.inputDays
  
  var result = {
    isSuccessful: false,
    data: [],
  };

  // console.log("Input days: ", inputDays)

  let fromDate = getState()?.commonSlice?.fromDate
  let toDate = getState()?.commonSlice?.toDate
  // console.log("From Date To Date------", fromDate, toDate);

  let bodyJson = {
    SBHExcessDisRate: 0.0,
    LocationID: 0,
    DateFrom: fromDate,
    ToDate: toDate,
}
  const URL = `api/Report/DailySummaryReport/GetSaleExcessDiscountAppData`;
  await axios
    .post(URL, bodyJson)
    .then(response => {
     
      dispatch(CommonSliceActions.setExcessDiscount(response.data.Table));
      result.data = response.data.Table;
    })
    .catch(error => {
      dispatch(CommonSliceActions.setProductListFailure(error));

      console.error('Excess Discount Error  ===>> ', error.message);
    });
    return result

};

export const getRateDifference = () => async (dispatch, getState) => {
  var result = {
    isSuccessful: false,
    data: [],
  };

  let fromDate = getState()?.commonSlice?.fromDate
  let toDate = getState()?.commonSlice?.toDate
  // console.log("From Date To Date------", fromDate, toDate);

  let bodyJson = {
    LocationID: 0,
    DateFrom: fromDate,
    ToDate: toDate, 
}
  const URL = `api/Report/DailySummaryReport/GetSaleDifferentRateAppData`;
  await axios
    .post(URL, bodyJson)
    .then(response => {
    //  console.log("Response rate difference: ", response.data);
      dispatch(CommonSliceActions.setRateDifference(response.data.Table));
      result.data = response.data.Table;
    })
    .catch(error => {
      dispatch(CommonSliceActions.setProductListFailure(error));

      console.error('Rate Difference Error  ===>> ', error.message);
    });
    return result

};


export const getExcessScheme = () =>  async (dispatch, getState) => {
  var result = {
    isSuccessful: false,
    data: [],
  };

  let fromDate = getState()?.commonSlice?.fromDate
  let toDate = getState()?.commonSlice?.toDate
  // console.log("From Date To Date------", fromDate, toDate);

  let bodyJson = {
    LocationID: 0,
    DateFrom: fromDate,
    ToDate: toDate
}
  const URL = `api/Report/DailySummaryReport/GetSaleDifferentSchemeAppData`;
  await axios
    .post(URL, bodyJson)
    .then(response => {
     
      dispatch(CommonSliceActions.setExcessScheme(response.data.Table));
      result.data = response.data.Table;
    })
    .catch(error => {
      dispatch(CommonSliceActions.setProductListFailure(error));

      console.error('Excess Scheme Error  ===>> ', error.message);
    });
    return result

};


//<<<<<<<<<<<---------------------Inventory APIs end here------------->>>>>>>>>>>>>>>>>>>>>>>>>

//<<<<<<<<<<<<<-------------------Accounts API start from here------------->>>>>>>>>>>>>>>>>>>>>>>>>

export const getReceivablesReport = () => async(dispatch, getState) => {
  var result = {
    isSuccessful: false,
    data: null
  }
  let inputDays = getState()?.commonSlice?.inputDays
  // console.log("Input days: ", inputDays)

  var date = new Date()?.getDate();
  var month = new Date()?.getMonth() + 1;
  var year = new Date()?.getFullYear();
  var fullDate = year + '-' + month + '-' + date ;
  const tempDate = inputDays ? (inputDays == '' || 0 ? 0 : inputDays - 1 ) : 0;
  var oldDate = new Date(new Date()?.setDate(new Date()?.getDate() - tempDate));

  var date2 = oldDate?.getDate();
  var month2 = oldDate?.getMonth() + 1;
  var year2 = oldDate?.getFullYear();
  var fullDate2 = year2 + '-' + month2 + '-' + date2 ;

  let bodyJson = {
    toDate: new Date(fullDate2) || new Date(fullDate)
  }
  
  const URL = 'api/report/ReceivablesReport/GetReceivablesReportAppData'
  await axios
  .post(URL, bodyJson)
  .then(response => {
     if(response.data.Status === 'success'){
       dispatch(CommonSliceActions.setReceivablesReport(JSON.parse(response.data.Data)));
       result.data = JSON.parse(response.data.Data);
     }
  })
  .catch(error => {
    dispatch(CommonSliceActions.setProductListFailure(error));
    console.error('Receivables report error  ===>> ', error.message);
  });
  return result


};

export const getPayablesReport = () => async(dispatch, getState) => {
  var result = {
    isSuccessful: false,
    data: null,
  }

  let inputDays = getState()?.commonSlice?.inputDays
  // console.log("Input days: ", inputDays)

  var date = new Date()?.getDate();
  var month = new Date()?.getMonth() + 1;
  var year = new Date()?.getFullYear();
  var fullDate = year + '-' + month + '-' + date ;
  const tempDate = inputDays ? (inputDays == '' || 0 ? 0 : inputDays - 1 ) : 0;
  var oldDate = new Date(new Date()?.setDate(new Date()?.getDate() - tempDate));

  var date2 = oldDate?.getDate();
  var month2 = oldDate?.getMonth() + 1;
  var year2 = oldDate?.getFullYear();
  var fullDate2 = year2 + '-' + month2 + '-' + date2 ;

  let bodyJson = {
    dateFrom: new Date(fullDate2),
    toDate: new Date(fullDate),
    SeriesFilter: "28,9,30,18,7,2,29,-3,-4,"
  }

  const URL = 'api/report/PayablesReport/GetPayablesReportAppdata'

  await axios
  .post(URL, bodyJson)
  .then(response => {
    if(response.data.Status === 'success'){
      dispatch(CommonSliceActions.setPayablesReport(JSON.parse(response.data.Data)));
      result.data = JSON.parse(response.data.Data);
    }
  })
  .catch((error) => {
    dispatch(CommonSliceActions.setProductListFailure(error));
    console.log("Payables Report Error: ", error);
  });

  return result

};


export const getSingleOutstandingReport = (data, autoAdjust) => async(dispatch, getState) => {
  let result = {
      isSuccessful: false,
      data: null,
    };

  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = String(currentDate.getMonth() + 1).padStart(2, '0'); // Adding 1 because months are 0-based
  const day = String(currentDate.getDate()).padStart(2, '0');
  const formattedDate = `${year}/${month}/${day}`;

  let FKReferByID = getState()?.defaultDashboardData?.FkreferById;
  let IsValidReferBy = getState()?.defaultDashboardData?.ReferByWiseCustomer;
  let URL;

  {IsValidReferBy && FKReferByID ? 
    URL = `api/report/ReceivablesReport/ReceivableViewDataMobile?ToDate=${formattedDate}&PartyID=0&AccountID=${data?.PKID}&AutoAdjust=${autoAdjust}&ReferBy=${`,${FKReferByID},`}` :
    URL = `api/report/ReceivablesReport/ReceivableViewDataMobile?ToDate=${formattedDate}&PartyID=0&AccountID=${data?.PKID}&AutoAdjust=${autoAdjust}`
  }

  console.log("URL--------", URL)
  await axios
  .post(URL)
  .then(response => {
    if(response?.data?.Result){
      result.isSuccessful = true;
      // console.log("Response -------", response.data)
      result.data = response.data.Result
      dispatch(CommonSliceActions.setFullReportData(response.data.Result))
    }
    else{
      dispatch(CommonSliceActions.setFullReportDataError(response.data.Message));
      result.data = response.data.Message;
    }
  })
  .catch(error => {
    result.data = error.message;
    dispatch(CommonSliceActions.setFullReportDataError(response.data.Message));
    console.error('Get single outstanding report error -----> ' + error.message);
  });

  return result;
}

export const getSinglePayableData = (data, autoAdjust) => async(dispatch, getState) => {
  let result = {
    isSuccessful: false,
    data: null,
  }

  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = String(currentDate.getMonth() + 1).padStart(2, '0'); // Adding 1 because months are 0-based
  const day = String(currentDate.getDate()).padStart(2, '0');
  const formattedDate = `${year}/${month}/${day}`;

  let FKReferByID = getState()?.defaultDashboardData?.FkreferById;
  let IsValidReferBy = getState()?.defaultDashboardData?.ReferByWiseCustomer;
  let URL;

  {IsValidReferBy && FKReferByID ? 
    URL = `api/report/PayablesReport/PayablesReportAppViewData?ToDate=${formattedDate}&PartyID=0&AccountID=${data?.PKID}&AutoAdjust=${autoAdjust}&ReferBy=${`,${FKReferByID},`}` :
    URL = `api/report/PayablesReport/PayablesReportAppViewData?ToDate=${formattedDate}&PartyID=0&AccountID=${data?.PKID}&AutoAdjust=${autoAdjust}`
  }

  // console.log("URL------",URL)
  await axios
  .post(URL)
  .then(response => {
    
    if(response?.data?.Data){
      result.isSuccessful = true;
      result.data = response.data.Data;
      dispatch(CommonSliceActions.setCustomerPayableData(response.data.Data))
      // console.log("Response -------", response.data.Data);
    }
    else{
      dispatch(CommonSliceActions.setCustomerPayableError(response.data.Message));
      result.data = response.data.Message;
      console.log("response error----", response.data.message);

    }
  })
  .catch(error => {
    result.data = error.message;
    dispatch(CommonSliceActions.setCustomerPayableError(response.data.Message));
    console.error('Get Payables outstanding report error -----> ' + error.message);
  });

  return result;
}



//<<<<<<<<<<<<<-------------------Accounts API ends here------------->>>>>>>>>>>>>>>>>>>>>>>>>>>
export const getProductDetailsByID = prodID => async (dispatch, getstate) => {
  // console.log("Prod ID -----", prodID);
  var result = {
    isSuccessful: false,
    data: null,
  };
  await axios
    .post(`api/master/Product/GetMobileByID?id=${prodID}&CurQtyFlag=true&AllowExpired=true`)
    .then(response => {
      // console.log('product deatils ------------------>', response.data);
      let productDetails={};
      
      if((response.data.PKID = prodID)){
        result.isSuccessful = true;
        productDetails.IsBatchApplied = response?.data?.IsBatchApplied;
        productDetails.NameToDisplay = response?.data?.NameToDisplay;
        productDetails.FKProdID = response?.data?.PKID;
        productDetails.TblProdLotDtl = response?.data?.TblProdLotDtl;
        // console.log("Product Details of lot--------", productDetails);
        result.data = productDetails;
        dispatch(CommonSliceActions.lastAddedProduct(productDetails));
      } else {
        result.data = response.data;
      }
    })
    .catch(error => {
      Alert.alert('', `${error}`);
      console.error('get product details by id error --->', error);
    });
  return result;
};


export const getSeriesListByTranAlias = (tranAlias) => async (dispatch, getState) => {
  let result = {
    isSuccessful: false,
    data: null,
  };

  try {
    const response = await axios.post(`api/master/series/CustomList?tranalias=${tranAlias}`);
    
    if (response.data.length) {
      if (tranAlias === 'V_JR') {
        result.isSuccessful = true;
        result.data = response.data;
        dispatch(TranSliceActions.setVoucherSeriesList(response.data))

      } else if (tranAlias === 'SCRN') {
        result.isSuccessful = true;
        result.data = response.data; 
        dispatch(TranSliceActions.setCreditNoteSeriesList(response.data))

      }
    } else {
      result.data = response.data;
      result.isSuccessful = false;
    }
  } catch (error) {
    // Handle errors
    Alert.alert('Error !', `${error}`);
    console.error('Get Series List --->', error);
  }

  return result;
};



import AsyncStorage from "@react-native-async-storage/async-storage";

import axios from "../../Axios/Axios";
import { CommonSliceActions } from "../Common/CommonSlice";
import { TranSliceActions } from "./TransactionSlice";

const getTranDataModal = {
  DateFrom: "2023-04-01T00:00:00",
  ToDate: new Date().toJSON().substring(0, 19),
  ReportType: "S",
  TranAlias: "", //required
  PartyFilter: "",
  ColumnString: "Amount,TaxAmt,NetAmt,QtyUnit1,Party,",
  OrderString: "", // selected type wise filter
  ChlnTranAlias: "SPSL",
  OnlyCrNote: false,
  InclPendingChallan: true,
  AsOnDate: "2023-04-26T00:00:00",
  IsSummary: false,
  Value1: 0.0,
  Value2: 0.0,
  Rate1: 0.0,
  Rate2: 0.0,
  InvoiceIDFilter: null,
  SalesPersonFilter: "",
  SeriesFilter: "",
  ProductFilter: "",
  LocationFilter: "",
  UserFilter: null,
  RptFlag: "\u0000",
  GridName: "",
  ColumnListFlag: "",
};

export const getReportData =
  (tranAlias, selectedFilter) => async (dispatch, getState) => {
    const bodyJSON = { ...getTranDataModal };
    bodyJSON.TranAlias = tranAlias;
    bodyJSON.OrderString = selectedFilter;
  };

export const getTranWiseSummary = (tranAlias) => async (dispatch, getState) => {
  const result = {
    isSuccessful: false,
    response: null,
  };

  // console.log("TranAlias:-------- ", tranAlias);
  const fromDateSal = getState()?.transactionSlice?.fromDateSal;
  const toDateSal = getState()?.transactionSlice?.toDateSal
  const fromDatePur = getState()?.transactionSlice?.fromDatePur;
  const toDatePur = getState()?.transactionSlice?.toDatePur

  // console.log("Date ------", fromDate, toDate);

    await axios
      .post(
        `api/master/Dashboard/GetDashBoardHeaderMobileData?EntryDate=${(tranAlias == 'SINV' || tranAlias == 'SORD' || tranAlias == 'SPSL') ? new Date(fromDateSal).toJSON() : new Date(fromDatePur).toJSON()}&&dashboardFlag=dashboardTrnWisesummary&EntryDateTo=${(tranAlias == 'SINV' || tranAlias == 'SORD' || tranAlias == 'SPSL') ? new Date(toDateSal).toJSON() : new Date(toDatePur).toJSON()}&TranAlias=${tranAlias}`
      )
      .then((response) => {     
        if (response.data.Status === "success") {
          result.isSuccessful = true;
          if(tranAlias==='SINV' || tranAlias==='SORD' || tranAlias==='SPSL'){
            dispatch(
              TranSliceActions.setSalesReport({
                Data: JSON.parse(response.data.Data.Table).Table[0],
                tranAlias: tranAlias,
              })
            );
          }
          
          else if(tranAlias==='PINV' || tranAlias==='PORD' || tranAlias==='PPSL'){
            dispatch(
              TranSliceActions.setPurchaseReport({
                Data: JSON.parse(response.data.Data.Table).Table[0],
                tranAlias: tranAlias,
              })
            );
          }
          result.response = JSON.parse(response.data.Data.Table).Table[0];
        } 
        else {
          result.isSuccessful = false;

          console.error("getDashboardData error ------>", error);
          result.response = response.data.Message;

        }
      })
      .catch((error) => {
        result.isSuccessful = false;
        console.error("getDashboardData error ------>", error);
        result.response = error.message;

      });

    return result;
  
};

export const getNetAmountInvoice = (tranAlias) => async (dispatch, getState) => {
  /* Check if API is already called or not */
  // console.log('body net amount ---------->', bodyData);
  if (!getState().creditNote?.isNetAmountLoading) {
    var result = {
      isSuccessful: false,
      response: null,
    };
    // dispatch(getNetAmountInvoiceLoading());
    const singleCreditNoteDetail = getState()?.transactionSlice?.objectDetails;
    const orderDetails = getState()?.transactionSlice?.creditNote?.cart;
    // console.log("Cart Details ------", getState()?.transactionSlice?.creditNote?.cart)

    const URL = `api/transaction/SalesCrNote/SetTotalForGridMobile?flag=All`;
    /* Generate body */
    const bodyJSON = {
      ProdDtl: [],
    };

    getState()
      ?.transactionSlice?.creditNote?.cart?.forEach((item1) => {
            var tempItem2 = Object.assign({});
            if(tranAlias=='creditNote') {
              tempItem2.Rate =   item1?.selectedBatch?.SaleRate || item1?.SaleRate;
              tempItem2.Qty = item1?.selectedBatch?.Qty || item1?.Qty;
              tempItem2.FKProdID = item1?.FKProdID;
              tempItem2.FKLotID = item1?.selectedBatch?.PklotId || item1?.FKLotID || item1?.PklotId || 0;
              tempItem2.ModeForm = 0;
              tempItem2.MRP = item1?.selectedBatch?.MRP || item1?.MRP;
              tempItem2.SrNo = 0,
              tempItem2.ReturnTypeID = item1?.ReturnType
              // tempItem2.TradeDisc = item1.Discount > 0 ? item1.Discount : 0;
              // console.log("Temp Item: ",  tempItem2)
              bodyJSON?.ProdDtl?.push(tempItem2);
            }
            else{
              tempItem2.Rate =   item1?.selectedBatch?.Rate || item1?.Rate || item1.selectedBatch?.SaleRate;
              tempItem2.Qty = item1?.selectedBatch?.Qty || item1?.Qty;
              tempItem2.FKProdID = item1?.FKProdID;
              tempItem2.FKLotID = item1?.selectedBatch?.PklotId || item1?.FKLotID || item1?.PklotId || 0;
              tempItem2.ModeForm = item1?.ModeForm || 0;
              tempItem2.MRP = item1?.selectedBatch?.MRP || item1?.MRP;
              tempItem2.SrNo = item1?.SrNo,
              tempItem2.ReturnTypeID = item1?.ReturnTypeID
              bodyJSON?.ProdDtl?.push(tempItem2);

            }
          }
        );

    bodyJSON.PKID = tranAlias == 'creditNote' ? 0 : singleCreditNoteDetail?.PKID;
    bodyJSON.CashDisc = 0;
    bodyJSON.CashDiscType =    'U';
    bodyJSON.FKPartyID = orderDetails?.FKPartyID
      ? orderDetails?.FKPartyID
      : getState()?.transactionSlice?.creditNote?.selectedCustomer?.PKID;
    bodyJSON.FKSeriesID = orderDetails?.FKSeriesID
      ? orderDetails?.FKSeriesID
      : getState()?.transactionSlice?.creditNote?.selectedCreditNoteSeries?.PKID;
    const bodyData = JSON.stringify(bodyJSON);
    // console.log("Body JSON: -------", bodyData);
    await axios
      .post(URL, bodyData)
      .then((res) => {
        // console.log("Net ammount response-----", res.data)
        result.isSuccessful = true;
        result.response = res.data;
        // console.log("Response Net amount from ----------------------->>", res.data)
        // dispatch(getNetAmountInvoiceSuccess(res.data.ReceivedAmt));
 
      })
      .catch((error) => {
        result.response = error.message;
        console.error("getNetAmountInvoice ---------->> ", error.message);
        // dispatch(getNetAmountInvoiceFailure(error.message));
      });
  }
  return result;
};



export const getAccountsList = () => async (dispatch, getState) => {
  const result = {
    isSuccessful: false,
    response: null,
  };

 await axios
    .post(`api/Master/Account/CustomList?AllCredDebit=true`)
    .then((response) => {
      result.isSuccessful = true;
      result.response = response.data;
      // console.log("Response data ----------", response.data);
      dispatch(TranSliceActions.setAccountList(response.data));
    })
    .catch((error) => {
      result.isSuccessful = false;
      console.error("Get Acount List ------>", error);
      result.response = error.message;
    });

  return result;
};

export const getAccountsListByPKID = (item) => async (dispatch, getState) => {
  const result = {
    isSuccessful: false,
    response: null,
  };

 await axios
    .post(`api/Master/Account/CustomList?PKID=${item.PKID}`)
    .then((response) => {
      result.isSuccessful = true;
      result.response = response.data;
      // console.log("Response . data PKI d ------>>>>>",response.data);
    })
    .catch((error) => {
      result.isSuccessful = false;
      console.error("Get Acount List By PKID------>", error);
      result.response = error.message;
    });

  return result;
};
export const getDefaultPartyList = (selectedCustomer,Flag) => async (dispatch, getState) => {
  // console.log("----------->>>>>>>",selectedCustomer,Flag)
  const result = {
    isSuccessful: false,
    response: null,
  };

 await axios
    .post(
      `api/Transaction/Voucher/SetPartybyAccount?Id=${selectedCustomer?.PKID}&PartyFlag=${Flag}`
    )
    .then((response) => {
      result.isSuccessful = true;
      result.response = response.data;
      // console.log("Response data party -------", response.data);
    })
    .catch((error) => {
      result.isSuccessful = false;
      console.error("Get Party List ------>", error);
      result.response = error.message;
    });

  return result;
};
export const getAccPartyList = (selectedCustomer,Flag) => async (dispatch, getState) => {
  const result = {
    isSuccessful: false,
    response: null,
  };

 await axios
    .post(
      `api/Transaction/Voucher/getaccountpartylist?Id=${selectedCustomer?.PKID}`
    )
    .then((response) => {
      result.isSuccessful = true;
      result.response = response.data;
      // console.log("Response of account partylist------", response.data);
    })
    .catch((error) => {
      result.isSuccessful = false;
      console.error("Get Acc Party List ------>", error);
      result.response = error.message;
    });

  return result;
};

export const createVoucher = (bodyJSON) => async (dispatch, getState) => {
  const result = {
    isSuccessful: false,
    response: null,
  };

  // console.log("Body Json of create voucher --->>>", bodyJSON)

 await axios
    .post(
      `api/transaction/Voucher/CreateMobileVoucher`,bodyJSON
    )
    .then((response) => {
      if(response.data.ApiResponse.ID){
        result.isSuccessful = true;
        result.response = response.data.ApiResponse.ID;
      }else{
        result.isSuccessful = false;
        result.response = response?.data?.ErrorMessage?.length ?response?.data?.ErrorMessage[0]?.Message: response?.data?.WarningMessage[0]?.Message ;
      }
      
    })
    .catch((error) => {
      result.isSuccessful = false;
      console.error("Voucher ------>", error);
      result.response = error.message;
    });

  return result;
};

export const getAdjustmentList = (bodyJSON) => async (dispatch, getState) => {
  const result = {
    isSuccessful: false,
    response: null,
  };
 await axios
    .post(
      `api/Transaction/Voucher/GetInvoice`,JSON.stringify(bodyJSON)
    )
    .then((response) => {
      if(response.data){
        result.isSuccessful = true;
        result.response = response.data;
      }else{
        result.isSuccessful = false;
        result.response = response.data;
      }
      
    })
    .catch((error) => {
      result.isSuccessful = false;
      console.error("Fetch Adjustments List ------>", error);
      result.response = error.message;
    });

  return result;
};
export const getCostCenterList = () => async (dispatch, getState) => {
  const result = {
    isSuccessful: false,
    response: null,
  };

 await axios
    .post(`api/Master/CostCenter/CustomList?pagesize=20&pageno=1&search&alldropdown=2`)
    .then((response) => {
      result.isSuccessful = true;
      result.response = response.data;
      dispatch(TranSliceActions.setCostCenterList(response.data))
    })
    .catch((error) => {
      result.isSuccessful = false;
      console.error("Get Cost Center List ------>", error);
      result.response = error.message;
    });

  return result;
};
export const getVoucherList = () => async (dispatch, getState) => {
  const result = {
    isSuccessful: false,
    response: null,
  };

 await axios
    .post(`api/Transaction/Voucher/GetList?typ=Week`)
    .then((response) => {
      result.isSuccessful = true;
      result.response = response.data;
      dispatch(TranSliceActions.setVouchersList(response.data))

    })
    .catch((error) => {
      result.isSuccessful = false;
      console.error("Get Voucher List ------>", error);
      result.response = error.message;
    });

  return result;
};

export const getVoucherDetailByID = (item) => async (dispatch, getState) => {
  const result = {
    isSuccessful: false,
    response: null,
  };

 await axios
    .post(`api/transaction/Voucher/GetByID?id=${item?.PKID}&FkID=${item?.FKSeriesID}&FormName=Voucher`)
    .then((response) => {
      dispatch(TranSliceActions.setSingleVoucherDetail(response.data))
      result.isSuccessful = true;
      result.response = response.data;
      // console.log("Response single --------", response.data)
    })
    .catch((error) => {
      result.isSuccessful = false;
      console.error("Get Voucher Detail By ID------>", error);
      result.response = error.message;
    });

  return result;
};

export const deleteSbcrVJR = (item, tranAlias) => async (dispatch, getState) => {
  const result = {
    isSuccessful: false,
    response: null,
  };
  const URL = 
  tranAlias == 'SCRN' 
  ? `api/transaction/SalesCrNote/Delete?id=${item?.PKID}&FkID=${item?.FKSeriesID}`
   : `api/transaction/Voucher/Delete?id=${item?.PKID}&FkID=${item?.FKSeriesID}`;


  //  console.log("URL ----", URL);

 await axios
    .delete(URL)
    .then((response) => {
      result.isSuccessful = true;
      result.response = response.data;

    })
    .catch((error) => {
      result.isSuccessful = false;
      console.error("Delete Voucher------>", error);
      result.response = error.message;
    });

  return result;
};


// *************************Credit Note Api's *****************************************

export const getReturnTypeList = () => async (dispatch, getState) => {
  const result = {
    isSuccessful: false,
    response: null,
  };
 await axios
    .post(`api/transaction/SalesCrNote/ReturnTypeID?IsExpiry=true&IncludeMRPToMRP=false`)
    .then((response) => {
      result.isSuccessful = true;
      result.response = response.data;
      dispatch(TranSliceActions.setReturnTypeList(response?.data))
    })
    .catch((error) => {
      result.isSuccessful = false;
      console.error("Get Return Type List ------>", error);
      result.response = error.message;
    });

  return result;
};

export const getCreditNoteList = () => async (dispatch, getState) => {
  const result = {
    isSuccessful: false,
    response: null,
  };

  await axios
  .post(`api/transaction/SalesCrNote/GetList?typ=Week&DocType=B`)
  .then((response) => {
      result.isSuccessful = true;
      result.response = response.data;
      dispatch(TranSliceActions.setCreditNoteList(response.data))
    })
    .catch((error) => {
      result.isSuccessful = false;
      console.error("Get Credit Note List ------>", error);
      result.response = error.message;
    });

  return result;
};
export const updateSalesCreditNote = (bodyJSON) => async (dispatch, getState) => {
  const paymentData = getState()?.transactionSlice?.creditNote?.paymentData;
  const selectedCustomer =
    getState()?.transactionSlice?.creditNote?.selectedCustomer;
  const singleCreditNoteDetail = getState()?.transactionSlice?.objectDetails;
  // console.log("Create credit note selected customer -------->", selectedCustomer);

  const getCardExpiryDate = dateStr => {
    var parts = dateStr.split('/');
    var month = parseInt(parts[0]).toString().padStart(2, '0');
    var year = parseInt(parts[1]);
    var lastDay = new Date(year, month, 0).getDate();
    var dateString = month + '/' + lastDay + '/' + `20${year}`; 
    return dateString;
  };

  const getChequeDate = dateString => {
    const [day, month, year] = dateString.split('/');
    var d = new Date(Date.UTC(year, month - 1, day, 0, 0, 0));
    return d.toISOString();
  };
  const salesCreditNoteBodyJSON = {
    Cash: paymentData?.CashAmt > 0 ? true : false,
    CashAmt: paymentData?.CashAmt || 0,
    Credit: paymentData?.CreditAmt > 0 ? true : false,
    CreditAmt: paymentData?.CreditAmt || 0,
    CreditCard: paymentData?.CreditCardAmt > 0 ? true : false,
    CreditCardAmt: paymentData?.CreditCardAmt || 0,
    CreditCardDate: paymentData.CreditCardDate
    ? getCardExpiryDate(paymentData.CreditCardDate)
    : new Date().toJSON(),
    CreditCardNo: paymentData?.CreditCardNo || '',
    CreditCardType: paymentData?.CreditCardType || 0,
    CreditDate: new Date(
      new Date().setDate(new Date().getDate() + selectedCustomer?.CreditDays)
    )
      .toJSON()
      .substring(0, 10),
      Cheque:paymentData?.ChequeAmt > 0 ? true : false,
      ChequeAmt:paymentData?.ChequeAmt || 0,
      ChequeNo: paymentData?.ChequeNumber || '',
      FKBankChequeID: paymentData?.BankChequeID || '',
      ChequeDate:paymentData.ChequeDate
      ? getChequeDate(paymentData.ChequeDate)
      : new Date().toJSON(),
    FKPartyID: selectedCustomer?.PKID,
    FKPostAccID: selectedCustomer?.AccountID,
    FKSeriesID:
      getState()?.transactionSlice?.creditNote?.selectedCreditNoteSeries?.PKID,
    PKID: singleCreditNoteDetail?.PKID,
    PostingAccount: selectedCustomer?.Account,
    ProdDtl: [],
    ReceivedAmt: getState()?.transactionSlice?.creditNote?.netAmount,
  };

  // console.log("Cart------", getState()?.transactionSlice?.creditNote?.cart);

  getState()
    ?.transactionSlice?.creditNote?.cart?.forEach((item2) => {
     
        var tempItem = Object.assign({});
        tempItem.InvoiceSrNo = 0;
        tempItem.FKInvoiceID = 0;
        tempItem.FKInvoiceSrId = 0;
        tempItem.Rate = item2?.selectedBatch?.Rate || item2.Rate || item2.selectedBatch?.SaleRate;
        tempItem.Qty = item2?.Qty;
        tempItem.MRP = item2?.selectedBatch?.MRP || item2.MRP,
        tempItem.FreeQty = 0;
        tempItem.FKProdID = item2?.selectedBatch?.FKProdID || item2?.FKProdID;
        tempItem.ModeForm = item2?.ModeForm || 0;
        tempItem.FKLotID = item2?.selectedBatch?.PklotId || item2?.FKLotID || item2?.PklotId || 0;
        item2?.SrNo ? tempItem.SrNo = item2?.SrNo : null;
        tempItem.TradeDisc = 0;
        tempItem.SchemeDisc = 0;
        tempItem.LotDisc = 0;
        tempItem.ReturnTypeID = item2?.ReturnTypeID || item2?.ReturnType
        salesCreditNoteBodyJSON.ProdDtl.push(tempItem);
    });

  const result = {
    isSuccessful: false,
    response: null,
  };

  // console.log("Body Json update credit Note------>>>>", salesCreditNoteBodyJSON);

  await axios
    .post(`api/transaction/SalesCrNote/CreateMobile`,JSON.stringify(salesCreditNoteBodyJSON))
    .then((response) => {
      // console.log("Response from update credit Note-----", response.data);
      if (response.data.Status === "success" && response.data?.Data?.ApiResponse?.ID > 0) {       
        result.isSuccessful = true;
        result.response = response.data.ApiResponse?.ID;
      } else {
        result.isSuccessful = false;
        result.response =
          response?.data?.Data?.ErrorMessage?.length > 0
            ? response?.data?.Data?.ErrorMessage[0]?.MessageCenter + " , "  + response?.data?.Data?.ErrorMessage[0]?.Message
            : response.data?.Data?.ApiResponse?.ID < 0 ?  response.data?.Data?.ApiResponse?.Response    :  response?.data?.WarningMessage[0]?.Message;
      }
    })
    .catch((error) => {
      result.isSuccessful = false;
      console.error("Create Credit Note ------>", error);
      result.response = error.message;
    });

  return result;
};
export const createSalesCreditNote = () => async (dispatch, getState) => {
  const paymentData = getState()?.transactionSlice?.creditNote?.paymentData;
  const selectedCustomer =
    getState()?.transactionSlice?.creditNote?.selectedCustomer;

    const getCardExpiryDate = dateStr => {
      var parts = dateStr.split('/');
      var month = parseInt(parts[0]).toString().padStart(2, '0');
      var year = parseInt(parts[1]);
      var lastDay = new Date(year, month, 0).getDate();
      var dateString = month + '/' + lastDay + '/' + `20${year}`; 
      return dateString;
    };

    const getChequeDate = dateString => {
      const [day, month, year] = dateString.split('/');
      var d = new Date(Date.UTC(year, month - 1, day, 0, 0, 0));
      return d.toISOString();
    };
  const salesCreditNoteBodyJSON = {
    Cash: paymentData?.CashAmt > 0 ? true : false,
    CashAmt: paymentData?.CashAmt || 0,
    Credit: paymentData?.CreditAmt > 0 ? true : false,
    CreditAmt: paymentData?.CreditAmt || 0,
    CreditCard: paymentData?.CreditCardAmt > 0 ? true : false,
    CreditCardAmt: paymentData?.CreditCardAmt || 0,
    CreditCardDate: paymentData.CreditCardDate
    ? getCardExpiryDate(paymentData.CreditCardDate)
    : new Date().toJSON(),
    CreditCardNo: paymentData?.CreditCardNo,
    CreditCardType: paymentData?.CreditCardType || 0,
    CreditDate: new Date(
      new Date().setDate(new Date().getDate() + selectedCustomer?.CreditDays)
    )
      .toJSON()
      .substring(0, 10),
      Cheque:paymentData?.ChequeAmt > 0 ? true : false,
      ChequeAmt:paymentData?.ChequeAmt || 0,
      ChequeNo: paymentData?.ChequeNumber || '',
      FKBankChequeID: paymentData?.BankChequeID || '',
      ChequeDate:paymentData.ChequeDate
      ? getChequeDate(paymentData.ChequeDate)
      : new Date().toJSON(),
    FKPartyID: selectedCustomer?.PKID,
    FKPostAccID: selectedCustomer?.AccountID,
    FKSeriesID:
      getState()?.transactionSlice?.creditNote?.selectedCreditNoteSeries?.PKID,
    PKID: 0,
    PostingAccount: selectedCustomer?.Account,
    ProdDtl: [],
    ReceivedAmt: getState()?.transactionSlice?.creditNote?.netAmount,
  };

  // console.log("FKlotID------", getState()?.transactionSlice?.creditNote);

  // console.log("Cart ----------", getState()?.transactionSlice?.creditNote?.cart)

  getState()
    ?.transactionSlice?.creditNote?.cart.filter((item) => item.ModeForm !== 2)
    .forEach((item2) => {
      if (item2.ModeForm === 2) {
      } else {
        var tempItem = Object.assign({});
        tempItem.InvoiceSrNo = 0;
        tempItem.FKInvoiceID = 0;
        tempItem.FKInvoiceSrId = 0;
        tempItem.MRP = item2?.selectedBatch?.MRP || item2.MRP,
        tempItem.Rate = item2?.selectedBatch?.SaleRate || item2.SaleRate;
        tempItem.Qty = item2?.Qty;
        tempItem.FreeQty = 0;
        tempItem.FKProdID = item2?.selectedBatch?.FKProdID || item2?.FKProdID || item2?.PKID;
        tempItem.ModeForm = 0;
        tempItem.FKLotID = item2?.selectedBatch?.PklotId || 0;
        tempItem.SrNo = 0;
        tempItem.TradeDisc = 0;
        tempItem.SchemeDisc = 0;
        tempItem.LotDisc = 0;
        tempItem.ReturnTypeID = item2?.ReturnType
        salesCreditNoteBodyJSON.ProdDtl.push(tempItem);
      }
    });

  const result = {
    isSuccessful: false,
    response: null,
  };

  // console.log("Body Json------>>>>", salesCreditNoteBodyJSON);

  await axios
    .post(`api/transaction/SalesCrNote/CreateMobile`,JSON.stringify(salesCreditNoteBodyJSON))
    .then((response) => {
      // console.log(" Credit note response----" , JSON.stringify(response.data))
      if (response.data.Status === "success" && response.data?.Data?.ApiResponse?.ID > 0) {       
        result.isSuccessful = true;
        result.response = response.data.ApiResponse?.ID;
      } else {
        // console.log("Iam asdadsfdf")
        result.isSuccessful = false;
        result.response =
          response?.data?.Data?.ErrorMessage?.length > 0
            ? response?.data?.Data?.ErrorMessage[0]?.MessageCenter + " , "  + response?.data?.Data?.ErrorMessage[0]?.Message
            :response.data?.Data?.ApiResponse?.ID < 0 ?  response.data?.Data?.ApiResponse?.Response    :  response?.data?.WarningMessage[0]?.Message;
      }
    })
    .catch((error) => {
      result.isSuccessful = false;
      console.error("Create Credit Note ------>", error);
      result.response = error.message;
    });

  return result;
};


export const getCreditNoteDetailsbyID = (item) => async(dispatch, getState) => {
    const result = {
      isSuccessful: false,
      data: null,
    }

    // console.log("Item PKID and FKSeries ID-----", item.PKID, item.FKSeriesID)

    let object = {};
    object.TransDetail = [];

let URL = `api/transaction/SalesCrNote/GetByID?id=${item.PKID}&FkID=${item.FKSeriesID}&FormName=CreditNote`;
    await axios
    .post(URL)
    .then((response) => {
        result.isSuccessful = true
        result.data = response.data;
        dispatch(TranSliceActions.setSingleCreditNoteDetail(response.data));
        
        // console.log("URL --->>>>>---------", URL);
        // console.log("response ------", response.data);
        object.Cash = response.data.Cash;
        object.CashAmt = response.data.CashAmt;
        object.Cheque = response.data.Cheque;
        object.ChequeAmt = response.data.ChequeAmt;
        object.Credit = response.data.Credit;
        object.CreditAmt = response.data.CreditAmt;
        object.DATE_MODIFIED = response.data.DATE_MODIFIED;
        object.EntryNo = response.data.EntryNo;
        object.EntryDate = response.data.EntryDate;
        object.FKPartyID = response.data.FKPartyID;
        object.FKSeriesID = response.data.FKSeriesID;
        object.FKUserID = response.data.FKUserID;
        object.ModeForm = response.data.ModeForm;
        object.NetAmt = response.data.NetAmt;
        object.PKID = response.data.PKID;
        object.Party = response.data.Party;
        object.ReturnTypes = response.data.ReturnTypes;
        object.Series = response.data.Series;
        object.TransDetail = response.data.TransDetail;
        dispatch(TranSliceActions.setObjectDetails(object));
    })
    .catch((err)=>{
      console.error("Get Single Credit Note Error ", err);
    })

    return result;
};


// export const getBankAccounts = (searchString) => async(dispatch) => {
//   let result = {
//     isSuccessful: false,
//     data: [],
//   }

//   let URL = searchString ?
//     `api/master/series/TranSetBankacc?pageSize=50&pageNo=1&search=${searchString}` 
//     : `api/master/series/TranSetBankacc?pageSize=50&pageNo=1` 

//   await axios
//   .post(URL)
//   .then((response) => {
//     console.log('Response from bank accounts api ', response)
//   })
//   .catch((err) => {
//     console.error("Bank accounts error ", err)
//   })
// }


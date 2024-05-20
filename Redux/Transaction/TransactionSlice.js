import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { Alert } from "react-native";

function generateUniqueId() {
  const timestamp = new Date().getTime().toString(36);
  const random = Math.random().toString(36).slice(2);
  return timestamp + random;
}

export const initialState = {
  objectDetails: null,
  DashboardTranReport: {
    isReportLoading: false,
    reportData: {
      SORD: [],
      SINV: [],
      RCPT: [],
      PORD: [],
    },
    reportDataError: null,
  },

  selectedCategoryWiseFilter: "Party",
  fromDateSal: new Date(),
  toDateSal: new Date(),
  fromDatePur: new Date(),
  toDatePur: new Date(),


  salesReport: {
    salesInvoiceReports: null,
    salesChallanReports: null,
    salesOrderReports: null,
  },
  purchaseReport: {
    purchaseInvoiceReports: null,
    purchaseOrderReports: null,
    purchaseChallanReports: null,
  },
  creditNote: {
    cart:[],
    creditNoteSeriesList:[],
    singleCreditNoteDetail: null,
    selectedCreditNoteSeries:[],
    selectedCustomer: null,
    isCameraOpen: false,
    paymentDetails: null,
    isPostingOrder: false,
    postOrderError: null,
    isNetAmountLoading: false,
    netAmount: null,
    netAmountError: null,
    lastAddedProduct: null,
    CashDisc: 0,
    CashDiscType: "U",
    paymentOptionEnabled: false,
    paymentData:[],
    returnTypeList:[],
    creditNoteList:[],
    selectedCreditNote: null,
    smallJson: null,
  },
  addedAccToLedger: [],
  vouchers: {
    vouchersList: [],
    accountList: [],
    selectedAccount: [],
    selectedAccountDetails: [],
    voucherSeriesList: [],
    selectedVoucherSeries: [],
    accountToEditInLedger: [],
    singleVoucherDetail: [],
    inputAmt: [],
    // selectedVoucher: null,
  },
  costCenter: {
    costCenterList: [],
    addedCostCenterList: [],
    mainAddedCostCenterList: [],
  },
  editVoucher: {
    editSelectedAccount: [],
    editAddedAccToLedger: [],
    accToEditInEditableAccount: [],
    
  },
};

export default TransactionSlice = createSlice({
  name: "transactionSlice",
  initialState,
  reducers: {
    setObjectDetails(state, action){
      state.objectDetails = action.payload;
    },
    setIsReportDataLoading(state, action) {
      state.DashboardTranReport.isReportLoading = action.payload;
    },
    getReportDataSuccess(state, action) {
      state.DashboardTranReport.isReportLoading = false;
      state.DashboardTranReport.reportData =
        state.DashboardTranReport.reportData((prevSeries) => ({
          ...prevSeries,
          [action.payload.tranAlias]: action.payload.data,
        }));
    },
    getReportDataFailure(state, action) {
      state.DashboardTranReport.isReportLoading = false;
      state.DashboardTranReport.reportDataError = action.payload;
    },
    setFromDateSal(state, action) {
      state.fromDateSal = action.payload;
    },
    setToDateSal(state, action) {
      state.toDateSal = action.payload;
    },
    setFromDatePur(state, action) {
      state.fromDatePur = action.payload;
    },
    setToDatePur(state, action) {
      state.toDatePur = action.payload;
    },
    setSalesReport(state, action) {
      if (action.payload.tranAlias === "SINV") {
        state.salesReport.salesInvoiceReports = action.payload.Data;
      } else if (action.payload.tranAlias === "SORD") {
        state.salesReport.salesOrderReports = action.payload.Data;
      } else if(action.payload.tranAlias === "SPSL") {
        state.salesReport.salesChallanReports = action.payload.Data;
      }
    },
    setPurchaseReport(state, action) {
      if (action.payload.tranAlias === "PINV") {
        state.purchaseReport.purchaseInvoiceReports = action.payload.Data;
      } else if (action.payload.tranAlias === "PORD") {
        state.purchaseReport.purchaseOrderReports = action.payload.Data;
      } else if (action.payload.tranAlias === "PPSL") {
        state.purchaseReport.purchaseChallanReports = action.payload.Data;
      }
    },

    // ------------------CreditNote Part Starts here ---------------------
    setSelectedCustomer(state, action) {
      if (action.payload.tranAlias == "creditNote" || action.payload.tranAlias == "editCreditNote") {
        state.creditNote.selectedCustomer = action.payload.customerDetails;
      }
    },
    setNetAmount(state, action) {
     state.creditNote.netAmount = action.payload
    },
    // setSmallJson(state, action) {
    //   state.creditNote.smallJson = action.payload;
    // },
    setSelectedCreditNote(state, action) {
      state.creditNote.selectedCreditNote = action.payload;
    },
    setSingleCreditNoteDetail(state, action) {
      state.creditNote.singleCreditNoteDetail  = action.payload
    },
    setCreditNoteSeriesList(state, action) {
      state.creditNote.creditNoteSeriesList = action.payload
    },
    setSelectedCreditNoteSeries(state, action) {
      state.creditNote.selectedCreditNoteSeries = action.payload
    },
    setPaymentData(state, action) {
      state.creditNote.paymentData = action.payload
    },

  setEmptyLastAddedProductAndCustomer(state, action) {
    state.creditNote.selectedCustomer = null;
    state.creditNote.lastAddedProduct=null;
  },
  setReturnTypeList(state, action) {
    state.creditNote.returnTypeList = action.payload
  },

    toggleCamera(state, action) {
      state.creditNote.isCameraOpen = !state.creditNote.isCameraOpen;
    },
    addProductToCart(state, action) {
      // console.log("Prod Details -=>>>>>>>>>>",action.payload)
      if (state?.creditNote?.cart?.length) {

        if(action.payload.SrNo){
          state.creditNote.cart?.push(action.payload)
        }
        else{
          let includesObject = state.creditNote.cart?.some(item => item.IsBatchApplied ? (item.FKProdID == action.payload.FKProdID && (item?.selectedBatch?.PklotId == action?.payload?.selectedBatch?.PklotId || item?.FKLotID == action?.payload?.selectedBatch?.PklotId) && item.selectedBatch.Batch == action.payload.selectedBatch.Batch) : item.FKProdID == action.payload.FKProdID);
          if(includesObject){
            state.creditNote.cart?.forEach(prod => {
              if(prod.IsBatchApplied){
                if(prod.FKProdID == action.payload.FKProdID){
                  if((prod?.selectedBatch?.PklotId == action?.payload?.selectedBatch?.PklotId || prod?.FKLotID == action?.payload?.selectedBatch?.PklotId)){
                    if(prod.selectedBatch.Batch == action.payload.selectedBatch.Batch){
                      prod.Qty = JSON.parse(prod.Qty) + JSON.parse(action.payload.Qty);
                      prod.ReturnType = action.payload.ReturnType;
                      prod.ReturnTypeName = action.payload.ReturnTypeName
                    }
                  }
                }
              }
              else{
                if(prod.FKProdID == action.payload.FKProdID){
                  prod.Qty = JSON.parse(prod.Qty) + JSON.parse(action.payload.Qty)
                }
                // else{
                //   state.creditNote.cart?.push(action.payload);
                // }
              }
            })
          }
          else{
            state.creditNote.cart?.push(action.payload);
          }

        }
      } else {
        state.creditNote.cart = [action.payload];
      }
      // state.creditNote.cart = [...state.creditNote.cart,action.payload]
    },
    editProductInCart(state, action) {

      if (state?.creditNote?.cart?.length) {
        if(action.payload.SrNo){
          let temp1 = state?.creditNote?.cart?.filter((sprod) => sprod.SrNo != action.payload.SrNo);
          state.creditNote.cart = temp1;
        }
        else{
          let newCart = [];
          state?.creditNote?.cart?.forEach((prod) => {
            if(prod.IsBatchApplied){
              if(prod?.FKProdID==action?.payload?.FKProdID && prod?.selectedBatch?.PklotId==action?.payload?.selectedBatch?.PklotId && prod?.selectedBatch?.Batch==action?.payload?.selectedBatch?.Batch){
              }
              else{
                newCart.push(prod);
              }
            }
            else{
              if(prod.FKProdID==action.payload.FKProdID){
              }
              else{
                newCart.push(prod);
              }
            }
          })
          state.creditNote.cart = newCart;
        }
      } else {
        state.creditNote.cart = [] ;
      }
    },
    deleteProductFromCart(state, action) {
      // console.log("Action Payload -----", action.payload);

      if (state?.creditNote?.cart?.length ) {
        if(action.payload.SrNo){
          state?.creditNote?.cart?.forEach((sprod) => {
            if(sprod.SrNo == action.payload.SrNo){
              sprod.ModeForm = 2;
            }
          });
        }
        else{
          let newCart = [];
          state?.creditNote?.cart?.forEach((prod) => {
            if(prod.IsBatchApplied){
              if(prod.FKProdID==action.payload.FKProdID && prod.selectedBatch.PklotId==action.payload.selectedBatch.PklotId && prod.selectedBatch.Batch==action.payload.selectedBatch.Batch){
              }
              else{
                newCart.push(prod);
              }
            }
            else{
              if(prod.FKProdID==action.payload.FKProdID){
              }
              else{
                newCart.push(prod);
              }
            }
          })
          state.creditNote.cart = newCart;
        }
      } else {
        state.creditNote.cart = [] ;
      }
    },
    setProdToCart(state, action) {
      state.creditNote.cart = action.payload;
    },
    emptyCart(state, action) {
      state.creditNote.cart = [];
    },
    setPaymentOptionEnabled(state, action) {
      state.creditNote.paymentOptionEnabled = action.payload;
    },
    setCreditNoteList(state,action){
      state.creditNote.creditNoteList = action.payload
    },

    // ------------------CreditNote Part Ends here -----------------------

    // *******************Voucher Parts Starts here*******************
    setAccountList(state, action) {
      state.vouchers.accountList = action.payload;
    },

    setInputAmt(state, action) {
      state.vouchers.inputAmt = action.payload;
    },

    setSelectedAccount(state, action) {
      state.vouchers.selectedAccount = action.payload;
    },
    setSelectedAccountDetails(state, action) {
      state.vouchers.selectedAccountDetails = action.payload;
    },
    setBlankSelectedAccount(state, action) {
      state.vouchers.selectedAccount = [];
    },
    setAddedAccToLedger(state, action) {
      if (state?.addedAccToLedger?.length > 0) {
        var temp = state.addedAccToLedger?.filter((acc) => {
          return (
            acc.FKAccountID == action.payload.FKAccountID &&
            acc.FKPartyID == action.payload.FKPartyID
          );
        });

        if (temp?.length > 0) {
          state.addedAccToLedger.forEach((item) => {
            if (
              item.FKAccountID === action.payload.FKAccountID &&
              item.FKPartyID === action.payload.FKPartyID
            ) {
              Alert.alert("Hold on", "Same Party not allowed");
            }
          });
        } else {
          state.addedAccToLedger = [...state?.addedAccToLedger, action.payload];
        }
      } else {
        state.addedAccToLedger = [action.payload];
      }
    },
    setBlankAddedAccToLedger(state, action) {
      state.addedAccToLedger = [];
    },

    setEditableVoucherAccToLedger(state, action) {
      state.addedAccToLedger = action.payload;
    },
    setVoucherSeriesList(state, action) {
      state.vouchers.voucherSeriesList = action.payload;
    },
    setSelectedVoucherSeries(state, action) {
      state.vouchers.selectedVoucherSeries = action.payload;
    },
    deleteAccFromLedger(state, action) {
      var temp = state.addedAccToLedger.filter((acc) => {
        return (
          acc?.FKAccountID !== action.payload.FKAccountID ||
          acc?.VoucherAmt !== action.payload.VoucherAmt
        );
      });
      state.addedAccToLedger = temp;
    },
    editAccountFromLedger(state, action) {
      var temp = state.addedAccToLedger.filter((acc) => {
        return (
          acc?.UniqueID !== action.payload.UniqueID 
        );
      });

      state.addedAccToLedger = temp;
      state.vouchers.accountToEditInLedger = action.payload;
    },
    setCostCenterList(state, action) {
      state.costCenter.costCenterList = action.payload;
    },
    setAddedCostCenterList(state, action) {
      if (
        state.costCenter.addedCostCenterList.filter(
          (item) =>{
           if(item.UniqueID === action.payload.UniqueID) {
             if (item.FKCostCenterID === action.payload.FKCostCenterID) {
               return item;
             }
           }
          } 
        ).length
      ) {
            Alert.alert("Hold On !", "Cost Center Already exists !");
      } else {
        state.costCenter.addedCostCenterList = [
          ...state.costCenter.addedCostCenterList,
          action.payload,
        ];
      }
    },
    setCostCenterInAccEditing(state, action) {
      state.costCenter.addedCostCenterList = action.payload;
    },
    editCostCenterInMainVoucher(state, action) {
      state.costCenter.addedCostCenterList = action.payload;
    },
    editCostCenter(state, action) {
      var tempCostCenter = state.costCenter?.addedCostCenterList?.filter(
        (item) => item.FKCostCenterID !== action.payload.FKCostCenterID
      );
      state.costCenter.addedCostCenterList = tempCostCenter;
    },
    deleteCostCenter(state, action) {
      var tempCostCenter = state.costCenter?.addedCostCenterList?.filter(
        (item) => item.FKCostCenterID !== action.payload.FKCostCenterID
      );
      state.costCenter.addedCostCenterList = tempCostCenter;
    },
    editCostCenterInVoucherEditing(state,action){
      var tempCostCenter = state.costCenter?.addedCostCenterList?.filter(
        (item) => item.FKCostCenterID !== action.payload.FKCostCenterID && item.SrNo !== action.payload.SrNo
      );
      state.costCenter.addedCostCenterList = tempCostCenter;
    },
    deleteCostCenterInVoucherEditing(state, action) {
     state.costCenter?.addedCostCenterList?.forEach(
        (item) => {
          if (
            item.FKCostCenterID === action.payload.FKCostCenterID &&
            item.SrNo === action.payload.SrNo
          ) {
            item.ModeForm = 2
          }
        }
      );
     
    },
    setBlankCostCenter(state, action) {
      state.costCenter.addedCostCenterList = [];
    },
    setVouchersList(state, action) {
      state.vouchers.vouchersList = action.payload;
    },
    setSingleVoucherDetail(state, action) {
      state.vouchers.singleVoucherDetail = action.payload;
    },
   
    setEditSelectedAccount(state, action) {
      state.editVoucher.editSelectedAccount = action.payload;
    },
    setBlankEditSelectedAccount(state, action) {
      state.editVoucher.editSelectedAccount = [];
    },
    setEditAddedAccToLedger(state, action) {
      state.editVoucher.editAddedAccToLedger = action.payload;
    },
   
    editAccFromEditableList(state, action) {
      var temp = state.editVoucher.editAddedAccToLedger.filter((acc) => {
        return (
          acc?.FKAccountID !== action.payload.FKAccountID &&
          acc?.SrNo !== action.payload.SrNo
        );
      });
      state.editVoucher.editAddedAccToLedger = temp;
      state.editVoucher.accToEditInEditableAccount = action.payload;
    },
   
    deleteAccFromEditableList(state, action) {
      state.editVoucher.editAddedAccToLedger.forEach((item) => {
        if (
          item.FKAccountID === action.payload.FKAccountID ||
          item.FKPartyID === action.payload.FKPartyID
        ) {
          item.ModeForm = 2;
        }
      });
    },
    addAccToLedgerInEditing(state, action) {
      if (state.editVoucher.editAddedAccToLedger?.length > 0) {
        var temp = state.editVoucher.editAddedAccToLedger?.filter((acc) => {
          return (
            acc.FKAccountID == action.payload.FKAccountID &&
            acc.FKPartyID == action.payload.FKPartyID
          );
        });

        if (temp?.length > 0) {
          state.editVoucher.editAddedAccToLedger.forEach((item) => {
            if (
              item.FKAccountID === action.payload.FKAccountID &&
              item.FKPartyID === action.payload.FKPartyID
            ) {
              Alert.alert("Hold on", "Same Party not allowed");
            }
          });
        } else {
          state.editVoucher.editAddedAccToLedger = [
            ...state?.editVoucher.editAddedAccToLedger,
            action.payload,
          ];
        }
      } else {
        state.editVoucher.editAddedAccToLedger = [
          ...state?.editVoucher.editAddedAccToLedger,
          action.payload,
        ];
      }
    },

    EditAccInEditableList(state, action) {
      state.editVoucher.accToEditInEditableAccount.forEach((item) => {});
    },

    setBlankAccFromEditablelist(state, action) {
      state.editVoucher.accToEditInEditableAccount = [];
    },
    setBlankSingleVoucherDetail(state, action) {
      state.vouchers.singleVoucherDetail = [];
    },
    setBlankEditAddedAccToLedger(state, action) {
      state.editVoucher.editAddedAccToLedger = [];
    },
    setSelectedVoucher(state, action){
      state.vouchers.selectedVoucher = action.payload;
    }
   
  },
});

export const TranSliceActions = TransactionSlice.actions;

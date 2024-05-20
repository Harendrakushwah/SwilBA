import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';

export const initialState = {
  isLogged: false,
  loguserDtl: {},
  isValid: false,
  isAuthorized: false,
  isNetConnected: false,
  deviceOrientation: [],
  deviceType: [],
  headerData: null,
  // inputDays: 0,
  fromDate: new Date(),
  toDate: new Date(),
  fromDateExpiry: null,
  toDateExpiry: new Date(),
  defaultDashboardData: null,
  defaultDashboardDataFailure: null,
  dashboard: {
    isDashboardDataLoding: false,
    dashboardData: null,
    dashboardDataError: null,
  },
  Inventory: {
    expiryStock: null,
    excessStock: null,
    nonMovingStock: null,
    saleBelowCostRate: [],
    excessDiscount: [],
    rateDifference: [],
    excessScheme: [],
    dateInput: {
      saleBelowCostRate: 1,
      excessDiscount: 1,
      rateDifference: 1,
      excessScheme: 1,  
    }
  },

  Accounts: {
    receivablesReport: null,
    payablesReport: null,
    customerList: [],
    isCustomerListLoading: false,
    customerListError: null,
    fullReportData: [],
    fullReportDataError: null,
    customerPayableData: [],
    customerPayableError: null,
  },

  product: {
    isProductListLoading: false,
    productList: [],
    productError:null
  },
  lastAddedProduct: null,
};

const CommonSlice = createSlice({
  name: 'commonSlice',
  initialState: initialState,
  reducers: {
    setUserLogState(state, action) {
      state.isLogged = action.payload.result;
      state.loguserDtl = action.payload.loguserDtl;
    },
    logUserOut() {
      return initialState;
    },
    setIsNetConnected(state, action) {
      state.isNetConnected = action.payload;
    },
    setIsAuthorized(state, action) {
      state.isValid = action.payload;
    },
    setHeaderData(state, action) {
      state.headerData = action.payload;
    },
    setFromDate(state, action) {
      state.fromDate = action.payload
    },
    setToDate(state, action) {
      state.toDate = action.payload
    },
    setFromDateExpiry(state, action) {
      state.fromDateExpiry = action.payload
    },
    setToDateExpiry(state, action) {
      state.toDateExpiry = action.payload
    },
    setDefaultDashboardData(state, action) {
      state.defaultDashboardData = action.payload;
    },
    setDefaultDashboardDataFailure(state, action) {
      state.defaultDashboardDataFailure = action.payload;
    },
    setIsDashboardDataLoding(state, action) {
      state.dashboard.isDashboardDataLoding = action.payload;
    },
    setDashboardDataSuccess(state, action) {
      state.dashboard.dashboardData = action.payload;
      state.dashboard.isDashboardDataLoding = false;
    },
    setDashboardDataFailure(state, action) {
      state.dashboard.isDashboardDataLoding = false;
      state.dashBoardDataError = action.payload;
    },
    setFullReportData(state, action) {
      state.Accounts.fullReportData = action.payload;
    },
    setFullReportDataError(state, action) {
      state.Accounts.fullReportDataError = action.payload;
    },
    setCustomerPayableData(state, action){
      state.Accounts.customerPayableData = action.payload;
    },
    setCustomerPayableError(state, action){
      state.Accounts.customerPayableError = action.payload;
    },
    // setInputDays(state, action) {
    //   state.inputDays = action.payload;
    // },
    setExpiryStock(state, action) {
      state.Inventory.expiryStock = action.payload;   
    },
    setExcessStock(state, action) {
      state.Inventory.excessStock = action.payload;
    },
    setNonMovingStock(state, action) {
      state.Inventory.nonMovingStock = action.payload;
    },
    setSaleBelowCostRate(state, action) {
      state.Inventory.saleBelowCostRate = action.payload;
    },
    setExcessDiscount(state, action) {
      state.Inventory.excessDiscount = action.payload;
    },
    setRateDifference(state, action){
      state.Inventory.rateDifference = action.payload;
    },
    setExcessScheme(state, action){
      state.Inventory.excessScheme = action.payload;
    },
    setSbcrInput(state, action){
      state.Inventory.dateInput.saleBelowCostRate = action.payload;
    },
    setRateDiffInput(state, action){
      state.Inventory.dateInput.rateDifference = action.payload;
    },
    setExcDisInput(state, action){
      state.Inventory.dateInput.excessDiscount = action.payload;
    },
    setExcSchInput(state, action){
      state.Inventory.dateInput.excessScheme = action.payload;
    },
    setReceivablesReport(state, action){
      state.Accounts.receivablesReport = action.payload;
    },
    setPayablesReport(state, action){
      state.Accounts.payablesReport = action.payload;
    },
    setDeviceType(state, action) {
      state.deviceType = action.payload;
    },
    setDeviceOrientation(state, action) {
      state.deviceOrientation = action.payload;
    },
    setCustomerLoading(state, action) {
      state.Accounts.isCustomerListLoading = action.payload;
    },
    setCustomerList(state, action) {
      // console.log("State----->>>", action.payload);
      state.Accounts.customerList = action.payload;
    },
    setCustomerListError(state, action) {
      state.Accounts.customerListError = action.payload;
    },
    lastAddedProduct(state, action) {
      state.lastAddedProduct = action.payload;
    },
    setProductListLoading(state, action) {
      state.product.isProductListLoading = action.payload;
    },
    setProductListSuccess(state, action) {
      state.product.productList = action.payload;
      state.product.isProductListLoading = false;
    },
    setProductListFailure(state, action) {
      state.product.productError = action.payload
      state.product.isProductListLoading = false;
    }
  },
});

export const CommonSliceActions = CommonSlice.actions;

export default CommonSlice;

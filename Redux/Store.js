import {persistStore, persistReducer} from 'redux-persist';
import {combineReducers, configureStore} from '@reduxjs/toolkit';
import thunk from 'redux-thunk';
import AsyncStorage from '@react-native-async-storage/async-storage';
import createFilter, {createWhitelistFilter} from 'redux-persist-transform-filter';
import TransactionSlice from './Transaction/TransactionSlice';
import CommonSlice, { initialState } from './Common/CommonSlice';
import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2';
import { initialState as initialState2 } from './Transaction/TransactionSlice';

const saveSubsetFilter = createFilter(
  'commonSlice',
  ['isLogged', 'loguserDtl'],
);

const transactionSliceFilter = createFilter(
  'transactionSlice',
  ['vouchers.selectedVoucherSeries','creditNote.selectedCreditNoteSeries',]
)


const getInitialState = () => initialState;
const getInitialState2 = () => initialState2

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  transforms: [saveSubsetFilter, transactionSliceFilter],
  default : [getInitialState, getInitialState2],
  stateReconciler: autoMergeLevel2,
};

const reducer = combineReducers({
  transactionSlice: TransactionSlice.reducer,
  commonSlice: CommonSlice.reducer,
});

const persistedAsyncReducer = persistReducer(persistConfig, reducer);

export const store = configureStore({
  reducer: persistedAsyncReducer,
  middleware: [thunk],
});

export const persistor = persistStore(store);

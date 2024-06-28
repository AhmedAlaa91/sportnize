import { legacy_createStore as  createStore, applyMiddleware } from 'redux';
import {thunk} from 'redux-thunk';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // defaults to localStorage for web and AsyncStorage for react-native

import index from '../reducer/index';

const persistConfig = {
  key: 'root',
  storage,
  // Add other config options if needed
};

const persistedReducer = persistReducer(persistConfig, index);

export const store = createStore(index, applyMiddleware(thunk));

export const persistor = persistStore(store);

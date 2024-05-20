/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import 'react-native-gesture-handler';
import {Provider} from 'react-redux';
import {persistor, store} from './src/Components/Redux/Store';
import {PersistGate} from 'redux-persist/integration/react';
import 'react-native-reanimated';

const Main = () => {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <App />
      </PersistGate>
    </Provider>
  );
};

AppRegistry.registerComponent(appName, () => Main);

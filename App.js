import React from 'react';
import {
  Platform,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import PropTypes from 'prop-types';
import { AppLoading } from 'expo';
import * as Icon from '@expo/vector-icons';
import * as Font from 'expo-font';
import { Asset } from 'expo-asset';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import Reactotron from 'reactotron-react-native';

import AppNavigator from './navigation/AppNavigator';
import { store, persistor } from './store/store';
import i18n from './languages';

import { setNetworkConnectivity } from './store/actions/networkConnectivity.actions';


// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});

// App
let netInfoSubscribe;
class App extends React.Component {
  constructor() {
    super();
    this.state = {
      isLoadingComplete: false,
    };
  }

  componentDidMount() {
    // initial detection
    NetInfo.isConnected.fetch().then((isConnected) => {
      this.handleConnectivityChange(isConnected);
    });
    // add network connectivity handler
    netInfoSubscribe = NetInfo.isConnected.addEventListener('connectionChange', this.handleConnectivityChange);
    if (__DEV__) {
      // Reactotron can be used to see AsyncStorage data and API requests
      // If Reactotron gets no connection, this is the solution that worked for me (cairocoder01: 2019-08-15)
      // https://github.com/expo/expo-cli/issues/153#issuecomment-358925525
      // May need to then run this before `npm start`: `adb reverse tcp:9090 tcp:9090`
      Reactotron
        .configure() // controls connection & communication settings
        .useReactNative() // add all built-in react native plugins
        .connect(); // let's connect!
    }
  }

  componentWillUnmount() {
    // remove network connectivity handler
    netInfoSubscribe.remove();
  }

  handleConnectivityChange = (isConnected) => {
    // detect conectivity change (This only says if a device has an active connection, not that it is able to reach the internet)
    if (isConnected) {
      // Check if the phone has internet
      fetch('https://8.8.8.8')
        .then(() => {
          store.dispatch(setNetworkConnectivity(true));
        }).catch(() => {
          store.dispatch(setNetworkConnectivity(false));
        });
    } else {
      store.dispatch(setNetworkConnectivity(false));
    }
  }

  loadResourcesAsync = async () => Promise.all([
    Asset.loadAsync([
      require('./assets/images/robot-dev.png'),
      require('./assets/images/robot-prod.png'),
    ]),
    Font.loadAsync({
      // This is the font that we are using for our tab bar
      ...Icon.Ionicons.font,
      // We include SpaceMono because we use it in HomeScreen.js. Feel free
      // to remove this if you are not using it in your app
      'space-mono': require('./assets/fonts/SpaceMono-Regular.ttf'),
    }),
  ]);

  handleLoadingError = (error) => {
    // In this case, you might want to report the error to your error
    // reporting service, for example Sentry
    // eslint-disable-next-line no-console
    console.warn(error);
  };

  handleFinishLoading = () => {
    this.setState({ isLoadingComplete: true });

    // Initialize language from redux store after it has been hydrated
    const state = store.getState();
    i18n.setLocale(state.i18nReducer.locale);
  };

  render() {
    const AppContainer = (
      <View style={styles.container}>
        {Platform.OS === 'ios' && <StatusBar barStyle="default" />}
        <AppNavigator />
      </View>
    );

    if (!this.state.isLoadingComplete && !this.props.skipLoadingScreen) {
      return (
        <AppLoading
          startAsync={this.loadResourcesAsync}
          onError={this.handleLoadingError}
          onFinish={this.handleFinishLoading}
        />
      );
    }

    return (
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          {AppContainer}
        </PersistGate>
      </Provider>
    );
  }
}

App.propTypes = {
  skipLoadingScreen: PropTypes.bool,
};
App.defaultProps = {
  skipLoadingScreen: false,
};
export default App;

import React from 'react';
import { connect } from 'react-redux';
import {
  View,
  Button,
  Text,
} from 'react-native';
import { Fab, Icon } from 'native-base';
import Toast from 'react-native-easy-toast';
import PropTypes from 'prop-types';
import { logout } from '../store/actions/user.actions';
import { toggleNetworkConnectivity } from '../store/actions/networkConnectivity.actions';
import i18n from '../languages';

const propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }).isRequired,
  isConnected: PropTypes.bool.isRequired,
  userData: PropTypes.shape({
    domain: PropTypes.string,
    username: PropTypes.string,
  }).isRequired,
  logout: PropTypes.func.isRequired,
  toggleNetworkConnectivity: PropTypes.func.isRequired,
};

class SettingsScreen extends React.Component {
  static navigationOptions = {
    title: i18n.t('settingsScreen.settings'),
  };

  constructor() {
    super();
    this.state = { iconName: 'ios-flash' };
  }

  componentDidMount() {
    this.setNetworkConnectivityIcon(this.props.isConnected);
  }


  setNetworkConnectivityIcon = (isConnected) => {
    this.setState({ iconName: isConnected ? 'ios-flash' : 'ios-flash-off' });
  }

  toggleNetworkConnectivityIcon = (isConnected) => {
    this.setNetworkConnectivityIcon(!isConnected);
  }

  signOutAsync = async () => {
    this.props.logout();
    // await AsyncStorage.removeItem('@KeyStore:token');
    this.props.navigation.navigate('Auth');
  };

  onFABPress = () => {
    this.toggleNetworkConnectivityIcon(this.props.isConnected);
    const toastMsg = this.props.isConnected ? i18n.t('settingsScreen.networkUnavailable') : i18n.t('settingsScreen.networkAvailable');
    this.toast.show(toastMsg);
    this.props.toggleNetworkConnectivity(this.props.isConnected);
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <View>
          <Text style={{ color: 'rgba(0,0,0,0.4)' }}>
            {i18n.t('settingsScreen.domain')}
            {this.props.userData.domain}
          </Text>
          <Text style={{ color: 'rgba(0,0,0,0.4)' }}>
            {`${i18n.t('settingsScreen.signedInAs')}:`}
            {this.props.userData.username}
          </Text>
          <Button title={i18n.t('settingsScreen.signOut')} onPress={this.signOutAsync} />
        </View>
        <Fab
          style={{ backgroundColor: '#E74C3C' }}
          position="bottomRight"
          onPress={() => this.onFABPress()}
        >
          <Icon name={this.state.iconName} />
        </Fab>
        <Toast ref={(c) => { this.toast = c; }} position="center" />
      </View>
    );
  }
}

SettingsScreen.propTypes = propTypes;

const mapStateToProps = state => ({
  isConnected: state.networkConnectivityReducer.isConnected,
  userData: state.userReducer.userData,
});
const mapDispatchToProps = dispatch => ({
  toggleNetworkConnectivity: (isConnected) => {
    dispatch(toggleNetworkConnectivity(isConnected));
  },
  logout: () => {
    dispatch(logout());
  },
});
export default connect(mapStateToProps, mapDispatchToProps)(SettingsScreen);

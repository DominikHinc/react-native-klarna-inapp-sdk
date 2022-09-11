/**
 * Sample React Native App
 *
 * adapted from App.js generated by the following command:
 *
 * react-native init example
 *
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import {Node} from 'react';
import React, {useRef, useState} from 'react';
import {
  Button,
  NativeModules,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  useColorScheme,
  View,
} from 'react-native';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import KlarnaPaymentView from 'react-native-klarna-inapp-sdk';

const App: () => Node = () => {
  const [state, setState] = useState({});

  const paymentViewRefs = [];

  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  const actionButtons = paymentMethodName => {
    return (
      <View style={styles.buttonsContainer}>
        <Button
          onPress={() => {
            paymentViewRefs[paymentMethodName].current.initialize(
              authToken,
              'returnUrl://',
            );

            //You can skip this line, it's for integration testing purposes by Klarna.
            if (Platform.OS === 'android') {
              NativeModules.DebugWebViewModule.enable();
            }
          }}
          title="Init."
          {...testProps('initButton_' + paymentMethodName)}
          style={styles.button}
        />
        <Button
          onPress={() => {
            paymentViewRefs[paymentMethodName].current.load();
          }}
          title="Load"
          {...testProps('loadButton_' + paymentMethodName)}
          style={styles.button}
        />
        <Button
          onPress={() => {
            paymentViewRefs[paymentMethodName].current.authorize();
          }}
          title="Authorize"
          {...testProps('authorizeButton_' + paymentMethodName)}
          style={styles.button}
        />
        <Button
          onPress={() => {
            paymentViewRefs[paymentMethodName].current.reauthorize();
          }}
          title="Reauthorize"
          {...testProps('reauthorizeButton_' + paymentMethodName)}
          style={styles.button}
        />
        <Button
          onPress={() => {
            paymentViewRefs[paymentMethodName].current.finalize();
          }}
          title="Finalize"
          {...testProps('finalizeButton_' + paymentMethodName)}
          style={styles.button}
        />
      </View>
    );
  };

  const onEvent = (event, paymentMethodName) => {
    const newState = state;
    newState[paymentMethodName] = JSON.stringify(event.nativeEvent);
    setState(newState);
    window.console.warn(JSON.stringify(event.nativeEvent));
  };

  const renderSetTokenInput = () => {
    if (authToken === '') {
      return (
        <TextInput
          style={styles.tokenInput}
          placeholder="Set token here..."
          multiline={true}
          blurOnSubmit={true}
          {...testProps('setTokenInput')}
          onChangeText={text => {
            authToken = text;
          }}
        />
      );
    }
  };

  const renderPaymentMethod = paymentMethodName => {
    const paymentMethod = useRef();
    paymentViewRefs[paymentMethodName] = paymentMethod;
    return (
      <View style={styles.container} key={paymentMethodName}>
        <Text style={styles.title}>{paymentMethodName}</Text>
        <KlarnaPaymentView
          ref={paymentMethod}
          style={styles.paymentView}
          category={paymentMethodName}
          onInitialized={event => {
            onEvent(event, paymentMethodName);
          }}
          onLoaded={event => {
            onEvent(event, paymentMethodName);
          }}
          onAuthorized={event => {
            onEvent(event, paymentMethodName);
          }}
          onReauthorized={event => {
            onEvent(event, paymentMethodName);
          }}
          onFinalized={event => {
            onEvent(event, paymentMethodName);
          }}
          onError={event => {
            onEvent(event, paymentMethodName);
          }}
        />
        {actionButtons(paymentMethodName)}
        <Text
          style={{color: 'gray'}}
          {...testProps('state_' + paymentMethodName)}>
          {state[paymentMethodName]}
        </Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={backgroundStyle}>
        <View
          style={{
            backgroundColor: isDarkMode ? Colors.black : Colors.white,
          }}>
          <Text style={styles.header}>☆Klarna Payments Test App</Text>
          {renderSetTokenInput()}
          {paymentMethods.map(paymentMethod => {
            return renderPaymentMethod(paymentMethod);
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

let authToken = ''; // set your token here

const paymentMethods = [
  'pay_now',
  'pay_later',
  'pay_over_time',
  'pay_in_parts',
];

const styles = StyleSheet.create({
  outer: {
    flex: 1,
    flexGrow: 1,
  },
  scrollView: {
    flex: 1,
    flexGrow: 1,
  },
  scrollViewContentContainer: {
    justifyContent: 'space-between',
  },
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
    width: '100%',
  },
  header: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  paymentView: {
    width: '100%',
    flexGrow: 1,
  },
  title: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    margin: 10,
  },
  tokenInput: {
    flexDirection: 'column',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderColor: 'gray',
    height: 40,
    borderWidth: 1,
    padding: 10,
    marginLeft: 20,
    marginRight: 20,
    marginBottom: 10,
  },
  button: {
    height: 10,
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;

export function testProps(id) {
  return Platform.OS === 'android'
    ? {testID: id, accessibilityLabel: id}
    : {testID: id};
}

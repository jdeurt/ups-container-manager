import { StatusBar } from 'expo-status-bar';
import { Platform, Pressable, StyleSheet } from 'react-native';
import * as WebBrowser from 'expo-web-browser';

import EditScreenInfo from '../components/EditScreenInfo';
import { Text, View } from '../components/Themed';

import APP_DATA from '../app.json';

export default function ModalScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>UPS Container Manager v{APP_DATA.expo.version}-alpha</Text>
      <Text style={{
        marginTop: 20,
        marginBottom: 20
      }}>Developed by Juan de Urtubey</Text>
      <Pressable onPress={() => {
        WebBrowser.openBrowserAsync('https://jdeurt.xyz');
      }}>
        <Text style={{ color: '#0074D9' }}>jdeurt.xyz</Text>
      </Pressable>

      {/* Use a light status bar on iOS to account for the black space above the modal */}
      <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
    alignItems: 'center'
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
});

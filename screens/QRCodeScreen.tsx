import { StatusBar } from 'expo-status-bar';
import { Platform, StyleSheet, Image, Dimensions, FlatList } from 'react-native';
import * as WebBrowser from 'expo-web-browser';

import EditScreenInfo from '../components/EditScreenInfo';
import { Text, View } from '../components/Themed';

export default function QRCodeModalScreen({ navigation, route }: { navigation: any, route: any }) {
  return (
    <View style={styles.container}>
      <View style={styles.qrCodeImgContainer}>
        <Image
          source={{
            uri: `https://api.jdeurt.xyz/qr-code?data=${(route.params.container.data || [0]).join('%0d')}`
          }}
          style={styles.qrCodeImg}
        ></Image>
      </View>

      <Text style={styles.title2}>Items in container {route.params.container._id}: ({route.params.container.data.length})</Text>

      <FlatList
        style={{ width: '100%' }}
        data={route.params.container.data}
        renderItem={({ item }) => (
          <View style={styles.listItemContainer}>
            <Text style={styles.listItem}>{item}</Text>
          </View>
        )}
        keyExtractor={item => item}
      />

      {/* Use a light status bar on iOS to account for the black space above the modal */}
      <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} />
    </View >
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center'
  },
  listItemContainer: {
    borderBottomWidth: 1,
    borderBottomColor: 'gray',
    display: 'flex',
    flexDirection: 'row'
  },
  listItem: {
    flexGrow: 1,
    padding: 20
  },
  qrCodeImgContainer: {
    backgroundColor: 'white',
    padding: 20,
    width: '100%',
  },
  qrCodeImg: {
    width: Dimensions.get('window').width * 0.7,
    height: Dimensions.get('window').width * 0.7,
    marginLeft: 'auto',
    marginRight: 'auto'
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  title2: {
    marginVertical: 10,
    fontSize: 15,
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
});

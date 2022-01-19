import { StyleSheet, FlatList, Pressable } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as WebBrowser from 'expo-web-browser';

import { Text, View } from '../components/Themed';
import { RootTabScreenProps } from '../types';
import { useEffect, useState } from 'react';
import ContainerDB from '../helpers/ContainerDB';

export default function TabOneScreen({ navigation }: RootTabScreenProps<'TabOne'>) {
  const [data, setData] = useState<string[]>([]);
  const [activeContainerId, setActiveContainerId] = useState<string>('');

  const loadContainerIds = async () => {
    const keys = await ContainerDB.getContainerIds();

    setData(keys);
  };
  /*
  useEffect(() => {
    loadContainerIds();
  }, []);
  */

  const loadActiveContainerId = async () => {
    const activeId = await ContainerDB.getActiveContainerId();

    if (activeId === null) {
      return;
    }

    setActiveContainerId(activeId);
  };
  /*
  useEffect(() => {
    loadActiveContainerId();
  }, []);
  */

  useEffect(() => {
    navigation.addListener('focus', () => {
      loadContainerIds().then(() => loadActiveContainerId());
    });
  }, []);

  return (
    <View style={styles.container}>
      <View style={{
        marginTop: 10,
        padding: 20,
        display: 'flex',
        alignItems: 'center'
      }}>
        <Text style={styles.title2}>Press a container to view its code</Text>
      </View>
      <View style={styles.containerIdPickerWrapper}>
        <FlatList
          data={data}
          renderItem={({ item }) => (
            <View style={styles.listItemContainer}>
              <Pressable
                onPress={() => {
                  ContainerDB.getContainer(item).then((container) => {
                    if (container === null) {
                      return;
                    }

                    WebBrowser.openBrowserAsync(`https://api.jdeurt.xyz/qr-code?data=${container.data.join('%0d')}`);
                  });
                }}
                style={({ pressed }) => [
                  {
                    backgroundColor: pressed
                      ? 'rgba(255, 255, 255, 0.3)'
                      : 'rgba(255, 255, 255, 0)'
                  },
                  styles.listItem
                ]}
              >
                <Text>{item}</Text>
              </Pressable>
            </View>
          )}
          keyExtractor={item => item}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
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
  containerIdInputWrapper: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center'
  },
  containerIdInput: {
    flexGrow: 1,
    margin: 15,
    borderBottomWidth: 1,
    borderBottomColor: 'gray',
    padding: 15,
    color: '#fff'
  },
  containerIdSubmitBtn: {
    margin: 15,
    borderColor: 'gray',
  },
  containerIdPickerWrapper: {
    flexGrow: 1
  },
  container: {
    flex: 1,
    flexDirection: 'column',
    //justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  title2: {
    fontSize: 15,
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },

});


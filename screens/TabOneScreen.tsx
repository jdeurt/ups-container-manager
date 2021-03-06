import { StyleSheet, FlatList, TextInput, Pressable } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

import { Text, View } from '../components/Themed';
import { RootTabScreenProps } from '../types';
import { useEffect, useState } from 'react';

import ContainerDB from '../helpers/ContainerDB';

export default function TabOneScreen({ navigation }: RootTabScreenProps<'TabOne'>) {
  const [text, onChangeText] = useState<any | null>(null);
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
      <View style={styles.containerIdInputWrapper}>
        <TextInput
          style={styles.containerIdInput}
          onChangeText={onChangeText}
          value={text}
          placeholder="New container ID"
        />
        <Pressable
          onPress={() => {
            ContainerDB.createContainer(text).then(() => loadContainerIds()).then(() => onChangeText(''));
          }}
          style={({ pressed }) => [
            {
              borderWidth: pressed
                ? 1
                : 0,
              padding: pressed
                ? 14
                : 15
            },
            styles.containerIdSubmitBtn
          ]}
        >
          <FontAwesome
            name="arrow-right"
            size={25}
            color='white'
          />
        </Pressable>
      </View>
      <View style={{
        marginTop: 10,
        padding: 20,
        display: 'flex',
        alignItems: 'center'
      }}>
        <Text style={styles.title}>Containers</Text>
      </View>
      <View style={styles.containerIdPickerWrapper}>
        <FlatList
          data={data}
          renderItem={({ item }) => (
            <View style={[
              styles.listItemContainer,
              (item === activeContainerId
                ? { backgroundColor: 'rgba(46, 204, 64, 0.3)' }
                : { backgroundColor: 'rgba(46, 204, 64, 0)' }
              )
            ]}>
              <Pressable
                onPress={() => {
                  ContainerDB.setActiveContainerId(item);
                  setActiveContainerId(item);
                }}
                style={({ pressed }) => [
                  {
                    backgroundColor: pressed
                      ? 'rgba(46, 204, 64, 0.3)'
                      : 'rgba(46, 204, 64, 0)'
                  },
                  styles.listItem
                ]}
              >
                <Text>{item}</Text>
              </Pressable>
              <Pressable
                onPress={() => {
                  ContainerDB.deleteContainer(item).then(() => loadContainerIds());
                }}
                style={({ pressed }) => [
                  {
                    opacity: pressed
                      ? 0.5
                      : 1,
                  },
                  styles.listItemActionBtn
                ]}
              >
                <FontAwesome
                  name="times"
                  size={20}
                  color='white'
                />
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
  listItemActionBtn: {
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

import { Button, Pressable, StyleSheet, ViewStyle } from 'react-native';
import { BarCodeScanner } from "expo-barcode-scanner";

import EditScreenInfo from '../components/EditScreenInfo';
import { Text, View } from '../components/Themed';
import { RootTabScreenProps } from '../types';
import React, { useEffect, useState } from 'react';
import ContainerDB from '../helpers/ContainerDB';

const AMAZON_360_ID_REGEXP = /D\w+RMA/;

export default function TabTwoScreen({ navigation }: RootTabScreenProps<'TabOne'>) {
  const [hasPermission, setHasPermission] = useState<Boolean | null>(null);
  const [scanningStatus, setScanningStatus] = useState(false);
  const [activeContainerId, setActiveContainerId] = useState<string>('');
  const [scanResult, setScanResult] = useState<'none' | 'valid' | 'invalid'>('none');
  const [screenFocused, setScreenFocused] = useState(false);

  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const loadActiveContainerId = async () => {
    const activeId = await ContainerDB.getActiveContainerId();

    if (activeId === null) {
      return;
    }

    setActiveContainerId(activeId);
  };
  useEffect(() => {
    loadActiveContainerId();
  }, []);

  // Disable camera when not on this screen
  useEffect(() => {
    navigation.addListener('focus', () => {
      loadActiveContainerId().then(() => setScreenFocused(true));
    });
    navigation.addListener('blur', () => setScreenFocused(false));
  }, []);

  const handleBarCodeScanned: (param: { type: any, data: string }) => any = ({ type, data }) => {
    //alert(`Bar code with type ${type} and data ${data} has been scanned!`);

    if (data.toString().match(AMAZON_360_ID_REGEXP)) {
      setScanResult('valid');

      ContainerDB.addToContainer(activeContainerId, [data.toString()]);
    } else {
      setScanResult('invalid');
    }

    setTimeout(() => {
      setScanResult('none');
    }, 500);
  };

  const scanStatusVisualUpdate: () => ViewStyle = () => {
    if (scanResult === 'valid') {
      return {
        backgroundColor: 'rgba(46, 204, 64, 0.5)'
      };
    }

    if (scanResult === 'invalid') {
      return {
        backgroundColor: 'rgba(255, 65, 54, 0.5)'
      };
    }

    return {
      backgroundColor: 'rgba(0, 0, 0, 0)'
    };
  };

  if (hasPermission === null) {
    return <Text>Requesting for camera permission</Text>;
  }
  if (hasPermission === false) {
    return <Text>Please enable camera access :)</Text>;
  }

  return (
    <View style={styles.container}>
      {screenFocused
        ? <BarCodeScanner
          barCodeTypes={[BarCodeScanner.Constants.BarCodeType.qr, BarCodeScanner.Constants.BarCodeType.code128, BarCodeScanner.Constants.BarCodeType.datamatrix]}
          onBarCodeScanned={scanningStatus ? handleBarCodeScanned : undefined}
          style={StyleSheet.absoluteFillObject}
        />
        : undefined}
      <View
        style={[
          StyleSheet.absoluteFillObject,
          scanStatusVisualUpdate()
        ]}
      ></View>
      <View style={styles.scanBtnContainer}>
        <Pressable
          style={({ pressed }) => [
            styles.scanBtn,
            {
              backgroundColor: pressed
                ? 'rgba(255, 255, 255, 1)'
                : 'rgba(255, 255, 255, 0)'
            }
          ]}
          onPressIn={() => {
            setScanningStatus(true);
          }}
          onPressOut={() => {
            setScanningStatus(false);
          }}
        >
          <View></View>
        </Pressable>
      </View>
      <View style={styles.activeIdIndicatorContainer}>
        <Text style={styles.activeIdIndicator}>Active container: {activeContainerId}</Text>
      </View>
    </View >
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scanBtnContainer: {
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'row',
    position: 'absolute',
    bottom: 50,
    left: 0,
    width: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0)'
  },
  scanBtn: {
    // position: 'absolute',
    // bottom: 50,
    // right: 50,
    borderWidth: 10,
    borderColor: 'white',
    borderRadius: 100,
    width: 100,
    height: 100
  },
  activeIdIndicatorContainer: {
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'row',
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0)',
    padding: 5
  },
  activeIdIndicator: {
    // position: 'absolute',
    // bottom: 20,
    // left: 20
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

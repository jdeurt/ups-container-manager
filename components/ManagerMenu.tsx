import { StyleSheet } from 'react-native';

import { Text, View } from './Themed';

export default function ManagerMenu() {
    return (
        <View>
            <View style={styles.menuContainer}>
                <View style={styles.menuItem}>
                    <Text>Create container</Text>
                </View>
                <View style={styles.menuItem}>
                    <Text>Select container</Text>
                </View>
                <View style={styles.menuItem}>
                    <Text>Delete container</Text>
                </View>
                <View style={styles.menuItem}>
                    <Text>Generate container code</Text>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    menuContainer: {
        display: 'flex',
        flexWrap: 'wrap',
        flexDirection: 'row',
        justifyContent: 'center'
    },
    menuItem: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: 100,
        height: 100,
        margin: 15,
        borderStyle: 'solid',
        borderColor: 'gray',
        borderRadius: 10,
        borderWidth: 1
    }
});

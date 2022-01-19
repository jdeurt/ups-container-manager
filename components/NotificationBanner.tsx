import { StyleProp, StyleSheet, ViewStyle } from 'react-native';

import { Text, View } from './Themed';
import { cssColor, WebSafeColorName } from '../helpers/colorgen';
import { memo, useEffect, useRef, useState } from 'react';

export interface NotificationBannerProps {
    type: 'success' | 'warning' | 'error' | 'info';
    size: 'compact' | 'full';
    text: string;
    timeout: number;
    style: StyleProp<ViewStyle>;
};

export default memo(function NotificationBanner({ type, size, text, timeout, style }: NotificationBannerProps) {
    const [opacity, setOpacity] = useState(0);
    const updateTimer = useRef<NodeJS.Timeout | null>(null);

    function setUpdate() {
        if (text.length === 0) {
            return;
        }

        setOpacity(1);

        updateTimer.current = setTimeout(() => {
            setOpacity(0);

            updateTimer.current = null;
        }, timeout);
    }

    useEffect(() => {
        if (!updateTimer.current) {
            setUpdate();
        }
    }, [text]);

    useEffect(() => {
        return () => {
            if (updateTimer.current) {
                clearTimeout(updateTimer.current);
            }
        };
    }, []);

    const colors: {
        [k: string]: WebSafeColorName
    } = {
        'success': 'green',
        'warning': 'yellow',
        'error': 'red',
        'info': 'blue'
    };

    return (
        <View
            style={[styles.notificationContainer, style, {
                backgroundColor: cssColor(colors[type], 1),
                padding: size === 'compact' ? 1 : 3,
                opacity: opacity
            }]}
        >
            <Text>{text}</Text>
        </View>
    );
});

const styles = StyleSheet.create({
    notificationContainer: {
        display: 'flex',
        justifyContent: 'center',
        flexDirection: 'row'
    }
});

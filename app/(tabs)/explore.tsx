// app/(tabs)/index.tsx
import { View, Text } from 'react-native';
import SnakeGame from '../../components/SnakeGame'

export default function TabOneScreen() {
    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <SnakeGame />
        </View>
    );
}

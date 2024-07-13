import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native';

type Position = { x: number, y: number };

const initialSnake: Position[] = [
    { x: 2, y: 2 },
    { x: 2, y: 1 },
    { x: 2, y: 0 },
];

const boardSize = 20;
const directions = {
    UP: { x: -1, y: 0 },
    DOWN: { x: 1, y: 0 },
    LEFT: { x: 0, y: -1 },
    RIGHT: { x: 0, y: 1 },
};

const generateFoodPosition = (snake: Position[]): Position => {
    let position: Position;
    do {
        position = {
            x: Math.floor(Math.random() * boardSize),
            y: Math.floor(Math.random() * boardSize),
        };
    } while (snake.some(segment => segment.x === position.x && segment.y === position.y));
    return position;
};

const SnakeGame = () => {
    const [snake, setSnake] = useState<Position[]>(initialSnake);
    const [direction, setDirection] = useState<Position>(directions.RIGHT);
    const [food, setFood] = useState<Position>(generateFoodPosition(initialSnake));
    const [inputValue, setInputValue] = useState('');

    useEffect(() => {
        const interval = setInterval(() => {
            moveSnake();
        }, 200);
        return () => clearInterval(interval);
    }, [snake, direction]);

    const moveSnake = () => {
        setSnake((prevSnake) => {
            const newHead: Position = {
                x: prevSnake[0].x + direction.x,
                y: prevSnake[0].y + direction.y,
            };

            if (isCollision(newHead)) {
                // Reset the game on collision
                return initialSnake;
            }

            const newSnake = [newHead, ...prevSnake];
            if (newHead.x === food.x && newHead.y === food.y) {
                setFood(generateFoodPosition(newSnake));
            } else {
                newSnake.pop();
            }
            return newSnake;
        });
    };

    const isCollision = (position: Position) => {
        if (
            position.x < 0 ||
            position.x >= boardSize ||
            position.y < 0 ||
            position.y >= boardSize
        ) {
            return true;
        }

        for (const segment of snake) {
            if (position.x === segment.x && position.y === segment.y) {
                return true;
            }
        }

        return false;
    };

    const handleSwipe = (newDirection: Position) => {
        setDirection(newDirection);
    };

    const handleKeyPress = (e) => {
        switch (e.nativeEvent.key) {
            case 'ArrowUp':
                handleSwipe(directions.UP);
                break;
            case 'ArrowDown':
                handleSwipe(directions.DOWN);
                break;
            case 'ArrowLeft':
                handleSwipe(directions.LEFT);
                break;
            case 'ArrowRight':
                handleSwipe(directions.RIGHT);
                break;
            default:
                break;
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Snake Game</Text>
            <View style={styles.board}>
                {Array.from({ length: boardSize }).map((_, rowIndex) => (
                    <View key={rowIndex} style={styles.row}>
                        {Array.from({ length: boardSize }).map((_, cellIndex) => (
                            <View
                                key={cellIndex}
                                style={[
                                    styles.cell,
                                    snake.some(segment => segment.x === rowIndex && segment.y === cellIndex) && styles.snakeCell,
                                    food.x === rowIndex && food.y === cellIndex && styles.foodCell,
                                ]}
                            />
                        ))}
                    </View>
                ))}
            </View>
            <View style={styles.controls}>
                <TouchableOpacity onPress={() => handleSwipe(directions.UP)}>
                    <Text style={styles.control}>Up</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleSwipe(directions.LEFT)}>
                    <Text style={styles.control}>Left</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleSwipe(directions.DOWN)}>
                    <Text style={styles.control}>Down</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleSwipe(directions.RIGHT)}>
                    <Text style={styles.control}>Right</Text>
                </TouchableOpacity>
            </View>
            <TextInput
                style={styles.hiddenInput}
                autoFocus={true}
                value={inputValue}
                onKeyPress={handleKeyPress}
                onChangeText={setInputValue}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    board: {
        flexDirection: 'column',
    },
    row: {
        flexDirection: 'row',
    },
    cell: {
        width: 20,
        height: 20,
        borderWidth: 1,
        borderColor: '#ccc',
    },
    snakeCell: {
        backgroundColor: 'green',
    },
    foodCell: {
        backgroundColor: 'red',
    },
    controls: {
        flexDirection: 'row',
        marginTop: 20,
    },
    control: {
        margin: 10,
        fontSize: 18,
        fontWeight: 'bold',
        color: '#007BFF',
    },
    hiddenInput: {
        height: 0,
        width: 0,
        opacity: 0,
    },
});

export default SnakeGame;

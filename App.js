import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Button, FlatList } from "react-native";

const App = () => {
    const [items, setItems] = useState([]);
    const [newItem, setNewItem] = useState("");
    const [notes, setNotes] = useState("");
    const [storeLocation, setStoreLocation] = useState("");
    const [searchResult, setSearchResult] = useState([]);

    useEffect(() => {
        // Fetching data from Walmart's API based on store location
        const fetchData = async () => {
            try {
                const response = await fetch(
                    `https://api.walmart.com/storeLocator?location=${storeLocation}`
                );
                const data = await response.json();
                setSearchResult(data.result);
            } catch (error) {
                console.error(error);
            }
        };

        fetchData();
    }, [storeLocation]);

    const addItem = () => {
        setItems([
            ...items,
            { name: newItem, notes: notes, crossedOut: false },
        ]);
        setNewItem("");
        setNotes("");
    };

    const crossOutItem = (index) => {
        const updatedItems = [...items];
        updatedItems[index].crossedOut = !updatedItems[index].crossedOut;
        setItems(updatedItems);
    };

    const deleteCrossedOutItems = () => {
        const updatedItems = items.filter((item) => !item.crossedOut);
        setItems(updatedItems);
    };

    return (
        <View>
            <Text>Walmart Shopping List</Text>
            <TextInput
                placeholder="Enter item name"
                value={newItem}
                onChangeText={(text) => setNewItem(text)}
            />
            <TextInput
                placeholder="Enter notes"
                value={notes}
                onChangeText={(text) => setNotes(text)}
            />
            <TextInput
                placeholder="Enter store location"
                value={storeLocation}
                onChangeText={(text) => setStoreLocation(text)}
            />
            <Button title="Add Item" onPress={addItem} />

            <Text>Search Result:</Text>
            <FlatList
                data={searchResult}
                renderItem={({ item }) => (
                    <Text>
                        Item: {item.name}, Isle: {item.isle}
                    </Text>
                )}
                keyExtractor={(item) => item.id.toString()}
            />

            <Text>Shopping List:</Text>
            <FlatList
                data={items}
                renderItem={({ item, index }) => (
                    <Text
                        style={{
                            textDecorationLine: item.crossedOut
                                ? "line-through"
                                : "none",
                        }}
                        onPress={() => crossOutItem(index)}
                    >
                        {item.name} - {item.notes}
                    </Text>
                )}
                keyExtractor={(item, index) => index.toString()}
            />

            <Button
                title="Delete Crossed-out Items"
                onPress={deleteCrossedOutItems}
            />
        </View>
    );
};

export default App;

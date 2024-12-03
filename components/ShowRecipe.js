import { StatusBar } from 'expo-status-bar';
import { FlatList, StyleSheet } from 'react-native';
import { Button, Card, View, TextInput, Text, IconButton } from 'react-native-paper';
import { useState, useEffect } from 'react';
import IngredientList from './IngredientList';
import * as SQLite from 'expo-sqlite';
import { useSQLiteContext } from 'expo-sqlite';
import { Rating } from 'react-native-ratings';

export default function ShowRecipe({route}) {

const db = SQLite.useSQLiteContext();

const {data} = route.params;

const [note, setNote] = useState('');
const [rating, setRating] = useState(null);
const [idMeal, setIdMeal] = useState(data.meals[0].idMeal)
const [id, setId] = useState('');

const rated = async (rating) => {
  setRating(rating)
}

const updateItem = async (note, rating, id) => {
  try {
    await db.runAsync('UPDATE mymeals SET note=?, rating=? WHERE id=?', note, rating, id);
    setNote('');
  }
  catch (error) {
    console.error('Could not update item', error);
  }
}

const getItem = async () => {
  try {
    const item = await db.getAllAsync('SELECT id, note FROM mymeals WHERE idMeal=?', idMeal);
    setId(item[0].id);
    setNote(item[0].note)
  } catch (error) {
    console.error('Could not get items', error);
  }
}

useEffect(() => { getItem() }, []);

  return (
    <Card style={styles.content}>
      <Card>
        <TextInput
          label='Add Note'
          value={note}
          onChangeText={text => setNote(text)}
        />
        <Rating 
          imageSize={30}
          tintColor="rgb(233, 223, 235)"
          startingValue={rating}
          onFinishRating={rated}
        />
        <Button onPress={() => updateItem(note, rating, id)}>Update Note & Rating</Button>
      </Card>
      <FlatList
        data={data.meals}
        keyExtractor={(item) => item.idMeal}
        renderItem={({ item }) => <IngredientList meal={item} />}
      />
      <StatusBar style="auto" />
    </Card>
  );
}

const styles = StyleSheet.create({
  content: {
    marginBottom: 80,
    paddingBottom: 50
  }
});
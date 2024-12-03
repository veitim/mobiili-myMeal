import { StatusBar } from 'expo-status-bar';
import { FlatList, StyleSheet } from 'react-native';
import { Button, Card, TextInput } from 'react-native-paper';
import { useState, useEffect, useCallback } from 'react';
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
    Alert.alert('Note & Rating updated')
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
    <Card style={styles.container}>
      <FlatList
        data={data.meals}
        keyExtractor={(item) => item.idMeal}
        renderItem={({ item }) => <IngredientList meal={item} />}
        ListFooterComponent={
          <Card style={styles.footer}>
          <TextInput
            mode='outlined'
            label='Update note'
            value={note}
            onChangeText={text => setNote(text)}
          />
          <Rating 
            type='custom'
            imageSize={30}
            tintColor="rgb(247, 243, 242)"
            ratingBackgroundColor='#c8c7c8'
            startingValue={rating}
            onFinishRating={rated}
          />
          <Button mode='outlined' onPress={() => updateItem(note, rating, id)}>Update Note & Rating</Button>
        </Card>
        }
      />
      <StatusBar style="auto" />
    </Card>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    marginBottom: 20,
    paddingBottom: 20,
    marginLeft: 5,
    marginRight: 5,
  },
  header: {
    backgroundColor: 'rgb(229, 227, 209)'
  },
  footer: {
    flex: 2,
    marginBottom: 10,
    paddingBottom: 10,
    padding: 10,
  },
});

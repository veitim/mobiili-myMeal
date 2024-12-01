import { StatusBar } from 'expo-status-bar';
import { useCallback, useEffect, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { Rating } from 'react-native-ratings';
import {  Button, TextInput, Card, Text, Divider, IconButton } from 'react-native-paper';
import { StyleSheet, View, FlatList } from 'react-native';
import * as SQLite from 'expo-sqlite';
import { useSQLiteContext } from 'expo-sqlite';
import { fetchMeal } from './FetchFunctions';

export default function SavedMeals({route}) {

  const db = SQLite.useSQLiteContext();
  const [mymeals, setMymeals] = useState([]);
  const [note, setNote] = useState('');

  const updateList = async () => {
    try {
      const list = await db.getAllAsync('SELECT * from mymeals');
      setMymeals(list);
    } catch (error) {
      console.error('Could not get items', error);
    }
  }

  const deleteItem = async (id) => {
    console.log('deleteItem')
    try {
      await db.runAsync('DELETE FROM mymeals WHERE id=?', id);
      await updateList();
    }
    catch (error) {
      console.error('Could not delete item', error);
    }
  }

  const updateItem = async (note, id) => {
    console.log('updateItem')
    try {
      await db.runAsync('UPDATE mymeals SET note=? WHERE id=?', note, id);
      await updateList();
    }
    catch (error) {
      console.error('Could not delete item', error);
    }
  }

  const handleFetch = () => {
    setLoading(true);
    let fmeal = mymeals.idMeal
    fetchMeal(fmeal)
    .then((data) => {
      setMeal(data.meals);
    })
    .catch(err => console.error(err))
    .finally(() => setLoading(false));   
  }

  useFocusEffect(useCallback(() => { updateList() }, []));

  return (
  <Card>
    <FlatList
        data={mymeals}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) =>
          <Card>
            <Card.Cover source={{ uri: 'https://picsum.photos/700' }} />
            <Card.Title
                title={item.strMeal}
                subtitle={item.strCategory}
                right={(props) => <IconButton {...props} icon="delete" onPress={() => deleteItem(item.id)} />} 
            />
            <Rating>

            </Rating>
          </Card>
        }
    />
  </Card> 
  );
}

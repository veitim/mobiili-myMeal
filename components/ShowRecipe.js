import { StatusBar } from 'expo-status-bar';
import { FlatList, StyleSheet } from 'react-native';
import { Button, Card, View, TextInput } from 'react-native-paper';
import { useState, useEffect } from 'react';
import IngredientList from './IngredientList';
import * as SQLite from 'expo-sqlite';
import { useSQLiteContext } from 'expo-sqlite';
import { fetchMeal, fetchRandom } from './FetchFunctions';
import { Rating } from 'react-native-ratings';

export default function ShowRecipe({route}) {

const [note, setNote] = useState ('');

const {data} = route.params;
  return (
    <Card style={styles.content}>
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
    marginTop: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
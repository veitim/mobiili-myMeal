import { StatusBar } from 'expo-status-bar';
import { FlatList, StyleSheet } from 'react-native';
import { Button, Card } from 'react-native-paper';
import { useState, useEffect } from 'react';
import IngredientList from './IngredientList';
import * as SQLite from 'expo-sqlite';
import { useSQLiteContext } from 'expo-sqlite';
import { fetchMeal, fetchRandom } from './FetchFunctions';

export default function ShowRecipe({route}) {

const {data} = route.params;

  return (
    <Card style={styles.content}>
      <FlatList
        data={data.meal}
        keyExtractor={(item) => item.idMeal}
        renderItem={({ item }) => <IngredientList meal={item} />}
      />
      <StatusBar style="auto" />
    </Card>
  );
}

const styles = StyleSheet.create({
  content: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
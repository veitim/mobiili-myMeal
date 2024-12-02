import { StatusBar } from 'expo-status-bar';
import { Alert, FlatList, StyleSheet } from 'react-native';
import { Appbar, Button, Card, Tooltip, IconButton } from 'react-native-paper';
import { useState, useEffect } from 'react';
import IngredientList from './IngredientList';
import * as SQLite from 'expo-sqlite';
import { useSQLiteContext } from 'expo-sqlite';
import { fetchRandom } from './FetchFunctions';

export default function SearchRandom() {

  const db = SQLite.useSQLiteContext();

  const [meal, setMeal] = useState([]);
  const [loading, setLoading] = useState(false);
  const [mymeals, setMymeals] = useState([]);
  const [mymeal, setMymeal] = useState({
    idmeal: '',
    name: '',
    category: '',
    thumb: ''
  });

  const handleFetch = () => {
    setLoading(true);
    fetchRandom()
    .then((data) => {
      setMeal(data.meals);
      setMymeal({
        idmeal: data.meals[0].idMeal,
        name: data.meals[0].strMeal,
        category: data.meals[0].strCategory,
        thumb: data.meals[0].strMealThumb,
      });
    })
    .catch(err => console.error(err))
    .finally(() => setLoading(false));   
  }

  const saveItem = async () => {
    try {
      const alreadyExists = await checkExistance(mymeal.idmeal);
      if (alreadyExists) {
        Alert.alert('Recipe is already in Meal list')
        return;
      }
      await db.runAsync('INSERT INTO mymeals VALUES (?, ?, ?, ?, ?, ?, ?)'
        , null, mymeal.idmeal, mymeal.name, mymeal.category, null, null, mymeal.thumb);
    } catch (error) {
      console.error('Could not add item', error);
    }
  };

  const checkExistance = async (idMeal) => {
    try {
      const result = await db.getAllAsync('SELECT * FROM mymeals WHERE idMeal = ?', idMeal);
      return result.length > 0;
    } catch (error) {
      console.error('Error checking existence:', error);
      return false;
    }
  };

  useEffect(() => { handleFetch() }, []);

  return (
    <Card style={styles.content}>
      <Appbar.Header >
        <Appbar.Content title="Next Meal ->" />
        <Tooltip title="Find Meal">
          <IconButton icon="magnify" selected size={24} onPress={handleFetch} />
        </Tooltip>
        <Tooltip title="Save Meal">
          <IconButton icon="plus" selected size={24} onPress={saveItem} />
        </Tooltip>
      </Appbar.Header>
      <FlatList
        data={meal}
        keyExtractor={(item) => item.idMeal}
        renderItem={({ item }) => <IngredientList meal={item} />}
      />
      <StatusBar style="auto" />
    </Card>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  savebutton: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
  }
  
});
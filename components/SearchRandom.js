import { StatusBar } from 'expo-status-bar';
import { Alert, FlatList, StyleSheet } from 'react-native';
import { Appbar, Button, Card } from 'react-native-paper';
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
    rating: null
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
      await db.runAsync('INSERT INTO mymeals VALUES (?, ?, ?, ?, ?, ?)'
        , null, mymeal.idmeal, mymeal.name, mymeal.category);
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
      <Appbar.Header>
        <Appbar.Content title="My Next Meal" />
        <Appbar.Action  icon="magnify" onPress={handleFetch} />
      </Appbar.Header>
      <Card.Actions>
        <Button mode="contained" onPress={saveItem}>
          Save Meal
        </Button>
      </Card.Actions>
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
    alignItems: 'center',
    justifyContent: 'center',
  },
});
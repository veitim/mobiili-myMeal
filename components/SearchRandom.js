import { Alert, FlatList, StyleSheet, } from 'react-native';
import { Appbar, Button, Card, TextInput } from 'react-native-paper';
import { useState, useEffect } from 'react';
import IngredientList from './IngredientList';
import * as SQLite from 'expo-sqlite';
import { useSQLiteContext } from 'expo-sqlite';
import { fetchRandom } from './FetchFunctions';
import { Rating } from 'react-native-ratings';

export default function SearchRandom() {

  const db = SQLite.useSQLiteContext();

  const [meal, setMeal] = useState([]);
  const [loading, setLoading] = useState(false);
  const [mymeals, setMymeals] = useState([]);
  const [rating, setRating] = useState(null);
  const [note, setNote] = useState('');
  const [mymeal, setMymeal] = useState({
    idmeal: '',
    name: '',
    category: '',
    thumb: ''
  });

  const rated = async (rating) => {
    setRating(rating)
  }

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
      } else {
        Alert.alert("Meal saved")
        setRating(null)
        setNote('')
      }
      await db.runAsync('INSERT INTO mymeals VALUES (?, ?, ?, ?, ?, ?, ?)'
        , null, mymeal.idmeal, mymeal.name, mymeal.category, note, rating, mymeal.thumb);
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

  useEffect(() => { handleFetch()}, []);

  return (
    <Card style={styles.container}>
      <Appbar.Header >
        <Appbar.Content title="Next Meal" />
        <Button icon="magnify" onPress={handleFetch}>
          New Meal
        </Button>
        <Button icon="plus" onPress={saveItem}>
          Save Meal
        </Button>
      </Appbar.Header>
      <FlatList
        data={meal}
        keyExtractor={(item) => item.idMeal}
        renderItem={({ item }) => <IngredientList meal={item} />}
        ListHeaderComponent={
          <Card style={styles.footer}>
          <TextInput
            mode='outlined'
            label='Add Note'
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
        </Card>
        }
      />
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
  footer: {
    marginRigh: 5,
    marginBottom: 10,
    paddingBottom: 10,
    padding: 10,
  },
});
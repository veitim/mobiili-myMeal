import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, FlatList, Button } from 'react-native';
import { useState } from 'react';
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
      await db.runAsync('INSERT INTO mymeals VALUES (?, ?, ?, ?, ?, ?)'
        , null, mymeal.idmeal, mymeal.name, mymeal.category, null);
    } catch (error) {
      console.error('Could not add item', error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.button}>
        <Button title="Find Random Meal" onPress={handleFetch} />
      </View>
      <View>
        <Button title = "Save Meal" onPress={saveItem}/>
      </View>
      <View style={styles.list}>
        <FlatList
          data={meal}
          keyExtractor={(item) => item.idMeal}
          renderItem={({ item }) => <IngredientList meal={item} />}
        />
      </View>
      <View>
        <Button title = "Save Meal" onPress={saveItem}/>
        
      </View>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 70,
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    width: 200,
  },
  input: {
    height: 40,
    width: 200,
  },
  list: {
    paddingTop: 20,
  },
  header: {
    fontSize: 13, 
    fontWeight: "bold",
  },
  image: {
    width: 50, 
    height: 50, 
    margin: 5,
  },
  separator: {
    height: 1,
    width: "100%",
    backgroundColor: "gray"
  },
});

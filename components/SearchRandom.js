import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, FlatList, Button } from 'react-native';
import { useState } from 'react';
import IngredientList from './IngredientList';

export default function SearchRandom() {

  const [meal, setMeal] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchRandom = () => {
    setLoading(true);
    fetch(`https://www.themealdb.com/api/json/v1/1/random.php`)
    .then(response => {
      if (!response.ok)
        throw new Error("Error in fetch:" + response.statusText);
        
      return response.json()
    })
    .then(data => setMeal(data.meals))
    .catch(err => console.error(err))
    .finally(() => setLoading(false));   
  }

  return (
    <View style={styles.container}>
      <View style={styles.button}>
        <Button title="Find Random Meal" onPress={fetchRandom} />
      </View>
      <View style={styles.list}>
        <FlatList
          data={meal}
          keyExtractor={(item) => item.idMeal}
          renderItem={({ item }) => <IngredientList meal={item} />}
        />
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

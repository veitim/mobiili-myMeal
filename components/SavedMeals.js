import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { Rating } from 'react-native-ratings';
import { StyleSheet, Text, View, FlatList, Button } from 'react-native';
import * as SQLite from 'expo-sqlite';
import { useSQLiteContext } from 'expo-sqlite';
import { fetchMeal } from './FetchFunctions';

export default function SavedMeals({route}) {

  const db = SQLite.useSQLiteContext();
  const [mymeals, setMymeals] = useState([]);

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

  useEffect(() => { updateList() }, []);
  console.log(mymeals);
  return (
  <View>
    <View style= {styles.list}>
    <Text style= {styles.header}>My Meals</Text>
    <Button title = "Save Meal" onPress={updateList}/>
    <FlatList
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) =>
        <View>
            <Text>
                {item.strMeal}, 
                {item.strCategory}
                <Rating
                  showRating
                  style={{ paddingVertical: 10 }}
                /> 
                <Text style={{ color: '#0000ff' }} 
                    onPress={() => deleteItem(item.id)}>   Remove meal
                </Text>
            </Text>
        </View>}
        data={mymeals}
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

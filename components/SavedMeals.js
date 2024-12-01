import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View, FlatList } from 'react-native';
import * as SQLite from 'expo-sqlite';
import { useSQLiteContext } from 'expo-sqlite';

export default function SavedMeals({route}) {
  const db = SQLite.useSQLiteContext();

  const [mymeals, setMymeals] = useState([]);

  const initialize = async (db) => {
    try {
      await db.execAsync(
        `CREATE TABLE IF NOT EXISTS mymeal (id INTEGER PRIMARY KEY NOT NULL, idMeal INT, strMeal TEXT, strCategory TEXT);`);
    } catch (error) {
      console.error('Could not open database', error);
    }
  }
  
  useEffect(() => { updateList() }, []);

  const updateList = async () => {
    try {
      const list = await db.getAllAsync('SELECT * from mymeal');
      setMymeals(list);
    } catch (error) {
      console.error('Could not get items', error);
    }
  }

  const deleteItem = async (id) => {
    console.log('deleteItem')
    try {
      await db.runAsync('DELETE FROM mymeal WHERE id=?', id);
      await updateList();
    }
    catch (error) {
      console.error('Could not delete item', error);
    }
  }

  console.log(mymeals);

  return (
  <View>
    <View style= {styles.list}>
    <Text style= {styles.header}>My Meals</Text>
    <FlatList
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) =>
        <View>
            <Text>
                {item.strMeal}, 
                {item.strCategory} 
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

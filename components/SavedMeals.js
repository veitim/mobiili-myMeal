import { useCallback, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { Rating } from 'react-native-ratings';
import { Button, TextInput, Card, Text, Divider, IconButton, Portal, Dialog } from 'react-native-paper';
import { FlatList, StyleSheet } from 'react-native';
import * as SQLite from 'expo-sqlite';
import { useSQLiteContext } from 'expo-sqlite';
import { fetchMeal } from './FetchFunctions';

export default function SavedMeals({navigation}) {

  const db = SQLite.useSQLiteContext();

  const [mymeals, setMymeals] = useState([]);
  const [note, setNote] = useState('');
  const [visible, setVisible] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  const showWarning = (id) => {
    setSelectedId(id);
    setVisible(true);
  }
  const hideWarning = () => {
    setVisible(false);
  }

  const updateList = async () => {
    try {
      const list = await db.getAllAsync('SELECT * from mymeals');
      setMymeals(list);
    } catch (error) {
      console.error('Could not get items', error);
    }
  }

  const deleteItem = async (id) => {
    try {
      await db.runAsync('DELETE FROM mymeals WHERE id=?', id);
      await updateList();
      hideWarning();
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

  const handleFetch = (idMeal) => {
    fetchMeal(idMeal)
    .then((data) => {
      return data.meals;
    })
    .then((meals) => navigation.navigate('Saved Recipe', {data:{meals}})
    )
    .catch(err => console.error(err))   
  }

  useFocusEffect(useCallback(() => { updateList() }, []));

  return (
  <Card style={styles.card}>
    <FlatList
        data={mymeals}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) =>
          <Card style={styles.cardItem}>
            <Card.Cover style={styles.image} source={{ uri: 'https://picsum.photos/700' }} />
            <Card.Title
                title={item.strMeal}
                subtitle={item.strCategory}
                right={(props) => <IconButton {...props} icon="delete" onPress={() => showWarning(item.id)} />}
                left={(props) => <IconButton {...props} icon="pencil" onPress={() => handleFetch(item.idMeal)} />}
            />
            <Portal>
              <Dialog visible={visible} onDismiss={hideWarning}>
                <Dialog.Title>Delete Confirmation</Dialog.Title>
                <Dialog.Content>
                  <Text variant="bodyMedium">Are you sure you want to delete this meal</Text>
                </Dialog.Content>
                <Dialog.Actions>
                  <Button onPress={hideWarning}>Cancel</Button>
                  <Button onPress={() => deleteItem(selectedId)}>Remove</Button>
                </Dialog.Actions>
              </Dialog>
            </Portal>
            <Rating
              style={styles.rating}
              imageSize={20}
              tintColor="rgb(233, 223, 235)"
            />
          </Card>
        }
    />
  </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginTop: 10,
    marginBottom: 60,
    
  },
  cardItem: {
    marginTop: 15,
  },
  image: {
    height: 110,
    width: '40%',
    resizeMode: 'cover',
    marginLeft: 20,
    marginRight: 20,
  },
  rating: {
    
  }
});

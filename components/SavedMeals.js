import { useCallback, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { Rating } from 'react-native-ratings';
import { Button, Card, Text, IconButton, Portal, Dialog } from 'react-native-paper';
import { FlatList, StyleSheet, Pressable } from 'react-native';
import * as SQLite from 'expo-sqlite';
import { useSQLiteContext } from 'expo-sqlite';
import { fetchMeal } from './FetchFunctions';

export default function SavedMeals({navigation}) {

  const db = SQLite.useSQLiteContext();

  const [mymeals, setMymeals] = useState([]);
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
  <Card style={styles.content}>
    <FlatList
        data={mymeals}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) =>
          <Card style={styles.cardItem}>
            <Pressable onPress={() => handleFetch(item.idMeal)}>
              <Card.Cover style={styles.image} source={{ uri: item.strMealThumb }} />
            </Pressable>
            <Card.Title
                title={item.strMeal}
                subtitle={item.strCategory}
                right={(props) => <IconButton {...props} icon="delete" onPress={() => showWarning(item.id)} />}
            />
            <Card.Content>
              <Text >Note: {item.note}</Text>
            </Card.Content>
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
              type='custom'
              imageSize={20}
              tintColor="rgb(247, 243, 242)"
              ratingBackgroundColor='#c8c7c8'
              readonly={true}
              startingValue={item.rating}
            />
          </Card>
        }
    />
  </Card>
  );
}

const styles = StyleSheet.create({
  content: {
    backgroundColor: 'rgb(229, 227, 209)',
    paddingBottom: 40,
    marginLeft: 5,
    marginRight: 5,
  },
  cardItem: {
    marginTop: 10,
    marginBottom: 10,
  },
  image: {
    height: 110,
    width: '100%',
    resizeMode: 'cover',
    marginLeft: 20,
    marginRight: 20,
  },
});

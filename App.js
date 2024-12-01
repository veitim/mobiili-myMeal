import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SQLiteProvider } from 'expo-sqlite';
import * as SQLite from 'expo-sqlite';

import SearchRandom from './components/SearchRandom';
import SavedMeals from './components/SavedMeals';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

export default function App() {


  const initialize = async (db) => {
    try {
      await db.execAsync(
        `CREATE TABLE IF NOT EXISTS mymeal (id INTEGER PRIMARY KEY NOT NULL, idMeal INT, strMeal TEXT, strCategory TEXT);`);
      } catch ( error ) {
        console.error('Could not open database', error);
      }
  };

  return (
    <SQLiteProvider
      databaseName='mymeal.db'
      onInit={initialize}
      onError={error => console.error('Could not open database', error)}
    >
      <NavigationContainer>
        <Tab.Navigator>
          <Tab.Screen name = "Search" component = { SearchRandom } />
          <Tab.Screen name = "MyMeals" component = { SavedMeals } />
        </Tab.Navigator>
      </NavigationContainer>
    </SQLiteProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

import { PaperProvider, Appbar, Text, BottomNavigation } from 'react-native-paper';
import { StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SQLiteProvider } from 'expo-sqlite';
import * as SQLite from 'expo-sqlite';

import SearchRandom from './components/SearchRandom';
import SavedMeals from './components/SavedMeals';

const Tab = createBottomTabNavigator();

export default function App() {
  const initialize = async (db) => {
    try {
      await db.execAsync(
        `CREATE TABLE IF NOT EXISTS mymeals (id INTEGER PRIMARY KEY NOT NULL, idMeal INT, strMeal TEXT, strCategory TEXT, note TEXT, rating INT);`);
      } catch ( error ) {
        console.error('Could not open database', error);
      }
  };

  return (
    <PaperProvider>
      <Appbar mode="medium" elevated>
        <Appbar.Content title="My Meal" />
      </Appbar>
      <SQLiteProvider
        databaseName='mymeals.db'
        onInit={initialize}
        onError={error => console.error('Could not open database', error)}
      >
        <NavigationContainer>
          <Tab.Navigator 
              screenOptions={{
              headerShown: false,
            }}>
            <Tab.Screen name = "Random meal" component = { SearchRandom } />
            <Tab.Screen name = "MyMeals" component = { SavedMeals } />
          </Tab.Navigator>
        </NavigationContainer>
      </SQLiteProvider>
    </PaperProvider>
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

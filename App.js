import { PaperProvider, Appbar } from 'react-native-paper';
import { StyleSheet } from 'react-native';
import { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SQLiteProvider } from 'expo-sqlite';
import * as SQLite from 'expo-sqlite';
import { BlurView } from 'expo-blur';
import Ionicons from '@expo/vector-icons/Ionicons';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import SearchRandom from './components/SearchRandom';
import SavedMeals from './components/SavedMeals';
import ShowRecipe from './components/ShowRecipe';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function MyMealsStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="MyMeals" component={SavedMeals} />
      <Stack.Screen name="Saved Recipe" component={ShowRecipe} />
    </Stack.Navigator>
  );
}

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
      <SQLiteProvider
        databaseName='mymeals.db'
        onInit={initialize}
        onError={error => console.error('Could not open database', error)}
      >
        <NavigationContainer>
        <Tab.Navigator
          screenOptions={({ route }) => ({
            headerShown: false,
            tabBarStyle: { position: 'absolute' },
            tabBarIcon: ({ focused, color, size }) => { 
              let iconName;
              if (route.name === 'Random meal') {
                iconName = 'fast-food-outline';
              } else if (route.name === 'MyMeals') {
                iconName = 'heart-outline';
              }
              return <Ionicons name={iconName} size={size} color={color} />;
            },
            tabBarBackground: () => (
              <BlurView tint="light" intensity={100} style={StyleSheet.absoluteFill} />
            ),
          })}
        >
          <Tab.Screen name="Random meal" component={SearchRandom} />
          <Tab.Screen name="MyMeals" component={MyMealsStack} />
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
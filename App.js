import { PaperProvider, } from 'react-native-paper';
import { StyleSheet } from 'react-native';
import { NavigationContainer} from '@react-navigation/native';
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
      <Stack.Navigator >
        <Stack.Screen name="MyMeals" component={SavedMeals} options={{ headerTitle: 'MyMeals' }}/>
        <Stack.Screen name="Saved Recipe" component={ShowRecipe} options={{ headerTitle: 'Saved Recipe' }}/>
      </Stack.Navigator>
  );
}

export default function App() {

  const initialize = async (db) => {
    try {
      await db.execAsync(
        `CREATE TABLE IF NOT EXISTS mymeals (id INTEGER PRIMARY KEY NOT NULL, idMeal INT, strMeal TEXT, strCategory TEXT, note TEXT, rating INT, strMealThumb TEXT);`);
      } catch ( error ) {
        console.error('Could not open database', error);
      }
  };

  return (
    <PaperProvider theme = {theme}>
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
              } else if (route.name === 'My Meals') {
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
          <Tab.Screen name="My Meals" component={MyMealsStack} />
        </Tab.Navigator>
        </NavigationContainer>
      </SQLiteProvider>
    </PaperProvider>
  );
}

const theme = {
  "colors": {
    "primary": "rgb(95, 98, 0)",
    "onPrimary": "rgb(255, 255, 255)",
    "primaryContainer": "rgb(229, 234, 93)",
    "onPrimaryContainer": "rgb(28, 29, 0)",
    "secondary": "rgb(96, 96, 67)",
    "onSecondary": "rgb(255, 255, 255)",
    "secondaryContainer": "rgb(229, 229, 192)",
    "onSecondaryContainer": "rgb(28, 29, 6)",
    "tertiary": "rgb(61, 102, 88)",
    "onTertiary": "rgb(255, 255, 255)",
    "tertiaryContainer": "rgb(191, 236, 218)",
    "onTertiaryContainer": "rgb(0, 33, 24)",
    "error": "rgb(186, 26, 26)",
    "onError": "rgb(255, 255, 255)",
    "errorContainer": "rgb(255, 218, 214)",
    "onErrorContainer": "rgb(65, 0, 2)",
    "background": "rgb(255, 251, 255)",
    "onBackground": "rgb(28, 28, 23)",
    "surface": "rgb(255, 251, 255)",
    "onSurface": "rgb(28, 28, 23)",
    "surfaceVariant": "rgb(229, 227, 209)",
    "onSurfaceVariant": "rgb(72, 71, 59)",
    "outline": "rgb(121, 120, 105)",
    "outlineVariant": "rgb(201, 199, 182)",
    "shadow": "rgb(0, 0, 0)",
    "scrim": "rgb(0, 0, 0)",
    "inverseSurface": "rgb(49, 49, 43)",
    "inverseOnSurface": "rgb(244, 240, 232)",
    "inversePrimary": "rgb(200, 206, 68)",
    "elevation": {
      "level0": "transparent",
      "level1": "rgb(247, 243, 242)",
      "level2": "rgb(242, 239, 235)",
      "level3": "rgb(237, 234, 227)",
      "level4": "rgb(236, 233, 224)",
      "level5": "rgb(233, 230, 219)"
    },
    "surfaceDisabled": "rgba(28, 28, 23, 0.12)",
    "onSurfaceDisabled": "rgba(28, 28, 23, 0.38)",
    "backdrop": "rgba(49, 49, 37, 0.4)"
  }
};
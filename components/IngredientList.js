import { View, StyleSheet} from "react-native";
import { Text, Card, Divider} from "react-native-paper";

export default function IngredientList({ meal }) {
    const ingredients = [];
    for (let i = 1; i <= 20; i++) {
      const ingredient = meal[`strIngredient${i}`];
      const measure = meal[`strMeasure${i}`];
      if (ingredient && measure) {
        ingredients.push(`${ingredient} ${measure}`);
      }
    }
  
    return (
      <Card>
        <Card.Title title={meal.strMeal}/>
        <Card.Cover source={{ uri: meal.strMealThumb }}  />
        <Card.Content>
          <Text variant="titleSmall">Ingredients</Text>
          {ingredients.map((item, index) => (
          <Text key={index}>
            {item}
          </Text>
        ))}
        <Divider/>
        <Text variant="titleSmall">Instructions</Text>
        <Text> {meal.strInstructions} </Text>
        </Card.Content>
      </Card>
    );
};

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
      <Card style={styles.card}> 
        <Card.Title style={styles.title} title={meal.strMeal}/>
        <Card.Cover style={styles.image} source={{ uri: meal.strMealThumb }}  />
        <Card.Content>
            <Text style={styles.header} variant="titleSmall">Ingredients</Text>
            {ingredients.map((item, index) => (
            <Text style={styles.text} key={index}>
              {item}
            </Text>
          ))}
          <Divider/>
          <Text style={styles.header} variant="titleSmall">Instructions</Text>
          <Text style={styles.instruction}> {meal.strInstructions} </Text>
        </Card.Content>
      </Card>
    );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: 120,
    marginLeft: 5,
    marginRigh: 5,
  },
  image: {
    height: 110,
    width: '90%',
    resizeMode: 'cover',
    marginLeft: 20,
    marginRight: 20,
  },
  header: {
    marginTop: 10,
    marginBottom: 10
  },
  text: {
    marginBottom: 5
  },
  instruction: {
    marginBottom: 10,
    marginRight: 10
  },
  title: {
    fontSize: 20
  }
});

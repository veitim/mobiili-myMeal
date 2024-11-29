import { Image, Text, View, StyleSheet} from "react-native";

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
      <View>
        <Text style={styles.header}>{meal.strMeal}</Text>
        <Image source={{ uri: meal.strMealThumb }} style={styles.image} />
        <Text style={styles.subHeader}>Ingredients:</Text>
        {ingredients.map((item, index) => (
          <Text key={index} style={styles.ingredient}>
            {item}
          </Text>
        ))}
        <Text style={styles.list}> {meal.strInstructions} </Text>
      </View>
    );
};

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
      fontSize: 15, 
      fontWeight: "bold",
    },
    subHeader: {
      fontSize: 15,
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

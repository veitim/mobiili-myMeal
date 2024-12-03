function fetchRandom() {
    return fetch(`https://www.themealdb.com/api/json/v1/1/random.php`)
        .then(response => {
          if (!response.ok)
            throw new Error("Error in fetch:" + response.statusText);
            
          return response.json()
        })
}

function fetchMeal(idMeal) {
    return fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${idMeal}`)
        .then(response => {
          if (!response.ok)
            throw new Error("Error in fetch:" + response.statusText);
            
          return response.json()
        })
}

function fetchCategory(fcategory) {
  return fetch(`https://www.themealdb.com/api/json/v1/1/category/${fcategory}.php`)
  .then(response => {
    if (!response.ok)
      throw new Error("Error in fetch:" + response.statusText);
      
    return response.json()
  })
}

function fetchCategories() {
  return fetch(`https://www.themealdb.com/api/json/v1/1/categories.php`)
  .then(response => {
    if (!response.ok)
      throw new Error("Error in fetch:" + response.statusText);
      
    return response.json()
  })
}

export { fetchRandom, fetchMeal, fetchCategory, fetchCategories }
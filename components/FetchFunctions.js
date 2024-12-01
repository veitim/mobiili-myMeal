function fetchRandom() {
    return fetch(`https://www.themealdb.com/api/json/v1/1/random.php`)
        .then(response => {
          if (!response.ok)
            throw new Error("Error in fetch:" + response.statusText);
            
          return response.json()
        })
}

function fetchMeal(fmeal) {
    return fetch(`www.themealdb.com/api/json/v1/1/lookup.php?i=${fmeal}`)
        .then(response => {
          if (!response.ok)
            throw new Error("Error in fetch:" + response.statusText);
            
          return response.json()
        })
}

function fetchCategory(fcategory) {

}

export { fetchRandom, fetchMeal, fetchCategory }
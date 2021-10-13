import React, { useState, useEffect } from "react";

import IngredientForm from "./IngredientForm";
import IngredientList from "./IngredientList";
import Search from "./Search";

const Ingredients = () => {
  const [userIngredients, setUserIngredients] = useState([]);

  useEffect(() => {
    fetch(
      "https://udemy-reacthooks-review-default-rtdb.firebaseio.com/.json"
    ).then((response) =>
      response.json().then((responseData) => {
        const loadedIngredients = [];
        for (const key in responseData) {
          loadedIngredients.push({
            id: key,
            title: responseData[key].title,
            amount: responseData[key].amount,
          });
        }
        setUserIngredients(loadedIngredients);
      })
    );
  }, []);

  useEffect(() => {
    console.log("RENDERING INGREDIENTS!", userIngredients);
  }, [userIngredients]);

  const addIngredientHandler = (ingredient) => {
    fetch("https://udemy-reacthooks-review-default-rtdb.firebaseio.com/.json", {
      method: "POST",
      //  JSON can .stringify() an object OR an array!
      body: JSON.stringify(ingredient),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        return response.json();
      })
      .then((responseData) => {
        //  Ingredient is already an object, so putting an object inside of an object! ...ingredient gets
        //  all of its properties.
        setUserIngredients((prevIngredients) => [
          ...prevIngredients,
          //  This gets the auto-generated id from Firebase!
          { id: responseData.name, ...ingredient },
        ]);
      });
  };

  const removeIngredientHandler = (ingredientId) => {
    setUserIngredients((prevIngredients) =>
      prevIngredients.filter((ingredient) => ingredient.id !== ingredientId)
    );
  };

  return (
    <div className="App">
      <IngredientForm onAddIngredient={addIngredientHandler} />

      <section>
        <Search />
        <IngredientList
          ingredients={userIngredients}
          onRemoveItem={removeIngredientHandler}
        />
      </section>
    </div>
  );
};

export default Ingredients;

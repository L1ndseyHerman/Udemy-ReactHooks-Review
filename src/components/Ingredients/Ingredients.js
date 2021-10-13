import React, { useState, useCallback } from "react";

import IngredientForm from "./IngredientForm";
import IngredientList from "./IngredientList";
import Search from "./Search";

const Ingredients = () => {
  const [userIngredients, setUserIngredients] = useState([]);

  const filteredIngredientsHandler = useCallback((filteredIngredients) => {
    setUserIngredients(filteredIngredients);
  }, []);

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
    //  Need backticks to choose which item to delete:
    //  Hmm, my Firebase doesn't have an "ingredients" section. Is that why the filter doesn't work?
    fetch(
      //`https://udemy-reacthooks-review-default-rtdb.firebaseio.com/ingredients/${ingredientId}.json`,
      `https://udemy-reacthooks-review-default-rtdb.firebaseio.com/${ingredientId}.json`,
      {
        method: "DELETE",
      }
    ).then((response) => {
      setUserIngredients((prevIngredients) =>
        prevIngredients.filter((ingredient) => ingredient.id !== ingredientId)
      );
    });
  };

  return (
    <div className="App">
      <IngredientForm onAddIngredient={addIngredientHandler} />

      <section>
        <Search onLoadIngredients={filteredIngredientsHandler} />
        <IngredientList
          ingredients={userIngredients}
          onRemoveItem={removeIngredientHandler}
        />
      </section>
    </div>
  );
};

export default Ingredients;

import React, { useState, useCallback } from "react";

import IngredientForm from "./IngredientForm";
import IngredientList from "./IngredientList";
import ErrorModal from "../UI/ErrorModal";
import Search from "./Search";

const Ingredients = () => {
  const [userIngredients, setUserIngredients] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();

  const filteredIngredientsHandler = useCallback((filteredIngredients) => {
    setUserIngredients(filteredIngredients);
  }, []);

  const addIngredientHandler = (ingredient) => {
    setIsLoading(true);
    fetch("https://udemy-reacthooks-review-default-rtdb.firebaseio.com/.json", {
      method: "POST",
      //  JSON can .stringify() an object OR an array!
      body: JSON.stringify(ingredient),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        setIsLoading(false);
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
    setIsLoading(true);
    //  Need backticks to choose which item to delete:
    //  Hmm, my Firebase doesn't have an "ingredients" section. Is that why the filter doesn't work?
    fetch(
      //`https://udemy-reacthooks-review-default-rtdb.firebaseio.com/ingredients/${ingredientId}.json`,
      `https://udemy-reacthooks-review-default-rtdb.firebaseio.com/${ingredientId}.json`,
      {
        method: "DELETE",
      }
    )
      .then((response) => {
        setIsLoading(false);
        setUserIngredients((prevIngredients) =>
          prevIngredients.filter((ingredient) => ingredient.id !== ingredientId)
        );
      })
      .catch((error) => {
        //setError(error.message);

        //  This is state batching. U wouldn't be able to access the results from
        //  setError() in setIsLoading(), the states update at the same time somehow bec threads.
        //  Both of these only call 1 render instead of 2!
        setIsLoading(false);
        setError("Something went wrong!");
      });
  };

  const clearError = () => {
    setError(null);
  };

  return (
    <div className="App">
      {error && <ErrorModal onClose={clearError}>{error}</ErrorModal>}
      <IngredientForm
        onAddIngredient={addIngredientHandler}
        loading={isLoading}
      />

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

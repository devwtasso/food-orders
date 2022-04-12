/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { ImSpinner9 } from 'react-icons/im';
import { IconContext } from 'react-icons/lib';
import firebaseInstance from '../../services/firebase';

import Card from '../UI/Card';
import MealItem from './MealItem/MealItem';


const AvailableMeals = () => {
  const [meals, setMeals] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [httpError, setHttpError] = useState();
  const [categories, setCategories] = useState([]);

  let tabelaTemp = [];

  useEffect(() => {
    handleGetCategories()
  }, [])

  const handleGetProducts = async () => {
    let tempCategories = []
    const docsCategories = await firebaseInstance.getCategories();

    docsCategories.forEach((snap) => {
      const data = snap.data();
      tempCategories.push(data.category);
    });

    

    const docs = await firebaseInstance.getProducts();

    docs.forEach((snap) => {
      const data = snap.data();
      tabelaTemp.push({...data, id: snap.id});
    });

    tempCategories.forEach((category) => {
      tabelaTemp.filter(produto => produto.category === category)  
    })

    return tabelaTemp;
  };

  const handleGetCategories = async () => {
    let tempCategories = []
    const docs = await firebaseInstance.getCategories();

    docs.forEach((snap) => {
      const data = snap.data();
      tempCategories.push(data.category);
    });

    console.log({ tempCategories })
    setCategories(tempCategories)
  };


  useEffect(() => {
    const fetchMeals = async () => {
      const loadedMeals = await handleGetProducts();
      
      setMeals(loadedMeals);
      setIsLoading(false);
    };

    fetchMeals().catch(error => {
      setIsLoading(false);
      setHttpError(error.message);
    });
  }, []);

  const mealsList = meals.map(meal => (
    <MealItem
      id={meal.id}
      key={meal.id}
      name={meal.name}
      description={meal.description}
      price={meal.price}
      image={meal.image}
      category={meal.category}
    />
  ));

  if (isLoading) {
    return (
      <section className="text-center p-4 bg-white shadow-md rounded-2xl max-w-[60rem] w-[90%] my-8 mx-auto">
        <IconContext.Provider value={{ className: 'spinner' }}>
          <ImSpinner9 />
        </IconContext.Provider>
      </section>
    );
  }

  if (httpError) {
    return (
      <section className="p-4 bg-white shadow-md rounded-2xl max-w-[60rem] w-[90%] my-8 mx-auto text-center">
        <p className="text-2xl text-red-600">{httpError}</p>
      </section>
    );
  }

  return (
    <section className="max-w-[60rem] w-[90%] my-8 mx-auto animate-meals-appear">
      <Card>
        <ul className="list-none m-0 p-0">{mealsList}</ul>
      </Card>
    </section>
  );
};

export default AvailableMeals;

'use client'
import RecipeCard from './components/RecipeCard'
import { useEffect, useState } from 'react';
import axios from 'axios';

export default function Home() {
  const [lessCaloriesRecipes, setLessCaloriesRecipes] = useState([]);
  const [lessPreparationTime, setLessPreparationTime] = useState([]);
  const [lessPrice, setLessPrice] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('https://api.yemekcuzdani.com/api/v1/recipes/home')
      .then((response) => {
        setLessCaloriesRecipes(response.data.lessCalories);
        setLessPreparationTime(response.data.lessPreparationTime);
        setLessPrice(response.data.lessPrice);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div>Yükleniyor...</div>;
  }

  return (
    <div>
      <div className="inset-2 bottom-0 rounded-4xl ring-1 ring-inset ring-black/5 bg-white p-4">
        <div className="flex items-center justify-start mb-8 pl-4">
          <h1 className="flex flex-row font-bold text-2xl text-red-500"><img className='w-8 h-8 object-cover mr-2' src="/images/diet.png" alt="" />Az Kalori, Çok Lezzet !</h1>
        </div>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {lessCaloriesRecipes.map((recipe: any, index: number) => (
            <RecipeCard key={`${recipe.id}-${index}`} recipe={recipe} />
          ))}
        </div>
      </div>
      <div className="inset-2 bottom-0 rounded-4xl ring-1 ring-inset ring-black/5 bg-white p-4 flex flex-col mt-10">
      <div className="flex items-center justify-start mb-8 pl-4">
          <h1 className="flex flex-row font-bold text-2xl text-blue-500"><img className='w-8 h-8 object-cover mr-2' src="/images/clock.png" alt="" />Dakikalarla Yarışan Lezzetler !</h1>
        </div>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {lessPreparationTime.map((recipe: any, index: number) => (
            <RecipeCard key={`${recipe.id}-${index}`} recipe={recipe} />
          ))}
        </div>
      </div>
      <div className="inset-2 bottom-0 rounded-4xl ring-1 ring-inset ring-black/5 bg-white p-4 flex flex-col mt-10">
      <div className="flex items-center justify-start mb-8 pl-4">
          <h1 className="flex flex-row font-bold text-2xl text-green-500"><img className='w-8 h-8 object-cover mr-2' src="/images/offer.png" alt="" />Cebin Rahat, Sofran Şahane !</h1>
        </div>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {lessPrice.map((recipe: any, index: number) => (
            <RecipeCard key={`${recipe.id}-${index}`} recipe={recipe} />
          ))}
        </div>
      </div>
    </div>
  )
}

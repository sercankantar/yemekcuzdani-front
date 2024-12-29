import React, { useEffect, useState } from 'react';
import { FaClock, FaComment, FaDollarSign, FaFire, FaMoneyBill, FaRegClock, FaStar, FaUsers } from 'react-icons/fa';
import useLoginModal from '../hooks/useLoginModal';
import axios from 'axios';
import { getCurrentUser } from '../actions/getCurrentUser';
import useFavorite from "../hooks/useFavorite";
import { AiFillHeart, AiOutlineHeart } from 'react-icons/ai';
interface RecipeCardProps {
  recipe: {
    _id: string;
    seo_url: any;
    name: string;
    description: string;
    images: string[];
    servings: number;
    totalPrice: number;
    preparation_time: number;
    cooking_time: number;
    ratingAverage: number;
    ratingCount: number;
    comments: object[];
  };
}

const RecipeCard: React.FC<RecipeCardProps> = ({ recipe }) => {
  const [user,setUser] = useState<any>(null);
  const { hasFavorited, toggleFavorite } = useFavorite({ listingId: recipe._id, currentUser: user });
  return (

    <div className="max-w-md mx-auto bg-white border-1 shadow-md rounded-xl overflow-hidden">
      <div className="relative">
        <img
          src={`https://api.yemekcuzdani.com${recipe.images[0]}`}
          alt={recipe.name}
          className="w-full h-[200px] object-cover"
        />
        <button
          onClick={toggleFavorite}
          className="absolute top-4 right-4 p-2 rounded-full bg-white/80 hover:bg-white transition-colors"
          aria-label="Add to favorites"
        >
              <AiFillHeart
                size={24}
                className={
                  hasFavorited ? 'fill-rose-500' : 'fill-neutral-500/70'
                }
              />
          
        </button>
        
        <div className="absolute bottom-4 left-4 flex items-center space-x-2">
          <div className="px-2 py-1 bg-white/80 rounded-md text-sm flex items-center">
          <FaComment className='w-3 h-3 mr-1 text-gray-600' />
            {recipe.comments.length} yorum
          </div>
          <div className="px-2 py-1 bg-white/80 rounded-md text-sm flex items-center">
            <svg
              className="w-4 h-4 mr-1 text-yellow-400"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            {recipe.ratingAverage} ({recipe.ratingCount} değerlendirme)
          </div>
        </div>
      </div>
      <a href={`/tarif/${recipe.seo_url}`} className="p-4 flex flex-col items-center">
        <h3 className="text-lg font-extrabold text-pink-500 line-clamp-1 text-center">
          {recipe.name}
        </h3>
        <p className="text-base text-gray-600 mb-4 line-clamp-2 text-center">
          {recipe.description}
        </p>
        <div className="mb-2 p-2 flex flex-wrap justify-center items-center gap-4">
          <div className="text-sm text-gray-600 flex items-center">
          <FaUsers className="mr-1 text-blue-500" size={18} /> {recipe.servings} kişilik
          </div>
          <div className="text-sm text-gray-600 flex items-center">
            
          <FaRegClock className="mr-1 text-green-500" size={18} /> {recipe.preparation_time}dk Hazırlık
          </div>
          <div className="text-sm text-gray-600 flex items-center">
            <FaFire className="mr-1 text-red-500" size={18} /> {recipe.cooking_time}dk Pişirme
          </div>
          
        </div>
        <div className="flex items-center justify-center">
          <button className="flex items-center justify-center gap-2 bg-[#EC48A6] hover:bg-[#EC48A6] text-white font-bold py-2 px-4 md:px-8 lg:px-16 rounded-lg shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105 w-full md:w-auto">
            <FaMoneyBill className="w-5 h-5" />
            <span className="text-lg">{recipe.totalPrice.toFixed(1)} ₺</span>
          </button>
        </div>
    
      </a>
    </div>
  );
};

export default RecipeCard;

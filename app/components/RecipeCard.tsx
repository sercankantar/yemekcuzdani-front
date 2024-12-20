import React from 'react';
import { FaStar } from 'react-icons/fa';

interface RecipeCardProps {
  recipe: {
    seo_url: any;
    name: string;
    description: string;
    images: string[];
    servings: number;
    preparation_time: number;
    cooking_time: number;
    ratingAverage: number;
    ratingCount: number;
    comments: object[];
  };
}

const RecipeCard: React.FC<RecipeCardProps> = ({ recipe }) => {
  return (
    <div className="border rounded-lg shadow-md overflow-hidden max-w-lg mx-auto">
      <img
        src={`https://api.yemekcuzdani.com${recipe.images[0]}`}
        alt={recipe.name}
        className="w-full h-56 object-cover"
        onError={(e) => (e.currentTarget.src = '/placeholder-image.jpg')} // Görsel yüklenemezse placeholder kullanılır
      />
      <div className="p-6">
      <h2 className="text-xl font-bold mb-3">
         <a href={`/tarif/${recipe.seo_url}`} className="hover:underline">
           {recipe.name}
         </a>
       </h2>
        <p className="text-base text-gray-600 mb-4 line-clamp-3">
          {recipe.description}
        </p>

        {/* Bilgi Alanı */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4 justify-items-center">
          {/* Servis Bilgisi */}
          <div className="flex items-center gap-2 bg-[#64B5FF] rounded-md p-2 text-white">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
            </svg>
            <div className="flex items-baseline gap-1">
              <span className="font-semibold">Servis:</span>
              <span className="bg-white text-[#64B5FF] font-bold rounded px-2 py-1">
                {recipe.servings}
              </span>
            </div>
          </div>

          {/* Hazırlık Bilgisi */}
          <div className="flex items-center gap-2 bg-[#FFEB3B] rounded-md p-2 text-black">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zm0-2c3.86 0 7 3.14 7 7s-3.14 7-7 7-7-3.14-7-7 3.14-7 7-7zm-1 9h2v2h-2zm0-8h2v6h-2z" />
            </svg>
            <div className="flex items-baseline gap-1">
              <span className="font-semibold">Hazırlık:</span>
              <span className="bg-white text-black font-bold rounded px-2 py-1">
                {recipe.preparation_time}dk
              </span>
            </div>
          </div>

          {/* Pişirme Bilgisi */}
          <div className="flex items-center gap-2 bg-[#4CAF50] rounded-md p-2 text-white">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
              <path d="M6 13c0-2.21 1.79-4 4-4s4 1.79 4 4-1.79 4-4 4-4-1.79-4-4zm8 0c0-2.21 1.79-4 4-4s4 1.79 4 4-1.79 4-4 4-4-1.79-4-4zm-8 6c0-2.21 1.79-4 4-4s4 1.79 4 4H6zm8 0c0-2.21 1.79-4 4-4s4 1.79 4 4h-8z" />
            </svg>
            <div className="flex items-baseline gap-1">
              <span className="font-semibold">Pişirme:</span>
              <span className="bg-white text-[#4CAF50] font-bold rounded px-2 py-1">
                {recipe.cooking_time}dk
              </span>
            </div>
          </div>
        </div>


        {/* Puan Alanı */}
        {/* Puan Alanı */}
        <div className="flex items-center justify-between">
          <div className="flex items-center text-yellow-500">
            {[...Array(5)].map((_, i) => (
              <FaStar
                key={i}
                color={i < Math.round(recipe.ratingAverage) ? "#ffc107" : "#e4e5e9"}
              />
            ))}
            <span className="ml-2 text-sm text-gray-600">({recipe.ratingCount} oy)</span>
          </div>
          {recipe.comments.length === 0 ? (
           <span className="text-sm">Henüz hiç yorum atılmamış, ilk yorumlayan sen ol...</span>
         ) : (
           <span className="ml-2 text-sm text-gray-600">({recipe.comments.length} yorum)</span>
         )}
        </div>
      </div>
    </div>
  );
};

export default RecipeCard;

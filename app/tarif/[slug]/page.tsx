"use client";

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import axios from 'axios';
// Recipe türünü tanımlayın
interface Ingredient {
   Ingredient_Description: string;
   _id: string;
}
interface Pricing {
   totalCost: number;
   needToSpendMoney: number;
   cheapestProducts: CheapestProduct[];
}
interface CheapestProduct {
    ingredientName: string;
    cheapestProduct: {
        name: string;
        price: number;
        priceString: string;
        pricePerUnit: number;
        brand: string | null;
        market: string;
        weight: number;
        required_weight: number;
        ingredientTotalPrice: string;
        url: string;
        image: string;
    };
}
interface Recipe {
   name: string;
   description: string;
   ingredients: Ingredient[];
   recipe_instructions: string[];
   comments: string[];
   images: string[];
}
interface Comment {
    _id: string;
    content: string;
    user: {
        profileImageId: string;
        _id: string;
        email: string;
        fullName: string | null;
    };
}
function RecipePage() {
   const { slug } = useParams();
   const [recipe, setRecipe] = useState<Recipe | null>(null);
   const [comments, setComments] = useState<Comment[]>([]);
   const [pricing, setPricing] = useState<Pricing | null>(null);
   const storedToken = localStorage.getItem('token');
    useEffect(() => {
       const fetchRecipe = async () => {
           if (slug) {
               try {
                   const response = await axios.get(`https://api.yemekcuzdani.com/api/v1/recipes/get-recipe/${slug}`, {
                       headers: {
                           Authorization: `Bearer ${storedToken}`,
                       },
                   });
                   setRecipe(response.data.Recipe);
                   setComments(response.data.Comments);
                   setPricing(response.data.Pricing);
               } catch (error) {
                   console.error('Tarif alınırken hata oluştu:', error);
               }
           }
       };
        fetchRecipe();
   }, [slug]);
    if (!recipe) {
       return <div className="flex justify-center items-center h-screen">Yükleniyor...</div>;
   }
    return (
       <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg">
        <img src={`https://api.yemekcuzdani.com${recipe.images[0]}`} alt={recipe.name} className="w-full h-56 object-cover" onError={(e) => (e.currentTarget.src = '/placeholder-image.jpg')}   />
           <h1 className="text-3xl font-bold mb-4">{recipe.name}</h1>
           <p className="text-gray-700 mb-6">{recipe.description}</p>
           
           <div className="mb-6">
               <h2 className="text-2xl font-semibold mb-2">Malzemeler</h2>
               <ul className="list-disc list-inside space-y-2">
                   {recipe.ingredients.map((ingredient) => (
                       <li key={ingredient._id} className="text-gray-600">
                           {ingredient.Ingredient_Description}
                       </li>
                   ))}
               </ul>
           </div>
            <div className="mb-6">
               <h2 className="text-2xl font-semibold mb-2">Yapılış</h2>
               <ol className="list-decimal list-inside space-y-2">
                   {recipe.recipe_instructions.map((instruction, index) => (
                       <li key={index} className="text-gray-600">
                           {instruction}
                       </li>
                   ))}
               </ol>
           </div>
           <div className="mb-6">
           
       </div>
       <div className="mb-6">
           <h2 className="text-2xl font-semibold mb-2">Fiyatlandırma</h2>
           {pricing && (
               <>
                   <p>Toplam Maliyet: {pricing.totalCost.toFixed(2)} TL</p>
                   <p>Gerekli Harcama: {pricing.needToSpendMoney} TL</p>
                   <table className="min-w-full bg-white">
                       <thead>
                           <tr>
                               <th className="py-2">Malzeme</th>
                               <th className="py-2">Ürün</th>
                               <th className="py-2">Fiyat</th>
                               <th className="py-2">Marka</th>
                               <th className="py-2">Market</th>
                               <th className="py-2">Görsel</th>
                               <th className="py-2">Link</th>
                               <th className="py-2">Gerekli Ağırlık</th>
                               <th className="py-2">Toplam Fiyat</th>
                           </tr>
                       </thead>
                       <tbody>
                           {pricing.cheapestProducts.map((product) => (
                               <tr key={product.ingredientName} className="bg-gray-100">
                                   <td className="border px-4 py-2">{product.ingredientName}</td>
                                   {product.cheapestProduct ? (
                                       <>
                                           <td className="border px-4 py-2">{product.cheapestProduct.name}</td>
                                           <td className="border px-4 py-2">{product.cheapestProduct.priceString}</td>
                                           <td className="border px-4 py-2">{product.cheapestProduct.brand || 'Bilinmiyor'}</td>
                                           <td className="border px-4 py-2">{product.cheapestProduct.market}</td>
                                           <td className="border px-4 py-2">
                                               <img src={product.cheapestProduct.image} alt={product.cheapestProduct.name} className="w-16 h-16 object-cover" />
                                           </td>
                                           <td className="border px-4 py-2">
                                               <a href={product.cheapestProduct.url} target="_blank" rel="noopener noreferrer" className="text-blue-500">Ürünü Gör</a>
                                           </td>
                                           <td className="border px-4 py-2">{product.cheapestProduct.required_weight} g</td>
                                           <td className="border px-4 py-2">{product.cheapestProduct.ingredientTotalPrice}</td>
                                       </>
                                   ) : (
                                       <td colSpan={8} className="border px-4 py-2 text-center">Ürün bilgisi mevcut değil</td>
                                   )}
                               </tr>
                           ))}
                       </tbody>
                   </table>
               </>
           )}
       </div>
       <h2 className="text-2xl font-semibold mb-2">Yorumlar</h2>
           <ul className="space-y-4">
               {comments.map((comment) => (
                   <li key={comment._id} className="bg-gray-100 p-4 rounded-lg shadow">
                       <div className="flex items-center mb-2">
                           <img src={`https://api.yemekcuzdani.com${comment.user.profileImageId}`} alt="Profile" className="w-8 h-8 rounded-full mr-2" />
                           <span className="font-semibold">{comment.user.fullName || comment.user.email}</span>
                       </div>
                       <p className="text-gray-700">{comment.content}</p>
                   </li>
               ))}
           </ul>
       </div>
   );
}
export default RecipePage;
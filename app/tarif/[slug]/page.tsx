"use client";

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import axios from 'axios';
import useLoginModal from '@/app/hooks/useLoginModal';
import { getCurrentUser } from '@/app/actions/getCurrentUser';
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
    _id: string;
    name: string;
    description: string;
    ingredients: Ingredient[];
    recipe_instructions: string[];
    comments: string[];
    images: string[];
    ratingAverage: number;
    calories: number;
    proteins: number;
    fats: number;
    carbohydrates: number;
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
    const [currentUserId, setCurrentUserId] = useState<string | null>(null);
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
        getCurrentUser(storedToken?.toString()).then(data => setCurrentUserId(data._id));
    }
    const [newComment, setNewComment] = useState('');
    const loginModal = useLoginModal();
    const [userRating, setUserRating] = useState<number | null>(null);
    const handleRatingSubmit = async () => {
        if (!storedToken) {
            loginModal.onOpen();
            return;
        }
        if (userRating === null) {
            alert("Lütfen bir puan seçin.");
            return;
        }
        try {
            await axios.post(
                `https://api.yemekcuzdani.com/api/v1/recipes/add-rating/${recipe?._id}`,
                {
                    rating: userRating
                },
                {
                    headers: {
                        Authorization: `Bearer ${storedToken}`,
                    },
                }
            );
            alert("Puanınız kaydedildi!");
        } catch (error) {
            console.error('Puan gönderilirken hata oluştu:', error);
        }
    };
    const handleDeleteComment = async (commentId: string) => {
        if (!storedToken) {
            loginModal.onOpen();
            return;
        }
        try {
            await axios.delete(`https://api.yemekcuzdani.com/api/v1/recipes/delete-comment/${commentId}`, {
                headers: {
                    Authorization: `Bearer ${storedToken}`,
                },
            });
            window.location.reload();
        } catch (error) {
            console.error('Yorum silinirken hata oluştu:', error);
        }
    };
    const handleCommentSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!storedToken) {
            loginModal.onOpen();
            return;
        }
        try {
            const response = await axios.post(
                `https://api.yemekcuzdani.com/api/v1/recipes/create-comment`,
                {
                    recipeId: recipe?._id,
                    content: newComment
                },
                {
                    headers: {
                        Authorization: `Bearer ${storedToken}`,
                    },
                }
            );
            setComments([...comments, response.data.comment]);
            window.location.reload();
            setNewComment('');
        } catch (error) {
            console.error('Yorum gönderilirken hata oluştu:', error);
        }
    };
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
            <img src={`https://api.yemekcuzdani.com${recipe.images[0]}`} alt={recipe.name} className="w-full h-56 object-cover" onError={(e) => (e.currentTarget.src = '/placeholder-image.jpg')} />
            <h1 className="text-3xl font-bold mb-4">{recipe.name}</h1>
            <p className="text-gray-700 mb-6">{recipe.description}</p>
            <div className="mb-6">
                <h2 className="text-xl font-semibold">Puan: {recipe.ratingAverage ? recipe.ratingAverage.toFixed(1) : 'Henüz puanlanmamış'}</h2>
                <div className="flex items-center mt-2">
                    {[1, 2, 3, 4, 5].map((value) => (
                        <button
                            key={value}
                            onClick={() => setUserRating(value)}
                            className={`px-2 py-1 border ${userRating === value ? 'bg-blue-500 text-white' : 'bg-white text-blue-500'}`}
                        >
                            {value}
                        </button>
                    ))}
                </div>
                <button
                    onClick={handleRatingSubmit}
                    className="mt-2 px-4 py-2 bg-blue-500 text-white rounded"
                >
                    Puanla
                </button>
            </div>
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
                <h2 className="text-2xl font-semibold mb-2">Kalori</h2>
                <p className="text-gray-600">{recipe.calories} kcal</p>
                <h2 className="text-2xl font-semibold mb-2">Protein</h2>
                <p className="text-gray-600">{recipe.proteins} g</p>
                <h2 className="text-2xl font-semibold mb-2">Yağ</h2>
                <p className="text-gray-600">{recipe.fats} g</p>
                <h2 className="text-2xl font-semibold mb-2">Karbonhidrat</h2>
                <p className="text-gray-600">{recipe.carbohydrates} g</p>
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
            {recipe.comments.length === 0 ? (
                <span className="text-sm">Henüz hiç yorum atılmamış, ilk yorumlayan sen ol...</span>
            ) : (
                <span className="ml-2 text-sm text-gray-600">({recipe.comments.length} yorum)</span>
            )}
            <ul className="space-y-4">
                {comments.map((comment) => (
                    <li key={comment._id} className="bg-gray-100 p-4 rounded-lg shadow">
                        <div className="flex items-center mb-2">
                            <img src={`https://api.yemekcuzdani.com${comment.user.profileImageId}`} alt="Profile" className="w-8 h-8 rounded-full mr-2" />
                            <span className="font-semibold">{comment.user.fullName || comment.user.email}</span>
                            {comment.user._id === currentUserId && (
                                <button
                                    onClick={() => handleDeleteComment(comment._id)}
                                    className="ml-auto text-red-500 hover:text-red-700"
                                >
                                    Sil
                                </button>
                            )}
                        </div>
                        <p className="text-gray-700">{comment.content}</p>
                    </li>
                ))}
            </ul>
            <form onSubmit={handleCommentSubmit} className="mt-4">
                <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    className="w-full p-2 border rounded"
                    placeholder="Yorumunuzu yazın..."
                    required
                />
                <button type="submit" className="mt-2 px-4 py-2 bg-blue-500 text-white rounded">
                    Yorum Yap
                </button>
            </form>
        </div>
    );
}
export default RecipePage;
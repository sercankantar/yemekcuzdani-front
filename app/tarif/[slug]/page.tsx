"use client";

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import axios from 'axios';
import useLoginModal from '@/app/hooks/useLoginModal';
import { getCurrentUser } from '@/app/actions/getCurrentUser';
import { SafeUser } from '@/app/types';
import { AiFillHeart } from 'react-icons/ai';
import useFavorite from '@/app/hooks/useFavorite';
import { BiChevronLeft, BiChevronRight } from 'react-icons/bi';
import { FaBreadSlice, FaCheck, FaChevronCircleDown, FaChevronCircleUp, FaCloudMeatball, FaDollarSign, FaFire, FaFireAlt, FaFish, FaInfo, FaInfoCircle, FaMoneyBill, FaOilCan, FaReceipt, FaRegClock, FaStar, FaStore, FaStoreAlt, FaTrash, FaUsers, FaUtensils, FaUtensilSpoon, FaWeight } from 'react-icons/fa';
import { TbBrand4Chan } from 'react-icons/tb';
import Container from '@/app/components/Container';
import toast from 'react-hot-toast';
import Loader from '@/app/components/Loader';
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
    servings: number;
    preparation_time: number;
    cooking_time: number;
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
    const [user, setUser] = useState<SafeUser | null>(null);
    const storedToken = localStorage.getItem('token');
    useEffect(() => {
        if (storedToken) {
            getCurrentUser(storedToken?.toString()).then(data => setUser(data));
        }
    }, [storedToken]);
    const [newComment, setNewComment] = useState('');
    const loginModal = useLoginModal();
    const [userRating, setUserRating] = useState<number | null>(null);
    const [showMore, setShowMore] = useState(false);
    const { hasFavorited, toggleFavorite } = useFavorite({ listingId: recipe?._id || "", currentUser: user });
    const handleShowMore = () => {
      setShowMore(true);
    };
  
    const handleShowLess = () => {
      setShowMore(false);
    };
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
            getCurrentUser(storedToken?.toString()).then(data => setUser(data));
            toast.success("Değerlendirildi !");
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
            toast.success("Yorum Silindi !");
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
            toast.success("Yorum Yapıldı !");
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
        return <Loader/>;
    }
    return (
        <Container>
        <div className="max-w-screen-lg mx-auto">
            
            {/* ListingClient */}
            <div className='flex flex-col gap-6'>
                {/* Heading */}
                
                <div className="w-full  overflow-hidden rounded-xl relative">
                    <img src={`https://api.yemekcuzdani.com${recipe.images[0]}`} alt={recipe.name} className="object-cover w-full" onError={(e) => (e.currentTarget.src = '/placeholder-image.jpg')} />
                    {/* Fav */}
                    <div className='absolute top-5 right-5'>
                        <button
                                  onClick={toggleFavorite}
                                  className="absolute top-4 right-4 p-2 rounded-full bg-white/80 hover:bg-white transition-colors"
                                  aria-label="Add to favorites"
                                >
                                      <AiFillHeart
                                        size={30}
                                        className={
                                          hasFavorited ? 'fill-rose-500' : 'fill-neutral-500/70'
                                        }
                                      />
                                  
                        </button>    
                    </div>

                </div>
                {/* Heading bitti */}
                <div className='grid grid-cols-1 md:grid-cols-7 md:gap-10 mt-6'>
                    {/* Heading info */}
                    <div className='col-span-4 flex flex-col gap-8'>
                    <div className='flex flex-col gap-6'>
                        <div className='text-lg font-semibold'>
                        {recipe.name}
                            </div>
                            <div className='flex flex-row items-center gap-4'>
                                {recipe.description}
                            </div>
                        </div>
                        <hr />
                        <div className="flex flex-col gap-4">
                                <div className="flex flex-row items-center gap-3">
                                    <h2 className="flex text-xl font-semibold">
                                        <FaStar className="mr-2 text-yellow-500" size={24} />
                                        Değerlendirme: {recipe.ratingAverage ? recipe.ratingAverage.toFixed(1) : 'Henüz değerlendirilmemiş'}
                                    </h2>
                                    {user && !user.ratedRecipes.includes(recipe._id) && (
                                        <div className="flex flex-col">
                                            <div className="flex flex-row items-center gap-1">
                                                {[1, 2, 3, 4, 5].map((value) => (
                                                    <button
                                                        key={value}
                                                        onClick={() => setUserRating(value)}
                                                        className={`transition-all duration-200 ${userRating !== null && userRating >= value ? 'text-yellow-500' : 'text-gray-400'} text-2xl`}
                                                    >
                                                        <FaStar  />
                                                    </button>
                                                ))}
                                                <button
                                                onClick={handleRatingSubmit}
                                                className="mt-2 flex items-center  gap-2 px-2 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition duration-200"
                                            >
                                                <FaCheck size={20} />
                                                
                                            </button>

                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>


                        <hr />
                        <div className='flex flex-col gap-6'>
                            <div className='flex flex-row items-center gap-4'>
                                <img
                                      className="rounded-full" 
                                      height="30" 
                                      width="30" 
                                      alt="Avatar" 
                                      src={'/images/placeholder.jpg'}
                                    />
                                <div className='flex flex-col'>
                                    <div className='text-lg font-semibold'>
                                        Yemek Cüzdanı
                                    </div>
                                    <div className='text-neutral-500 font-light'>
                                        tarafından hazırlanmıştır.
                                    </div>
                                </div>
                            </div>
                            

                        </div>
                        <hr />
                        <div className='flex flex-col gap-6'>
                        <div className='text-lg font-semibold'>
                                Tarif Bilgileri
                            </div>
                            <div className='flex flex-row items-center gap-4'>
                                <FaUsers className="mr-1 text-gray-500" size={18} />
                                <div className='flex flex-col'>
                                    <div className='text-lg font-semibold'>
                                        {recipe.servings} <span className='text-neutral-500 font-light'>kişilik</span>
                                    </div>
                                </div>
                                <FaRegClock className="mr-1 text-gray-500" size={18} />
                                <div className='flex flex-col'>
                                    <div className='text-lg font-semibold'>
                                    {recipe.preparation_time} <span className='text-neutral-500 font-light'>dk hazırlık</span>
                                    </div>
                                </div>
                                <FaFire className="mr-1 text-gray-500" size={18} />
                                <div className='flex flex-col'>
                                    <div className='text-lg font-semibold'>
                                    {recipe.cooking_time} <span className='text-neutral-500 font-light'>dk Pişirme</span>
                                    </div>
                                </div>
                            </div>
                            
                            

                        </div>
                        <hr />
                        <div className='flex flex-col gap-6'>
                            <div className='text-lg font-semibold'>
                                Besin Değerleri
                            </div>
                            <div className='flex flex-row items-center gap-4'>
                                <FaFireAlt className="mr-1 text-red-500" size={18} />
                                <div className='flex flex-col'>
                                    <div className='text-lg font-semibold'>
                                        {recipe.calories} kcal <span className='text-neutral-500 font-light'> Kalori</span>
                                    </div>
                                </div>
                                <FaBreadSlice className="mr-1 text-blue-500" size={18} />
                                <div className='flex flex-col'>
                                    <div className='text-lg font-semibold'>
                                    {recipe.carbohydrates} g <span className='text-neutral-500 font-light'>Karbonhidrat</span>
                                    </div>
                                </div>
                                <FaOilCan className="mr-1 text-yellow-500" size={18} />
                                <div className='flex flex-col'>
                                    <div className='text-lg font-semibold'>
                                    {recipe.fats} g <span className='text-neutral-500 font-light'>Yağ</span>
                                    </div>
                                </div>
                                <FaFish className="mr-1 text-green-500" size={18} />
                                <div className='flex flex-col'>
                                    <div className='text-lg font-semibold'>
                                    {recipe.proteins} g <span className='text-neutral-500 font-light'>Protein</span>
                                    </div>
                                </div>
                            </div>
                            
                            

                        </div>
                        <hr />
                        <div className='text-lg font-light text-neutral-500'>
                            <div className="mb-6">
                                <h2 className="text-2xl font-bold mb-2">Malzemeler</h2>
                                <ul className="list-disc list-inside space-y-2">
                                    {recipe.ingredients.map((ingredient) => (
                                        <li key={ingredient._id} className="text-gray-600">
                                            {ingredient.Ingredient_Description}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className="mb-6">
                                <h2 className="text-2xl font-bold mb-2">Yapılış</h2>
                                <ol className="list-decimal list-inside space-y-2">
                                    {recipe.recipe_instructions.map((instruction, index) => (
                                        <li key={index} className="text-gray-600">
                                            {instruction}
                                        </li>
                                    ))}
                                </ol>
                            </div>
                        </div>

                    </div>
                
                {pricing && (
                <div className='bg-white rounded-xl border-[1px] border-neutral-200 overflow-hidden md:w-[400px]'>
                
                    <div className='flex flex-row items-center gap-1 p-4'>
                        
                        <div className='text-2xl text-green-600 font-semibold'>
                            {pricing.totalCost.toFixed(2)} ₺
                        </div>
                        <div className="font-light text-neutral-600">
                            (bu tarif için gerekli harcama)
                        </div>

                    </div>
                    <hr />
                    <div className='flex flex-row items-center gap-1 p-4'>
                        
                        <div className='text-2xl text-yellow-600 font-semibold'>
                            {pricing.needToSpendMoney.toFixed(2)} ₺
                        </div>
                        <div className="font-light text-neutral-600">
                            (malzemeler için gerekli harcama)
                        </div>

                    </div>
                    <hr />
                    <div className='flex flex-row items-center gap-1 p-4'>
                    <FaStore className="mr-1 text-pink-700" size={24} />
                        <div className='text-xl font-bold text-pink-600'>
                            Tarif İçin İhtiyaçlarınız
                        </div>

                    </div>
                    <hr />
                    <div>
      {pricing.cheapestProducts.slice(0, 1).map((product, index) => (
        <div className="relative w-full max-w-md mx-auto bg-white rounded-2xl shadow-sm p-8 mb-6" key={index}>
          <div className="flex flex-col items-center gap-6">
            <div className="relative w-32 h-48">
              <img
                src={product.cheapestProduct?.image || 'placeholder.jpg'}
                alt={product.cheapestProduct?.name || 'Market fotoğrafı'}
                className="object-contain w-full h-full"
              />
            </div>

            <div className="text-center">
              <h2 className="text-xl font-medium text-gray-900 mb-4">{product.ingredientName}</h2>
              {product.cheapestProduct ? (
                <>
                  <div className="mt-2 mb-2 p-2 flex justify-center items-center gap-2">
                    <div className="text-sm text-gray-600 flex items-center">
                      <FaUtensils className="mr-1 text-gray-500" size={18} /> {product.cheapestProduct.name}
                    </div>
                    <div className="text-sm text-gray-600 flex items-center">
                      <FaWeight className="mr-1 text-gray-500" size={18} /> {product.cheapestProduct.required_weight} gram
                    </div>
                  </div>
                  <div className="mt-2 mb-2 p-2 flex justify-between items-center gap-2">
                    <div className="text-sm text-gray-600 flex items-center">
                      <FaStore className="mr-1 text-gray-500" size={18} /> {product.cheapestProduct.brand || 'Bilinmiyor'}
                    </div>
                    <div className="text-sm text-gray-600 flex items-center">
                      <FaStoreAlt className="mr-1 text-gray-500" size={18} /> {product.cheapestProduct.market}
                    </div>
                    <div className="text-sm text-yellow-600 flex items-center font-semibold">
                      <FaMoneyBill className="mr-1 text-yellow-600" size={18} /> {product.cheapestProduct.priceString}
                    </div>
                  </div>
                  <div className="mt-2 mb-2 p-2 flex justify-center items-center gap-2">
                    <div className="text-sm text-green-600 flex items-center font-bold">
                      <FaReceipt className="mr-1 text-green-500" size={18} />Tarif için harcanan miktar: {product.cheapestProduct.ingredientTotalPrice} ₺
                    </div>
                  </div>
                  <a 
                    href={product.cheapestProduct.url} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="bg-pink-400 text-white px-6 py-2 rounded-md hover:bg-pink-600 transition-colors">
                    Ürünü Görüntüle
                  </a>
                </>
              ) : (
                <p className="text-gray-500">Ürün bilgisi mevcut değil</p>
              )}
            </div>
          </div>
        </div>
      ))}

      {pricing.cheapestProducts.length > 2 && !showMore && (
        <button 
          onClick={handleShowMore} 
          className="flex  mx-auto mt-6 bg-blue-500 text-white px-16 py-2 rounded-md hover:bg-blue-600 transition-colors">
          <FaChevronCircleDown className="mr-1 " size={18} /> Tüm Ürünleri Listele
        </button>
      )}

      {showMore && (
        <>
          {pricing.cheapestProducts.slice(1).map((product, index) => (
            <div className="relative w-full max-w-md mx-auto bg-white rounded-2xl shadow-sm p-8 mb-6" key={index}>
              <div className="flex flex-col items-center gap-6">
                <div className="relative w-32 h-48">
                  <img
                    src={product.cheapestProduct?.image || 'placeholder.jpg'}
                    alt={product.cheapestProduct?.name || 'Market fotoğrafı'}
                    className="object-contain w-full h-full"
                  />
                </div>

                <div className="text-center">
                  <h2 className="text-xl font-medium text-gray-900 mb-4">{product.ingredientName}</h2>
                  {product.cheapestProduct ? (
                    <>
                      <div className="mt-2 mb-2 p-2 flex justify-center items-center gap-2">
                        <div className="text-sm text-gray-600 flex items-center">
                          <FaUtensils className="mr-1 text-gray-500" size={18} /> {product.cheapestProduct.name}
                        </div>
                        <div className="text-sm text-gray-600 flex items-center">
                          <FaWeight className="mr-1 text-gray-500" size={18} /> {product.cheapestProduct.required_weight} gram
                        </div>
                      </div>
                      <div className="mt-2 mb-2 p-2 flex justify-between items-center gap-2">
                        <div className="text-sm text-gray-600 flex items-center">
                          <FaStore className="mr-1 text-gray-500" size={18} /> {product.cheapestProduct.brand || 'Bilinmiyor'}
                        </div>
                        <div className="text-sm text-gray-600 flex items-center">
                          <FaStoreAlt className="mr-1 text-gray-500" size={18} /> {product.cheapestProduct.market}
                        </div>
                        <div className="text-sm text-yellow-600 flex items-center font-semibold">
                          <FaMoneyBill className="mr-1 text-yellow-600" size={18} /> {product.cheapestProduct.priceString}
                        </div>
                      </div>
                      <div className="mt-2 mb-2 p-2 flex justify-center items-center gap-2">
                        <div className="text-sm text-green-600 flex items-center">
                          <FaReceipt className="mr-1 text-green-500" size={18} />Tarif için harcanan miktar: {product.cheapestProduct.ingredientTotalPrice} ₺
                        </div>
                      </div>
                      <a 
                    href={product.cheapestProduct.url} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="bg-pink-400 text-white px-6 py-2 rounded-md hover:bg-pink-600 transition-colors">
                    Ürünü Görüntüle
                  </a>
                    </>
                  ) : (
                    <p className="text-gray-500">Ürün bilgisi mevcut değil</p>
                  )}
                </div>
              </div>
            </div>
          ))}

          <button 
            onClick={handleShowLess} 
            className="flex  mx-auto mt-6 bg-blue-500 text-white px-16 py-2 rounded-md hover:bg-blue-600 transition-colors">
            <FaChevronCircleUp className="mr-1 " size={18} /> Daha Az Göster
          </button>
        </>
      )}
    </div>

                    
                
                </div>
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
                            {user && comment.user._id === user._id && (
                                <button
                                    onClick={() => handleDeleteComment(comment._id)}
                                    className="ml-auto text-red-500 hover:text-red-700"
                                >
                                    <FaTrash size={18} />
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
        </div>
        </Container>
    );
}
export default RecipePage;
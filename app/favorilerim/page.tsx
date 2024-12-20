"use client";

import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import axios from 'axios';
import RecipeCard from '@/app/components/RecipeCard';
import useLoginModal from '../hooks/useLoginModal';
const MyFavoritesPage = () => {
    const { slug } = useParams();
    const params = useSearchParams();
    const [recipes, setRecipes] = useState([]);
    const loginModal = useLoginModal();
    const [pagination, setPagination] = useState({
        page: 1,
        pageSize: 20,
        totalItems: 0,
        totalPages: 0,
    });

    const fetchRecipes = async (filters: any) => {
        const storedToken = localStorage.getItem('token');
        if (!storedToken) {
            loginModal.onOpen();
            return;
        }
        const apiUrl = `https://api.yemekcuzdani.com/api/v1/recipes/my-favorites`;
        try {
            
            const response = await axios.get(apiUrl, {
                headers: {
                    Authorization: `Bearer ${storedToken}`,
                },
            });
            setRecipes(response.data.data);
            setPagination({
                ...pagination,
                totalItems: response.data.meta.totalItems,
                totalPages: response.data.meta.totalPages,
            });
        } catch (error) {
            console.error('API isteği sırasında hata oluştu:', error);
        }

    };

    useEffect(() => {
        fetchRecipes({});
    }, [slug, pagination.page]);

    const handlePageChange = (newPage: number) => {
        setPagination((prevState) => ({ ...prevState, page: newPage }));
        fetchRecipes({});
    };

    return (
        <div className="p-4">
            {recipes.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {recipes.map((recipe: any, index: number) => (
                        <RecipeCard key={`${recipe.id}-${index}`} recipe={recipe} />
                    ))}
                </div>
            ) : (
                <div>Yükleniyor...</div>
            )}
            {pagination.totalPages > 0 && (
                <div className="flex justify-center mt-4">
                    <button
                        disabled={pagination.page === 1}
                        onClick={() => handlePageChange(pagination.page - 1)}
                        className="mr-2 px-4 py-2 bg-gray-300 rounded"
                    >
                        Önceki
                    </button>
                    <span className="px-4">{pagination.page} / {pagination.totalPages}</span>
                    <button
                        disabled={pagination.page === pagination.totalPages}
                        onClick={() => handlePageChange(pagination.page + 1)}
                        className="ml-2 px-4 py-2 bg-gray-300 rounded"
                    >
                        Sonraki
                    </button>
                </div>
            )}
        </div>
    );
};

export default MyFavoritesPage;

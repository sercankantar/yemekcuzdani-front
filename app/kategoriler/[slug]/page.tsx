"use client";

import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import axios from 'axios';
import RecipeCard from '@/app/components/RecipeCard';
import FilterComponent from '@/app/components/filters/filter'; 
import qs from 'query-string';
const CategoryPage = () => {
  const { slug } = useParams();
  const params = useSearchParams();
  const [recipes, setRecipes] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 20,
    totalItems: 0,
    totalPages: 0,
  });

  const fetchRecipes = async (filters: any) => {
    if (slug) {
      let currentQuery = {};
      if (params) {
        currentQuery = qs.parse(params.toString());
      }
      const queryParams = new URLSearchParams({
        ...filters,
        page: pagination.page,
        pageSize: pagination.pageSize,
        ...currentQuery,
      }).toString();
      const apiUrl = `https://api.yemekcuzdani.com/api/v1/recipes/recipe-list/${slug}?${queryParams}`;
      try {
        const response = await axios.get(apiUrl);
        setRecipes(response.data.data);
        setPagination({
          ...pagination,
          totalItems: response.data.meta.totalItems,
          totalPages: response.data.meta.totalPages,
        });
      } catch (error) {
        console.error('API isteği sırasında hata oluştu:', error);
      }
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
      <FilterComponent onFilter={(filters: any) => {
        setPagination((prevState) => ({ ...prevState, page: 1 })); // Sayfa numarasını 1'e sıfırla
        fetchRecipes(filters);
      }} /> {/* FilterComponent'i burada kullanın */}
      {recipes.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {recipes.map((recipe: any, index: number) => (
            <RecipeCard key={`${recipe.id}-${index}`} recipe={recipe} />
          ))}
        </div>
      ) : (
        <div>Yükleniyor...</div>
      )}

      {/* Pagination kontrolü */}
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

export default CategoryPage;

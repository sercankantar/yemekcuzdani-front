"use client";

import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import axios from 'axios';
import RecipeCard from '@/app/components/RecipeCard';
import FilterSearchComponent from '@/app/components/filters/filterSearch'; 
import qs from 'query-string';
import { BiChevronLeft, BiChevronRight } from 'react-icons/bi';
const SearchPage = () => {
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
    if (params) {
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
      const apiUrl = `https://api.yemekcuzdani.com/api/v1/recipes/search-recipe?${queryParams}`;
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
      <FilterSearchComponent onFilter={(filters: any) => {
        setPagination((prevState) => ({ ...prevState, page: 1 })); // Sayfa numarasını 1'e sıfırla
        fetchRecipes(filters);
      }} /> {/* FilterComponent'i burada kullanın */}
      {recipes.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mt-6">
          {recipes.map((recipe: any, index: number) => (
            <RecipeCard key={`${recipe.id}-${index}`} recipe={recipe} />
          ))}
        </div>
      ) : (
        <div>Yükleniyor...</div>
      )}

      {/* Pagination kontrolü */}
      {pagination.totalPages > 0 && (
        <div className="flex items-center justify-center gap-2 mt-32">
          <button
            disabled={pagination.page === 1}
            onClick={() => handlePageChange(pagination.page - 1)}
            className="mr-2 px-4 py-2 bg-pink-100 rounded"
          >
            <BiChevronLeft className="h-4 w-4" />
          </button>
          <span className="flex items-center justify-center min-w-[2rem] h-9 px-3 border border-primary rounded-md text-gray-500">{pagination.page} / {pagination.totalPages}</span>
          <button
            disabled={pagination.page === pagination.totalPages}
            onClick={() => handlePageChange(pagination.page + 1)}
            className="ml-2 px-4 py-2 bg-pink-100 rounded"
          >
            <BiChevronRight className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
};

export default SearchPage;
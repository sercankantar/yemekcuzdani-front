import { useSearchParams, useRouter } from 'next/navigation';
import React, { useState, useEffect } from 'react';
import { FaBars, FaFilter } from 'react-icons/fa';

const FilterComponent = ({ onFilter }: { onFilter: (filters: any) => void }) => {
  const [filters, setFilters] = useState({
    name: '',
    min_servings: '',
    max_servings: '',
    min_preparation_time: '',
    max_preparation_time: '',
    sort_by: '',
    order: '',
    page: 1,
    limit: 10,
  });
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const params = Object.fromEntries(searchParams.entries());
    setFilters((prevFilters) => ({
      ...prevFilters,
      ...params,
    }));
  }, [searchParams]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const activeFilters = Object.fromEntries(
      Object.entries(filters)
        .filter(([_, value]) => value !== '')
        .map(([key, value]) => [key, value.toString()])
    );
    const url = new URLSearchParams(activeFilters).toString();
    router.push(`?${url}`);
    onFilter(activeFilters);
  };

  return (
    <div className="bg-gray-50 p-2 rounded-lg  pt-3 border-1 mb-12">
      <button
        onClick={() => setIsFilterVisible(!isFilterVisible)}
        className="w-full px-4 py-2 mb-4 bg-gray-500 text-white font-semibold rounded-lg hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-400 md:hidden flex items-center justify-center"
      >
        <FaBars size={20} className='mr-2' /> Filtrele
      </button>
      {(isFilterVisible || window.innerWidth >= 768) && (
        
        <form 
          onSubmit={handleSubmit} 
          className="flex flex-wrap items-center justify-between gap-2 md:gap-4">
            <div className='hidden md:block '>
              <FaBars className='w-8 h-8 text-pink-600' />
            </div>
          <input
            type="text"
            name="name"
            placeholder="Tarif Adı"
            value={filters.name}
            onChange={handleChange}
            className="
          p-2
          w-full
          sm:w-auto
          font-light 
          bg-white 
          border-2
          rounded-md
          outline-none
          transition
          disabled:opacity-70
          disabled:cursor-not-allowed
          border-rose-100
          focus:border-rose-400"
          />
          <input
            type="number"
            name="min_servings"
            placeholder="Min Porsiyon"
            value={filters.min_servings}
            onChange={handleChange}
            className="p-2
            w-full
          sm:w-auto
          font-light 
          bg-white 
          border-2
          rounded-md
          outline-none
          transition
          disabled:opacity-70
          disabled:cursor-not-allowed
          border-rose-100
          focus:border-rose-400"
          />
          <input
            type="number"
            name="max_servings"
            placeholder="Max Porsiyon"
            value={filters.max_servings}
            onChange={handleChange}
            className="p-2
          font-light
          w-full
          sm:w-auto 
          bg-white 
          border-2
          rounded-md
          outline-none
          transition
          disabled:opacity-70
          disabled:cursor-not-allowed
          border-rose-100
          focus:border-rose-400"
          />
          <input
            type="number"
            name="min_preparation_time"
            placeholder="Min Hazırlık Süresi"
            value={filters.min_preparation_time}
            onChange={handleChange}
            className="p-2
          font-light
          w-full
          sm:w-auto 
          bg-white 
          border-2
          rounded-md
          outline-none
          transition
          disabled:opacity-70
          disabled:cursor-not-allowed
          border-rose-100
          focus:border-rose-400"
          />
          <input
            type="number"
            name="max_preparation_time"
            placeholder="Max Hazırlık Süresi"
            value={filters.max_preparation_time}
            onChange={handleChange}
            className="p-2
          font-light
          w-full
          sm:w-auto 
          bg-white 
          border-2
          rounded-md
          outline-none
          transition
          disabled:opacity-70
          disabled:cursor-not-allowed
          border-rose-100
          focus:border-rose-400"
          />
          <select
            name="sort_by"
            value={filters.sort_by}
            onChange={handleChange}
            className="p-2
          font-light
          w-full
          sm:w-auto 
          bg-white 
          border-2
          rounded-md
          outline-none
          transition
          disabled:opacity-70
          disabled:cursor-not-allowed
          border-rose-100
          focus:border-rose-400"
          >
            <option value="">Sıralama Kriteri</option>
            <option value="name">Ad</option>
            <option value="servings">Porsiyon</option>
            <option value="preparation_time">Hazırlık Süresi</option>
          </select>
          <select
            name="order"
            value={filters.order}
            onChange={handleChange}
            className="p-2
          font-light
          w-full
          sm:w-auto 
          bg-white 
          border-2
          rounded-md
          outline-none
          transition
          disabled:opacity-70
          disabled:cursor-not-allowed
          border-rose-100
          focus:border-rose-400"
          >
            <option value="">Sıralama Yönü</option>
            <option value="asc">Artan</option>
            <option value="desc">Azalan</option>
          </select>
          <button
            type="submit"
            className="w-full md:w-auto px-4 py-2 bg-pink-500 text-white font-semibold rounded-lg hover:bg-pink-600 focus:outline-none focus:ring-2 focus:ring-pink-400"
          >
            Filtreyi Uygula
          </button>
        </form>
      )}
    </div>
  );
};

export default FilterComponent;
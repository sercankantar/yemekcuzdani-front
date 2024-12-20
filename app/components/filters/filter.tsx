import { useSearchParams, useRouter } from 'next/navigation';
import React, { useState, useEffect } from 'react';
import { FaFilter } from 'react-icons/fa';

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
    <div className="bg-gray-100 p-2 rounded-lg shadow-md pt-4 border-2">
      <button
        onClick={() => setIsFilterVisible(!isFilterVisible)}
        className="w-full px-4 py-2 mb-4 bg-gray-500 text-white font-semibold rounded-lg hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-400 md:hidden flex items-center justify-center"
      >
        <FaFilter size={20} className='mr-2' /> Filtrele
      </button>
      {(isFilterVisible || window.innerWidth >= 768) && (
        <form 
          onSubmit={handleSubmit} 
          className="flex flex-wrap items-center justify-between gap-2 md:gap-4">
          <input
            type="text"
            name="name"
            placeholder="Tarif Adı"
            value={filters.name}
            onChange={handleChange}
            className="w-full md:w-auto px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400"
          />
          <input
            type="number"
            name="min_servings"
            placeholder="Min Porsiyon"
            value={filters.min_servings}
            onChange={handleChange}
            className="w-full md:w-auto px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400"
          />
          <input
            type="number"
            name="max_servings"
            placeholder="Max Porsiyon"
            value={filters.max_servings}
            onChange={handleChange}
            className="w-full md:w-auto px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400"
          />
          <input
            type="number"
            name="min_preparation_time"
            placeholder="Min Hazırlık Süresi"
            value={filters.min_preparation_time}
            onChange={handleChange}
            className="w-full md:w-auto px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400"
          />
          <input
            type="number"
            name="max_preparation_time"
            placeholder="Max Hazırlık Süresi"
            value={filters.max_preparation_time}
            onChange={handleChange}
            className="w-full md:w-auto px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400"
          />
          <select
            name="sort_by"
            value={filters.sort_by}
            onChange={handleChange}
            className="w-full md:w-auto px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400"
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
            className="w-full md:w-auto px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400"
          >
            <option value="">Sıralama Yönü</option>
            <option value="asc">Artan</option>
            <option value="desc">Azalan</option>
          </select>
          <button
            type="submit"
            className="w-full md:w-auto px-4 py-2 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400"
          >
            Filtreyi Uygula
          </button>
        </form>
      )}
    </div>
  );
};

export default FilterComponent;
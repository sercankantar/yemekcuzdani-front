import { useSearchParams, useRouter } from 'next/navigation';
import React, { useState, useEffect } from 'react';
// ... mevcut kodlar ...
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
   <form onSubmit={handleSubmit} className="mb-4">
     <input type="text" name="name" placeholder="Tarif Adı" value={filters.name} onChange={handleChange} />
     <input type="number" name="min_servings" placeholder="Min Porsiyon" value={filters.min_servings} onChange={handleChange} />
     <input type="number" name="max_servings" placeholder="Max Porsiyon" value={filters.max_servings} onChange={handleChange} />
     <input type="number" name="min_preparation_time" placeholder="Min Hazırlık Süresi" value={filters.min_preparation_time} onChange={handleChange} />
     <input type="number" name="max_preparation_time" placeholder="Max Hazırlık Süresi" value={filters.max_preparation_time} onChange={handleChange} />
     <select name="sort_by" value={filters.sort_by} onChange={handleChange}>
       <option value="">Sıralama Kriteri</option>
       <option value="name">Ad</option>
       <option value="servings">Porsiyon</option>
       <option value="preparation_time">Hazırlık Süresi</option>
     </select>
     <select name="order" value={filters.order} onChange={handleChange}>
       <option value="">Sıralama Yönü</option>
       <option value="asc">Artan</option>
       <option value="desc">Azalan</option>
     </select>
     <button type="submit">Filtrele</button>
   </form>
 );
};
export default FilterComponent;
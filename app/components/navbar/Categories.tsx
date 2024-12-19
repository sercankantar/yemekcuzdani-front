'use client';

import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import axios from 'axios';
import CategoryBox from "../CategoryBox";
import Container from '../Container';

interface Category {
  seo_url: string ;
  Category_Name: string;
  recipeCount: number;
  icon: string;
}

const Categories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const params = useSearchParams();
  const category = params?.get('seo_url');

  useEffect(() => {
    axios.get('https://api.yemekcuzdani.com/api/v1/recipes/category-list')
      .then((response) => {
        console.log(response.data);
        setCategories(response.data);
      })
      .catch((error) => {
        console.error('Error fetching categories:', error);
      });
  }, []);


  return (
    <Container>
      <div
        className="pt-4 flex flex-row items-center justify-between overflow-x-auto"
      >
        {categories.map((item) => (
          <CategoryBox 
            key={item.Category_Name}
            label={item.Category_Name}
            icon={"https://api.yemekcuzdani.com" + item.icon}
            selected={category === item.seo_url} seo_url={item.seo_url}          />
        ))}
      </div>
    </Container>
  );
};

export default Categories;

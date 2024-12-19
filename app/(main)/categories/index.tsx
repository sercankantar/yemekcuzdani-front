import React from 'react';
import Navbar from '../../components/navbar/Navbar';
import CategoryList from '../../components/navbar/Categories';

const CategoryPage = () => {
    return (
        <div>
            <Navbar currentUser={null} />
            <CategoryList />
        </div>
    );
};

export default CategoryPage;

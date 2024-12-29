import { ResolvingMetadata } from 'next';
import CategoryPage  from './CategoryPage';
import { Metadata } from 'next';
import axios from 'axios';
type Props = {
    params: Promise<{ slug: string }>
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
  }

export async function generateMetadata(
    { params, searchParams }: Props,
    parent: ResolvingMetadata
  ) {
    const storedToken = typeof window === 'undefined'
    ? null
    : localStorage.getItem("token");
    const slug = (await params).slug
   
    if(slug){
        try {
            const response = await axios.get('https://api.yemekcuzdani.com/api/v1/recipes/category-list');
            const category = response.data.find((item: any) => item.seo_url === slug);
            return {
                title: 'Yemek Cüzdanı | ' + category.Category_Name,
                description: category.description,
                keywords: category.seo_keywords?.join(',') || "en ucuz yemek, en ucuz "+category.Category_Name,
                openGraph: {
                    title: 'Yemek Cüzdanı | ' + category.Category_Name,
                    description: category.description,
                    url: `https://www.yemekcuzdani.com/tarif/${slug}`,
                    type: 'article',
                    images: [
                        {
                            url: 'https://api.yemekcuzdani.com' + category.icon,
                            width: 800,
                            height: 600,
                            alt: category.Category_Name,
                        },
                    ],
                },
                twitter: {
                    card: 'summary_large_image',
                    title: 'Yemek Cüzdanı | ' + category.Category_Name,
                    description: category.description,
                    image: 'https://api.yemekcuzdani.com' + category.icon,
                },
                canonical: `https://www.yemekcuzdani.com/tarif/${slug}`,
            }
        } catch (error) {
            console.error('Tarif alınırken hata oluştu:', error);
        }
    }
    else{
        return {
            title: 'Yemek Cüzdanı | "test"',
            description: 'test',
            keywords: 'test',
        }
    }
  }

export default function RecipePageWrapper() {
    return <CategoryPage />;
}
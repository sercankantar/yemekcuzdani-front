import { ResolvingMetadata } from 'next';
import  RecipePage  from './RecipePage';
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
            const response = await axios.get(`https://api.yemekcuzdani.com/api/v1/recipes/get-recipe/${slug}`, {
                headers: {
                    Authorization: `Bearer ${storedToken}`,
                },
            });
            const recipe = response.data.Recipe;
            return {
                title: 'Yemek Cüzdanı | ' + recipe.name,
                description: recipe.description,
                keywords: recipe.seo_keywords?.join(',') || "en ucuz yemek, en ucuz "+recipe.name,
                openGraph: {
                    title: 'Yemek Cüzdanı | ' + recipe.name,
                    description: recipe.description,
                    url: `https://www.yemekcuzdani.com/tarif/${slug}`,
                    type: 'article',
                    images: [
                        {
                            url: 'https://api.yemekcuzdani.com' + recipe.images[0],
                            width: 800,
                            height: 600,
                            alt: recipe.name,
                        },
                    ],
                },
                twitter: {
                    card: 'summary_large_image',
                    title: 'Yemek Cüzdanı | ' + recipe.name,
                    description: recipe.description,
                    image: 'https://api.yemekcuzdani.com' + recipe.images[0],
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
    return <RecipePage />;
}
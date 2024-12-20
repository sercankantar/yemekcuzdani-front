export interface SafeUser {
    _id: string;
    email: string;
    name?: string;
    image?: string;
    createdAt: string;
    updatedAt: string;
    favoriteRecipes: string[];
    ratedRecipes: string[];
  }
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import useLoginModal from "./useLoginModal";
import { SafeUser } from "@/app/types";
import { getCurrentUser } from "../actions/getCurrentUser";
interface IUseFavorite {
 listingId: string;
 currentUser?: SafeUser | null;
}
const useFavorite = ({ listingId, currentUser }: IUseFavorite) => {
    const [user,setUser] = useState<SafeUser | null>(null);
    const router = useRouter();
    const storedToken = localStorage.getItem('token');
    useEffect(() => {
        if (storedToken) {
            getCurrentUser(storedToken?.toString()).then(data => setUser(data));
        }
    }, [storedToken]);
    const loginModal = useLoginModal();
    const hasFavorited = useMemo(() => {
        return user?.favoriteRecipes?.includes(listingId);
    }, [user, listingId]);
    const toggleFavorite = useCallback(async () => {
        if (!user) {
            loginModal.onOpen();
            return;
        }
        try {
            if (hasFavorited) {
                await axios.delete(`https://api.yemekcuzdani.com/api/v1/recipes/remove-favorite-recipe/${listingId}`, {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                });
                if(storedToken){
                    getCurrentUser(storedToken?.toString()).then(data => setUser(data));
                }
                toast.success("Favorilerden çıkarıldı!");
            } else {
                await axios.post(
                    `https://api.yemekcuzdani.com/api/v1/recipes/favorite-recipe/${listingId}`,
                    {},
                    {
                        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                    }
                );
                if(storedToken){
                    getCurrentUser(storedToken?.toString()).then(data => setUser(data));
                }
                toast.success("Favorilere eklendi!");
            }
            router.refresh();
        } catch (error) {
            toast.error("Bir hata oluştu.");
            console.error('Favori işlemi hatası:', error);
        }
    }, [user, hasFavorited, listingId, loginModal, router]);
    return { hasFavorited, toggleFavorite };
};
export default useFavorite;
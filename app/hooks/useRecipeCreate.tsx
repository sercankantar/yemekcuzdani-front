import { create } from 'zustand';

interface RecipeCreateModalStore {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

const useRecipeCreateModal = create<RecipeCreateModalStore>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false })
}));

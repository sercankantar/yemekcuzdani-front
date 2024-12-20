'use client';

import { useCallback, useState } from "react";
import { AiOutlineMenu } from "react-icons/ai";
import { useRouter } from "next/navigation";

import useLoginModal from "@/app/hooks/useLoginModal";
import useRegisterModal from "@/app/hooks/useRegisterModal";
import useRentModal from "@/app/hooks/useRentModal";
import { SafeUser } from "@/app/types";
import SettingsModal from "@/app/components/modals/SettingsModal";
import MenuItem from "./MenuItem";
import Avatar from "../Avatar";
import { useAuth } from "@/app/context/AuthContext"; // useAuth'ı import ettik
import useSettingsModal from "@/app/hooks/useSettingsModal";

export const UserMenu: React.FC = () => {
  const { currentUser, setCurrentUser } = useAuth(); // currentUser'ı AuthContext'ten alıyoruz
  const router = useRouter();

  const loginModal = useLoginModal();
  const registerModal = useRegisterModal();
  const rentModal = useRentModal();
  const settingsModal = useSettingsModal();

  const [isOpen, setIsOpen] = useState(false);

  const toggleOpen = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  const onRent = useCallback(() => {
    if (!currentUser) {
      return loginModal.onOpen();
    }
    rentModal.onOpen();
  }, [loginModal, rentModal, currentUser]);

  const handleLogout = () => {
    // Token'ı localStorage'den siliyoruz
    localStorage.removeItem("token");

    // currentUser'ı sıfırlıyoruz (eğer AuthContext'te setCurrentUser varsa)
    setCurrentUser(null);

    // Sayfayı yeniliyoruz
    window.location.reload();
  };

  const menuItems = currentUser
    ? [
        { label: "Tariflerim", action: () => router.push("/tariflerim") },
        { label: "Favorilerim", action: () => router.push("/favorilerim") },
        { label: "Ayarlar", action: () => settingsModal.onOpen() },
        { label: "Yemek Tarifi Ekle", action: rentModal.onOpen },
        { label: "Çıkış Yap", action: handleLogout }, // Çıkış yapma fonksiyonu buraya eklendi
      ]
    : [
        { label: "Giriş Yap", action: loginModal.onOpen },
        { label: "Kayıt Ol", action: registerModal.onOpen },
      ];

  return (
    <div className="relative">
      <div className="flex flex-row items-center gap-3">
        <div
          onClick={onRent}
          className="hidden md:block text-sm font-semibold py-3 px-4 rounded-full hover:bg-neutral-100 transition cursor-pointer"
        >
          Yemek Tarifi Ekle
        </div>
        <div
          onClick={toggleOpen}
          className="p-4 md:py-1 md:px-2 border-[1px] border-neutral-200 flex flex-row items-center gap-3 rounded-full cursor-pointer hover:shadow-md transition"
        >
          <AiOutlineMenu />
          <div className="hidden md:block">
            <Avatar src={currentUser?.image} />
          </div>
        </div>
      </div>
      {isOpen && (
        <div className="absolute rounded-xl shadow-md w-[40vw] md:w-3/4 bg-white overflow-hidden right-0 top-12 text-sm">
          <div className="flex flex-col cursor-pointer">
            {menuItems.map((item, index) => (
              <MenuItem key={index} label={item.label} onClick={item.action} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default UserMenu;

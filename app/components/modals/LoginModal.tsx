'use client';

import { useCallback, useState } from "react";
import { toast } from "react-hot-toast";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import axios from "axios";

import useRegisterModal from "@/app/hooks/useRegisterModal";
import useLoginModal from "@/app/hooks/useLoginModal";
import { useAuthStore } from "@/app/store/auth"; // Zustand store'u import ettik

import Modal from "./Modal";
import Input from "../inputs/Input";
import Heading from "../Heading";
import Button from "../Button";

const LoginModal = () => {
  const router = useRouter();
  const { setToken, setCurrentUser, setRefreshToken } = useAuthStore(); // Zustand store'dan setToken ve setCurrentUser fonksiyonları alındı
  const loginModal = useLoginModal();
  const registerModal = useRegisterModal();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      email: '',
      password: ''
    },
  });

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    setIsLoading(true);

    try {
      const response = await axios.post("https://api.yemekcuzdani.com/api/v1/auth/login", {
        email: data.email,
        password: data.password,
      });

      const { token, user, refreshToken } = response.data;

      // Token ve kullanıcı bilgisini kaydet
      localStorage.setItem("token", token);
      localStorage.setItem("refreshToken", refreshToken);
      setToken(token); // Zustand store'a token kaydet
      setCurrentUser(user); // Kullanıcı bilgisini store'a kaydet
      setRefreshToken(refreshToken); // Refresh token'ı store'a kaydet
      toast.success("Giriş başarılı!");
      loginModal.onClose(); // Modalı kapat
      window.location.reload();
    } catch (error: any) {
      // Hata durumunda kullanıcıya anlamlı mesaj göster
      if (error.response) {
        // Eğer bir response varsa, hata mesajını buradan alabiliriz
        if (error.response.status === 404) {
          toast.error("Hatalı giriş. Lütfen bilgilerinizi kontrol edin.");
        } else {
          toast.error(error.response?.data?.message || "Giriş yaparken bir hata oluştu.");
        }
      } else if (error.request) {
        // Eğer request yapıldıysa ama cevap alınamadıysa
        toast.error("Sunucuya bağlanılamadı. Lütfen internet bağlantınızı kontrol edin.");
      } else {
        // Başka bir hata durumu
        toast.error("Bir hata oluştu. Lütfen tekrar deneyin.");
      }
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const onToggle = useCallback(() => {
    loginModal.onClose();
    registerModal.onOpen();
  }, [loginModal, registerModal]);

  const bodyContent = (
    <div className="flex flex-col gap-4">
      <Heading
        title="Hoşgeldiniz"
        subtitle="Hesabınıza giriş yapın!"
      />
      <Input
        id="email"
        label="Email"
        disabled={isLoading}
        register={register}
        errors={errors}
        required
      />
      <Input
        id="password"
        label="Şifre"
        type="password"
        disabled={isLoading}
        register={register}
        errors={errors}
        required
      />
    </div>
  );

  const footerContent = (
    <div className="flex flex-col gap-4 mt-3">
      <hr />
      <div className="text-neutral-500 text-center mt-4 font-light">
        <p><span className="text-pink-600">Yemekcüzdanı</span>&apos;nda yeni misin?  
          <span 
            onClick={onToggle} 
            className="text-neutral-800 cursor-pointer hover:underline"
          >
             Hesap Oluştur
          </span>
        </p>
      </div>
    </div>
  );

  return (
    <Modal
      disabled={isLoading}
      isOpen={loginModal.isOpen}
      title="Giriş Yap"
      actionLabel="Giriş Yap"
      onClose={loginModal.onClose}
      onSubmit={handleSubmit(onSubmit)}
      body={bodyContent}
      footer={footerContent}
    />
  );
};

export default LoginModal;

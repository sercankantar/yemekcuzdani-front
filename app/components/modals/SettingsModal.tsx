'use client'

import { useEffect, useState } from "react"
import useSettingsModal from '../../hooks/useSettingsModal';
import { FaCog, FaUser, FaComments, FaDatabase, FaUserCircle, FaAppStore, FaShieldAlt, FaTimes } from 'react-icons/fa';
import { getCurrentUser } from "@/app/actions/getCurrentUser";
import { SafeUser } from "@/app/types";
import axios from "axios";
import { toast } from "react-hot-toast";
import { headers } from "next/headers";

export default function SettingsModal() {
  const { isOpen, onOpen, onClose } = useSettingsModal();
  const [activeTab, setActiveTab] = useState('general')
  const [oldPassword, setOldPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [newPasswordConfirm, setNewPasswordConfirm] = useState('')
  const [fullName, setFullName] = useState('')
  const [user, setUser] = useState<SafeUser | null>(null)
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      getCurrentUser(storedToken).then(setUser);
    }
  }, []);
  const menuItems = [
    { id: 'profile', icon: FaUserCircle, label: 'Genel' },
    { id: 'security', icon: FaShieldAlt, label: 'Güvenlik' },
  ]
  const handleFullNameChange = async () => {
    const response = await axios.patch('https://api.yemekcuzdani.com/api/v1/users/me', {
      fullName: fullName
    }, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })
    if (response.status === 200) {
        setUser(response.data)
      toast.success('İsim ve soyisim başarıyla değiştirildi')
    } else {
      toast.error('İsim ve soyisim değiştirme hatası')
    }
  }
  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      await axios.post('https://api.yemekcuzdani.com/api/v1/file-upload/profile-image', {
        file: file
      },
      {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      })
      toast.success('Profil fotoğrafı başarıyla değiştirildi')
    }
  };
  const handlePasswordChange = async () => {
    if (newPassword !== newPasswordConfirm) {
      toast.error('Yeni şifreler eşleşmiyor')
      return
    }
    const response = await axios.post('https://api.yemekcuzdani.com/api/v1/auth/change-password', {
      oldPassword: oldPassword,
      newPassword: newPassword,
    }, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })
    if (response.status === 201) {
      localStorage.setItem('token', response.data.token)
      localStorage.setItem('refreshToken', response.data.refreshToken)
      toast.success('Şifre başarıyla değiştirildi')
    } else {
      toast.error('Şifre değiştirme hatası')
    }
  }
  return (
    <div>
     {isOpen && (
       <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
         <div className="bg-zinc-900 text-white rounded-lg shadow-lg w-full max-w-3xl">
           <div className="flex justify-between items-center p-4 border-b border-zinc-800">
             <h2 className="text-lg font-semibold">Ayarlar</h2>
             <button 
               className="text-white hover:text-gray-400"
               onClick={onClose}
             >
               <FaTimes className="h-6 w-6" />
             </button>
           </div>
           <div className="flex h-[600px]">
             <div className="w-[200px] border-r border-zinc-800">
               {menuItems.map((item) => (
                 <button
                   key={item.id}
                   onClick={() => setActiveTab(item.id)}
                   className={`flex items-center gap-2 w-full p-3 text-sm hover:bg-zinc-800 transition-colors ${activeTab === item.id ? 'bg-zinc-800' : ''}`}
                 >
                   <item.icon className="h-4 w-4" />
                   {item.label}
                 </button>
               ))}
             </div>
             <div className="flex-1 p-6 space-y-6">
               {activeTab === 'profile' && (
                 <div className="space-y-4">
                   <div className="flex flex-col items-center">
                     <div className="relative">
                       <img
                         src={`https://api.yemekcuzdani.com${user?.profileImageId}` || '/default-profile.png'}
                         alt="Profil Fotoğrafı"
                         className="h-24 w-24 rounded-full object-cover"
                       />
                       <input
                         type="file"
                         accept="image/*"
                         className="absolute inset-0 opacity-0 cursor-pointer"
                         onChange={handleImageChange}
                       />
                     </div>
                   </div>
                   <div className="flex flex-col">
                     <span>Email</span>
                     <input type="email" placeholder={user?.email} disabled className="bg-zinc-800 border border-zinc-700 text-white p-2 rounded mt-1" />
                   </div>
                   <div className="flex flex-col">
                     <span>İsim ve Soyisim</span>
                     <input onChange={(e) => setFullName(e.target.value)} type="text" placeholder={user?.fullName} className="bg-zinc-800 border border-zinc-700 text-white p-2 rounded mt-1" />
                   </div>
                   <div className="flex items-center justify-between">
                     <button onClick={handleFullNameChange} className="bg-gray-700 text-white px-3 py-1 rounded hover:bg-gray-600">
                       Değiştir
                     </button>
                   </div>
                 </div>
               )}
               {activeTab === 'security' && (
                 <div className="space-y-4">
                   <div className="flex flex-col">
                     <span>Eski Şifre</span>
                     <input onChange={(e) => setOldPassword(e.target.value)} type="password" placeholder="Eski Şifre" className="bg-zinc-800 border border-zinc-700 text-white p-2 rounded mt-1" />
                   </div>
                   <div className="flex flex-col">
                     <span>Yeni Şifre</span>
                     <input onChange={(e) => setNewPassword(e.target.value)} type="password" placeholder="Yeni Şifre" className="bg-zinc-800 border border-zinc-700 text-white p-2 rounded mt-1" />
                   </div>
                   <div className="flex flex-col">
                     <span>Yeni Şifre Tekrar</span>
                     <input onChange={(e) => setNewPasswordConfirm(e.target.value)} type="password" placeholder="Yeni Şifre Tekrar" className="bg-zinc-800 border border-zinc-700 text-white p-2 rounded mt-1" />
                   </div>
                   <div className="flex items-center justify-between">
                     <button onClick={handlePasswordChange} className="bg-gray-700 text-white px-3 py-1 rounded hover:bg-gray-600">
                       Değiştir
                     </button>
                   </div>
                 </div>
               )}
             </div>
           </div>
         </div>
       </div>
     )}
   </div>
  )
}
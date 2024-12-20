'use client'

import { useState } from "react"
import useSettingsModal from '../../hooks/useSettingsModal';
import { FaCog, FaUser, FaComments, FaDatabase, FaUserCircle, FaAppStore, FaShieldAlt, FaTimes } from 'react-icons/fa';

export default function SettingsModal() {
  const { isOpen, onOpen, onClose } = useSettingsModal();
  const [activeTab, setActiveTab] = useState('general')
  const [user, setUser] = useState(null)
  const menuItems = [
    { id: 'profile', icon: FaUserCircle, label: 'Genel' },
    { id: 'security', icon: FaShieldAlt, label: 'Güvenlik' },
  ]

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
                    <div className="flex items-center justify-between">
                      <span>Email</span>
                      <input type="email" className="bg-zinc-800 border border-zinc-700 text-white p-2 rounded w-[180px]" />
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Profil Fotoğrafı</span>
                      <input type="file" className="bg-zinc-800 border border-zinc-700 text-white p-2 rounded w-[180px]" />
                    </div>
                    <div className="flex items-center justify-between">
                      <span>İsim</span>
                      <input type="text" className="bg-zinc-800 border border-zinc-700 text-white p-2 rounded w-[180px]" />
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Soyisim</span>
                      <input type="text" className="bg-zinc-800 border border-zinc-700 text-white p-2 rounded w-[180px]" />
                    </div>
                  </div>
                )}
                {activeTab === 'security' && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span>Şifre Değiştir</span>
                      <button className="bg-gray-700 text-white px-3 py-1 rounded hover:bg-gray-600">
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
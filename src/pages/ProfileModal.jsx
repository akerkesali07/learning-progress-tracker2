import React from "react";

export default function ProfileModal({ user, onClose, onLogout }) {
  if (!user) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-lg w-96 p-6 relative">
        {/* X батырмасы */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-black text-lg"
        >
          ×
        </button>

        <h2 className="text-xl font-semibold mb-4 text-center">👤 Профиль</h2>

        <div className="space-y-2 text-sm text-gray-700">
          <p><strong>Аты-жөні:</strong> {user.fullName}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Мамандығы:</strong> {user.major}</p>
          <p><strong>Тобы:</strong> {user.groupName}</p>
        </div>

        <div className="mt-6 text-center">
          <button
            onClick={onLogout}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition"
          >
            Аккаунттан шығу
          </button>
        </div>
      </div>
    </div>
  );
}

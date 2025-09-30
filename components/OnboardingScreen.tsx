// components/OnboardingScreen.tsx
"use client";

import React, { useCallback } from 'react';
import { motion } from 'framer-motion';

// Khai báo lại các kiểu dữ liệu cần thiết (hoặc import từ file types nếu có)
interface UserInfo {
    name: string;
    major: string;
    classYear: string;
}

// Khai báo Props cho component này
interface OnboardingProps {
    userInfo: UserInfo;
    handleUserInfoChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    startTest: (e: React.FormEvent) => void;
}

const OnboardingScreenComponent: React.FC<OnboardingProps> = ({ 
    userInfo, 
    handleUserInfoChange, 
    startTest 
}) => {
    return (
        // KHÔNG CÓ ANIMATION TẠI ĐÂY để ngăn flickering
        <div className="flex flex-col items-center justify-center min-h-screen p-6 text-white">
            <motion.div
                initial={{ y: -50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ type: "spring", stiffness: 100 }}
                className="bg-gray-800 p-8 md:p-10 rounded-xl shadow-2xl max-w-md w-full border-t-4 border-green-500"
            >
                <h2 className="text-3xl font-bold text-green-400 mb-6 text-center">Chào mừng đến với Green Test!</h2>
                <p className="text-gray-400 mb-6 text-center">Vui lòng điền thông tin để bắt đầu bài kiểm tra tính cách.</p>

                <form onSubmit={startTest} className="space-y-4">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">Họ và Tên</label>
                        <input
                            id="name"
                            name="name"
                            type="text"
                            value={userInfo.name}
                            onChange={handleUserInfoChange}
                            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-green-500 focus:border-green-500"
                            placeholder="Nguyễn Văn A"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="major" className="block text-sm font-medium text-gray-300 mb-1">Chuyên ngành</label>
                        <input
                            id="major"
                            name="major"
                            type="text"
                            value={userInfo.major}
                            onChange={handleUserInfoChange}
                            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-green-500 focus:border-green-500"
                            placeholder="Kinh tế học"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="classYear" className="block text-sm font-medium text-gray-300 mb-1">Khóa (Ví dụ: K63)</label>
                        <input
                            id="classYear"
                            name="classYear"
                            type="text"
                            value={userInfo.classYear}
                            onChange={handleUserInfoChange}
                            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-green-500 focus:border-green-500"
                            placeholder="K63"
                            required
                        />
                    </div>
                    
                    <motion.button
                        type="submit"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="w-full mt-6 bg-green-600 text-white px-6 py-3 text-lg font-bold rounded-full hover:bg-green-500 transition shadow-lg"
                    >
                        Bắt Đầu Bài Test
                    </motion.button>
                </form>
            </motion.div>
        </div>
    );
};

// Sử dụng React.memo để ngăn ngừa re-render không cần thiết
export const OnboardingScreen = React.memo(OnboardingScreenComponent);
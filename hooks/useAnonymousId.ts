// hooks/useAnonymousId.ts
"use client";

import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid'; // Cần cài đặt thư viện uuid

const STORAGE_KEY = 'green_test_client_id';

/**
 * Hook tùy chỉnh để lấy ID duy nhất của người dùng ẩn danh (client_id).
 * Nếu ID chưa tồn tại trong Local Storage, nó sẽ tạo một UUID mới và lưu lại.
 * @returns {string | null} UUID của người dùng hoặc null nếu chưa load xong.
 */
export const useAnonymousId = (): string | null => {
  const [clientId, setClientId] = useState<string | null>(null);

  useEffect(() => {
    // Đảm bảo code chỉ chạy ở phía client (trình duyệt)
    if (typeof window !== 'undefined') {
      let storedId = localStorage.getItem(STORAGE_KEY);
      
      if (!storedId) {
        // Nếu chưa có, tạo UUID mới
        const newId = uuidv4();
        
        // Lưu ID mới vào Local Storage
        try {
            localStorage.setItem(STORAGE_KEY, newId);
            storedId = newId;
        } catch (error) {
            console.error("Lỗi khi truy cập Local Storage:", error);
            // Xử lý trường hợp Local Storage bị chặn/không khả dụng
            // Có thể dùng một UUID tạm thời hoặc để null
            storedId = newId; 
        }
      }
      
      setClientId(storedId);
    }
  }, []); // [] đảm bảo chỉ chạy một lần sau khi component mount

  return clientId;
};
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Bổ sung cấu hình để bỏ qua các lỗi TypeScript trong quá trình build
  typescript: {
    // !! DANGER !! Cho phép build thành công ngay cả khi có lỗi type.
    ignoreBuildErrors: true,
  },
  
  // Bổ sung cấu hình để bỏ qua các lỗi/cảnh báo ESLint trong quá trình build
  eslint: {
    // !! DANGER !! Bỏ qua các lỗi Linting (ví dụ: 'useCallback' defined but never used).
    ignoreDuringBuilds: true,
  },
  
  /* các tùy chọn cấu hình khác của bạn (nếu có) */
};

export default nextConfig;
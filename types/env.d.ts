// types/env.d.ts (hoặc types/global.d.ts)
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      EXPO_PUBLIC_URL_API?: string; // Dùng ? nếu biến có thể không tồn tại trong mọi môi trường (ví dụ: production build)
      EXPO_PUBLIC_URL_TOKEN?: string;
      // Thêm bất kỳ biến EXPO_PUBLIC_ nào khác mà bạn có vào đây
    }
  }
}
export {}; // Quan trọng để biến file này thành một module và tránh xung đột global
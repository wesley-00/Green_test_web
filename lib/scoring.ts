import { questions } from "../data/questions";

// Định nghĩa kiểu dữ liệu cho Group Code
type GroupCode = 'A' | 'B' | 'C' | 'D';

// Định nghĩa kiểu dữ liệu cho Questions (Giả định questions.ts có cấu trúc này)
// Việc này giúp TypeScript hiểu q.group là một key hợp lệ, loại bỏ nhu cầu dùng @ts-ignore
interface Question {
  id: string;
  group: GroupCode; 
  // Thêm các trường khác nếu cần
}

// Cần đồng bộ với định nghĩa trong HomePage.tsx và API route
export type Result = {
  scores: { [key: string]: number };
  mainGroup: string;
  subGroup: string;
};

// --- HẰNG SỐ CẦN ĐẢM BẢO TỒN TẠI NGOÀI HÀM ---

// Ánh xạ mã nhóm với tên hiển thị đầy đủ
const GROUP_NAMES: Record<GroupCode, string> = {
    A: "Nhóm Hạt Giống (Sáng tạo & Khởi xướng)",
    B: "Nhóm Cây Non (Hành động & Tổ chức)",
    C: "Nhóm Rễ Cây (Quản lý & Hậu cần)",
    D: "Nhóm Tán Lá (Truyền thông & Tầm nhìn)",
};

// Ánh xạ Subgroup code với tên hiển thị đầy đủ (KHÔNG BỊ LỖI 'is not defined' nữa)
const SUBGROUP_NAMES: { [key: string]: string } = {
    "Green Artist": "Nghệ sĩ Xanh",
    "Green Originator": "Người Khởi tạo Xanh",
    "Green Strategist": "Chiến lược gia Xanh",
    "Green Organizer": "Nhà Tổ chức Xanh",
    "Green Commander": "Chỉ huy Xanh",
    "Green Host": "Người tiếp đón Xanh",
    "Green Visionary": "Người có Tầm nhìn Xanh",
    "Green Storyteller": "Người kể chuyện Xanh",
};

// Hàm tính toán kết quả chính
export function calculateResult(answers: { [key: string]: number }): Result {
  // Định kiểu rõ ràng cho Object
  const rawScores: Record<GroupCode, number> = { A: 0, B: 0, C: 0, D: 0 };
  const questionCounts: Record<GroupCode, number> = { A: 0, B: 0, C: 0, D: 0 };

  // 1. TÍNH TỔNG ĐIỂM THÔ VÀ ĐẾM SỐ CÂU TRẢ LỜI CỦA MỖI NHÓM
  
  // Ép kiểu questions sang Question[] để TypeScript biết q.group là GroupCode
  (questions as Question[]).forEach((q) => {
    if (answers[q.id]) {
      const groupCode = q.group; // groupCode là 'A' | 'B' | 'C' | 'D'
      
      // Không cần @ts-ignore vì đã định kiểu GroupCode
      rawScores[groupCode] += answers[q.id];
      questionCounts[groupCode] += 1;
    }
  });

  // 2. TÍNH ĐIỂM PHẦN TRĂM VÀ TÌM MAIN GROUP
  const scores: { [key: string]: number } = {};
  let maxScore = -1;
  let mainGroupCode: GroupCode | "" = ""; 

  // Dùng Object.keys để duyệt qua các nhóm đã định nghĩa
  (Object.keys(rawScores) as Array<GroupCode>).forEach((code) => {
    const rawScore = rawScores[code];
    const maxPossibleScore = questionCounts[code] * 5; 
    
    const percentage = maxPossibleScore > 0 
        ? Math.round((rawScore / maxPossibleScore) * 100) 
        : 0;
        
    scores[GROUP_NAMES[code]] = percentage;

    if (rawScore > maxScore) {
      maxScore = rawScore;
      mainGroupCode = code;
    }
  });

  // Xử lý trường hợp không có câu trả lời nào (mainGroupCode="")
  if (!mainGroupCode) {
      mainGroupCode = 'A'; 
  }
  
  // 3. TÍNH SUBGROUP (Giữ nguyên logic của bạn)
  let subGroupCode = "";
  
  switch (mainGroupCode) {
    case "A":
      subGroupCode = (answers["C3.1"] ?? 0) + (answers["C4.4"] ?? 0) >
                     (answers["C1.3"] ?? 0) + (answers["C4.2"] ?? 0)
                     ? "Green Artist" : "Green Originator";
      break;
    case "B":
      subGroupCode = (answers["C2.1"] ?? 0) + (answers["C2.5"] ?? 0) + (answers["C3.3"] ?? 0) >
                     (answers["C3.2"] ?? 0) + (answers["C4.3"] ?? 0)
                     ? "Green Strategist" : "Green Organizer";
      break;
    case "C":
      subGroupCode = (answers["C4.3"] ?? 0) + (answers["C4.5"] ?? 0) >
                     (answers["C4.1"] ?? 0) + (answers["C4.2"] ?? 0)
                     ? "Green Commander" : "Green Host";
      break;
    case "D":
      subGroupCode = (answers["C1.1"] ?? 0) + (answers["C2.2"] ?? 0) >
                     (answers["C3.4"] ?? 0) + (answers["C4.4"] ?? 0)
                     ? "Green Visionary" : "Green Storyteller";
      break;
  }

  // 4. TRẢ VỀ KẾT QUẢ VỚI TÊN ĐẦY ĐỦ
  return { 
      scores, 
      mainGroup: GROUP_NAMES[mainGroupCode], 
      subGroup: SUBGROUP_NAMES[subGroupCode] 
  };
}
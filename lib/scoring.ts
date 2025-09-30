import { questions } from "../data/questions";

// Cần đồng bộ với định nghĩa trong HomePage.tsx
export type Result = {
  scores: { [key: string]: number }; // Đổi tên từ groupScores thành scores để khớp với DB
  mainGroup: string;
  subGroup: string;
};

// Ánh xạ mã nhóm với tên hiển thị đầy đủ
const GROUP_NAMES: { [key: string]: string } = {
    A: "Nhóm Hạt Giống (Sáng tạo & Khởi xướng)",
    B: "Nhóm Cây Non (Hành động & Tổ chức)",
    C: "Nhóm Rễ Cây (Quản lý & Hậu cần)",
    D: "Nhóm Tán Lá (Truyền thông & Tầm nhìn)",
};

// Ánh xạ Subgroup code với tên hiển thị đầy đủ
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
  const rawScores: { [key: string]: number } = { A: 0, B: 0, C: 0, D: 0 };
  const questionCounts: { [key: string]: number } = { A: 0, B: 0, C: 0, D: 0 };

  // 1. TÍNH TỔNG ĐIỂM THÔ VÀ ĐẾM SỐ CÂU TRẢ LỜI CỦA MỖI NHÓM
  questions.forEach((q) => {
    if (answers[q.id]) {
      // @ts-ignore: q.group chắc chắn là 'A'|'B'|'C'|'D'
      rawScores[q.group] += answers[q.id];
      // @ts-ignore
      questionCounts[q.group] += 1;
    }
  });

  // 2. TÍNH ĐIỂM PHẦN TRĂM VÀ TÌM MAIN GROUP
  const scores: { [key: string]: number } = {};
  let maxScore = -1;
  let mainGroupCode = "";

  Object.entries(rawScores).forEach(([code, rawScore]) => {
    const maxPossibleScore = questionCounts[code] * 5; // Tối đa 5 điểm/câu
    
    // Tính phần trăm: (Điểm thô / Điểm tối đa) * 100
    const percentage = maxPossibleScore > 0 
        ? Math.round((rawScore / maxPossibleScore) * 100) 
        : 0;
        
    // Lưu điểm dưới tên nhóm hiển thị
    scores[GROUP_NAMES[code]] = percentage;

    // Tìm nhóm chính (sử dụng điểm thô để tránh sai lệch làm tròn)
    if (rawScore > maxScore) {
      maxScore = rawScore;
      mainGroupCode = code;
    }
  });

  // 3. TÍNH SUBGROUP (Dựa trên logic của bạn)
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
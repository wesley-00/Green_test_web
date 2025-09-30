// data/questions.ts
export type Question = {
  id: string;
  text: string;
  group: "A" | "B" | "C" | "D";
};

export const questions: Question[] = [
  // Nhận thức & Giá trị (A)
  { id: "C1.1", text: "Tôi luôn cảm thấy một phần trách nhiệm cá nhân trong việc bảo vệ Trái Đất.", group: "A" },
  { id: "C1.2", text: "Tôi thường xuyên theo dõi tin tức về biến đổi khí hậu và các vấn đề môi trường.", group: "A" },
  { id: "C1.3", text: "Tôi tin rằng những hành động nhỏ bé của mỗi người có thể cộng hưởng thành thay đổi lớn.", group: "A" },
  { id: "C1.4", text: "Tôi khó chịu khi chứng kiến ai đó xả rác hoặc phung phí tài nguyên.", group: "A" },
  { id: "C1.5", text: "Khi lựa chọn sản phẩm hay dịch vụ, tôi quan tâm đến tác động của nó đối với môi trường.", group: "A" },

  // Quyết định & Sở thích (B)
  { id: "C2.1", text: "Tôi ưu tiên chọn sản phẩm thân thiện với môi trường, ngay cả khi giá cao hơn.", group: "B" },
  { id: "C2.2", text: "Tôi cân nhắc lượng phát thải carbon khi di chuyển hay đi du lịch.", group: "B" },
  { id: "C2.3", text: "Tôi chủ động giảm nhựa dùng một lần bằng cách mang túi, ly hoặc bình cá nhân.", group: "B" },
  { id: "C2.4", text: "Tôi thường suy nghĩ kỹ trước khi mua sắm để tránh lãng phí.", group: "B" },
  { id: "C2.5", text: "Tôi sẵn sàng thay đổi thói quen hằng ngày nếu điều đó giúp ích cho môi trường.", group: "B" },

  // Hành động thực tế (C)
  { id: "C3.1", text: "Tôi thường tham gia các hoạt động như dọn rác, trồng cây hoặc chiến dịch xanh.", group: "C" },
  { id: "C3.2", text: "Tôi phân loại rác đúng cách: hữu cơ, tái chế, hay rác nguy hại.", group: "C" },
  { id: "C3.3", text: "Tôi cố gắng tiết kiệm điện và nước bất cứ khi nào có thể.", group: "C" },
  { id: "C3.4", text: "Tôi chia sẻ kiến thức môi trường với bạn bè và người thân.", group: "C" },
  { id: "C3.5", text: "Tôi sẵn sàng tình nguyện hoặc đóng góp cho các tổ chức bảo vệ môi trường.", group: "C" },

  // Ảnh hưởng xã hội & Lãnh đạo (D)
  { id: "C4.1", text: "Tôi thường khuyến khích người khác cùng hành động vì môi trường.", group: "D" },
  { id: "C4.2", text: "Tôi thấy hứng khởi hơn khi tham gia vào các hoạt động xanh theo nhóm.", group: "D" },
  { id: "C4.3", text: "Tôi thích lập kế hoạch hoặc tổ chức sự kiện gắn với bảo vệ môi trường.", group: "D" },
  { id: "C4.4", text: "Tôi hay chia sẻ hành trình hoặc thành tựu xanh của bản thân lên mạng xã hội.", group: "D" },
  { id: "C4.5", text: "Tôi coi trọng việc tạo ảnh hưởng đến cộng đồng nhiều hơn là hành động đơn lẻ.", group: "D" },
];

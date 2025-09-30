import { NextResponse, NextRequest } from "next/server";
import { supabase } from "@/lib/supabaseClient";

// Định nghĩa Interface (kiểu dữ liệu) cho dữ liệu nhận được từ request body
// Thay thế các kiểu dữ liệu này bằng kiểu thực tế của bạn (ví dụ: number[] hoặc object)
interface TestResultData {
  name: string;
  user_major: string; // Thêm các trường bạn thực sự dùng
  user_class_year: string;
  main_group: string;
  sub_group: string;
  scores_json: Record<string, number>; // Ví dụ: { groupA: 10, groupB: 5 }
  answers: string; // Hoặc kiểu dữ liệu mà bạn lưu trữ câu trả lời
}

// Next.js tự động truyền vào NextRequest, chúng ta nên định kiểu cho nó
export async function POST(req: NextRequest) {
  let body: TestResultData;
  try {
    // Ép kiểu (cast) dữ liệu JSON nhận được vào Interface đã định nghĩa
    body = (await req.json()) as TestResultData;

    const { 
        name, 
        user_major, 
        user_class_year, 
        main_group, 
        sub_group, 
        scores_json, 
        answers 
    } = body;
    
    // Đảm bảo tất cả các trường cần thiết đều có mặt
    if (!name || !main_group || !answers) {
        return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Chỉnh sửa câu lệnh INSERT cho phù hợp với schema Supabase của bạn (public.results)
    const { error } = await supabase.from("results").insert([
      { 
        user_name: name,
        user_major: user_major,
        user_class_year: user_class_year,
        main_group: main_group,
        sub_group: sub_group,
        scores_json: scores_json,
        answers: answers
      }
    ]);

    if (error) {
      // In lỗi ra console Vercel để dễ debug hơn
      console.error("Supabase Error:", error);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ message: "Lưu kết quả thành công ✅" });
  } catch (err) {
    // Sửa lỗi: Loại bỏ kiểu 'any' khỏi khối catch.
    // TypeScript/ESLint sẽ chấp nhận kiểu 'unknown' (là kiểu mặc định trong ES2017+).
    console.error("Request Parsing Error:", err);
    
    let errorMessage = "An unknown error occurred.";
    if (err instanceof Error) {
        errorMessage = err.message;
    }
    
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
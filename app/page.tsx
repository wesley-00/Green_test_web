// page.tsx (hoặc app/page.tsx)
"use client";

import { useState, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
// Đảm bảo các đường dẫn này chính xác
import { questions } from "../data/questions";
import { calculateResult } from "../lib/scoring";
import { supabase } from "../lib/supabaseClient"; 
import { useAnonymousId } from "../hooks/useAnonymousId"; 
// IMPORT COMPONENT ĐÃ TÁCH
import { OnboardingScreen } from "../components/OnboardingScreen"; 

// --- INTERFACES (KHAI BÁO KIỂU DỮ LIỆU) ---

interface Result {
  scores: { [groupName: string]: number };
  mainGroup: string;
  subGroup: string;
}

interface UserInfo {
    name: string;
    major: string;
    classYear: string;
}

// --- COMPONENT CHÍNH ---

export default function HomePage() {
  const clientId = useAnonymousId();
  
  const [answers, setAnswers] = useState<{[key: string]: number}>({});
  const [clicked, setClicked] = useState<string | null>(null);
  const [result, setResult] = useState<Result | null>(null);
  
  // STATE cho Onboarding
  const [isStarted, setIsStarted] = useState(false);
  const [userInfo, setUserInfo] = useState<UserInfo>({
      name: '',
      major: '',
      classYear: '',
  });
  
  // --- HÀM XỬ LÝ ---

  // Dùng useCallback để hàm không bị định nghĩa lại, giúp React.memo hoạt động hiệu quả
  const handleUserInfoChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
      // Dùng functional update để cập nhật state dựa trên state trước đó
      setUserInfo(prev => ({
          ...prev,
          [e.target.name]: e.target.value,
      }));
  }, []); 

  const startTest = useCallback((e: React.FormEvent) => {
      e.preventDefault();
      if (userInfo.name && userInfo.major && userInfo.classYear) {
          setIsStarted(true);
      } else {
          alert("Vui lòng nhập đầy đủ thông tin để bắt đầu.");
      }
  }, [userInfo]);
  
  const handleSelect = useCallback((id: string, value: number) => {
    setAnswers(prev => ({ ...prev, [id]: value }));
    setClicked(`${id}-${value}`);
    setTimeout(() => setClicked(null), 200);
  }, []);
  
  const handleReset = useCallback(() => {
    setAnswers({});
    setResult(null);
    setIsStarted(false); 
    setUserInfo({ name: '', major: '', classYear: '' });
  }, []);

  // --- TÍNH TOÁN ---
  const answeredCount = useMemo(() => Object.keys(answers).length, [answers]);
  const totalCount = questions.length;
  const progress = useMemo(() => Math.round((answeredCount / totalCount) * 100), [answeredCount, totalCount]);
  const isCompleted = answeredCount === totalCount;
  
  const handleSubmit = useCallback(async () => {
    if (!isCompleted || !clientId) return;

    const calculatedResult = calculateResult(answers) as Result;
    
    // Dữ liệu gửi lên Supabase
    const dataToInsert = {
        client_id: clientId,
        main_group: calculatedResult.mainGroup,
        sub_group: calculatedResult.subGroup,
        scores_json: calculatedResult.scores,
        // Thông tin người dùng
        user_name: userInfo.name,
        user_major: userInfo.major,
        user_class_year: userInfo.classYear,
        answers: answers
    };
    
    const { error } = await supabase
      .from('results') 
      .insert([dataToInsert]);
      
    if (error) {
      console.error("Error inserting data:", error);
      alert("Lỗi khi lưu kết quả. Vui lòng thử lại.");
      return;
    }

    setResult(calculatedResult);
  }, [isCompleted, clientId, answers, userInfo]);
  
  // --- THÔNG SỐ VÀ COMPONENT CON ---
  
  const optionColors: {[key: number]: string} = {
    1: "bg-red-700 border-red-700 text-white",
    2: "bg-red-500 border-red-500 text-white",
    3: "bg-gray-400 border-gray-400 text-black",
    4: "bg-green-500 border-green-500 text-white",
    5: "bg-green-700 border-green-700 text-white",
  };
  
  // Component Kết quả (ResultCard) giữ nguyên
  const ResultCard = () => (
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="bg-gray-800 p-8 rounded-2xl shadow-2xl max-w-lg w-full border-t-4 border-green-500"
          initial={{ y: 50, scale: 0.8 }}
          animate={{ y: 0, scale: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: "spring", stiffness: 100, damping: 20 }}
        >
          <h2 className="text-3xl font-bold text-green-400 mb-4 text-center">🎉 Kết Quả Của Bạn!</h2>
          
          <div className="bg-gray-900 p-4 rounded-xl mb-6 shadow-inner border border-gray-700">
            <p className="text-xl font-semibold text-white">
              Nhóm chính: <span className="text-green-400 font-extrabold">{result?.mainGroup}</span>
            </p>
            <p className="text-lg text-gray-300 mt-1">
              Phân loại: <span className="text-green-200 font-medium">{result?.subGroup}</span>
            </p>
          </div>

          <h3 className="text-xl font-semibold text-white mb-3 border-b border-gray-700 pb-1">Điểm Chi Tiết</h3>
          <div className="space-y-3">
            {result?.scores && Object.entries(result.scores).map(([group, score]) => (
              <div key={group}>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-gray-300 font-medium">{group}</span>
                  <span className="text-lg font-bold text-green-300">{score}%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <motion.div
                    className="bg-green-500 h-2 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${score}%` }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                  ></motion.div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-center gap-4 mt-8">
            <button
              onClick={() => setResult(null)}
              className="px-6 py-2 bg-gray-600 text-white rounded-full hover:bg-gray-500 transition font-medium"
            >
              Đóng
            </button>
            <motion.button
              onClick={handleReset}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-2 bg-green-600 text-white rounded-full hover:bg-green-500 transition font-bold shadow-lg"
            >
              Làm lại Bài Test
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
  );

  // --- RENDER CHÍNH ---
  return (
    <div className="relative min-h-screen overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-950 via-gray-900 to-black opacity-90 -z-10"></div>
        
        <AnimatePresence>
          {result && <ResultCard />}
        </AnimatePresence>

        {/* Logic hiển thị: Nếu chưa bắt đầu -> Onboarding, Ngược lại -> Bài Test */}
        {!isStarted ? (
            // SỬ DỤNG COMPONENT ĐÃ TÁCH VÀ TRUYỀN PROPS
            <OnboardingScreen 
                userInfo={userInfo}
                handleUserInfoChange={handleUserInfoChange}
                startTest={startTest}
            />
        ) : (
            <main className="relative z-0 min-h-screen p-6 max-w-4xl mx-auto" style={{ filter: result ? 'blur(3px)' : 'none', transition: 'filter 0.3s ease-out' }}>
                
                <h1 className="text-4xl font-extrabold text-green-400 mb-6 text-center tracking-tight">
                    🌱 Green Personality Test
                </h1>

                {/* Progress Bar */}
                <div className="max-w-xl mx-auto mb-8">
                  <div className="w-full bg-gray-800 rounded-full h-4 mb-2 shadow-inner">
                    <motion.div
                      className="bg-green-500 h-4 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 0.5, ease: "easeOut" }}
                    ></motion.div>
                  </div>
                  <p className="text-sm text-gray-400 text-center">
                    Đã trả lời <span className="font-semibold text-green-400">{answeredCount}</span>/
                    <span className="font-semibold">{totalCount}</span> câu hỏi (
                    <span className="font-bold text-green-300">{progress}%</span>)
                  </p>
                </div>

                {/* Danh sách câu hỏi */}
                <div className="space-y-4">
                  {questions.map((q, index) => (
                    <motion.div
                      key={q.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.05 }}
                      className="bg-gray-800/80 backdrop-blur-sm p-5 rounded-xl shadow-2xl border border-gray-700 hover:border-green-600 transition duration-300"
                    >
                      <p className="font-semibold text-lg mb-4 text-white">
                        <span className="text-green-400 mr-2">{index + 1}.</span> {q.text}
                      </p>
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mt-3">
                        <span className="text-xs sm:text-sm text-red-400 font-medium mb-2 sm:mb-0">Hoàn toàn không đồng ý</span>
                        <div className="flex gap-3 my-2">
                          {[1, 2, 3, 4, 5].map((v) => (
                            <motion.button
                              key={v}
                              onClick={() => handleSelect(q.id, v)}
                              whileHover={{ scale: 1.15 }}
                              whileTap={{ scale: 0.85 }}
                              className={`w-10 h-10 rounded-full border-2 font-bold text-sm transition duration-300 shadow-lg ${
                                answers[q.id] === v
                                  ? optionColors[v] + " ring-4 ring-offset-2 ring-offset-gray-800 ring-green-400/50"
                                  : "border-gray-500 text-gray-300 bg-gray-700/50 hover:bg-gray-600/70"
                              } ${clicked === `${q.id}-${v}` ? "scale-90" : ""}`}
                            >
                              {v}
                            </motion.button>
                          ))}
                        </div>
                        <span className="text-xs sm:text-sm text-green-400 font-medium mt-2 sm:mt-0">Hoàn toàn đồng ý</span>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Nút Submit */}
                <div className="text-center mt-10 mb-10">
                  <motion.button
                    onClick={handleSubmit}
                    disabled={!isCompleted}
                    whileHover={{ scale: isCompleted ? 1.05 : 1 }}
                    whileTap={{ scale: isCompleted ? 0.95 : 1 }}
                    className={`px-10 py-3 text-lg font-bold rounded-full transition duration-300 shadow-xl ${
                      isCompleted
                        ? "bg-green-600 text-white hover:bg-green-500 ring-4 ring-offset-2 ring-offset-gray-900 ring-green-600/50"
                        : "bg-gray-600 text-gray-400 cursor-not-allowed"
                    }`}
                  >
                    {isCompleted ? "🌱 Xem Kết Quả Ngay" : `Hoàn thành ${totalCount - answeredCount} câu nữa`}
                  </motion.button>
                </div>
                
            </main>
        )}
    </div>
  );
}
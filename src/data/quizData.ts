export interface QuizOption {
  id: 'A' | 'B' | 'C' | 'D';
  text: string;
}

export interface QuizQuestion {
  id: number;
  question: string;
  microCopy: string;
  options: QuizOption[];
}

// Door voice messages for each stage
export const doorVoiceMessages: Record<string, string> = {
  landing: "Ta đã đợi rất lâu để gặp bạn...",
  q1: "Bên kia cánh cửa có điều gì đó đang chờ bạn.",
  q2: "Mỗi bước đi đều có ý nghĩa riêng.",
  q3: "Bạn đang đến gần hơn rồi.",
  q4: "Ánh sáng đang dần hé mở.",
  q5: "Chuẩn bị. Ánh sáng sắp bùng nổ.",
};

export const quizQuestions: QuizQuestion[] = [
  {
    id: 1,
    question: "Điều gì thôi thúc bạn bước qua cánh cửa mới?",
    microCopy: "Mỗi lựa chọn mở ra một con đường...",
    options: [
      { id: 'A', text: "Sự tò mò về điều chưa biết" },
      { id: 'B', text: "Khát khao được tự do" },
      { id: 'C', text: "Mục tiêu rõ ràng phía trước" },
      { id: 'D', text: "Linh cảm từ sâu thẳm bên trong" },
    ],
  },
  {
    id: 2,
    question: "Buổi sáng lý tưởng của bạn có mùi gì?",
    microCopy: "Hương thơm đầu tiên định hình cả ngày...",
    options: [
      { id: 'A', text: "Cà phê và gỗ ấm" },
      { id: 'B', text: "Hoa tươi và gió biển" },
      { id: 'C', text: "Da thuộc và trà đậm" },
      { id: 'D', text: "Trầm hương và sương sớm" },
    ],
  },
  {
    id: 3,
    question: "Khi đối mặt với thay đổi, bạn thường…",
    microCopy: "Cách bạn đón nhận thay đổi nói lên bạn là ai...",
    options: [
      { id: 'A', text: "Hào hứng khám phá cơ hội mới" },
      { id: 'B', text: "Chờ đợi và quan sát" },
      { id: 'C', text: "Lập kế hoạch chi tiết" },
      { id: 'D', text: "Tin vào trực giác dẫn lối" },
    ],
  },
  {
    id: 4,
    question: "Bạn muốn người khác nhớ đến bạn như…",
    microCopy: "Dấu ấn bạn để lại trong lòng người...",
    options: [
      { id: 'A', text: "Người luôn mang đến năng lượng mới" },
      { id: 'B', text: "Người nhẹ nhàng và tinh tế" },
      { id: 'C', text: "Người đáng tin cậy và mạnh mẽ" },
      { id: 'D', text: "Người bí ẩn và sâu sắc" },
    ],
  },
  {
    id: 5,
    question: "Mùi hương bạn mang khi bước ra đường?",
    microCopy: "Hương thơm cuối cùng hoàn thiện bạn...",
    options: [
      { id: 'A', text: "Tươi mát, năng động" },
      { id: 'B', text: "Ngọt ngào, lãng mạn" },
      { id: 'C', text: "Sang trọng, quyền lực" },
      { id: 'D', text: "Huyền bí, quyến rũ" },
    ],
  },
];

export interface PersonalityResult {
  type: 'Explorer' | 'Dreamer' | 'Leader' | 'Mystic';
  title: string;
  description: string;
  perfumeMale: {
    name: string;
    description: string;
  };
  perfumeFemale: {
    name: string;
    description: string;
  };
}

export const personalityResults: Record<string, PersonalityResult> = {
  Explorer: {
    type: 'Explorer',
    title: 'Nhà Thám Hiểm',
    description: 'Bạn là người không ngừng tìm kiếm điều mới mẻ. Năng lượng của bạn lan tỏa khắp nơi, và mỗi ngày là một cuộc phiêu lưu chờ đón. Năm 2026 sẽ mở ra những cánh cửa bất ngờ cho tâm hồn khao khát khám phá của bạn.',
    perfumeMale: {
      name: 'Horizon Explorer - Nam',
      description: 'Hương cam bergamot, gỗ tuyết tùng và một chút hổ phách ấm áp',
    },
    perfumeFemale: {
      name: 'Horizon Explorer - Nữ',
      description: 'Hương chanh Amalfi, hoa nhài và gỗ đàn hương nhẹ nhàng',
    },
  },
  Dreamer: {
    type: 'Dreamer',
    title: 'Người Mơ Mộng',
    description: 'Bạn sống với cảm xúc và trí tưởng tượng phong phú. Thế giới nội tâm của bạn là một bức tranh đầy màu sắc. Năm 2026 sẽ là lúc những giấc mơ của bạn dần trở thành hiện thực.',
    perfumeMale: {
      name: 'Velvet Dreams - Nam',
      description: 'Hương oải hương, vani Madagascar và xạ hương thanh lịch',
    },
    perfumeFemale: {
      name: 'Velvet Dreams - Nữ',
      description: 'Hương hoa mẫu đơn, đào trắng và kem sữa dịu dàng',
    },
  },
  Leader: {
    type: 'Leader',
    title: 'Người Dẫn Lối',
    description: 'Bạn sinh ra để lãnh đạo. Sự tự tin và tầm nhìn của bạn truyền cảm hứng cho những người xung quanh. Năm 2026 sẽ chứng kiến bạn chinh phục những đỉnh cao mới.',
    perfumeMale: {
      name: 'Royal Command - Nam',
      description: 'Hương oud hoàng gia, da thuộc Ý và hương thảo tươi',
    },
    perfumeFemale: {
      name: 'Royal Command - Nữ',
      description: 'Hương hoa iris, nhựa thơm và gỗ hồng quyền lực',
    },
  },
  Mystic: {
    type: 'Mystic',
    title: 'Người Huyền Bí',
    description: 'Bạn có chiều sâu khó dò và sức hút không thể cưỡng lại. Trực giác mạnh mẽ dẫn lối bạn qua mọi quyết định. Năm 2026 sẽ hé lộ những bí mật vũ trụ dành riêng cho bạn.',
    perfumeMale: {
      name: 'Midnight Oracle - Nam',
      description: 'Hương trầm hương Oman, nhục đậu khấu và vetiver đêm',
    },
    perfumeFemale: {
      name: 'Midnight Oracle - Nữ',
      description: 'Hương hoắc hương, hoa huệ đen và xạ hương huyền bí',
    },
  },
};

export function calculateResult(answers: Record<number, 'A' | 'B' | 'C' | 'D'>): PersonalityResult {
  const scores = { A: 0, B: 0, C: 0, D: 0 };
  
  Object.values(answers).forEach((answer) => {
    scores[answer]++;
  });

  const maxScore = Math.max(...Object.values(scores));
  const topTypes = Object.entries(scores)
    .filter(([_, score]) => score === maxScore)
    .map(([type]) => type);

  // Random pick if tie
  const winningType = topTypes[Math.floor(Math.random() * topTypes.length)];

  const typeMap: Record<string, string> = {
    A: 'Explorer',
    B: 'Dreamer',
    C: 'Leader',
    D: 'Mystic',
  };

  return personalityResults[typeMap[winningType]];
}
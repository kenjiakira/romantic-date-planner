export type Location = {
  id: string
  name: string
  category: string
  description: string
  tags: string[]
}

export const locations: Location[] = [
  {
    id: "second_home",
    name: "Nhà thứ 2",
    category: "safe_place",
    description: "Game center quen thuộc, chỗ hay nằm nghỉ, không cần làm gì.",
    tags: ["quen thuộc", "nghỉ ngơi", "an toàn", "không áp lực", "base"],
  },
  {
    id: "aeon_xuan_thuy",
    name: "AEON Mall Xuân Thủy",
    category: "mall",
    description: "Đi dạo, ăn uống, xem phim, không cần mục tiêu.",
    tags: ["trong nhà", "ăn uống", "xem phim", "đi dạo"],
  },
  {
    id: "lotte_center",
    name: "Lotte Center",
    category: "mall",
    description: "View cao, đổi không khí.",
    tags: ["view", "chụp ảnh", "buổi tối"],
  },
  {
    id: "cinema",
    name: "Rạp chiếu phim",
    category: "entertainment",
    description: "Xem phim nếu muốn yên tĩnh.",
    tags: ["xem phim", "ngồi lâu", "ít nói"],
  },
  {
    id: "quiet_cafe",
    name: "Quán cà phê yên tĩnh",
    category: "cafe",
    description: "Ngồi nói chuyện, không vội.",
    tags: ["cafe", "trò chuyện", "nhẹ"],
  },
  {
    id: "rooftop_cafe",
    name: "Cà phê rooftop",
    category: "cafe",
    description: "Buổi tối, gió mát, ngắm thành phố.",
    tags: ["buổi tối", "view", "lãng mạn"],
  },
  {
    id: "park_walk",
    name: "Công viên / đi bộ",
    category: "outdoor",
    description: "Đi dạo nhẹ, không cần nói nhiều.",
    tags: ["ngoài trời", "đi bộ", "nhẹ"],
  },
  {
    id: "photobooth",
    name: "Photobooth",
    category: "activity",
    description: "Chụp vài tấm cho vui.",
    tags: ["chụp ảnh", "kỷ niệm", "vui"],
  },
  {
    id: "game_center",
    name: "Game center",
    category: "activity",
    description: "Chơi game nhẹ, giải trí.",
    tags: ["game", "giải trí", "vui"],
  },
  {
    id: "street_food",
    name: "Ăn vặt / ăn khuya",
    category: "food",
    description: "Ăn nhẹ khi đói.",
    tags: ["ăn uống", "linh hoạt", "khuya"],
  },
  {
    id: "random_walk",
    name: "Đi đâu đó không định trước",
    category: "free",
    description: "Lên xe rồi tính tiếp.",
    tags: ["tự do", "không kế hoạch"],
  },
]

export const foodMoods = [
  {
    id: "casual",
    label: "Thoải Mái & Tiện Lợi",
    flavor: "Những món ăn đường phố, đồ ăn nhanh yêu thích",
  },
  {
    id: "peaceful",
    label: "Thanh Đạm & Nhẹ Nhàng",
    flavor: "Chút salad tươi, trái cây hay đồ uống thanh mát",
  },
  {
    id: "shared",
    label: "Sẻ Chia & Kết Nối",
    flavor: "Lẩu nóng hổi hoặc những món ăn cùng nhau nhâm nhi",
  },
  {
    id: "rest",
    label: "Nạp Lại Năng Lượng",
    flavor: "Đồ ăn vặt tại Second Home khi chúng mình đang lười",
  },
] as const

export function getLocationById(id: string): Location | undefined {
  return locations.find((loc) => loc.id === id)
}

export function getMoodById(id: string) {
  return foodMoods.find((mood) => mood.id === id)
}


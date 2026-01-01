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
    description: "Chỗ ý ý.",
    tags: ["quen thuộc", "nghỉ ngơi", "an toàn", "không áp lực", "base"],
  },
  {
    id: "aeon_xuan_thuy",
    name: "AEON Mall Xuân Thủy",
    category: "mall",
    description: "Đi dạo, ăn uống, xem phim, v...v.",
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
    description: "Ngồi nói chuyện, v...v.",
    tags: ["cafe", "trò chuyện", "nhẹ"],
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
    description: "Đi rồi tính tiếp.",
    tags: ["tự do", "không kế hoạch"],
  },
  {
    id: "bookstore",
    name: "Hiệu sách / Thư viện",
    category: "quiet",
    description: "Ngồi đọc sách, yên tĩnh.",
    tags: ["yên tĩnh", "đọc sách", "ngồi lâu"],
  },
  {
    id: "art_gallery",
    name: "Triển lãm / Bảo tàng",
    category: "culture",
    description: "Xem tranh, đi chậm.",
    tags: ["văn hóa", "yên tĩnh", "chụp ảnh"],
  },
  {
    id: "picnic",
    name: "Dã ngoại nhẹ",
    category: "outdoor",
    description: "Ngồi ngoài trời, ăn nhẹ, thư giãn.",
    tags: ["ngoài trời", "ăn uống", "thư giãn"],
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

export const cuisines = [
  {
    id: "vietnamese",
    name: "Việt Nam",
    description: "Phở, bún chả, bánh mì, cơm tấm...",
    tags: ["quen thuộc", "đậm đà", "đa dạng"],
  },
  {
    id: "japanese",
    name: "Nhật Bản",
    description: "Sushi, ramen, udon, tempura...",
    tags: ["tinh tế", "thanh đạm", "tươi ngon"],
  },
  {
    id: "korean",
    name: "Hàn Quốc",
    description: "BBQ, kimchi, bibimbap, tteokbokki...",
    tags: ["đậm vị", "nóng hổi", "đa dạng"],
  },
  {
    id: "thai",
    name: "Thái Lan",
    description: "Tom yum, pad thai, green curry...",
    tags: ["cay nồng", "chua ngọt", "đậm đà"],
  },
  {
    id: "chinese",
    name: "Trung Hoa",
    description: "Dim sum, lẩu, mì xào, vịt quay...",
    tags: ["phong phú", "đa dạng", "nhiều món"],
  },
  {
    id: "western",
    name: "Âu Mỹ",
    description: "Pizza, pasta, burger, steak...",
    tags: ["quen thuộc", "no bụng", "dễ ăn"],
  },
  {
    id: "italian",
    name: "Ý",
    description: "Pasta, pizza, risotto, tiramisu...",
    tags: ["lãng mạn", "tinh tế", "no bụng"],
  },
  {
    id: "french",
    name: "Pháp",
    description: "Bánh mì, croissant, escargot...",
    tags: ["tinh tế", "lãng mạn", "đặc biệt"],
  },
] as const

export function getCuisineById(id: string) {
  return cuisines.find((cuisine) => cuisine.id === id)
}


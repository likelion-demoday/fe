// API 연결 전 Figma 예시 데이터
export const mockPurchases = Array.from({ length: 5 }, (_, index) => ({
  id: `example-${index + 1}`,
  title: index === 1 ? "다수 분석 이용권 구매" : "10회 이용권 구매",
  date: "2026.09.21",
  paymentMethod: "카카오페이",
  price: index === 1 ? "17,000원" : "17.000원",
}));

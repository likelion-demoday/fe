import api from "./axios";

export const getPaymentProducts = () => api.get("/api/v1/payments/products");
export const createPaymentOrder = (productCode) =>
  api.post("/api/v1/payments", { productCode });
export const getPayment = (orderId) =>
  api.get(`/api/v1/payments/${encodeURIComponent(orderId)}`);

export const requestNicePay = ({
  clientId,
  method,
  orderId,
  amount,
  goodsName,
  buyerName,
  buyerEmail,
  returnUrl,
  onError,
}) => {
  if (!clientId?.trim()) {
    throw new Error("나이스페이 클라이언트 키가 설정되지 않았습니다.");
  }

  if (!returnUrl) {
    throw new Error("나이스페이 백엔드 콜백 URL이 설정되지 않았습니다.");
  }
  if (typeof method !== "string" || !method.trim()) {
    throw new Error("결제 수단이 없습니다.");
  }
  if (typeof onError !== "function") {
    throw new Error("결제 오류 처리 함수가 필요합니다.");
  }

  let callbackUrl;
  try {
    callbackUrl = new URL(returnUrl);
  } catch {
    throw new Error("나이스페이 콜백 URL은 전체 URL이어야 합니다.");
  }
  if (!["http:", "https:"].includes(callbackUrl.protocol)) {
    throw new Error("나이스페이 콜백 URL은 HTTP 또는 HTTPS 주소여야 합니다.");
  }

  // 주문번호와 금액은 백엔드에서 생성·검증한 주문 정보를 전달합니다.
  if (typeof orderId !== "string" || !orderId.trim()) {
    throw new Error("결제 주문번호가 없습니다.");
  }
  if (!Number.isSafeInteger(amount) || amount <= 0) {
    throw new Error("결제 금액이 올바르지 않습니다.");
  }
  if (typeof goodsName !== "string" || !goodsName.trim()) {
    throw new Error("결제 상품명이 없습니다.");
  }

  if (typeof window.AUTHNICE?.requestPay !== "function") {
    throw new Error("결제창을 불러오지 못했습니다. 새로고침 후 다시 시도해주세요.");
  }

  window.AUTHNICE.requestPay({
    clientId,
    method,
    orderId,
    amount,
    goodsName,
    buyerName,
    buyerEmail,
    returnUrl,
    fnError: (result) => {
      const error = new Error(result?.errorMsg || "결제창이 종료되었습니다.");
      onError?.(error);
    },
  });
};

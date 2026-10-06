export const requestNicePay = ({
  orderId,
  amount,
  goodsName,
  buyerName,
  buyerEmail,
}) => {
  if (!window.AUTHNICE) {
    throw new Error("NICEPAY SDK가 로드되지 않았습니다.");
  }

  window.AUTHNICE.requestPay({
    clientId: import.meta.env.VITE_NICEPAY_CLIENT_KEY,
    method: "card",
    orderId,
    amount,
    goodsName,
    buyerName,
    buyerEmail,
    returnUrl: import.meta.env.VITE_NICEPAY_CALLBACK_URL,
  });
};

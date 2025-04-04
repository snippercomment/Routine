import React from 'react';
import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js";

const PaypalButton = ({ amount, onSuccess, onError }) => {
  // Giả sử tỉ giá 1 USD = 24,000 VND
  const exchangeRate = 24000;

  // Chuyển đổi số tiền từ VND sang USD
  const amountInUSD = (parseFloat(amount) / exchangeRate).toFixed(2);

  return (
    <PayPalScriptProvider options={{ "client-id": import.meta.env.VITE_PAYPAL_CLIENT_ID }}>
      <PayPalButtons
        style={{ layout: "vertical" }}
        createOrder={(data, actions) => {
          return actions.order.create({
            purchase_units: [{
              amount: {
                value: amountInUSD,  // Gửi số tiền bằng USD
                currency_code: "USD",  // Đảm bảo là USD
              },
            }],
          });
        }}
        onApprove={(data, actions) => {
          return actions.order.capture().then(onSuccess);
        }}
        onError={onError}
      />
    </PayPalScriptProvider>
  );
};

export default PaypalButton;

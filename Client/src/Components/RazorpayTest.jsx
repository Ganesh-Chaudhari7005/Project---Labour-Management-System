import React from "react";

export default function RazorpayTest() {
  const handlePayment = () => {
    const options = {
      key: "rzp_test_SbpSlPwd37raNJ", // 👈 use your TEST key
      amount: 50000, // 50000 paise = ₹500
      currency: "INR",
      name: "Test Company",
      description: "Test Payment",

      handler: function (response) {
        console.log("Payment Success:", response);
        alert("Payment Successful!");
      },

      prefill: {
        name: "Ganesh",
        email: "test@example.com",
        contact: "9999999999",
      },

      theme: {
        color: "#3399cc",
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  return (
    <div style={{ padding: "40px" }}>
      <h2>Razorpay Test</h2>
      <button onClick={handlePayment}>Pay ₹500</button>
    </div>
  );
}

import { ApiRoute } from "./ApiConfig.js";
import { ToastContainer, toast } from "react-toastify";
const handlePayment = async (bill) => {
  try {
    const response = await fetch(`${ApiRoute}create-order`, {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        amount: bill.TotalAmount,
      }),
    });

    const data = await response.json();

    if (!data.success) {
      toast.error("Order creation failed");
      return;
    }

      const billid = bill.BillID;


    const options = {
      key: "rzp_test_St8JFvkecQuVR0",

      amount: data.order.amount,

      currency: data.order.currency,

      name: "Royal Enterprises",

      description: "Bill Payment",

      order_id: data.order.id,

      handler: async function (response) {
        try {
          const verifyRes = await fetch(`${ApiRoute}verify-payment`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              ...response,
              billid: billid,
            
            }),
          });

          const data = await verifyRes.json();

          if (data.success) {
            toast.success("Payment Verified & Successful");
          } else {
            toast.error("Payment Verification Failed");
          }
        } catch (err) {
          console.log(err);
        } 
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
  } catch (err) {
    console.log(err);
  }
};

export default handlePayment;

import { ApiRoute } from "./ApiConfig.js";
import { ToastContainer, toast } from "react-toastify";
import Swal from "sweetalert2";

const handlePayment = async (bill, getPendingBill) => {
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
        Swal.fire({
          title: "Verifying Payment...",
          text: "Please wait while we verify your payment.",
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading();
          },
        });

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

             console.log("Payment verified");
             await getPendingBill();
             console.log("Bills refreshed");

            Swal.fire({
              icon: "success",
              title: "Payment Successful!",
              text: "Your payment has been verified.",
              confirmButtonText: "OK",
            });
             
          } else {
            Swal.fire({
              icon: "error",
              title: "Verification Failed",
              text: "Payment could not be verified.",
            });
          }
        } catch (err) {
          console.log(err);

          Swal.fire({
            icon: "error",
            title: "Error",
            text: "Something went wrong while verifying payment.",
          });
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

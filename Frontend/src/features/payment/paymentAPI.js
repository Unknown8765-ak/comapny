const API_BASE_URL = "https://company-management-backend-irc6.onrender.com/api/v1/payment"

const processPaymentAPI = async (plan) => {

  const response = await fetch(`${API_BASE_URL}/process`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    credentials: "include",
    body: JSON.stringify({ plan }),
    }
  );
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message);
  }
  return data;
};

const verifyPaymentAPI = async (paymentData) => {

  const response = await fetch(`${API_BASE_URL}/verify`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    credentials: "include",
      body: JSON.stringify(paymentData),
    }
  );

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message);
  }
  return data;
};

const getRazorpayKeyAPI = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/getkey`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json"
        },
         credentials: "include",
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.message || "Failed to fetch Razorpay key"
      );
    }

    return data;
  } catch (err) {
    console.log("Get Razorpay Key Error:", err);
    throw err;

  }

};

export {
    processPaymentAPI,
    verifyPaymentAPI,
    getRazorpayKeyAPI
}

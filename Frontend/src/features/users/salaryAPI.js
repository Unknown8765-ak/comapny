const API_BASE_URL = "https://company-management-backend-irc6.onrender.com/api/v1/payment"

const generateSalaryAPI = async (data) => {
  try {
    const res = await fetch(`${API_BASE_URL}/generate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      credentials: "include",
      body: JSON.stringify(data)
    })

    if (!res.ok) {
      const err = await res.json()
      throw new Error(err.message || "Failed to generate salary")
    }

    return await res.json()
  } catch (err) {
    console.error("Generate Salary Error:", err)
    throw err
  }
}

const getMySalaryAPI = async () => {
  try {
    const res = await fetch(`${API_BASE_URL}/me `, {
      method: "GET",
      credentials: "include"
    })

    if (!res.ok) {
      const err = await res.json()
      throw new Error(err.message || "Failed to fetch salary")
    }

    return await res.json()
  } catch (err) {
    console.error("Get My Salary Error:", err)
    throw err
  }
}

const getAllSalaryAPI = async () => {
  try {
    const res = await fetch(`${API_BASE_URL}/all`, {
      method: "GET",
      credentials: "include"
    })

    if (!res.ok) {
      const err = await res.json()
      throw new Error(err.message || "Failed to fetch salaries")
    }

    return await res.json()
  } catch (err) {
    console.error("Get All Salary Error:", err)
    throw err
  }
}


const markSalaryPaidAPI = async (id) => {
  try {
    const res = await fetch(`${API_BASE_URL}/pay/${id}`, {
      method: "PATCH",
      credentials: "include"
    })

    if (!res.ok) {
      const err = await res.json()
      throw new Error(err.message || "Failed to mark as paid")
    }

    return await res.json()
  } catch (err) {
    console.error("Mark Paid Error:", err)
    throw err
  }
}

const getEmployeeSalaryDetailsAPI = async (id) => {
  try {

    const response = await fetch(
      `${API_BASE_URL}/employee/${id}`,
      {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json"
        }
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message);
    }

    return data;

  } catch (err) {
    throw new Error(
      err.message || "Failed to fetch employee salary details"
    );
  }
};
export {
  generateSalaryAPI,
  getMySalaryAPI,
  getAllSalaryAPI,
  markSalaryPaidAPI,
  getEmployeeSalaryDetailsAPI
}

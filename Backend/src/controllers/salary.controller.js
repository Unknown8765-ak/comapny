import { Salary } from "../models/salary.model.js";
import { Leave } from "../models/leave.model.js";
import { Notification } from "../models/notification.model.js";
import { User } from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import  Task  from "../models/task.model.js"


const generateSalary = asyncHandler(async (req, res) => {

  const { employeeId, month, year,totalWorkingDays } = req.body;

  if (!employeeId || !month || !year ) {
    throw new ApiError(400, "All fields are required");
  }

  if (!["admin", "hr"].includes(req.user.role)) {
    throw new ApiError(403, "Unauthorized");
  }
  const employee = await User.findOne({
  _id: employeeId,
  company: req.user.company
});

if (!employee) {
  throw new ApiError(404, "Employee not found");
}
if (month < 1 || month > 12) {
  throw new ApiError(400, "Invalid month");
} 
const currentYear = new Date().getFullYear();

if (year < 2020 || year > currentYear + 1) {
  throw new ApiError(400, "Invalid year");
}

if (!totalWorkingDays || totalWorkingDays <= 0) {
  throw new ApiError(400, "Invalid working days");
}

const baseSalary = employee.monthlySalary;

  const leaves = await Leave.find({
    employee: employeeId,
    company: req.user.company,
    status: "approved",
    fromDate: { $gte: new Date(`${year}-${month}-01`) },
    toDate: { $lte: new Date(`${year}-${month}-31`) }
  });

  let paidLeaves = 0;
  let unpaidLeaves = 0;

  leaves.forEach(leave => {
    const days =
      (new Date(leave.toDate) - new Date(leave.fromDate)) /
        (1000 * 60 * 60 * 24) + 1;

    if (leave.type === "paid") {
      paidLeaves += days;
    } else {
      unpaidLeaves += days;
    }
  });


  const presentDays = totalWorkingDays - (paidLeaves + unpaidLeaves);
  if (presentDays < 0) {
  throw new ApiError(
    400,
    "Present days cannot be negative"
  );
}

  const perDaySalary = baseSalary / totalWorkingDays;
  const paidDays = presentDays + paidLeaves;

  const netSalary = (perDaySalary * paidDays);
  if (netSalary < 0) {
  throw new ApiError(
    400,
    "Invalid salary calculation"
  );
}

  const existingSalary = await Salary.findOne({
    employee: employeeId,
    month,
    year
  });

if (existingSalary) {
  throw new ApiError(400, "Salary already generated");
}

  const salary = await Salary.create({
    employee: employeeId,
    company: req.user.company,
    month,
    year,
    baseSalary,
    totalWorkingDays,
    presentDays,
    paidLeaves,
    unpaidLeaves,
    netSalary,
    status: "processed"
  });

  await Notification.create({
    userId: employeeId,
    type: "salary_generated",
    title: "Salary Generated",
    message: `Your salary for ${month}/${year} has been generated`,
    relatedId: salary._id,
    createdBy: req.user._id,
    company: req.user.company
  });

  res.json(new ApiResponse(200, salary, "Salary generated successfully"));
});


const getMySalary = asyncHandler(async (req, res) => {

  const salaries = await Salary.find({
    employee: req.user._id,
    company: req.user.company
  })
  .populate("employee", "name email")
  .sort({ year: -1, month: -1 });

  res.json(new ApiResponse(200, salaries));
});

const getEmployeeSalaryDetails = asyncHandler(async (req, res) => {

  const { id } = req.params

  const employee = await User.findOne({
    _id: id,
    company: req.user.company
  })
  .populate("department", "name")

  if (!employee) {
    throw new ApiError(404, "Employee not found")
  }


  const salaries = await Salary.find({
    employee: id,
    company: req.user.company
  })
  .sort({ year: -1, month: -1 })

  const leaves = await Leave.find({
    employee: id,
    company: req.user.company
  })
  .sort({ createdAt: -1 })

  const tasks = await Task.find({
    assignedTo: id,
    company: req.user.company
  })
  .sort({ createdAt: -1 })

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        employee,
        salaries,
        leaves,
        tasks
      },
      "Employee complete details fetched"
    )
  )

})


const getAllSalaries = asyncHandler(async (req, res) => {

  if (!["admin", "hr", "super_admin"].includes(req.user.role)) {
    throw new ApiError(403, "Unauthorized");
  }

  const salaries = await Salary.find({
    company: req.user.company
  })
    .populate("employee", "name email")
    .sort({ year: -1, month: -1 });

  res.json(new ApiResponse(200, salaries));
});



const markSalaryPaid = asyncHandler(async (req, res) => {

  if (!["admin", "hr"].includes(req.user.role)) {
    throw new ApiError(403, "Unauthorized");
  }

  const { id } = req.params;

  const salary = await Salary.findOne({
    _id: id,
    company: req.user.company
  });

  if (!salary) {
    throw new ApiError(404, "Salary not found");
  }
  if (salary.status === "paid") {
  throw new ApiError(
    400,
    "Salary already paid"
  );
}

  salary.status = "paid";
  salary.paidAt = new Date();

  await salary.save();

  await Notification.create({
    userId: salary.employee,
    type: "salary_paid",
    title: "Salary Credited",
    message: "Your salary has been credited to your account",
    relatedId: salary._id,
    createdBy: req.user._id,
    company: req.user.company
  });

  res.json(new ApiResponse(200, salary, "Salary marked as paid"));
});



export {
  generateSalary,
  getMySalary,
  getAllSalaries,
  markSalaryPaid,
  getEmployeeSalaryDetails
};

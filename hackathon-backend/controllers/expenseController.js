import Expense from "../models/expense.js";

/*
CREATE EXPENSE
POST /api/expenses
Protected Route
*/
export const createEXPENSE = async (req, res) => {
  try {
    const { title, amount, category, date, note } = req.body;

    if (!title || !amount || !category) {
      return res.status(400).json({
        success: false,
        message: "Title, amount and category are required"
      });
    }

    const expense = await Expense.create({
      title,
      amount,
      category,
      date,
      note,
      user: req.user._id
    });

    res.status(201).json({
      success: true,
      message: "Expense added successfully",
      data: expense
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};




/*
GET ALL EXPENSES
GET /api/expenses
Protected Route
*/
export const getEXPENSES = async (req, res) => {
  try {

    const expenses = await Expense.find({ user: req.user._id })
      .sort({ date: -1 });

    res.status(200).json({
      success: true,
      count: expenses.length,
      data: expenses
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};




/*
GET SINGLE EXPENSE
GET /api/expenses/:id
Protected Route
*/
export const getEXPENSEById = async (req, res) => {
  try {

    const expense = await Expense.findById(req.params.id);
    
    if (!expense) {
      return res.status(404).json({
        success: false,
        message: "Expense not found"
      });
    }

    if (expense.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({
        success: false,
        message: "Not authorized"
      });
    }

    res.status(200).json({
      success: true,
      data: expense
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};




/*
UPDATE EXPENSE
PUT /api/expenses/:id
Protected Route
*/
export const updateEXPENSE = async (req, res) => {
  try {

    const expense = await Expense.findById(req.params.id);

    if (!expense) {
      return res.status(404).json({
        success: false,
        message: "Expense not found"
      });
    }

    if (expense.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({
        success: false,
        message: "Not authorized"
      });
    }

    const updatedExpense = await Expense.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: "Expense updated successfully",
      data: updatedExpense
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};




/*
DELETE EXPENSE
DELETE /api/expenses/:id
Protected Route
*/
export const deleteEXPENSE = async (req, res) => {
  try {

    const expense = await Expense.findById(req.params.id);

    if (!expense) {
      return res.status(404).json({
        success: false,
        message: "Expense not found"
      });
    }

    if (expense.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({
        success: false,
        message: "Not authorized"
      });
    }

    await expense.deleteOne();

    res.status(200).json({
      success: true,
      message: "Expense deleted successfully"
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
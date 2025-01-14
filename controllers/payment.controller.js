const Payment = require("../models/payments");
const fs = require("fs");

module.exports = {
  getAllPayment: async (req, res) => {
    try {
      let payment = await Payment.find({}, "-__v");

      res.status(200).json(payment);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  getPaymentById: async (req, res) => {
    try {
      const { id } = req.params;
      const payment = await Payment.findById(id, "-__v");

      res.status(200).json({
        message: "Sukses mendapatkan data payment",
        data: payment,
      });
    } catch (error) {
      console.log(error);
    }
  },
  createPayment: async (req, res) => {
    const { konsultasi_id, status } = req.body;
    const buktiFile = req.file;

    // Set the bukti image path in the blog data
    let buktiImagePath = "";
    if (buktiFile) {
      buktiImagePath = `/buktiPembayaran/${buktiFile.filename}`;
    }

    const newPayment = new Payment({
      konsultasi_id,
      status,
      bukti_pembayaran: buktiImagePath,
    });

    try {
      const savedPayment = await newPayment.save();
      res.status(200).json(savedPayment);
    } catch (error) {
      // Delete the uploaded thumbnail image if there is an error
      if (buktiFile) {
        fs.unlinkSync(buktiFile.path);
      }
      res.status(404).json({
        message: "Error",
        error: error.message,
      });
    }
  },
  updatePaymentById: async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    try {
      // Find the payment by ID
      const payment = await Payment.findById(id);

      if (!payment) {
        return res.status(404).json({ message: "Payment not found" });
      }

      // Update the payment status
      payment.status = status;

      // Save the updated payment
      const updatedPayment = await payment.save();
      res.status(200).json(updatedPayment);
    } catch (error) {
      res.status(500).json({
        message: "Error updating payment",
        error: error.message,
      });
    }
  },
  deletePaymentById: async (req, res) => {
    const { id } = req.params;

    try {
      // Find the payment by ID
      const payment = await Payment.findById(id);

      if (!payment) {
        return res.status(404).json({ message: "Payment not found" });
      }

      // Delete the buktiPembayaran image file if it exists
      if (payment.bukti_pembayaran) {
        fs.unlinkSync(`path/to/your/uploaded/images/${payment.bukti_pembayaran}`);
      }

      // Delete the payment from the database
      await payment.remove();
      res.status(200).json({ message: "Payment deleted successfully" });
    } catch (error) {
      res.status(500).json({
        message: "Error deleting payment",
        error: error.message,
      });
    }
  },
};

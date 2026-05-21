import React from "react";
import { Link } from "react-router-dom";

const PaymentFailed = () => {
  return (
    <div className="h-screen flex flex-col justify-center items-center text-center px-6">
      <h1 className="text-4xl font-bold text-red-600 mb-4">Payment Failed</h1>
      <p className="text-lg text-gray-700 mb-6">
        Something went wrong. Please try again.
      </p>
      <Link
        to="/riding"
        className="bg-red-700 text-white py-2 px-5 rounded-lg text-lg font-semibold"
      >
        Try Again
      </Link>
    </div>
  );
};

export default PaymentFailed;

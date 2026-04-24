import React from 'react';
import axios from 'axios';

const RazorpayButton = ({ courseId, amount }) => {
  const handlePayment = async () => {
    try {
      const orderRes = await axios.post('/api/payments/order', { courseId, amount });
      const options = {
        key: 'rzp_test_your_key_id', // Test key
        amount: orderRes.data.order.amount,
        currency: 'INR',
        name: 'CourseHub',
        description: 'Course Purchase',
        order_id: orderRes.data.order.id,
        handler: async (response) => {
          const verifyRes = await axios.post('/api/payments/verify', {
            orderId: response.razorpay_order_id,
            paymentId: response.razorpay_payment_id,
            signature: response.razorpay_signature,
            courseId
          });
          
          if (verifyRes.data.success) {
            alert('Payment successful! Check your dashboard.');
            window.location.href = '/dashboard';
          }
        },
        prefill: {
          name: 'User',
          email: 'user@example.com'
        },
        theme: {
          color: '#3399cc'
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      alert('Payment failed');
    }
  };

  return (
    <button className="btn btn-success btn-lg" onClick={handlePayment}>
      Enroll Now - ₹{amount}
    </button>
  );
};

export default RazorpayButton;
import React, { useState } from 'react';
import { PayPalHostedFieldsProvider, PayPalHostedField, usePayPalHostedFields } from "@paypal/react-paypal-js";
import axios from 'axios';

const SubmitButton = ({ amount, donorName, donorEmail, setError }) => {
    const hostedFields = usePayPalHostedFields();
    const [isProcessing, setIsProcessing] = useState(false);

    const submitHandler = async () => {
        if (!hostedFields?.submit) return;

        setIsProcessing(true);
        setError("");

        try {
            // This internally calls createOrder on the provider, tokenizes the card, and returns the orderId
            const submitResponse = await hostedFields.submit();

            // Capture order on backend
            const resCapture = await axios.post(`${import.meta.env.VITE_API_URL}/payments/paypal/capture-order`, {
                orderId: submitResponse.orderId,
                payerName: donorName,
                payerEmail: donorEmail
            });

            if (resCapture.data.status === 'ok') {
                window.location.href = '/payment-success';
            } else {
                setError("Payment capture failed.");
            }
        } catch (err) {
            console.error("Hosted Fields Submit Error:", err);
            setError("PayPal encountered an error. Ensure your account is approved for Advanced Cards.");
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <button
            onClick={submitHandler}
            disabled={isProcessing}
            className="w-full py-4 text-white font-bold rounded-full transition-all duration-300 hover:-translate-y-1 mt-4"
            style={{ 
                backgroundColor: '#003087',
                boxShadow: `0 10px 20px -5px rgba(0,48,135,0.4)`
            }}
        >
            {isProcessing ? 'Processing...' : `Pay €${amount}`}
        </button>
    );
};

export default function PayPalCheckoutForm({ amount, donorName, donorEmail, onCancel }) {
    const [error, setError] = useState("");

    const createOrder = async () => {
        try {
            const res = await axios.post(`${import.meta.env.VITE_API_URL}/payments/paypal/create-order`, {
                amount: Number(amount),
                payerName: donorName,
                payerEmail: donorEmail,
                currency: 'eur'
            });
            return res.data.data.orderId;
        } catch (err) {
            console.error(err);
            throw new Error("Could not create order");
        }
    };

    return (
        <div className="w-full flex flex-col gap-4">
            {error && <div className="text-[#C2512F] text-sm font-semibold text-center bg-[#C2512F] bg-opacity-10 py-2 rounded-lg px-3">{error}</div>}
            
            <PayPalHostedFieldsProvider createOrder={createOrder}>
                <div className="flex flex-col gap-4 mt-2">
                    <div className="flex flex-col gap-2">
                        <label className="text-xs font-bold opacity-80 uppercase tracking-wide" style={{ color: '#3a2a1a' }}>Card Number</label>
                        <div className="border p-4 rounded-xl bg-white focus-within:border-[#003087] transition-colors" style={{ borderColor: '#ebd8c3', minHeight: '52px' }}>
                            <PayPalHostedField id="card-number" hostedFieldType="number" options={{ selector: "#card-number" }} />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col gap-2">
                            <label className="text-xs font-bold opacity-80 uppercase tracking-wide" style={{ color: '#3a2a1a' }}>Expiry Date</label>
                            <div className="border p-4 rounded-xl bg-white focus-within:border-[#003087] transition-colors" style={{ borderColor: '#ebd8c3', minHeight: '52px' }}>
                                <PayPalHostedField id="expiration-date" hostedFieldType="expirationDate" options={{ selector: "#expiration-date" }} />
                            </div>
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="text-xs font-bold opacity-80 uppercase tracking-wide" style={{ color: '#3a2a1a' }}>CVV</label>
                            <div className="border p-4 rounded-xl bg-white focus-within:border-[#003087] transition-colors" style={{ borderColor: '#ebd8c3', minHeight: '52px' }}>
                                <PayPalHostedField id="cvv" hostedFieldType="cvv" options={{ selector: "#cvv" }} />
                            </div>
                        </div>
                    </div>
                </div>

                <SubmitButton amount={amount} donorName={donorName} donorEmail={donorEmail} setError={setError} />
            </PayPalHostedFieldsProvider>

            <button 
                onClick={onCancel}
                className="w-full py-3 rounded-full font-bold transition-all border hover:bg-gray-50"
                style={{ borderColor: '#ebd8c3', color: '#3a2a1a', backgroundColor: 'transparent' }}
            >
                Cancel
            </button>
        </div>
    );
}

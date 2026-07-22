import React, { useState } from "react";
import {
  CreditCard,
  Wallet,
  Heart,
  ArrowRight,
  Shield,
  MapPin,
} from "lucide-react";
import api from "../api/axios";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import StripeCheckoutForm from "../components/StripeCheckoutForm";
import PayPalCheckoutForm from "../components/PayPalCheckoutForm";
import { useLanguage } from "../LanguageContext";

const PayPalIcon = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className}>
    <path
      fill="#003087"
      d="M19.1 6.8c-.8-3.1-3.6-4.8-7.7-4.8H5.9c-.4 0-.8.3-.9.7L1.9 21c-.1.3.1.6.4.6h4.5c.4 0 .8-.3.9-.7l.9-5.8c0-.2.2-.4.4-.4h2.2c3.5 0 6.1-1.6 6.9-5.5.3-1.6.1-3.3-1-4.4z"
    />
    <path
      fill="#0079C1"
      d="M21 7.2c-.8-3.1-3.6-4.8-7.7-4.8H7.8c-.4 0-.8.3-.9.7L3.8 21c-.1.3.1.6.4.6h4.5c.4 0 .8-.3.9-.7l.9-5.8c0-.2.2-.4.4-.4h2.2c3.5 0 6.1-1.6 6.9-5.5.3-1.6.1-3.3-1-4.4z"
    />
    <path
      fill="#00457C"
      d="M17.4 11.2c-.6 2.7-2.7 4.1-5.7 4.1h-2c-.3 0-.5.2-.6.5l-.8 5.1c-.1.3.1.6.4.6h3.4c.4 0 .8-.3.9-.7l.5-3c0-.2.2-.4.4-.4h.6c2.5 0 4.4-1.1 5-3.9.3-1.6.1-3.3-1-4.4-.3.4-.6.9-1.1 2.1z"
    />
  </svg>
);

const StripeIcon = ({ className }) => (
  <svg viewBox="0 0 32 32" fill="none" className={className}>
    <path
      fill="#635BFF"
      d="M16 32C24.8366 32 32 24.8366 32 16C32 7.16344 24.8366 0 16 0C7.16344 0 0 7.16344 0 16C0 24.8366 7.16344 32 16 32Z"
    />
    <path
      fill="white"
      d="M13.7915 21.0743C12.8715 21.0743 11.4554 20.8037 10.3643 20.1983V17.0628C11.3854 17.6596 12.7214 18.0697 13.9113 18.0697C15.3402 18.0697 15.932 17.6517 15.932 16.9246C15.932 15.5458 10.596 15.4265 10.596 11.5348C10.596 9.30932 12.3551 7.74797 15.6565 7.74797C17.0396 7.74797 18.2323 8.01861 19.1121 8.44199V11.5348C18.1565 11.0505 16.9638 10.7022 15.7712 10.7022C14.5447 10.7022 13.886 11.1256 13.886 11.7582C13.886 13.1111 19.261 13.1111 19.261 17.0628C19.261 19.349 17.4336 21.0743 13.7915 21.0743Z"
    />
  </svg>
);

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

export default function PaymentPage() {
  const isStripeEnabled = import.meta.env.VITE_STRIPE_ENABLED !== "false";
  const isPayPalEnabled = import.meta.env.VITE_PAYPAL_ENABLED === "true";

  const { t, language } = useLanguage();
  const [amount, setAmount] = useState("20");
  const [method, setMethod] = useState(isStripeEnabled ? "stripe" : isPayPalEnabled ? "paypal" : "");
  const [donorName, setDonorName] = useState("");
  const [donorEmail, setDonorEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [clientSecret, setClientSecret] = useState("");
  const [paymentIntentId, setPaymentIntentId] = useState("");
  const [paypalOrderId, setPaypalOrderId] = useState("");
  const [showPayPal, setShowPayPal] = useState(false);
  const [error, setError] = useState(null);

  const colors = {
    brand: "#C2512F",
    brandDark: "#9e3e21",
    paper: "#fff9f0",
    border: "#ebd8c3",
    dark: "#3a2a1a",
  };

  const headingStyle = {
    fontFamily: '\"Barlow Condensed\", sans-serif',
    color: colors.brand,
  };
  const cardStyle = {
    backgroundColor: "white",
    borderRadius: "1.5rem",
    border: `2px solid ${colors.border}`,
  };
  const inputStyle = {
    backgroundColor: colors.paper,
    borderRadius: "1rem",
    color: colors.dark,
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    if (!amount || Number(amount) <= 0 || !donorName || !donorEmail) return;

    setLoading(true);
    setError(null);

    try {
      if (method === "stripe") {
        const res = await api.post("/donations/stripe/initiate", {
          amount: Number(amount),
          donorName: donorName,
          donorEmail: donorEmail,
          type: "one-time",
          currency: "eur",
        });

        if (res.status === 200 && res.data.status === "ok" && res.data.data.clientSecret) {
          setClientSecret(res.data.data.clientSecret);
          setPaymentIntentId(res.data.data.paymentIntentId);
        } else {
          setError(res.data.message || t("failedInitiate"));
        }
      } else if (method === "paypal") {
        setShowPayPal(true);
        setLoading(false);
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || t("somethingWentWrong"));
    } finally {
      setLoading(false);
    }
  };

  if (clientSecret && method === "stripe") {
    return (
      <div className="flex flex-col gap-4 w-full max-w-lg mx-auto mt-2 flex-1 overflow-y-auto min-h-0 px-2 pb-8 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        <div className="text-center shrink-0">
          <h2
            className="text-3xl md:text-4xl uppercase tracking-wider drop-shadow-sm mt-2"
            style={headingStyle}
          >
            {t("completePayment")}
          </h2>
          <p
            className="mt-2 font-semibold"
            style={{ color: colors.dark, opacity: 0.7 }}
          >
            {t("secureStripe")}
          </p>
        </div>
        <div
          className="p-6 shrink-0 shadow-md"
          style={{
            backgroundColor: "#fffcf8",
            borderRadius: "1.5rem",
            border: `1px solid ${colors.border}`,
          }}
        >
          <Elements
            stripe={stripePromise}
            options={{
              clientSecret,
              locale: language === 'fr' ? 'fr' : 'en',
              appearance: {
                theme: "stripe",
                variables: { colorPrimary: colors.brand },
              },
            }}
          >
            <StripeCheckoutForm
              amount={amount}
              onCancel={() => {
                if (paymentIntentId) {
                  api.post("/donations/stripe/cancel", { paymentIntentId }).catch(err => {
                    console.error("Error canceling payment intent:", err);
                  });
                }
                setClientSecret(null);
                setPaymentIntentId("");
              }}
            />
          </Elements>
        </div>
      </div>
    );
  }

  if (showPayPal && method === "paypal") {
    return (
      <div className="flex flex-col gap-4 w-full max-w-lg mx-auto mt-2 flex-1 overflow-y-auto min-h-0 px-2 pb-8 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        <div className="text-center shrink-0">
          <h2
            className="text-3xl md:text-4xl uppercase tracking-wider drop-shadow-sm mt-2"
            style={headingStyle}
          >
            {t("completePayment")}
          </h2>
          <p
            className="mt-2 font-semibold"
            style={{ color: colors.dark, opacity: 0.7 }}
          >
            {t("securePayPal")}
          </p>
        </div>
        <div
          className="p-6 shrink-0 shadow-md flex flex-col gap-4"
          style={{
            backgroundColor: "#fffcf8",
            borderRadius: "1.5rem",
            border: `1px solid ${colors.border}`,
          }}
        >
          <div className="flex flex-col items-center py-4 border-b border-[#ebd8c3] mb-2">
            <div
              className="text-4xl font-bold mb-2 tracking-tight"
              style={{ color: colors.dark }}
            >
              €{amount}
            </div>
            <div
              className="text-sm font-semibold opacity-70 uppercase tracking-widest"
              style={{ color: colors.brand }}
            >
              {t("donationText")}
            </div>
          </div>

          <PayPalScriptProvider
            options={{
              "client-id": import.meta.env.VITE_PAYPAL_CLIENT_ID,
              currency: "EUR",
              locale: language === 'fr' ? 'fr_FR' : 'en_US',
            }}
          >
            <PayPalButtons
              style={{ layout: "vertical", shape: "pill", color: "blue" }}
              createOrder={async () => {
                try {
                  const res = await api.post("/donations/paypal/initiate", {
                    amount: Number(amount),
                    donorName: donorName,
                    donorEmail: donorEmail,
                    type: "one-time",
                    currency: "eur",
                  });
                  if (res.status === 200 && res.data.status === "ok") {
                    setPaypalOrderId(res.data.data.orderId);
                    return res.data.data.orderId;
                  }
                  throw new Error("Failed to initiate PayPal order");
                } catch (err) {
                  console.error(err);
                  setError(t("failedPayPalOrder"));
                  throw err;
                }
              }}
              onApprove={async (data, actions) => {
                try {
                  const res = await api.post("/donations/paypal/capture", {
                    orderId: data.orderID,
                  });
                  if (res.status === 200 && res.data.status === "ok") {
                    window.location.href = "/payment-success";
                  } else {
                    setError(t("paymentCaptureFailed"));
                  }
                } catch (err) {
                  console.error(err);
                  setError(t("paymentCaptureFailed"));
                }
              }}
              onCancel={() => {
                if (paypalOrderId) {
                  api.post("/donations/paypal/cancel", { orderId: paypalOrderId }).catch(err => console.error(err));
                }
                setShowPayPal(false);
                setPaypalOrderId("");
              }}
              onError={(err) => {
                console.error(err);
                setError(t("paypalError"));
              }}
            />

            {/* <PayPalCheckoutForm amount={amount} donorName={donorName} donorEmail={donorEmail} onCancel={() => setShowPayPal(false)} /> */}
          </PayPalScriptProvider>

          <button
            onClick={() => {
              if (paypalOrderId) {
                api.post("/donations/paypal/cancel", { orderId: paypalOrderId }).catch(err => console.error(err));
              }
              setShowPayPal(false);
              setPaypalOrderId("");
            }}
            className="w-full py-3 rounded-full font-bold transition-all border hover:bg-gray-50"
            style={{
              borderColor: colors.border,
              color: colors.dark,
              backgroundColor: "transparent",
            }}
          >
            {t("cancel")}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-start w-full flex-1 px-4 pt-4 pb-2">
      {/* Hesteka Platform Info */}
      <div className="w-full max-w-4xl flex flex-col items-center mb-4 md:mb-6 mt-0 animate-fade-in px-2 md:px-4">
        <h2
          className="text-xl sm:text-3xl md:text-4xl tracking-wide font-semibold mb-2 md:mb-3 text-center px-1 md:px-2"
          style={{
            fontFamily: '\"Barlow Condensed\", sans-serif',
            color: colors.brandDark,
            textShadow: "0 2px 4px rgba(0,0,0,0.05)",
          }}
        >
          {t("helpRescueProtect")}
        </h2>

        <p
          className="text-sm md:text-lg text-center max-w-5xl font-semibold mb-3 md:mb-5"
          style={{ color: colors.dark, opacity: 0.8 }}
        >
          {t("contributionFuels")}
        </p>


      </div>

      {/* Container Card */}
      <div
        className="bg-[#fffcf8] p-4 md:p-6 lg:p-8 shadow-2xl relative w-full max-w-6xl rounded-[1.5rem] md:rounded-[2rem]"
        style={{ border: `1px solid ${colors.border}`, fontFamily: '"Barlow Condensed", sans-serif' }}
      >
        {/* Horizontal Stepper */}
        <div className="flex items-center justify-center mb-6 md:mb-8 w-full max-w-2xl mx-auto relative px-4 md:px-6 mt-1 md:mt-2">
          <div
            className="absolute top-1/2 left-8 md:left-10 right-8 md:right-10 h-1 z-0 -translate-y-1/2"
            style={{ backgroundColor: "#ebd8c3" }}
          ></div>
          <div
            className="absolute top-1/2 left-8 md:left-10 w-[20%] h-1 z-0 -translate-y-1/2 transition-all duration-500"
            style={{ backgroundColor: colors.brand }}
          ></div>
          <div className="flex justify-between w-full relative z-10">
            <div
              className="w-8 h-8 md:w-10 md:h-10 rounded-full text-white flex items-center justify-center text-base md:text-lg shadow-lg"
              style={{
                backgroundColor: colors.brand,
                fontFamily: '\"Barlow Condensed\", sans-serif',
                boxShadow: `0 4px 10px ${colors.brand}66`,
              }}
            >
              1
            </div>
            <div
              className="w-8 h-8 md:w-10 md:h-10 rounded-full text-[#9a8a7a] flex items-center justify-center text-base md:text-lg shadow-inner"
              style={{
                backgroundColor: "#f4e8d8",
                fontFamily: '\"Barlow Condensed\", sans-serif',
              }}
            >
              2
            </div>
            <div
              className="w-8 h-8 md:w-10 md:h-10 rounded-full text-[#9a8a7a] flex items-center justify-center text-base md:text-lg shadow-inner"
              style={{
                backgroundColor: "#f4e8d8",
                fontFamily: '\"Barlow Condensed\", sans-serif',
              }}
            >
              3
            </div>
          </div>
        </div>

        <form
          onSubmit={handlePayment}
          className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-10 xl:gap-16 relative z-10"
        >
          {/* Column 1: Amount Selection */}
          <div className="flex flex-col gap-4 md:gap-6">
            <h3
              className="text-center font-bold tracking-widest text-xs md:text-sm"
              style={{ color: colors.dark, fontFamily: '"Barlow Condensed", sans-serif' }}
            >
              {t("selectAmount")}
            </h3>
            <div className="flex justify-center gap-2 md:gap-3">
              {["10", "20", "50"].map((val) => {
                const isSelected = amount === val;
                return (
                  <button
                    type="button"
                    key={val}
                    onClick={() => setAmount(val)}
                    className="flex-1 py-3 md:py-4 font-bold text-lg md:text-xl transition-all duration-200 active:translate-y-1 hover:-translate-y-0.5"
                    style={{
                      cursor: "pointer",
                      borderRadius: "1rem",
                      border: `1px solid ${isSelected ? colors.brandDark : colors.border}`,
                      borderBottomWidth: isSelected ? "4px" : "2px",
                      backgroundColor: isSelected ? colors.brand : colors.paper,
                      color: isSelected ? "white" : colors.dark,
                      boxShadow: isSelected
                        ? `0 6px 12px -2px ${colors.brand}4d`
                        : "none",
                    }}
                  >
                    €{val}
                  </button>
                );
              })}
            </div>
            <div className="flex flex-col gap-1.5 md:gap-2 mt-1 md:mt-2">
              <label
                className="text-[10px] md:text-xs font-bold"
                style={{ color: colors.dark, opacity: 0.8 }}
              >
                {t("manualInput")}
              </label>
              <div className="relative">
                <span
                  className="absolute left-3 md:left-4 top-1/2 -translate-y-1/2 font-bold text-sm md:text-base"
                  style={{ color: colors.dark }}
                >
                  €
                </span>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className={`w-full py-3 md:py-4 pl-8 md:pl-10 pr-3 md:pr-4 font-bold text-base md:text-lg outline-none transition-all focus:ring-0 focus:outline-none focus:border-2 focus:border-[#9e3e21] ${amount && !["10", "20", "50"].includes(amount) ? "border-2 border-[#C2512F]" : "border border-[#ebd8c3]"}`}
                  style={{
                    backgroundColor: colors.paper,
                    borderRadius: "1rem",
                    color: colors.dark,
                  }}
                  min="1"
                  required
                />
              </div>
            </div>
          </div>

          {/* Column 2: Personal Info */}
          <div className="flex flex-col gap-4 md:gap-6 border-t lg:border-t-0 lg:border-l border-[#ebd8c3] pt-5 md:pt-8 lg:pt-0 lg:pl-6">
            <h3
              className="text-center font-bold tracking-widest text-xs md:text-sm"
              style={{ color: colors.dark, fontFamily: '"Barlow Condensed", sans-serif' }}
            >
              {t("yourDetails")}
            </h3>
            <div className="flex flex-col gap-3 md:gap-4">
              <div className="flex flex-col gap-1.5 md:gap-2">
                <label
                  className="text-[10px] md:text-xs font-bold"
                  style={{ color: colors.dark, opacity: 0.8 }}
                >
                  {t("fullName")}
                </label>
                <input
                  type="text"
                  value={donorName}
                  onChange={(e) => setDonorName(e.target.value)}
                  className="w-full py-3 md:py-4 px-4 md:px-5 font-semibold text-sm md:text-base outline-none transition-all border border-[#ebd8c3] focus:border-2 focus:border-[#9e3e21] focus:ring-0 focus:outline-none"
                  style={{
                    backgroundColor: colors.paper,
                    borderRadius: "1rem",
                    color: colors.dark,
                  }}
                  required
                />
              </div>
              <div className="flex flex-col gap-1.5 md:gap-2">
                <label
                  className="text-[10px] md:text-xs font-bold"
                  style={{ color: colors.dark, opacity: 0.8 }}
                >
                  {t("emailAddress")}
                </label>
                <input
                  type="email"
                  value={donorEmail}
                  onChange={(e) => setDonorEmail(e.target.value)}
                  className="w-full py-3 md:py-4 px-4 md:px-5 font-semibold text-sm md:text-base outline-none transition-all border border-[#ebd8c3] focus:border-2 focus:border-[#9e3e21] focus:ring-0 focus:outline-none"
                  style={{
                    backgroundColor: colors.paper,
                    borderRadius: "1rem",
                    color: colors.dark,
                  }}
                  required
                />
              </div>
            </div>
          </div>

          {/* Column 3: Payment Method */}
          <div className="flex flex-col gap-4 md:gap-6 border-t lg:border-t-0 lg:border-l border-[#ebd8c3] pt-5 md:pt-8 lg:pt-0 lg:pl-6 relative">
            <h3
              className="text-center font-bold tracking-widest text-xs md:text-sm"
              style={{ color: colors.dark, fontFamily: '"Barlow Condensed", sans-serif' }}
            >
              {t("paymentMethod")}
            </h3>
            <div className={`grid ${isStripeEnabled && isPayPalEnabled ? 'grid-cols-2' : 'grid-cols-1'} gap-2 md:gap-3`}>
              {isStripeEnabled && (
                <button
                  type="button"
                  onClick={() => setMethod("stripe")}
                  className="flex flex-col items-center justify-center gap-2 md:gap-3 py-4 md:py-6 px-2 md:px-3 transition-all duration-200 hover:-translate-y-1 shadow-sm hover:shadow-md relative overflow-hidden"
                  style={{
                    cursor: "pointer",
                    borderRadius: "1rem",
                    border: `2px solid ${method === "stripe" ? colors.brand : colors.border}`,
                    backgroundColor:
                      method === "stripe" ? `${colors.brand}0d` : colors.paper,
                  }}
                >
                  {method === "stripe" && (
                    <div className="absolute inset-0 z-0 bg-gradient-to-tr from-[#635BFF]/10 to-transparent"></div>
                  )}
                  <StripeIcon
                    className={`w-8 h-8 md:w-10 md:h-10 z-10 transition-transform ${method === "stripe" ? "scale-110" : "opacity-80 grayscale"}`}
                  />
                  <span
                    className="text-xs md:text-sm font-bold tracking-wide z-10"
                    style={{ color: colors.dark }}
                  >
                    Stripe
                  </span>
                </button>
              )}

              {isPayPalEnabled && (
                <button
                  type="button"
                  onClick={() => setMethod("paypal")}
                  className="flex flex-col items-center justify-center gap-2 md:gap-3 py-4 md:py-6 px-2 md:px-3 transition-all duration-200 hover:-translate-y-1 shadow-sm hover:shadow-md relative overflow-hidden"
                  style={{
                    cursor: "pointer",
                    borderRadius: "1rem",
                    border: `2px solid ${method === "paypal" ? colors.brand : colors.border}`,
                    backgroundColor:
                      method === "paypal" ? `${colors.brand}0d` : colors.paper,
                  }}
                >
                  {method === "paypal" && (
                    <div className="absolute inset-0 z-0 bg-gradient-to-tr from-[#0079C1]/10 to-transparent"></div>
                  )}
                  <PayPalIcon
                    className={`w-8 h-8 md:w-10 md:h-10 z-10 transition-transform ${method === "paypal" ? "scale-110" : "opacity-80 grayscale"}`}
                  />
                  <span
                    className="text-xs md:text-sm font-bold tracking-wide z-10"
                    style={{ color: colors.dark }}
                  >
                    PayPal
                  </span>
                </button>
              )}
            </div>

            <p
              className="text-center text-[10px] md:text-xs font-bold mt-1 md:mt-2"
              style={{ color: colors.dark, opacity: 0.8 }}
            >
              {t("securelyPayWith")} {method === "stripe" ? "Stripe" : "PayPal"}
            </p>

            {error && (
              <div
                className="bg-red-50 text-red-600 p-3 text-xs font-bold border border-red-200 text-center"
                style={{ borderRadius: "0.8rem" }}
              >
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={
                loading ||
                !amount ||
                Number(amount) <= 0 ||
                !donorName ||
                !donorEmail
              }
              className="mt-4 md:mt-6 w-full text-white text-base md:text-lg lg:text-xl tracking-wider py-3 md:py-4 lg:py-5 px-2 flex items-center justify-center transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:-translate-y-1 active:translate-y-1 active:border-b-0 leading-tight"
              style={{
                cursor: "pointer",
                fontFamily: '"Barlow Condensed", sans-serif',
                fontWeight: 800,
                backgroundColor: colors.brand,
                borderRadius: "9999px",
                borderBottom: `5px solid ${colors.brandDark}`,
                boxShadow: `0 15px 25px -5px ${colors.brand}66`,
                textShadow: "0 2px 4px rgba(0,0,0,0.2)",
              }}
            >
              {loading ? (
                <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                t("supportNow")
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function CheckoutSteps({ step }) {
  const steps = ["Information", "Shipping", "Payment", "Done"];

  return (
    <div className="flex justify-between mt-4 mb-10 relative">
      {steps.map((label, i) => (
        <div key={i} className="text-center flex-1">
          <div
            className={`w-9 h-9 mx-auto rounded-full flex items-center justify-center 
              ${
                i <= step
                  ? "bg-primary text-white"
                  : "bg-gray-300 text-gray-700"
              }`}
          >
            {i + 1}
          </div>
          <p
            className={`mt-2 text-sm font-semibold 
            ${i <= step ? "text-primary" : "text-gray-500"}`}
          >
            {label}
          </p>
        </div>
      ))}

      <div className="absolute top-4 left-0 w-full h-1 bg-gray-300 -z-10"></div>
      <div
        className="absolute top-4 left-0 h-1 bg-primary -z-10 transition-all duration-500"
        style={{ width: `${(step / 3) * 100}%` }}
      ></div>
    </div>
  );
}

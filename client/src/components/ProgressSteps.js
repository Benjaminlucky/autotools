export default function ProgressSteps({ step }) {
  const steps = ["Contact", "Delivery", "Payment"];

  return (
    <div className="flex justify-center gap-6 mb-10">
      {steps.map((label, index) => {
        const active = step === index + 1;
        const completed = step > index + 1;

        return (
          <div key={index} className="text-center">
            <div
              className={`w-10 h-10 flex items-center justify-center rounded-full 
              ${
                active
                  ? "bg-primary text-white"
                  : completed
                  ? "bg-green-500 text-white"
                  : "bg-gray-300 text-gray-700"
              }`}
            >
              {index + 1}
            </div>
            <p className="mt-2 text-sm">{label}</p>
          </div>
        );
      })}
    </div>
  );
}

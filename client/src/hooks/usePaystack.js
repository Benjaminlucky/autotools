// hooks/usePaystack.js

/**
 * Custom hook for Paystack integration
 * @param {Object|null} config
 * @returns {Function|null}
 */
export const usePaystack = (config) => {
  if (!config) return null;

  const initializePayment = (onSuccess, onClose) => {
    if (!window.PaystackPop) {
      console.error("Paystack script not loaded");
      return;
    }

    if (!config.email) {
      console.error("Paystack email missing");
      return;
    }

    const handler = window.PaystackPop.setup({
      key: config.publicKey,
      email: config.email,
      amount: config.amount,
      ref: config.reference,
      metadata: config.metadata,
      callback: (response) => {
        onSuccess?.(response);
      },
      onClose: () => {
        onClose?.();
      },
    });

    handler.openIframe();
  };

  return initializePayment;
};

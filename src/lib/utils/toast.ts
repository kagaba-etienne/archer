import { toast as sonnerToast } from "sonner";

/**
 * Toast utility wrapper for Sonner
 * Provides consistent toast notifications throughout the app
 */
export const toast = {
  /**
   * Display success toast
   */
  success: (message: string, description?: string) => {
    return sonnerToast.success(message, {
      description,
    });
  },

  /**
   * Display error toast
   */
  error: (message: string, description?: string) => {
    return sonnerToast.error(message, {
      description,
    });
  },

  /**
   * Display info toast
   */
  info: (message: string, description?: string) => {
    return sonnerToast.info(message, {
      description,
    });
  },

  /**
   * Display warning toast
   */
  warning: (message: string, description?: string) => {
    return sonnerToast.warning(message, {
      description,
    });
  },

  /**
   * Display loading toast
   */
  loading: (message: string, description?: string) => {
    return sonnerToast.loading(message, {
      description,
    });
  },

  /**
   * Display promise toast with automatic loading/success/error states
   */
  promise: <T>(
    promise: Promise<T>,
    {
      loading,
      success,
      error,
    }: {
      loading: string;
      success: string | ((data: T) => string);
      error: string | ((error: Error) => string);
    },
  ) => {
    return sonnerToast.promise(promise, {
      loading,
      success,
      error,
    });
  },

  /**
   * Display custom toast
   */
  custom: (message: string, description?: string) => {
    return sonnerToast(message, {
      description,
    });
  },

  /**
   * Dismiss a toast by ID
   */
  dismiss: (toastId?: string | number) => {
    return sonnerToast.dismiss(toastId);
  },
};

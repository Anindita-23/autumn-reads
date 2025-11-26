// Use a safe dynamic toast helper to avoid requiring `react-hot-toast` at module load.
const safeToast = (message: string) => {
  // Try dynamic import; build the module name at runtime to prevent Vite
  // import-analysis from attempting to statically resolve the dependency.
  try {
    const modName = ["react", "-", "hot", "-", "toast"].join("");
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    // Tell Vite to ignore static analysis for this dynamic import
    // so we don't get the 'cannot be analyzed' warning.
    import(/* @vite-ignore */ modName)
      .then((mod) => {
        const t = (mod && (mod.default || (mod as any).toast)) as any;
        if (typeof t === "function") t(message, { position: "top-right" });
      })
      .catch(() => {
        // eslint-disable-next-line no-console
        console.warn("toast not available:", message);
      });
  } catch (e) {
    // eslint-disable-next-line no-console
    console.warn("dynamic import failed for toast", e);
  }
};

interface ApiError {
  error?: string;
  message?: string;
  errors?: Record<string, string[]>;
}

export const parseError = (error: unknown) => {
  // Duck-typing for axios errors to avoid a hard dependency at module-load time
  const maybeAxios = error as any;
  if (maybeAxios && (maybeAxios.isAxiosError || maybeAxios.response)) {
    const data = maybeAxios.response?.data as ApiError | undefined;

    if (data?.errors) {
      const messages = Object.values(data.errors).flat();
      return messages.map((msg) => safeToast(msg));
    }

    if (data?.error) return safeToast(data.error);
    if (data?.message) return safeToast(data.message);
  }

  if (error instanceof Error) {
    return safeToast(error.message);
  }

  safeToast("Something went wrong, please try after sometime!");
};

export const calculateDiscount = (price: { mrp: string; sale: string }) => {
  const { mrp, sale } = price;

  const mrpNumber = Number(mrp);
  const saleNumber = Number(sale);

  return Math.round(((mrpNumber - saleNumber) / mrpNumber) * 100);
};

export const formatPrice = (amount: number) => {
  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  });

  return formatter.format(amount);
};

export const debounce = <T extends unknown[]>(
  func: (...args: T) => void,
  time: number
) => {
  let timeoutId: number;

  return (...args: T) => {
    // clearing the previous timeout (invalidates the previous function call)
    clearTimeout(timeoutId);

    // registers the new timeout (registers the new function to call after the given time)
    timeoutId = setTimeout(() => {
      func(...args);
    }, time);
  };
};

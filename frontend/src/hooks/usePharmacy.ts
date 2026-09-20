import { useQuery, useMutation } from "@tanstack/react-query";
import {
  getProducts,
  getLabTests,
  checkoutPharmacyOrder,
  checkoutLabTest,
} from "../services/pharmacyService";
import {
  CheckoutOrderFormData,
  BookLabTestFormData,
} from "../schemas/pharmacySchema";
import { toast } from "sonner";

export const useGetProducts = () => {
  return useQuery({
    queryKey: ["pharmacyProducts"],
    queryFn: getProducts,
  });
};

export const useGetLabTests = () => {
  return useQuery({
    queryKey: ["labTests"],
    queryFn: getLabTests,
  });
};

export const useCheckoutPharmacyOrder = () => {
  return useMutation({
    mutationFn: (data: CheckoutOrderFormData) => checkoutPharmacyOrder(data),
    onSuccess: (res) => {
      if (res.data?.url) {
        toast.loading("Redirecting to secure Stripe Checkout... 💳");
        window.location.href = res.data.url;
      }
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Checkout failed");
    },
  });
};

export const useCheckoutLabTest = () => {
  return useMutation({
    mutationFn: (data: BookLabTestFormData) => checkoutLabTest(data),
    onSuccess: (res) => {
      if (res.data?.url) {
        toast.loading("Redirecting to secure Stripe Checkout... 💳");
        window.location.href = res.data.url;
      }
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Booking failed");
    },
  });
};

import api from "./api";
import {
  CheckoutOrderFormData,
  BookLabTestFormData,
} from "../schemas/pharmacySchema";

export const getProducts = async () => {
  const response = await api.get("/pharmacy/products");
  return response.data;
};

export const getLabTests = async () => {
  const response = await api.get("/pharmacy/lab-tests");
  return response.data;
};

export const checkoutPharmacyOrder = async (data: CheckoutOrderFormData) => {
  const response = await api.post("/pharmacy/orders", data);
  return response.data; // { url, orderId }
};

export const checkoutLabTest = async (data: BookLabTestFormData) => {
  const response = await api.post("/pharmacy/book-test", data);
  return response.data; // { url, bookingId }
};

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import {
  useGetProducts,
  useGetLabTests,
  useCheckoutPharmacyOrder,
  useCheckoutLabTest,
} from "../../hooks/usePharmacy";
import { useAuthStore } from "../../store/authStore";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Pill, TestTubes, ShoppingCart, ArrowRight } from "lucide-react";

const PharmacyStore = () => {
  const navigate = useNavigate();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  const [activeTab, setActiveTab] = useState<"MEDICINES" | "LAB_TESTS">(
    "MEDICINES",
  );
  const [cart, setCart] = useState<
    { productId: string; quantity: number; product: any }[]
  >([]);
  const [shippingAddress, setShippingAddress] = useState("");
  const [labBookingData, setLabBookingData] = useState<{
    testId: string | null;
    date: string;
    address: string;
  }>({ testId: null, date: "", address: "" });

  const { data: productsData, isLoading: loadingProducts } = useGetProducts();
  const { data: testsData, isLoading: loadingTests } = useGetLabTests();

  const checkoutPharmacy = useCheckoutPharmacyOrder();
  const checkoutLab = useCheckoutLabTest();

  const products = productsData?.data?.products || [];
  const labTests = testsData?.data?.tests || [];

  // Cart Functions
  const addToCart = (product: any) => {
    const exists = cart.find((item) => item.productId === product.id);
    if (exists) {
      setCart(
        cart.map((item) =>
          item.productId === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        ),
      );
      toast.success("Increased quantity in cart");
    } else {
      setCart([...cart, { productId: product.id, quantity: 1, product }]);
      toast.success(`${product.name} added to cart! 🛒`);
    }
  };

  const cartTotal = cart.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0,
  );

  const handlePharmacyCheckout = () => {
    if (!isAuthenticated) return navigate("/login");
    if (shippingAddress.length < 10) {
      toast.error("Please provide a complete shipping address.");
      return;
    }
    const items = cart.map((c) => ({
      productId: c.productId,
      quantity: c.quantity,
    }));
    checkoutPharmacy.mutate({ shippingAdd: shippingAddress, items });
  };

  const handleLabCheckout = (test: any) => {
    if (!isAuthenticated) return navigate("/login");
    if (!labBookingData.date) {
      toast.error("Please select a date for the test.");
      return;
    }
    if (test.homeSample && labBookingData.address.length < 10) {
      toast.error("Address is required for home sample collection.");
      return;
    }

    checkoutLab.mutate({
      testId: test.id,
      bookingDate: new Date(labBookingData.date).toISOString(),
      address: labBookingData.address,
    });
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-4 md:p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto space-y-8"
      >
        {/* Modern Header Banner */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-[2rem] p-8 md:p-12 shadow-xl border border-slate-200/50 bg-white flex flex-col md:flex-row justify-between items-start md:items-center gap-6"
        >
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-primary-400/20 to-accent-500/20 rounded-full blur-[80px] pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-cyan-400/20 to-blue-500/20 rounded-full blur-[80px] pointer-events-none" />

          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 mb-4">
              <span className="w-2 h-2 rounded-full bg-primary-500 animate-pulse"></span>
              <p className="text-xs font-semibold text-slate-600 uppercase tracking-wider">
                Health Store
              </p>
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
              Order Medicines &{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-accent-600">
                Lab Tests
              </span>
            </h1>
            <p className="text-slate-500 text-base mt-2 max-w-lg">
              Get genuine medicines delivered home and book diagnostic tests at
              your doorstep.
            </p>
          </div>

          {/* Premium Tab Selector */}
          <div className="relative z-10 flex bg-slate-100/50 p-1.5 rounded-full border border-slate-200 shadow-sm w-full md:w-auto overflow-hidden">
            <button
              onClick={() => setActiveTab("MEDICINES")}
              className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 ${activeTab === "MEDICINES" ? "bg-white text-primary-700 shadow-md" : "text-slate-500 hover:text-slate-800"}`}
            >
              <Pill size={16} /> E-Pharmacy
            </button>
            <button
              onClick={() => setActiveTab("LAB_TESTS")}
              className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 ${activeTab === "LAB_TESTS" ? "bg-white text-primary-700 shadow-md" : "text-slate-500 hover:text-slate-800"}`}
            >
              <TestTubes size={16} /> Lab Tests
            </button>
          </div>
        </motion.div>

        {/* ======================= E-PHARMACY TAB ======================= */}
        {activeTab === "MEDICINES" && (
          <div className="flex flex-col lg:flex-row gap-8 items-start">
            {/* Main Content Area (Products) */}
            <div className="w-full lg:flex-1 space-y-4">
              {loadingProducts ? (
                <div className="text-center py-12 text-slate-400 animate-pulse font-medium">
                  Loading premium products...
                </div>
              ) : products.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-2xl border border-slate-200 shadow-sm text-slate-500">
                  No products found.
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-5">
                  {products.map((product: any, index: number) => {
                    // Logic for 2 cards in first row, 3 cards in next rows
                    // First 2 items take 3 columns out of 6 (50%)
                    // Next 3 items take 2 columns out of 6 (33.3%)
                    const isFirstRow = index < 2;
                    const colSpanClass = isFirstRow
                      ? "lg:col-span-3"
                      : "lg:col-span-2";

                    return (
                      <motion.div
                        key={product.id}
                        whileHover={{ y: -4 }}
                        className={`bg-white p-5 rounded-[1.5rem] shadow-sm border border-slate-200/60 hover:shadow-xl hover:border-primary-200 transition-all flex flex-col justify-between group ${colSpanClass}`}
                      >
                        <div>
                          {product.imageUrl && (
                            <div
                              className={`w-full bg-slate-50 rounded-2xl mb-4 overflow-hidden border border-slate-100 flex items-center justify-center ${isFirstRow ? "h-56" : "h-40"}`}
                            >
                              <img
                                src={product.imageUrl}
                                alt={product.name}
                                className="w-full h-full object-cover mix-blend-multiply group-hover:scale-105 transition-transform duration-500"
                              />
                            </div>
                          )}
                          <div className="flex justify-between items-start mb-2">
                            <h3
                              className={`font-bold text-slate-800 line-clamp-1 ${isFirstRow ? "text-lg" : "text-base"}`}
                            >
                              {product.name}
                            </h3>
                            {product.requiresRx && (
                              <span className="text-[10px] bg-red-50 text-red-600 px-2 py-0.5 rounded-full font-bold border border-red-100">
                                Rx Required
                              </span>
                            )}
                          </div>
                          <p
                            className={`text-slate-500 line-clamp-2 mb-6 ${isFirstRow ? "text-sm" : "text-xs"}`}
                          >
                            {product.description}
                          </p>
                        </div>
                        <div className="flex items-center justify-between mt-auto">
                          <span
                            className={`font-extrabold text-primary-600 ${isFirstRow ? "text-2xl" : "text-xl"}`}
                          >
                            ${product.price.toFixed(2)}
                          </span>
                          <Button
                            onClick={() => addToCart(product)}
                            size={isFirstRow ? "default" : "sm"}
                            className="bg-slate-900 hover:bg-slate-800 text-white rounded-xl shadow-lg"
                          >
                            Add to Cart
                          </Button>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Shopping Cart Side Panel (Sticky) */}
            <div className="w-full lg:w-[380px] bg-white rounded-[1.5rem] p-6 md:p-8 shadow-xl border border-slate-200/60 sticky top-28 shrink-0">
              <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                <ShoppingCart size={20} className="text-primary-600" /> Your
                Cart
              </h2>

              {cart.length === 0 ? (
                <div className="py-12 flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50/50">
                  <span className="text-4xl opacity-50 mb-2">🛍️</span>
                  <p className="text-sm text-slate-500 font-medium">
                    Your cart is empty
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="max-h-[300px] overflow-y-auto space-y-3 pr-2 scrollbar-thin scrollbar-thumb-slate-200">
                    {cart.map((item) => (
                      <div
                        key={item.productId}
                        className="flex justify-between items-center bg-slate-50 p-3 rounded-xl text-sm border border-slate-100"
                      >
                        <div className="flex-1 min-w-0 pr-3">
                          <p className="font-bold text-slate-700 truncate">
                            {item.product.name}
                          </p>
                          <p className="text-xs text-slate-500 font-medium mt-0.5">
                            Qty: {item.quantity} × ${item.product.price}
                          </p>
                        </div>
                        <p className="font-bold text-slate-900">
                          ${(item.quantity * item.product.price).toFixed(2)}
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-slate-200 pt-4 flex justify-between items-center text-lg font-extrabold text-slate-900">
                    <span>Total Amount:</span>
                    <span className="text-primary-600">
                      ${cartTotal.toFixed(2)}
                    </span>
                  </div>

                  <div className="space-y-4 pt-4 border-t border-slate-200">
                    <div className="space-y-1.5">
                      <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                        Shipping Address *
                      </Label>
                      <textarea
                        value={shippingAddress}
                        onChange={(e) => setShippingAddress(e.target.value)}
                        placeholder="Enter full delivery address..."
                        className="w-full min-h-[90px] p-3 text-sm border border-slate-200 bg-slate-50/50 rounded-xl outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all resize-none"
                      />
                    </div>
                    <Button
                      onClick={handlePharmacyCheckout}
                      disabled={checkoutPharmacy.isPending || cart.length === 0}
                      className="w-full bg-primary-600 hover:bg-primary-700 text-white h-14 rounded-xl shadow-lg shadow-primary-600/20 text-base font-semibold flex items-center justify-center gap-2"
                    >
                      {checkoutPharmacy.isPending ? (
                        "Processing..."
                      ) : (
                        <>
                          Checkout Securely <ArrowRight size={18} />
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ======================= LAB TESTS TAB ======================= */}
        {activeTab === "LAB_TESTS" && (
          <div className="space-y-6 max-w-5xl mx-auto">
            {loadingTests ? (
              <div className="text-center py-12 text-slate-400 animate-pulse font-medium">
                Loading test catalog...
              </div>
            ) : labTests.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-2xl border border-slate-200 shadow-sm text-slate-500">
                No lab tests available.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {labTests.map((test: any) => (
                  <motion.div
                    key={test.id}
                    whileHover={{ y: -4 }}
                    className="bg-white p-6 md:p-8 rounded-[1.5rem] shadow-sm border border-slate-200/60 hover:shadow-xl hover:border-primary-200 transition-all flex flex-col justify-between group"
                  >
                    <div>
                      <div className="flex justify-between items-start mb-4">
                        <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 border border-blue-100 group-hover:scale-110 transition-transform">
                          <TestTubes size={24} strokeWidth={2} />
                        </div>
                        {test.homeSample && (
                          <span className="bg-indigo-50 text-indigo-700 text-[10px] font-bold px-3 py-1 rounded-full border border-indigo-100 flex items-center gap-1.5 uppercase tracking-wide">
                            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse"></span>
                            Home Collection
                          </span>
                        )}
                      </div>
                      <h3 className="font-bold text-slate-900 text-xl leading-tight mb-2 group-hover:text-primary-600 transition-colors">
                        {test.name}
                      </h3>
                      <p className="text-sm text-slate-500 mb-6 leading-relaxed">
                        {test.description}
                      </p>
                    </div>

                    <div className="space-y-4 bg-slate-50/80 p-5 rounded-2xl border border-slate-100">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-slate-700 text-sm">
                          Test Price:
                        </span>
                        <span className="text-2xl font-extrabold text-slate-900">
                          ${test.price.toFixed(2)}
                        </span>
                      </div>

                      {/* Booking Form Toggle */}
                      {labBookingData.testId === test.id ? (
                        <AnimatePresence>
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            className="space-y-4 pt-4 border-t border-slate-200"
                          >
                            <div className="space-y-1.5">
                              <Label className="text-xs font-bold text-slate-500 uppercase">
                                Preferred Date *
                              </Label>
                              <Input
                                type="date"
                                min={new Date().toISOString().split("T")[0]}
                                value={labBookingData.date}
                                onChange={(e) =>
                                  setLabBookingData({
                                    ...labBookingData,
                                    date: e.target.value,
                                  })
                                }
                                className="h-10 text-sm bg-white rounded-xl focus-visible:ring-primary-500"
                              />
                            </div>
                            {test.homeSample && (
                              <div className="space-y-1.5">
                                <Label className="text-xs font-bold text-slate-500 uppercase">
                                  Collection Address *
                                </Label>
                                <Input
                                  placeholder="House/Apt, Street, City"
                                  value={labBookingData.address}
                                  onChange={(e) =>
                                    setLabBookingData({
                                      ...labBookingData,
                                      address: e.target.value,
                                    })
                                  }
                                  className="h-10 text-sm bg-white rounded-xl focus-visible:ring-primary-500"
                                />
                              </div>
                            )}
                            <div className="flex gap-3 pt-2">
                              <Button
                                variant="outline"
                                onClick={() =>
                                  setLabBookingData({
                                    testId: null,
                                    date: "",
                                    address: "",
                                  })
                                }
                                className="flex-1 h-11 rounded-xl text-slate-600 hover:bg-slate-100"
                              >
                                Cancel
                              </Button>
                              <Button
                                onClick={() => handleLabCheckout(test)}
                                disabled={checkoutLab.isPending}
                                className="flex-1 h-11 bg-primary-600 hover:bg-primary-700 text-white rounded-xl shadow-lg shadow-primary-600/20"
                              >
                                {checkoutLab.isPending
                                  ? "Processing..."
                                  : "Pay Securely"}
                              </Button>
                            </div>
                          </motion.div>
                        </AnimatePresence>
                      ) : (
                        <Button
                          onClick={() =>
                            setLabBookingData({
                              testId: test.id,
                              date: "",
                              address: "",
                            })
                          }
                          className="w-full bg-slate-900 hover:bg-slate-800 text-white rounded-xl h-11 mt-2 font-medium"
                        >
                          Book This Test
                        </Button>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default PharmacyStore;

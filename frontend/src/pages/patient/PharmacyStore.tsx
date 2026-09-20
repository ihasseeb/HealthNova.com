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
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-cyan-50 p-4 md:p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-6xl mx-auto space-y-6"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-500 via-teal-600 to-cyan-600 rounded-3xl p-6 md:p-8 text-white shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
          <div className="relative z-10">
            <h1 className="text-2xl md:text-4xl font-bold flex items-center gap-3">
              <span>🛒</span> HealthNova Store
            </h1>
            <p className="text-white/90 text-sm mt-1">
              Order medicines and book diagnostic tests online.
            </p>
          </div>

          {/* Tabs */}
          <div className="flex bg-white/20 p-1 rounded-xl gap-1 relative z-10">
            <button
              onClick={() => setActiveTab("MEDICINES")}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition ${activeTab === "MEDICINES" ? "bg-white text-emerald-700" : "text-white hover:bg-white/10"}`}
            >
              💊 E-Pharmacy
            </button>
            <button
              onClick={() => setActiveTab("LAB_TESTS")}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition ${activeTab === "LAB_TESTS" ? "bg-white text-emerald-700" : "text-white hover:bg-white/10"}`}
            >
              🧪 Lab Tests
            </button>
          </div>
        </div>

        {/* ======================= E-PHARMACY TAB ======================= */}
        {activeTab === "MEDICINES" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Product List */}
            <div className="lg:col-span-2 space-y-4">
              {loadingProducts ? (
                <div className="text-center py-12 text-slate-500 animate-pulse">
                  Loading products...
                </div>
              ) : products.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-2xl border border-slate-100 shadow-sm text-slate-500">
                  No products found. Run seed script!
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {products.map((product: any) => (
                    <motion.div
                      key={product.id}
                      whileHover={{ y: -4 }}
                      className="bg-white p-5 rounded-2xl shadow-sm border border-emerald-100 flex flex-col justify-between h-full"
                    >
                      <div>
                        {product.imageUrl && (
                          <div className="w-full h-40 bg-slate-100 rounded-xl mb-4 overflow-hidden">
                            <img
                              src={product.imageUrl}
                              alt={product.name}
                              className="w-full h-full object-cover mix-blend-multiply"
                            />
                          </div>
                        )}
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-bold text-slate-800 line-clamp-1">
                            {product.name}
                          </h3>
                          {product.requiresRx && (
                            <span className="text-[10px] bg-amber-100 text-amber-700 px-2 py-0.5 rounded font-bold">
                              Rx Req.
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-500 line-clamp-2 mb-4">
                          {product.description}
                        </p>
                      </div>
                      <div className="flex items-center justify-between mt-auto">
                        <span className="text-xl font-bold text-emerald-600">
                          ${product.price.toFixed(2)}
                        </span>
                        <Button
                          onClick={() => addToCart(product)}
                          size="sm"
                          className="bg-emerald-600 hover:bg-emerald-700"
                        >
                          Add 🛒
                        </Button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Shopping Cart Side Panel */}
            <div className="bg-white rounded-2xl p-6 shadow-xl border border-emerald-200 h-fit sticky top-24">
              <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                🛍️ Your Cart
              </h2>

              {cart.length === 0 ? (
                <p className="text-sm text-slate-400 py-8 text-center border-2 border-dashed rounded-xl">
                  Your cart is empty.
                </p>
              ) : (
                <div className="space-y-4">
                  <div className="max-h-[300px] overflow-y-auto space-y-3 pr-2">
                    {cart.map((item) => (
                      <div
                        key={item.productId}
                        className="flex justify-between items-center bg-slate-50 p-3 rounded-lg text-sm"
                      >
                        <div className="flex-1 min-w-0 pr-2">
                          <p className="font-bold text-slate-700 truncate">
                            {item.product.name}
                          </p>
                          <p className="text-xs text-slate-500">
                            Qty: {item.quantity} × ${item.product.price}
                          </p>
                        </div>
                        <p className="font-bold text-emerald-600">
                          ${(item.quantity * item.product.price).toFixed(2)}
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-slate-200 pt-4 flex justify-between items-center text-lg font-bold">
                    <span>Total:</span>
                    <span className="text-emerald-600">
                      ${cartTotal.toFixed(2)}
                    </span>
                  </div>

                  <div className="space-y-3 pt-4">
                    <Label className="text-xs">Shipping Address *</Label>
                    <textarea
                      value={shippingAddress}
                      onChange={(e) => setShippingAddress(e.target.value)}
                      placeholder="Enter full delivery address..."
                      className="w-full min-h-[80px] p-3 text-sm border rounded-lg outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                    <Button
                      onClick={handlePharmacyCheckout}
                      disabled={checkoutPharmacy.isPending || cart.length === 0}
                      className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:opacity-90 h-12 shadow-lg"
                    >
                      {checkoutPharmacy.isPending
                        ? "Processing..."
                        : `Checkout ($${cartTotal.toFixed(2)})`}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ======================= LAB TESTS TAB ======================= */}
        {activeTab === "LAB_TESTS" && (
          <div className="space-y-6">
            {loadingTests ? (
              <div className="text-center py-12 text-slate-500 animate-pulse">
                Loading tests...
              </div>
            ) : labTests.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-2xl border border-slate-100 shadow-sm text-slate-500">
                No lab tests available.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {labTests.map((test: any) => (
                  <motion.div
                    key={test.id}
                    whileHover={{ y: -4 }}
                    className="bg-white p-6 rounded-2xl shadow-lg border border-teal-100 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex justify-between items-start mb-3">
                        <div className="text-4xl">🧪</div>
                        {test.homeSample && (
                          <span className="bg-blue-100 text-blue-700 text-[10px] font-bold px-2 py-1 rounded-full flex items-center gap-1">
                            🏠 Home Sample
                          </span>
                        )}
                      </div>
                      <h3 className="font-bold text-slate-800 text-lg leading-tight mb-2">
                        {test.name}
                      </h3>
                      <p className="text-xs text-slate-500 mb-4">
                        {test.description}
                      </p>
                    </div>

                    <div className="space-y-3 bg-slate-50 p-4 rounded-xl">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-bold text-slate-700">Price:</span>
                        <span className="text-xl font-bold text-teal-600">
                          ${test.price.toFixed(2)}
                        </span>
                      </div>

                      {/* Booking Form (Visible only if user intends to book this test) */}
                      {labBookingData.testId === test.id ? (
                        <AnimatePresence>
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            className="space-y-3 pt-2 border-t"
                          >
                            <div>
                              <Label className="text-[10px]">
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
                                className="h-8 text-xs mt-1"
                              />
                            </div>
                            {test.homeSample && (
                              <div>
                                <Label className="text-[10px]">
                                  Home Collection Address *
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
                                  className="h-8 text-xs mt-1"
                                />
                              </div>
                            )}
                            <div className="flex gap-2 pt-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                  setLabBookingData({
                                    testId: null,
                                    date: "",
                                    address: "",
                                  })
                                }
                                className="flex-1 h-8 text-xs"
                              >
                                Cancel
                              </Button>
                              <Button
                                onClick={() => handleLabCheckout(test)}
                                disabled={checkoutLab.isPending}
                                size="sm"
                                className="flex-1 h-8 bg-teal-600 hover:bg-teal-700 text-xs text-white shadow-md"
                              >
                                {checkoutLab.isPending ? "..." : "Pay Now"}
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
                          className="w-full bg-teal-600 hover:bg-teal-700 text-white shadow-md"
                        >
                          📅 Book This Test
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

import { useParams, Link, useNavigate } from "react-router";
import { products, sellers } from "../data/mockData";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Separator } from "../components/ui/separator";
import { Star, TruckIcon, Shield, MessageCircle, Package, ArrowLeft } from "lucide-react";
import { useCart } from "../contexts/CartContext";
import { toast } from "sonner";
import { ProductCard } from "../components/ProductCard";

export function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const product = products.find(p => p.id === id);
  const seller = product ? sellers.find(s => s.id === product.sellerId) : null;

  if (!product || !seller) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <h1 className="text-2xl mb-4">Product not found</h1>
        <Link to="/browse">
          <Button>Browse Products</Button>
        </Link>
      </div>
    );
  }

  const relatedProducts = products
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      title: product.title,
      price: product.price,
      image: product.image,
      seller: product.seller,
    });
    toast.success("Added to cart!");
  };

  const handleBuyNow = () => {
    addToCart({
      id: product.id,
      title: product.title,
      price: product.price,
      image: product.image,
      seller: product.seller,
    });
    navigate("/cart");
  };

  return (
    <div className="bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm mb-6">
          <Link to="/" className="text-gray-500 hover:text-gray-700">Home</Link>
          <span className="text-gray-400">/</span>
          <Link to="/browse" className="text-gray-500 hover:text-gray-700">Browse</Link>
          <span className="text-gray-400">/</span>
          <span>{product.title}</span>
        </div>

        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="size-4" />
          Back
        </button>

        {/* Product Content */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Images */}
          <div>
            <div className="aspect-square rounded-lg overflow-hidden bg-gray-100 mb-4">
              <img
                src={product.image}
                alt={product.title}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Details */}
          <div>
            <h1 className="text-3xl mb-4">{product.title}</h1>

            <div className="flex items-center gap-3 mb-4">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`size-5 ${
                      i < Math.floor(product.rating)
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <span className="font-medium">{product.rating}</span>
              <span className="text-gray-500">({product.reviews} reviews)</span>
            </div>

            <div className="text-4xl mb-6">${product.price.toFixed(2)}</div>

            <div className="space-y-3 mb-6">
              {product.shipping === "Free shipping" && (
                <div className="flex items-center gap-2 text-green-600">
                  <TruckIcon className="size-5" />
                  <span>Free shipping</span>
                </div>
              )}
              <div className="flex items-center gap-2 text-gray-700">
                <Package className="size-5" />
                <span>{product.stock} in stock</span>
              </div>
            </div>

            <Separator className="my-6" />

            {/* Description */}
            <div className="mb-6">
              <h2 className="text-xl mb-3">About this item</h2>
              <p className="text-gray-700">{product.description}</p>
            </div>

            {/* Specifications */}
            <div className="mb-6">
              <h2 className="text-xl mb-3">Specifications</h2>
              <ul className="space-y-2">
                {product.specifications.map((spec, index) => (
                  <li key={index} className="text-gray-700 flex items-start gap-2">
                    <span className="text-blue-600 mt-1">•</span>
                    <span>{spec}</span>
                  </li>
                ))}
              </ul>
            </div>

            <Separator className="my-6" />

            {/* Actions */}
            <div className="flex flex-col gap-3">
              <Button size="lg" onClick={handleBuyNow} className="w-full">
                Buy It Now
              </Button>
              <Button size="lg" variant="outline" onClick={handleAddToCart} className="w-full">
                Add to Cart
              </Button>
            </div>

            <div className="mt-4 p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center gap-2 text-blue-900">
                <Shield className="size-5" />
                <span className="font-medium">Buyer Protection</span>
              </div>
              <p className="text-sm text-blue-800 mt-1">
                Full refund if the item is not as described or if it doesn't arrive.
              </p>
            </div>
          </div>
        </div>

        {/* Seller Info */}
        <div className="border rounded-lg p-6 mb-12">
          <h2 className="text-2xl mb-4">Seller Information</h2>
          <div className="flex flex-col sm:flex-row justify-between gap-6">
            <div className="flex-1">
              <Link to={`/seller/${seller.id}`} className="text-blue-600 hover:underline text-lg font-medium mb-2 block">
                {seller.name}
              </Link>
              <p className="text-gray-700 mb-4">{seller.bio}</p>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="text-gray-500">Rating</div>
                  <div className="flex items-center gap-1">
                    <Star className="size-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium">{seller.rating}</span>
                  </div>
                </div>
                <div>
                  <div className="text-gray-500">Total Sales</div>
                  <div className="font-medium">{seller.totalSales.toLocaleString()}</div>
                </div>
                <div>
                  <div className="text-gray-500">Member Since</div>
                  <div className="font-medium">{seller.memberSince}</div>
                </div>
                <div>
                  <div className="text-gray-500">Response Time</div>
                  <div className="font-medium">{seller.responseTime}</div>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-3 sm:w-48">
              <Link to={`/seller/${seller.id}`}>
                <Button variant="outline" className="w-full">
                  View Shop
                </Button>
              </Link>
              <Button variant="outline" className="w-full">
                <MessageCircle className="size-4 mr-2" />
                Contact Seller
              </Button>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div>
            <h2 className="text-2xl mb-6">Similar Items</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map(p => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

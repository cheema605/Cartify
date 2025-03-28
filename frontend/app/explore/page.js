import { Search, ShoppingCart } from "lucide-react";

export default function ExplorePage() {
  return (
    <div className="min-h-screen w-full bg-gray-100">
      {/* Navbar */}
      <div className="bg-[#0e5a6d] py-4 px-6 flex items-center justify-between shadow-md">
        <h1 className="text-white text-2xl font-bold">Cartify</h1>
        <div className="relative w-1/2">
          <input
            type="text"
            placeholder="Search in Cartify"
            className="w-full py-2 px-4 rounded-lg focus:outline-none"
          />
          <Search className="absolute right-3 top-2 text-gray-500" />
        </div>
        <ShoppingCart className="text-white w-6 h-6" />
      </div>
      
      {/* Featured Products */}
      <div className="container mx-auto mt-6 p-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {[...Array(6)].map((_, index) => (
          <div key={index} className="bg-white p-2 shadow-lg rounded-lg">
            <img
              src="/placeholder.jpg"
              alt="Product"
              className="w-full h-40 object-cover rounded"
            />
            <h2 className="text-sm font-semibold mt-2">Product Name</h2>
            <p className="text-teal-600 font-bold">Rs. 999</p>
            <p className="text-gray-500 line-through text-sm">Rs. 1,500</p>
          </div>
        ))}
      </div>

      {/* Categories Section */}
      <div className="container mx-auto mt-8 p-4">
        <h2 className="text-xl font-bold mb-4">Categories</h2>
        <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
          {[...Array(6)].map((_, index) => (
            <div key={index} className="bg-white p-4 shadow rounded-lg text-center">
              <img
                src="/placeholder-category.jpg"
                alt="Category"
                className="w-16 h-16 mx-auto mb-2"
              />
              <p className="text-sm font-medium">Category {index + 1}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

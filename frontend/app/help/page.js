import React from 'react';

export default function HelpPage() {
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#0a192f] via-[#2563eb] to-black flex justify-center pb-16 px-2">
      <main className="w-full max-w-3xl bg-white/60 rounded-2xl shadow-2xl p-8 md:p-12 font-serif backdrop-blur-md mt-24">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-8 text-[#157a94] text-center drop-shadow">Help & Support</h1>
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-2 text-[#0e5a6d]">Getting Started</h2>
          <p className="text-gray-700">
            Welcome to Cartify! To get started, browse our wide range of products and services. You can add items to your shopping cart, manage your wishlist, and proceed to checkout seamlessly.
          </p>
        </section>
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-2 text-[#0e5a6d]">Account Management</h2>
          <p className="text-gray-700">
            Manage your account settings, update your profile, and view your order history in your dashboard. Keep your preferences up to date to get personalized recommendations.
          </p>
        </section>
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-2 text-[#0e5a6d]">Shopping & Payments</h2>
          <p className="text-gray-700">
            Add products to your cart and proceed to checkout using our secure payment options. You can save multiple payment methods for faster checkout.
          </p>
        </section>
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-2 text-[#0e5a6d]">Rentals & Sellers</h2>
          <p className="text-gray-700">
            If you are interested in renting products or selling your own items, visit the seller dashboard to manage your listings and rental agreements.
          </p>
        </section>
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-2 text-[#0e5a6d]">Contact Support</h2>
          <p className="text-gray-700">
            For further assistance, please contact our support team at <a href="mailto:support@cartify.com" className="text-blue-600 underline">support@cartify.com</a> or call us at <span className="font-semibold">+123 456 7890</span>. Our support hours are <span className="italic">Monday to Friday, 9 AM to 6 PM</span>.
          </p>
        </section>
      </main>
    </div>
  );
}

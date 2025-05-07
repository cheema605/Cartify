import React from 'react';

export default function HelpPage() {
  return (
    <main className="pt-24 px-8 max-w-4xl mx-auto font-serif">
      <h1 className="text-4xl font-extrabold mb-6">Help & Support</h1>
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">Getting Started</h2>
        <p>
          Welcome to Cartify! To get started, browse our wide range of products and services. You can add items to your shopping cart, manage your wishlist, and proceed to checkout seamlessly.
        </p>
      </section>
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">Account Management</h2>
        <p>
          Manage your account settings, update your profile, and view your order history in your dashboard. Keep your preferences up to date to get personalized recommendations.
        </p>
      </section>
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">Shopping & Payments</h2>
        <p>
          Add products to your cart and proceed to checkout using our secure payment options. You can save multiple payment methods for faster checkout.
        </p>
      </section>
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">Rentals & Sellers</h2>
        <p>
          If you are interested in renting products or selling your own items, visit the seller dashboard to manage your listings and rental agreements.
        </p>
      </section>
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">Contact Support</h2>
        <p>
          For further assistance, please contact our support team at <a href="mailto:support@cartify.com" className="text-blue-600 underline">support@cartify.com</a> or call us at +123 456 7890. Our support hours are Monday to Friday, 9 AM to 6 PM.
        </p>
      </section>
    </main>
  );
}

import React from 'react';

const sampleReviews = [
  {
    id: 1,
    username: 'Alice',
    rating: 5,
    comment: 'Excellent product! Highly recommend.',
  },
  {
    id: 2,
    username: 'Bob',
    rating: 4,
    comment: 'Very good quality, but shipping was slow.',
  },
  {
    id: 3,
    username: 'Charlie',
    rating: 3,
    comment: 'Average product, meets expectations.',
  },
];

function StarRating({ rating }) {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    stars.push(
      <span key={i} className={i <= rating ? 'text-yellow-400' : 'text-gray-300'}>
        &#9733;
      </span>
    );
  }
  return <div>{stars}</div>;
}

export default function ProductReviews({ params }) {
  const { productId } = params;

  return (
    <main className="pt-24 px-8 max-w-4xl mx-auto font-serif">
      <h1 className="text-4xl font-extrabold mb-6">Reviews for Product {productId}</h1>
      {sampleReviews.length === 0 ? (
        <p>No reviews yet. Be the first to review this product!</p>
      ) : (
        <ul className="space-y-6">
          {sampleReviews.map((review) => (
            <li key={review.id} className="border border-gray-300 rounded-lg p-4 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold">{review.username}</h3>
                <StarRating rating={review.rating} />
              </div>
              <p>{review.comment}</p>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}

'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Image from 'next/image'
import { Check, ShoppingCart, Timer, ChevronLeft, ChevronRight } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

function ReviewsSection({ productId }) {
  const [showReviews, setShowReviews] = useState(false)
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [rating, setRating] = useState(5)
  const [reviewText, setReviewText] = useState('')
  const router = useRouter()

  const toggleReviews = () => {
    setShowReviews(!showReviews)
  }

  useEffect(() => {
    if (showReviews) {
      fetchReviews()
    }
  }, [showReviews])

  const fetchReviews = async () => {
    setLoading(true)
    setError(null)
    try {
      const token = localStorage.getItem('jwt_token')
      const res = await fetch(`http://localhost:5000/api/reviews/get-review/${productId}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      if (res.status === 401) {
        router.push('/login')
        return
      }
      if (!res.ok) {
        console.error('Failed to fetch reviews:', res.statusText)
        throw new Error('Failed to fetch reviews')
      }
      const data = await res.json()
      setReviews(data.reviews)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    try {
      const token = localStorage.getItem('jwt_token')
      const res = await fetch('http://localhost:5000/api/reviews/add-review', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          product_id: productId,
          rating,
          review_text: reviewText,
        }),
      })
      if (res.status === 401) {
        router.push('/login')
        return
      }
      if (!res.ok) {
        throw new Error('Failed to add review')
      }
      setReviewText('')
      setRating(5)
      fetchReviews()
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="mt-8 px-2 md:px-0">
      <button
        onClick={toggleReviews}
        className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition"
      >
        {showReviews ? 'Hide Reviews' : 'See Reviews'}
      </button>
      {showReviews && (
        <>
          <div className="mt-4 space-y-6">
            {loading && <p>Loading reviews...</p>}
            {error && <p className="text-red-600">{error}</p>}
            {!loading && !error && reviews.length === 0 && <p>No reviews yet.</p>}
            {!loading && !error && reviews.map((review) => (
              <div key={review.review_id} className="border rounded-lg p-4 shadow-sm bg-white">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-gray-900">{review.full_name}</span>
                  <div className="flex space-x-1 text-yellow-400">
                    {Array(review.rating).fill(0).map((_, i) => (
                      <svg key={i} className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.185 3.644a1 1 0 00.95.69h3.828c.969 0 1.371 1.24.588 1.81l-3.1 2.254a1 1 0 00-.364 1.118l1.185 3.644c.3.921-.755 1.688-1.54 1.118l-3.1-2.254a1 1 0 00-1.176 0l-3.1 2.254c-.784.57-1.838-.197-1.539-1.118l1.184-3.644a1 1 0 00-.364-1.118L2.37 9.07c-.783-.57-.38-1.81.588-1.81h3.829a1 1 0 00.95-.69l1.184-3.644z" />
                      </svg>
                    ))}
                  </div>
                </div>
                <p className="text-gray-700">{review.review_text}</p>
              </div>
            ))}
          </div>
          <form onSubmit={handleSubmit} className="mt-6 space-y-4 bg-white p-4 rounded shadow">
            <h3 className="text-xl font-semibold">Add Your Review</h3>
            <label className="block">
              Rating:
              <select
                value={rating}
                onChange={(e) => setRating(parseInt(e.target.value))}
                className="ml-2 border rounded px-2 py-1"
              >
                {[5,4,3,2,1].map((r) => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </label>
            <label className="block">
              Review:
              <textarea
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                required
                className="w-full border rounded px-2 py-1 mt-1"
                rows={4}
              />
            </label>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">
              Submit Review
            </Button>
          </form>
        </>
      )}
    </div>
  )
}

function isTokenExpired(token) {
  if (!token) return true;
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const exp = payload.exp;
    if (!exp) return true;
    const now = Math.floor(Date.now() / 1000);
    return now >= exp;
  } catch {
    return true;
  }
}

export default function ProductPage() {
  const [selectedOption, setSelectedOption] = useState('buy')
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [product, setProduct] = useState(null)
  const router = useRouter()
  const searchParams = useSearchParams()
  // const productId = searchParams.get('product_id')
  const productId = searchParams.get('product_id') || 2 // Default to 1 if not found


  useEffect(() => {
    const fetchProduct = async () => {
      const token = localStorage.getItem('jwt_token')
      if (!token || isTokenExpired(token)) {
        router.push('/login')
        return
      }
      try {
        const res = await fetch(`http://localhost:5000/api/products/products?product_id=${productId}`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        if (res.status === 401) {
          router.push('/login')
          return
        }
        if (!res.ok) {
          console.error('Failed to fetch product:', res.statusText)
          return
        }
        const data = await res.json()
        setProduct(data)
      } catch (err) {
        console.error('Error fetching product:', err)
      }
    }
    if (productId) {
      fetchProduct()
    }
  }, [productId, router])

  const handleOptionChange = (value) => {
    setSelectedOption(value)
  }

  const prevImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex === 0 ? (product?.images?.length || 1) - 1 : prevIndex - 1))
  }

  const nextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex === (product?.images?.length || 1) - 1 ? 0 : prevIndex + 1))
  }

  if (!product) {
    return <div>Loading product...</div>
  }

  return (
    <div className="container mx-auto px-4 py-8 md:py-12 bg-white rounded-2xl shadow-lg mt-10 text-gray-700">
      <div className="grid gap-8 md:grid-cols-2">
        {/* Product Image Carousel */}
        <div className="relative aspect-square overflow-hidden rounded-lg bg-muted border-[#c5d6db] flex items-center justify-center">
          <button
            onClick={prevImage}
            className="absolute left-2 z-10 p-2 bg-white bg-opacity-70 rounded-full hover:bg-opacity-100 transition"
            aria-label="Previous Image"
          >
            <ChevronLeft className="h-6 w-6 text-gray-700" />
          </button>
          {product.image_url ? (
            <Image
              src={product.image_url}
              alt={`Product Image`}
              fill
              className="object-cover"
              priority
            />
          ) : (
            <div>No Image</div>
          )}
          <button
            onClick={nextImage}
            className="absolute right-2 z-10 p-2 bg-white bg-opacity-70 rounded-full hover:bg-opacity-100 transition"
            aria-label="Next Image"
          >
            <ChevronRight className="h-6 w-6 text-gray-700" />
          </button>
        </div>

        {/* Product Details */}
        <div className="flex flex-col gap-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">
              {product.name}
            </h1>
          </div>

          {/* Buy or Rent Selection */}
          <Tabs defaultValue="buy" className="w-full" onValueChange={handleOptionChange}>
            <TabsList className="grid w-full grid-cols-2 bg-[#e6eef0]">
              <TabsTrigger value="buy" className="text-base data-[state=active]:bg-[#234C58] data-[state=active]:text-white">
                Buy
              </TabsTrigger>
              <TabsTrigger value="rent" className="text-base data-[state=active]:bg-[#234C58] data-[state=active]:text-white">
                Rent
              </TabsTrigger>
            </TabsList>

            <TabsContent value="buy" className="mt-4">
              <Card>
                <CardContent className="pt-4 md:pt-6 px-4 md:px-6">
                  <div className="flex flex-col gap-4">
                    <div>
                      <span className="text-3xl font-bold text-gray-900">${product.price}</span>
                      <div className="flex items-center space-x-1 mt-2">
                        {Array(Math.round(product.average_rating))
                          .fill(0)
                          .map((_, i) => (
                            <svg
                              key={i}
                              className="w-5 h-5 text-yellow-400"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.185 3.644a1 1 0 00.95.69h3.828c.969 0 1.371 1.24.588 1.81l-3.1 2.254a1 1 0 00-.364 1.118l1.185 3.644c.3.921-.755 1.688-1.54 1.118l-3.1-2.254a1 1 0 00-1.176 0l-3.1 2.254c-.784.57-1.838-.197-1.539-1.118l1.184-3.644a1 1 0 00-.364-1.118L2.37 9.07c-.783-.57-.38-1.81.588-1.81h3.829a1 1 0 00.95-.69l1.184-3.644z" />
                            </svg>
                          ))}
                      </div>
                    </div>
                    <span className="text-sm text-gray-500">One-time payment</span>
                    <Button
                      size="lg"
                      className="mt-2 md:mt-4 w-full md:w-auto bg-gradient-to-r from-blue-600 to-teal-500 text-white font-bold shadow-lg hover:from-blue-700 hover:to-teal-600 transition-all duration-200"
                    >
                      <ShoppingCart className="mr-2 h-5 w-5" />
                      Add to Cart
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="rent" className="mt-4">
              <Card>
                <CardContent className="pt-4 md:pt-6 px-4 md:px-6">
                  <div className="flex flex-col gap-4">
                    <div>
                      <span className="text-3xl font-bold text-gray-900">${(product.price * 0.1).toFixed(2)}</span>
                      <div className="flex items-center space-x-1 mt-2">
                        {Array(Math.round(product.average_rating))
                          .fill(0)
                          .map((_, i) => (
                            <svg
                              key={i}
                              className="w-5 h-5 text-yellow-400"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.185 3.644a1 1 0 00.95.69h3.828c.969 0 1.371 1.24.588 1.81l-3.1 2.254a1 1 0 00-.364 1.118l1.185 3.644c.3.921-.755 1.688-1.54 1.118l-3.1-2.254a1 1 0 00-1.176 0l-3.1 2.254c-.784.57-1.838-.197-1.539-1.118l1.184-3.644a1 1 0 00-.364-1.118L2.37 9.07c-.783-.57-.38-1.81.588-1.81h3.829a1 1 0 00.95-.69l1.184-3.644z" />
                            </svg>
                          ))}
                      </div>
                    </div>
                    <span className="text-sm text-gray-500">per month</span>
                    <Button
                      size="lg"
                      className="mt-2 md:mt-4 w-full md:w-auto border-[#234C58] text-[#1a3a43] hover:bg-[#f5f9fa] hover:text-[#234C58]"
                      variant="outline"
                      disabled={!product.is_rentable}
                    >
                      <Timer className="mr-2 h-5 w-5" />
                      Rent Now
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      {/* Product Description */}
      <div className="mt-2 md:mt-4 px-2 md:px-0">
        <h2 className="text-2xl font-bold text-gray-900">Product Description</h2>
        <div className="mt-4 space-y-4 text-gray-700">
          <p>{product.description}</p>
        </div>
      </div>
      {/* Reviews Section */}
      <ReviewsSection productId={product.product_id} />
    </div>
  )
}

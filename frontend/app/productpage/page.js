'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Check, ShoppingCart, Timer, ChevronLeft, ChevronRight } from 'lucide-react'

// import { Button } from '@components/ui/button'
// import { Card, CardContent } from '@components/ui/card'
// import { Tabs, TabsContent, TabsList, TabsTrigger } from '@components/ui/tabs'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export default function ProductPage() {
  const [selectedOption, setSelectedOption] = useState('buy')
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  const images = [
    "/images/deal1.jpg?height=500&width=500",
    "/images/deal2.jpg?height=500&width=500",
    "/images/deal3.jpg?height=500&width=500"
  ]

  const handleOptionChange = (value) => {
    setSelectedOption(value)
  }

  const prevImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex === 0 ? images.length - 1 : prevIndex - 1))
  }

  const nextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex === images.length - 1 ? 0 : prevIndex + 1))
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
          <Image
            src={images[currentImageIndex]}
            alt={`Product Image ${currentImageIndex + 1}`}
            fill
            className="object-cover"
            priority
          />
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
              Premium Wireless Headphones
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
                      <span className="text-3xl font-bold text-gray-900">$299.99</span>
                      <div className="flex items-center space-x-1 mt-2">
                        {Array(5)
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
                      <span className="text-3xl font-bold text-gray-900">$29.99</span>
                      <div className="flex items-center space-x-1 mt-2">
                        {Array(5)
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
          <p>
            Our Premium Wireless Headphones deliver an exceptional audio experience with deep bass and crystal-clear
            highs. The comfortable over-ear design allows for hours of comfortable listening, while the active noise
            cancellation technology blocks out unwanted background noise.
          </p>
          <p>
            With a battery life of up to 30 hours, you can enjoy your music all day long without worrying about
            recharging. The headphones also feature intuitive touch controls, allowing you to adjust volume, skip
            tracks, and answer calls with a simple tap.
          </p>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="mt-8 px-2 md:px-0">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Reviews</h2>
        <div className="space-y-6">
          {/* Single Review */}
          <div className="border rounded-lg p-4 shadow-sm bg-white">
            <div className="flex items-center justify-between mb-2">
              <span className="font-semibold text-gray-900">John Doe</span>
              <div className="flex space-x-1 text-yellow-400">
                {Array(5)
                  .fill(0)
                  .map((_, i) => (
                    <svg
                      key={i}
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.185 3.644a1 1 0 00.95.69h3.828c.969 0 1.371 1.24.588 1.81l-3.1 2.254a1 1 0 00-.364 1.118l1.185 3.644c.3.921-.755 1.688-1.54 1.118l-3.1-2.254a1 1 0 00-1.176 0l-3.1 2.254c-.784.57-1.838-.197-1.539-1.118l1.184-3.644a1 1 0 00-.364-1.118L2.37 9.07c-.783-.57-.38-1.81.588-1.81h3.829a1 1 0 00.95-.69l1.184-3.644z" />
                    </svg>
                  ))}
              </div>
            </div>
            <p className="text-gray-700">
              These headphones have amazing sound quality and the noise cancellation works perfectly. Highly recommend!
            </p>
          </div>

          {/* Single Review */}
          <div className="border rounded-lg p-4 shadow-sm bg-white">
            <div className="flex items-center justify-between mb-2">
              <span className="font-semibold text-gray-900">Jane Smith</span>
              <div className="flex space-x-1 text-yellow-400">
                {Array(4)
                  .fill(0)
                  .map((_, i) => (
                    <svg
                      key={i}
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.185 3.644a1 1 0 00.95.69h3.828c.969 0 1.371 1.24.588 1.81l-3.1 2.254a1 1 0 00-.364 1.118l1.185 3.644c.3.921-.755 1.688-1.54 1.118l-3.1-2.254a1 1 0 00-1.176 0l-3.1 2.254c-.784.57-1.838-.197-1.539-1.118l1.184-3.644a1 1 0 00-.364-1.118L2.37 9.07c-.783-.57-.38-1.81.588-1.81h3.829a1 1 0 00.95-.69l1.184-3.644z" />
                    </svg>
                  ))}
                <svg
                  className="w-5 h-5 text-gray-300"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.185 3.644a1 1 0 00.95.69h3.828c.969 0 1.371 1.24.588 1.81l-3.1 2.254a1 1 0 00-.364 1.118l1.185 3.644c.3.921-.755 1.688-1.54 1.118l-3.1-2.254a1 1 0 00-1.176 0l-3.1 2.254c-.784.57-1.838-.197-1.539-1.118l1.184-3.644a1 1 0 00-.364-1.118L2.37 9.07c-.783-.57-.38-1.81.588-1.81h3.829a1 1 0 00.95-.69l1.184-3.644z" />
                </svg>
              </div>
            </div>
            <p className="text-gray-700">
              Great headphones but the battery life could be better. Still worth the price.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

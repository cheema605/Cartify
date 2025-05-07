'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Check, ShoppingCart, Timer } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export default function ProductPage() {
  const [selectedOption, setSelectedOption] = useState('buy')

  const handleOptionChange = (value) => {
    setSelectedOption(value)
  }

  return (
    <div className="container mx-auto px-4 py-8 md:py-12 bg-white rounded-2xl shadow-lg mt-28 text-gray-700">
      <div className="grid gap-8 md:grid-cols-2">
        {/* Product Image */}
        <div className="relative aspect-square overflow-hidden rounded-lg bg-muted border-[#c5d6db]">
          <Image
            src="/placeholder.svg?height=600&width=600"
            alt="Product Image"
            fill
            className="object-cover"
            priority
          />
        </div>

        {/* Product Details */}
        <div className="flex flex-col gap-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">Premium Wireless Headphones</h1>
            <p className="mt-2 text-gray-700">
              Experience crystal-clear sound with our premium wireless headphones. Perfect for music lovers and professionals.
            </p>
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
                <CardContent className="pt-6">
                  <div className="flex flex-col gap-4">
                    <div className="flex items-baseline justify-between">
                      <span className="text-3xl font-bold text-gray-900">$299.99</span>
                      <span className="text-sm text-gray-500">One-time payment</span>
                    </div>
                    <ul className="space-y-2">
                      <li className="flex items-center gap-2">
                        <Check className="h-5 w-5 text-[#234C58]" />
                        <span>Lifetime warranty</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="h-5 w-5 text-[#234C58]" />
                        <span>Free shipping</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="h-5 w-5 text-[#234C58]" />
                        <span>30-day money back guarantee</span>
                      </li>
                    </ul>
                    <Button size="lg" className="mt-2 bg-gradient-to-r from-blue-600 to-teal-500 text-white font-bold shadow-lg hover:from-blue-700 hover:to-teal-600 transition-all duration-200">
                      <ShoppingCart className="mr-2 h-5 w-5" />
                      Add to Cart
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="rent" className="mt-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex flex-col gap-4">
                    <div className="flex items-baseline justify-between">
                      <span className="text-3xl font-bold text-gray-900">$29.99</span>
                      <span className="text-sm text-gray-500">per month</span>
                    </div>
                    <ul className="space-y-2">
                      <li className="flex items-center gap-2">
                        <Check className="h-5 w-5 text-[#234C58]" />
                        <span>Free maintenance</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="h-5 w-5 text-[#234C58]" />
                        <span>Swap for newer model after 12 months</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="h-5 w-5 text-[#234C58]" />
                        <span>Cancel anytime (min. 3 months)</span>
                      </li>
                    </ul>
                    <Button
                      size="lg"
                      className="mt-2 border-[#234C58] text-[#1a3a43] hover:bg-[#f5f9fa] hover:text-[#234C58]"
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

          {/* Product Specifications */}
          <div className="mt-4 border-t pt-4">
            <h3 className="text-lg font-medium text-gray-900">Product Specifications</h3>
            <div className="mt-2 grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
              <div className="font-medium">Battery Life</div>
              <div>Up to 30 hours</div>
              <div className="font-medium">Connectivity</div>
              <div>Bluetooth 5.2</div>
              <div className="font-medium">Noise Cancellation</div>
              <div>Active Noise Cancelling</div>
              <div className="font-medium">Water Resistance</div>
              <div>IPX4 Rating</div>
            </div>
          </div>

          {/* Additional Information */}
          <div className="mt-4 rounded-lg bg-muted p-4">
            <p className="text-sm text-gray-700">
              {selectedOption === 'buy'
                ? 'Your purchase includes a 2-year warranty and free technical support.'
                : 'Rental includes damage protection and free replacement if issues occur during the rental period.'}
            </p>
          </div>
        </div>
      </div>

      {/* Product Description */}
      <div className="mt-12">
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
    </div>
  )
}

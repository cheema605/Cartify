'use client'

import { useState, useEffect } from 'react'
import { Button } from '../../../components/ui/button'
import { Input } from '../../../components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../../components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../../../components/ui/dialog'

export default function DiscountsPage() {
  const [products, setProducts] = useState([])
  const [discountsMap, setDiscountsMap] = useState({})
  const [isAddDiscountOpen, setIsAddDiscountOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [discountPercent, setDiscountPercent] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [error, setError] = useState('')
  const [selectedDiscount, setSelectedDiscount] = useState(null)

  // Fetch products for the store
  const fetchProducts = async () => {
    try {
      const token = localStorage.getItem('jwt_token')
      if (!token) return
      const tokenParts = token.split('.')
      if (tokenParts.length !== 3) return
      const payload = JSON.parse(atob(tokenParts[1]))
      const user_id = payload.id
      if (!user_id) return

      const response = await fetch('http://localhost:5000/api/seller/create-store/products', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user_id }),
      })
      if (response.ok) {
        const data = await response.json()
        setProducts(data.products || [])
        // After products fetched, fetch discounts for each product
        data.products.forEach(product => {
          fetchDiscounts(product.product_id)
        })
      }
    } catch (err) {
      console.error('Error fetching products:', err)
    }
  }

  // Fetch discounts for a product and update discountsMap
  const fetchDiscounts = async (product_id) => {
    try {
      const response = await fetch(`http://localhost:5000/api/discounts/get-discount/${product_id}`)
      if (response.ok) {
        const data = await response.json()
        setDiscountsMap(prev => ({ ...prev, [product_id]: data }))
      } else if (response.status === 404) {
        // No discounts found for this product
        setDiscountsMap(prev => ({ ...prev, [product_id]: [] }))
      }
    } catch (err) {
      console.error('Error fetching discounts:', err)
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  const openAddDiscountDialog = (product) => {
    setSelectedProduct(product)
    setDiscountPercent('')
    setStartDate('')
    setEndDate('')
    setError('')
    setSelectedDiscount(null)
    setIsAddDiscountOpen(true)
  }

  const openEditDiscountDialog = (product, discount) => {
    setSelectedProduct(product)
    setDiscountPercent(discount.discount_percent.toString())
    setStartDate(discount.start_date || '')
    setEndDate(discount.end_date || '')
    setError('')
    setSelectedDiscount(discount)
    setIsAddDiscountOpen(true)
  }

  const handleAddDiscount = async () => {
    if (!discountPercent || isNaN(discountPercent) || discountPercent <= 0) {
      setError('Please enter a valid discount percent')
      return
    }
    try {
      const token = localStorage.getItem('jwt_token')
      if (!token) {
        setError('Please log in to add/edit discounts')
        return
      }

      const endpoint = selectedDiscount 
        ? 'http://localhost:5000/api/discounts/edit-discount' 
        : 'http://localhost:5000/api/discounts/add-discount'

      const body = {
        product_id: selectedProduct.product_id,
        discount_percent: parseInt(discountPercent),
        start_date: startDate || null,
        end_date: endDate || null,
      }

      if (selectedDiscount) {
        body.discount_id = selectedDiscount.discount_id
      }

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      })

      if (response.ok) {
        // Refresh discounts for the product
        await fetchDiscounts(selectedProduct.product_id)
        setIsAddDiscountOpen(false)
        setSelectedDiscount(null)
        setDiscountPercent('')
        setStartDate('')
        setEndDate('')
        setError('')
      } else {
        const data = await response.json()
        setError(data.message || 'Failed to add/edit discount')
      }
    } catch (err) {
      setError('Error adding/editing discount')
      console.error('Error adding/editing discount:', err)
    }
  }

  const handleRemoveDiscount = async (discount_id, product_id) => {
    if (!confirm('Are you sure you want to remove this discount?')) return
    try {
      const token = localStorage.getItem('jwt_token')
      if (!token) {
        alert('Please log in to remove discounts')
        return
      }
      const response = await fetch('http://localhost:5000/api/discounts/remove-discount', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ discount_id }),
      })
      if (response.ok) {
        // Refresh discounts for the product
        await fetchDiscounts(product_id)
      } else {
        const data = await response.json()
        alert(data.message || 'Failed to remove discount')
      }
    } catch (err) {
      alert('Failed to remove discount')
      console.error('Error removing discount:', err)
    }
  }

  return (
    <div className="space-y-6 pt-24">
      <h1 className="text-3xl font-bold text-black">Discounts</h1>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-gray-500">Product Name</TableHead>
            <TableHead className="text-gray-500">Discount Percent</TableHead>
            <TableHead className="text-gray-500">Start Date</TableHead>
            <TableHead className="text-gray-500">End Date</TableHead>
            <TableHead className="text-gray-500">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map(product => {
            const discounts = discountsMap[product.product_id] || []
            return discounts.length > 0 ? discounts.map(discount => (
              <TableRow key={discount.discount_id}>
                <TableCell className="text-black">{product.name}</TableCell>
                <TableCell className="text-black">{discount.discount_percent}%</TableCell>
                <TableCell className="text-black">{discount.start_date || 'N/A'}</TableCell>
                <TableCell className="text-black">{discount.end_date || 'N/A'}</TableCell>
                <TableCell className="flex gap-2">
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleRemoveDiscount(discount.discount_id, product.product_id)}
                    className="bg-black text-white hover:bg-black/90"
                  >
                    Remove
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => openEditDiscountDialog(product, discount)}
                    className="bg-black text-white hover:bg-black/90"
                  >
                    Edit 
                  </Button>
                </TableCell>
              </TableRow>
            )) : (
              <TableRow key={product.product_id}>
                <TableCell className="text-black">{product.name}</TableCell>
                <TableCell className="text-black" colSpan={3}>No discounts</TableCell>
                <TableCell>
                  <Button size="sm" onClick={() => openAddDiscountDialog(product)} className="bg-black text-white hover:bg-black/90">Add Discount</Button>
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>

      <Dialog open={isAddDiscountOpen} onOpenChange={setIsAddDiscountOpen}>
        <DialogContent className="bg-white max-w-md text-black">
          <DialogHeader>
            <DialogTitle className="text-black">{selectedDiscount ? 'Edit Discount' : 'Add Discount'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {error && (
              <div className="p-3 bg-red-100 text-red-700 rounded-lg text-sm">
                {error}
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-black mb-1">Discount Percent (%) *</label>
              <Input
                type="number"
                value={discountPercent}
                onChange={e => setDiscountPercent(e.target.value)}
                min={1}
                max={100}
                required
                className="bg-white text-black"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-black mb-1">Start Date</label>
              <Input
                type="date"
                value={startDate}
                onChange={e => setStartDate(e.target.value)}
                className="bg-white text-black"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-black mb-1">End Date</label>
              <Input
                type="date"
                value={endDate}
                onChange={e => setEndDate(e.target.value)}
                className="bg-white text-black"
              />
            </div>
            <Button className="w-full bg-blue-500 text-white hover:bg-blue-600" onClick={handleAddDiscount}>
              {selectedDiscount ? 'Edit Discount' : 'Add Discount'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

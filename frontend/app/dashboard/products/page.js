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
import { Plus, Search, Upload } from 'lucide-react'

export default function ProductsPage() {
  const [isAddProductOpen, setIsAddProductOpen] = useState(false)
  const [isEditProductOpen, setIsEditProductOpen] = useState(false)
  const [isFilterDialogOpen, setIsFilterDialogOpen] = useState(false)
  const [filter, setFilter] = useState({ name: '', category: '' })
  const [products, setProducts] = useState([])
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [productImage, setProductImage] = useState([])
  const [error, setError] = useState('')
  const [productForm, setProductForm] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    category: '',
    status: 'active',
    is_sellable: true,
    is_rentable: false,
    rent: '',
    discount_percent: '',
  })
  const [categories, setCategories] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [discountsMap, setDiscountsMap] = useState({})
  const [isDiscountDialogOpen, setIsDiscountDialogOpen] = useState(false)
  const [discountProduct, setDiscountProduct] = useState(null)
  const [discountPercentInput, setDiscountPercentInput] = useState('')
  const [discountStartDateInput, setDiscountStartDateInput] = useState('')
  const [discountEndDateInput, setDiscountEndDateInput] = useState('')
  const [imagesToDelete, setImagesToDelete] = useState([])

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

  // Helper to get the active discount percent for a product (if any)
  const getActiveDiscountPercent = (product_id) => {
    const discounts = discountsMap[product_id] || []
    const now = new Date()
    for (const discount of discounts) {
      if (discount.start_date && discount.end_date) {
        const start = new Date(discount.start_date)
        const end = new Date(discount.end_date)
        if (now >= start && now <= end) {
          return discount.discount_percent
        }
      } else {
        // If no start/end date, consider discount active
        return discount.discount_percent
      }
    }
    return 0
  }

  // Helper to calculate discounted price
  const getDiscountedPrice = (product) => {
    const discountPercent = getActiveDiscountPercent(product.product_id)
    if (discountPercent > 0 && product.price) {
      return (product.price * (100 - discountPercent)) / 100
    }
    return product.price
  }

  // Extract fetchProducts outside useEffect for reuse
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
        // Fetch discounts for each product
        data.products.forEach(product => {
          fetchDiscounts(product.product_id)
        })
      }
    } catch (err) {
      console.error('Error fetching products:', err)
    }
  }

  useEffect(() => {
    // Fetch categories from backend
    const fetchCategories = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/categories/categories')
        if (response.ok) {
          const data = await response.json()
          setCategories(data.categories || [])
        }
      } catch (err) {
        console.error('Error fetching categories:', err)
      }
    }
    fetchCategories()

    fetchProducts()
  }, [])

  const handleFilterChange = (e) => {
    const { name, value } = e.target
    setFilter((prev) => ({ ...prev, [name]: value }))
  }

  // Filtering products based on search term and filter inputs
  const filteredProducts = products.filter(product => {
    const matchesName = product.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = filter.category ? product.category_name?.toLowerCase().includes(filter.category.toLowerCase()) || product.category?.toLowerCase().includes(filter.category.toLowerCase()) : true
    return matchesName && matchesCategory
  })

  // Separate products into sellable, rentable, and both categories
  const sellableProducts = filteredProducts.filter(p => p.is_sellable && !p.is_rentable)
  const rentableProducts = filteredProducts.filter(p => p.is_rentable && !p.is_sellable)
  const bothProducts = filteredProducts.filter(p => p.is_sellable && p.is_rentable)

  const handleEditClick = (product) => {
    setSelectedProduct(product)
    setIsEditProductOpen(true)
  }

  const handleSaveChanges = async () => {
    if (!selectedProduct) return

    if (selectedProduct.is_rentable && (!selectedProduct.rent || selectedProduct.rent === '')) {
      alert('Rent is required for rentable products.')
      return
    }

    try {
      const token = localStorage.getItem('jwt_token')
      if (!token) {
        alert('Please log in to edit products')
        return
      }

      const formData = new FormData()
      formData.append('name', selectedProduct.name)
      formData.append('description', selectedProduct.description || '')
      if (selectedProduct.is_sellable) formData.append('price', parseFloat(selectedProduct.price) || 0)
      formData.append('quantity', parseInt(selectedProduct.stock) || 0)
      formData.append('category', selectedProduct.category_name || selectedProduct.category || '')
      formData.append('status', selectedProduct.status || 'active')
      formData.append('is_sellable', selectedProduct.is_sellable)
      formData.append('is_rentable', selectedProduct.is_rentable)
      if (selectedProduct.is_rentable) formData.append('rent', parseFloat(selectedProduct.rent) || 0)
      if (selectedProduct.newImage) {
        formData.append('images', selectedProduct.newImage)
      }
      formData.append('imagesToDelete', JSON.stringify(imagesToDelete))

      const response = await fetch(`http://localhost:5000/api/seller/edit-product/${selectedProduct.product_id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      })

      if (response.ok) {
        await fetchProducts()
        setIsEditProductOpen(false)
        alert('Product updated successfully!')
      } else {
        const data = await response.json()
        alert(data.message || 'Failed to update product')
      }
    } catch (error) {
      console.error('Error updating product:', error)
      alert('Failed to update product')
    }
  }

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files)
    setProductImage(files)
  }

  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target
    setProductForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleAddProduct = async () => {
    setError('')

    if (!productForm.name.trim()) {
      setError('Product name is required')
      return
    }
    if (!productForm.stock) {
      setError('Stock quantity is required')
      return
    }
    if (!productForm.category.trim()) {
      setError('Category is required')
      return
    }
    if (!productImage.length) {
      setError('Product image is required')
      return
    }
    if (!productForm.is_sellable && !productForm.is_rentable) {
      setError('Product must be either sellable, rentable, or both.')
      return
    }
    if (productForm.is_sellable && !productForm.price) {
      setError('Price is required for sellable products.')
      return
    }
    if (productForm.is_rentable && !productForm.rent) {
      setError('Rent is required for rentable products.')
      return
    }

    try {
      const token = localStorage.getItem('jwt_token')
      if (!token) {
        setError('Please log in to add products')
        return
      }

      const tokenParts = token.split('.')
      if (tokenParts.length !== 3) {
        setError('Invalid token format')
        return
      }

      const payload = JSON.parse(atob(tokenParts[1]))
      const user_id = payload.id

      if (!user_id) {
        setError('User ID not found in token')
        return
      }

      const formData = new FormData()
      formData.append('user_id', user_id)
      formData.append('name', productForm.name.trim())
      formData.append('description', productForm.description.trim())
      if (productForm.is_sellable) formData.append('price', parseFloat(productForm.price) || 0)
      formData.append('quantity', productForm.stock)
      formData.append('category', productForm.category)
      formData.append('status', productForm.status)
      formData.append('is_sellable', productForm.is_sellable)
      formData.append('is_rentable', productForm.is_rentable)
      if (productForm.is_rentable) formData.append('rent', parseFloat(productForm.rent) || 0)
      productImage.forEach(img => formData.append('images', img))

      const response = await fetch('http://localhost:5000/api/seller/create-product', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData,
      })

      if (response.ok) {
        const data = await response.json()
        setProducts(prev => [...prev, {
          product_id: data.product_id,
          name: productForm.name,
          price: parseFloat(productForm.price),
          stock: parseInt(productForm.stock),
          category: productForm.category,
          status: 'In Stock'
        }])
        setProductForm({
          name: '',
          description: '',
          price: '',
          stock: '',
          category: '',
          status: 'active',
          is_sellable: true,
          is_rentable: false,
          rent: '',
          discount_percent: '',
        })
        setProductImage([])
        setIsAddProductOpen(false)
      } else {
        const errorData = await response.json()
        setError(errorData.message || 'Failed to add product')
      }
    } catch (error) {
      setError('Error adding product. Please try again.')
      console.error('Error adding product:', error)
    }
  }

  // Handler for deleting a product
  const handleDeleteProduct = async (product_id) => {
    if (!confirm('Are you sure you want to delete this product?')) return
    try {
      const token = localStorage.getItem('jwt_token')
      if (!token) {
        alert('Please log in to delete products')
        return
      }
      const response = await fetch(`http://localhost:5000/api/seller/delete-product/${product_id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      if (response.ok) {
        setProducts(prev => prev.filter(p => p.product_id !== product_id))
      } else {
        const data = await response.json()
        alert(data.message || 'Failed to delete product.')
      }
    } catch (err) {
      alert('Failed to delete product.')
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-black">Products</h1>
        <Dialog open={isAddProductOpen} onOpenChange={setIsAddProductOpen}>
          <DialogTrigger asChild>
            <Button className="bg-black text-white hover:bg-black/90">Add Product</Button>
          </DialogTrigger>
          <DialogContent
            className="bg-white w-full max-w-lg max-h-screen overflow-y-auto"
            style={{ maxHeight: '100vh', overflowY: 'auto' }}
          >
            <DialogHeader>
              <DialogTitle className="text-black">Add New Product</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              {error && (
                <div className="p-3 bg-red-100 text-red-700 rounded-lg text-sm">
                  {error}
                </div>
              )}
              <div className="space-y-2">
                <label className="text-sm font-medium text-black">Product Name *</label>
                <Input
                  name="name"
                  value={productForm.name}
                  onChange={handleFormChange}
                  placeholder="Enter product name"
                  className="bg-gray-100 text-black focus:outline-none focus:ring-1 focus:ring-gray-200 focus:border-gray-200"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-black">Description</label>
                <Input
                  name="description"
                  value={productForm.description}
                  onChange={handleFormChange}
                  placeholder="Enter product description"
                  className="bg-gray-100 text-black focus:outline-none focus:ring-1 focus:ring-gray-200 focus:border-gray-200"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-black">Is Sellable *</label>
                <select
                  name="is_sellable"
                  value={productForm.is_sellable ? 'true' : 'false'}
                  onChange={e => setProductForm(prev => ({ ...prev, is_sellable: e.target.value === 'true' }))}
                  className="bg-gray-100 text-black w-full p-2 rounded focus:outline-none focus:ring-1 focus:ring-gray-200 focus:border-gray-200"
                  required
                >
                  <option value="true">Yes</option>
                  <option value="false">No</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-black">Is Rentable *</label>
                <select
                  name="is_rentable"
                  value={productForm.is_rentable ? 'true' : 'false'}
                  onChange={e => setProductForm(prev => ({ ...prev, is_rentable: e.target.value === 'true' }))}
                  className="bg-gray-100 text-black w-full p-2 rounded focus:outline-none focus:ring-1 focus:ring-gray-200 focus:border-gray-200"
                  required
                >
                  <option value="true">Yes</option>
                  <option value="false">No</option>
                </select>
              </div>
              {productForm.is_sellable && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-black">Price *</label>
                  <Input
                    name="price"
                    value={productForm.price}
                    onChange={handleFormChange}
                    type="number"
                    placeholder="0.00"
                    className="bg-gray-100 text-black focus:outline-none focus:ring-1 focus:ring-gray-200 focus:border-gray-200"
                    required={productForm.is_sellable}
                  />
                </div>
              )}
              {productForm.is_rentable && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-black">Rent *</label>
                  <Input
                    name="rent"
                    value={productForm.rent}
                    onChange={handleFormChange}
                    type="number"
                    placeholder="0.00"
                    className="bg-gray-100 text-black focus:outline-none focus:ring-1 focus:ring-gray-200 focus:border-gray-200"
                    required={productForm.is_rentable}
                  />
                </div>
              )}
              <div className="space-y-2">
                <label className="text-sm font-medium text-black">Stock *</label>
                <Input
                  name="stock"
                  value={productForm.stock}
                  onChange={handleFormChange}
                  type="number"
                  placeholder="0"
                  className="bg-gray-100 text-black focus:outline-none focus:ring-1 focus:ring-gray-200 focus:border-gray-200"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-black">Category *</label>
                <select
                  name="category"
                  value={productForm.category}
                  onChange={handleFormChange}
                  className="bg-gray-100 text-black w-full p-2 rounded focus:outline-none focus:ring-1 focus:ring-gray-200 focus:border-gray-200"
                  required
                >
                  <option value="">Select category</option>
                  {categories.map((cat) => (
                    <option key={cat.category_id} value={cat.category_name}>{cat.category_name}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-black">Status *</label>
                <select
                  name="status"
                  value={productForm.status}
                  onChange={handleFormChange}
                  className="bg-gray-100 text-black w-full p-2 rounded focus:outline-none focus:ring-1 focus:ring-gray-200 focus:border-gray-200"
                  required
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-black">Product Image *</label>
                <div className="flex items-center gap-2">
                  <Input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageChange}
                    className="bg-gray-100 text-black focus:outline-none focus:ring-1 focus:ring-gray-200 focus:border-gray-200"
                    required
                  />
                  {productImage.length > 0 && (
                    <span className="text-sm text-gray-500">{productImage.map(img => img.name).join(', ')}</span>
                  )}
                </div>
              </div>
              <Button
                className="w-full bg-black text-white hover:bg-black/90"
                onClick={handleAddProduct}
              >
                Add Product
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Edit Dialog */}
        <Dialog open={isEditProductOpen} onOpenChange={setIsEditProductOpen}>
          <DialogContent className="bg-white max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-black">Edit Product</DialogTitle>
            </DialogHeader>
            {selectedProduct && (
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-black">Product Name</label>
                  <Input
                    value={selectedProduct.name}
                    onChange={(e) => setSelectedProduct((prev) => ({ ...prev, name: e.target.value }))}
                    className="bg-gray-100 text-black"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-black">Description</label>
                  <textarea
                    value={selectedProduct.description || ''}
                    onChange={e => setSelectedProduct(prev => ({ ...prev, description: e.target.value }))}
                    className="bg-gray-100 text-black w-full p-2 rounded focus:outline-none focus:ring-1 focus:ring-gray-200 focus:border-gray-200"
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-black">Product Image</label>
                  {selectedProduct.images && selectedProduct.images.length > 0 && (
                    <div className="flex gap-2 mb-2 flex-wrap">
                      {selectedProduct.images.filter(img => !imagesToDelete.includes(img)).map((img, idx) => (
                        <div key={idx} className="relative group">
                          <img src={img} alt={`Current ${idx + 1}`} className="h-24 w-24 object-cover rounded" />
                          <button
                            type="button"
                            className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 text-xs opacity-80 group-hover:opacity-100"
                            onClick={() => {
                              setImagesToDelete(prev => [...prev, img])
                              setSelectedProduct(prev => ({
                                ...prev,
                                images: prev.images.filter(i => i !== img)
                              }))
                            }}
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={e => {
                      const file = e.target.files[0]
                      if (file) setSelectedProduct(prev => ({ ...prev, newImage: file }))
                    }}
                    className="bg-gray-100 text-black"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-black">Is Sellable *</label>
                  <select
                    name="is_sellable"
                    value={selectedProduct.is_sellable ? 'true' : 'false'}
                    onChange={e => setSelectedProduct(prev => ({ ...prev, is_sellable: e.target.value === 'true' }))}
                    className="bg-gray-100 text-black w-full p-2 rounded focus:outline-none focus:ring-1 focus:ring-gray-200 focus:border-gray-200"
                    required
                  >
                    <option value="true">Yes</option>
                    <option value="false">No</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-black">Is Rentable *</label>
                  <select
                    name="is_rentable"
                    value={selectedProduct.is_rentable ? 'true' : 'false'}
                    onChange={e => setSelectedProduct(prev => ({ ...prev, is_rentable: e.target.value === 'true' }))}
                    className="bg-gray-100 text-black w-full p-2 rounded focus:outline-none focus:ring-1 focus:ring-gray-200 focus:border-gray-200"
                    required
                  >
                    <option value="true">Yes</option>
                    <option value="false">No</option>
                  </select>
                </div>
                {selectedProduct.is_sellable && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-black">Price *</label>
                    <Input
                      type="number"
                      value={selectedProduct.price}
                      onChange={(e) => setSelectedProduct((prev) => ({ ...prev, price: e.target.value }))}
                      className="bg-gray-100 text-black"
                    />
                  </div>
                )}
                {selectedProduct.is_rentable && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-black">Rent *</label>
                    <Input
                      type="number"
                      value={selectedProduct.rent}
                      onChange={(e) => setSelectedProduct((prev) => ({ ...prev, rent: e.target.value }))}
                      className="bg-gray-100 text-black"
                    />
                  </div>
                )}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-black">Stock</label>
                  <Input
                    type="number"
                    value={selectedProduct.stock || selectedProduct.quantity || ''}
                    onChange={e => setSelectedProduct(prev => ({
                      ...prev,
                      stock: e.target.value,
                      quantity: e.target.value
                    }))}
                    className="bg-gray-100 text-black"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-black">Category</label>
                  <select
                    value={selectedProduct.category || selectedProduct.category_name || ''}
                    onChange={(e) => setSelectedProduct((prev) => ({ ...prev, category: e.target.value }))}
                    className="bg-gray-100 text-black w-full p-2 rounded focus:outline-none focus:ring-1 focus:ring-gray-200 focus:border-gray-200"
                  >
                    <option value="">Select category</option>
                    {categories.map((cat) => (
                      <option key={cat.category_id} value={cat.category_name}>{cat.category_name}</option>
                    ))}
                  </select>
                </div>
                <Button className="w-full bg-black text-white hover:bg-black/90" onClick={handleSaveChanges}>
                  Save Changes
                </Button>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Filter Dialog */}
        <Dialog open={isFilterDialogOpen} onOpenChange={setIsFilterDialogOpen}>
          <DialogContent className="bg-white">
            <DialogHeader>
              <DialogTitle className="text-black">Filter Products</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-black">Name</label>
                <Input
                  name="name"
                  value={filter.name}
                  onChange={handleFilterChange}
                  placeholder="Search by name"
                  className="bg-gray-100 text-black"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-black">Category</label>
                <Input
                  name="category"
                  value={filter.category}
                  onChange={handleFilterChange}
                  placeholder="Search by category"
                  className="bg-gray-100 text-black"
                />
              </div>
              <Button
                className="w-full bg-black text-white hover:bg-gray-900"
                onClick={() => setIsFilterDialogOpen(false)}
              >
                Apply Filters
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search & Filter */}
      <div className="flex items-center space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search products..."
            className="pl-8 bg-white text-black"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
        <Button className="bg-black text-white hover:bg-gray-900" onClick={() => setIsFilterDialogOpen(true)}>
          Filter
        </Button>
      </div>

      {/* Sellable Products Section */}
      <h2 className="text-2xl font-bold text-black mt-8">Sellable Products</h2>
      <div className="rounded-md border bg-white mb-8">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-gray-500">Name</TableHead>
              <TableHead className="text-gray-500">Price</TableHead>
              <TableHead className="text-gray-500">Discounted Price</TableHead>
              <TableHead className="text-gray-500">Stock</TableHead>
              <TableHead className="text-gray-500">Category</TableHead>
              <TableHead className="text-gray-500">Status</TableHead>
              <TableHead className="text-gray-500">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sellableProducts.map((product) => (
              <TableRow key={product.product_id}>
                <TableCell className="text-black">{product.name}</TableCell>
                <TableCell className="text-black">PKR {product.price}</TableCell>
                <TableCell className="text-black">{getActiveDiscountPercent(product.product_id) > 0 ? `PKR ${getDiscountedPrice(product)}` : 'N/A'}</TableCell>
                <TableCell className="text-black">{product.quantity ?? product.stock ?? 'N/A'}</TableCell>
                <TableCell className="text-black">{product.category_name ?? product.category ?? 'N/A'}</TableCell>
                <TableCell>
                  <span className={`rounded-full px-3 py-1 text-xs font-medium ${product.status === 'In Stock' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>{product.status}</span>
                </TableCell>
                <TableCell className="px-4 py-2 whitespace-nowrap flex gap-2">
                  <Button size="sm" className="bg-black text-white hover:bg-gray-800" onClick={() => handleEditClick(product)}>Edit</Button>
                  <Button size="sm" className="bg-red-600 text-white hover:bg-red-700" onClick={() => handleDeleteProduct(product.product_id)}>Delete</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Rentable Products Section */}
      <h2 className="text-2xl font-bold text-black mt-8">Rentable Products</h2>
      <div className="rounded-md border bg-white mb-8">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-gray-500">Name</TableHead>
              <TableHead className="text-gray-500">Rent</TableHead>
              <TableHead className="text-gray-500">Stock</TableHead>
              <TableHead className="text-gray-500">Category</TableHead>
              <TableHead className="text-gray-500">Status</TableHead>
              <TableHead className="text-gray-500">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rentableProducts.map((product) => (
              <TableRow key={product.product_id}>
                <TableCell className="text-black">{product.name}</TableCell>
                <TableCell className="text-black">PKR {product.rent}</TableCell>
                <TableCell className="text-black">{product.quantity ?? product.stock ?? 'N/A'}</TableCell>
                <TableCell className="text-black">{product.category_name ?? product.category ?? 'N/A'}</TableCell>
                <TableCell>
                  <span className={`rounded-full px-3 py-1 text-xs font-medium ${product.status === 'In Stock' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>{product.status}</span>
                </TableCell>
                <TableCell className="px-4 py-2 whitespace-nowrap flex gap-2">
                  <Button size="sm" className="bg-black text-white hover:bg-gray-800" onClick={() => handleEditClick(product)}>Edit</Button>
                  <Button size="sm" className="bg-red-600 text-white hover:bg-red-700" onClick={() => handleDeleteProduct(product.product_id)}>Delete</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Both Sellable & Rentable Products Section */}
      <h2 className="text-2xl font-bold text-black mt-8">Sellable & Rentable Products</h2>
      <div className="rounded-md border bg-white mb-8">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-gray-500">Name</TableHead>
              <TableHead className="text-gray-500">Price</TableHead>
              <TableHead className="text-gray-500">Rent</TableHead>
              <TableHead className="text-gray-500">Stock</TableHead>
              <TableHead className="text-gray-500">Category</TableHead>
              <TableHead className="text-gray-500">Status</TableHead>
              <TableHead className="text-gray-500">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {bothProducts.map((product) => (
              <TableRow key={product.product_id}>
                <TableCell className="text-black">{product.name}</TableCell>
                <TableCell className="text-black">PKR {product.price}</TableCell>
                <TableCell className="text-black">PKR {product.rent}</TableCell>
                <TableCell className="text-black">{product.quantity ?? product.stock ?? 'N/A'}</TableCell>
                <TableCell className="text-black">{product.category_name ?? product.category ?? 'N/A'}</TableCell>
                <TableCell>
                  <span className={`rounded-full px-3 py-1 text-xs font-medium ${product.status === 'In Stock' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>{product.status}</span>
                </TableCell>
                <TableCell className="px-4 py-2 whitespace-nowrap flex gap-2">
                  <Button size="sm" className="bg-black text-white hover:bg-gray-800" onClick={() => handleEditClick(product)}>Edit</Button>
                  <Button size="sm" className="bg-red-600 text-white hover:bg-red-700" onClick={() => handleDeleteProduct(product.product_id)}>Delete</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

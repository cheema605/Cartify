'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Plus, Search, Upload } from 'lucide-react'

const productsData = [
  {
    id: 1,
    name: 'Basic T-Shirt',
    price: 19.99,
    stock: 150,
    category: 'Clothing',
    status: 'In Stock',
  },
  {
    id: 2,
    name: 'Leather Wallet',
    price: 49.99,
    stock: 30,
    category: 'Accessories',
    status: 'Low Stock',
  },
  {
    id: 3,
    name: 'Running Shoes',
    price: 89.99,
    stock: 75,
    category: 'Footwear',
    status: 'In Stock',
  },
]

export default function ProductsPage() {
  const [isAddProductOpen, setIsAddProductOpen] = useState(false)
  const [isEditProductOpen, setIsEditProductOpen] = useState(false)
  const [isFilterDialogOpen, setIsFilterDialogOpen] = useState(false)
  const [filter, setFilter] = useState({ name: '', category: '' })
  const [products, setProducts] = useState(productsData)
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [productImage, setProductImage] = useState(null)
  const [productForm, setProductForm] = useState({
    name: '',
    price: '',
    stock: '',
    category: '',
  })

  const handleFilterChange = (e) => {
    const { name, value } = e.target
    setFilter((prev) => ({ ...prev, [name]: value }))
  }

  const filteredProducts = products.filter((product) => {
    return (
      product.name.toLowerCase().includes(filter.name.toLowerCase()) &&
      product.category.toLowerCase().includes(filter.category.toLowerCase())
    )
  })

  const handleEditClick = (product) => {
    setSelectedProduct(product)
    setIsEditProductOpen(true)
  }

  const handleSaveChanges = () => {
    setProducts((prev) =>
      prev.map((p) => (p.id === selectedProduct.id ? selectedProduct : p))
    )
    setIsEditProductOpen(false)
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setProductImage(file)
    }
  }

  const handleFormChange = (e) => {
    const { name, value } = e.target
    setProductForm(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleAddProduct = async () => {
    const formData = new FormData()
    formData.append('name', productForm.name)
    formData.append('price', productForm.price)
    formData.append('quantity', productForm.stock)
    formData.append('category', productForm.category)
    if (productImage) {
      formData.append('images', productImage)
    }

    try {
      const response = await fetch('/api/seller/create-product', {
        method: 'POST',
        body: formData,
      })

      if (response.ok) {
        const data = await response.json()
        // Add the new product to the list
        setProducts(prev => [...prev, {
          id: data.product_id,
          name: productForm.name,
          price: parseFloat(productForm.price),
          stock: parseInt(productForm.stock),
          category: productForm.category,
          status: 'In Stock'
        }])
        // Reset form and close dialog
        setProductForm({
          name: '',
          price: '',
          stock: '',
          category: '',
        })
        setProductImage(null)
        setIsAddProductOpen(false)
      } else {
        console.error('Failed to add product')
      }
    } catch (error) {
      console.error('Error adding product:', error)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-black">Products</h1>
        <Dialog open={isAddProductOpen} onOpenChange={setIsAddProductOpen}>
          <DialogTrigger asChild>
            <Button className="bg-black text-white hover:bg-black/90">
              <Plus className="mr-2 h-4 w-4" />
              Add Product
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-white">
            <DialogHeader>
              <DialogTitle className="text-black">Add New Product</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-black">Product Name</label>
                <Input 
                  name="name"
                  value={productForm.name}
                  onChange={handleFormChange}
                  placeholder="Enter product name" 
                  className="bg-gray-100 text-black focus:outline-none focus:ring-1 focus:ring-gray-200 focus:border-gray-200" 
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-black">Price</label>
                <Input 
                  name="price"
                  value={productForm.price}
                  onChange={handleFormChange}
                  type="number" 
                  placeholder="0.00" 
                  className="bg-gray-100 text-black focus:outline-none focus:ring-1 focus:ring-gray-200 focus:border-gray-200" 
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-black">Stock</label>
                <Input 
                  name="stock"
                  value={productForm.stock}
                  onChange={handleFormChange}
                  type="number" 
                  placeholder="0" 
                  className="bg-gray-100 text-black focus:outline-none focus:ring-1 focus:ring-gray-200 focus:border-gray-200" 
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-black">Category</label>
                <Input 
                  name="category"
                  value={productForm.category}
                  onChange={handleFormChange}
                  placeholder="Enter category" 
                  className="bg-gray-100 text-black focus:outline-none focus:ring-1 focus:ring-gray-200 focus:border-gray-200" 
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-black">Product Image</label>
                <div className="flex items-center gap-2">
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="bg-gray-100 text-black focus:outline-none focus:ring-1 focus:ring-gray-200 focus:border-gray-200"
                  />
                  {productImage && (
                    <span className="text-sm text-gray-500">{productImage.name}</span>
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
          <DialogContent className="bg-white">
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
                  <label className="text-sm font-medium text-black">Price</label>
                  <Input
                    type="number"
                    value={selectedProduct.price}
                    onChange={(e) => setSelectedProduct((prev) => ({ ...prev, price: parseFloat(e.target.value) }))}
                    className="bg-gray-100 text-black"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-black">Stock</label>
                  <Input
                    type="number"
                    value={selectedProduct.stock}
                    onChange={(e) => setSelectedProduct((prev) => ({ ...prev, stock: parseInt(e.target.value) }))}
                    className="bg-gray-100 text-black"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-black">Category</label>
                  <Input
                    value={selectedProduct.category}
                    onChange={(e) => setSelectedProduct((prev) => ({ ...prev, category: e.target.value }))}
                    className="bg-gray-100 text-black"
                  />
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
              <Button className="w-full bg-black text-white hover:bg-black/90" onClick={() => setIsFilterDialogOpen(false)}>
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
          <Input placeholder="Search products..." className="pl-8 bg-white text-black" />
        </div>
        <Button variant="outline" onClick={() => setIsFilterDialogOpen(true)}>
          Filter
        </Button>
      </div>

      {/* Product Table */}
      <div className="rounded-md border bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-gray-500">Name</TableHead>
              <TableHead className="text-gray-500">Price</TableHead>
              <TableHead className="text-gray-500">Stock</TableHead>
              <TableHead className="text-gray-500">Category</TableHead>
              <TableHead className="text-gray-500">Status</TableHead>
              <TableHead className="text-gray-500">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProducts.map((product) => (
              <TableRow key={product.id}>
                <TableCell className="text-black">{product.name}</TableCell>
                <TableCell className="text-black">${product.price}</TableCell>
                <TableCell className="text-black">{product.stock}</TableCell>
                <TableCell className="text-black">{product.category}</TableCell>
                <TableCell>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-medium ${
                      product.status === 'In Stock'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}
                  >
                    {product.status}
                  </span>
                </TableCell>
                <TableCell>
                  <Button variant="outline" size="sm" onClick={() => handleEditClick(product)}>
                    Edit
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

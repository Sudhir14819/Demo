export interface Product {
  id: string
  name: string
  description: string
  price: number
  image: string
  category: string
  stock: number
  featured?: boolean
}

export interface CartItem extends Product {
  quantity: number
}

export const products: Product[] = [
  {
    id: "1",
    name: "Wireless Headphones",
    description: "Premium wireless headphones with noise cancellation",
    price: 199.99,
    image: "/wireless-headphones.png",
    category: "Electronics",
    stock: 50,
    featured: true,
  },
  {
    id: "2",
    name: "Smart Watch",
    description: "Advanced fitness tracking and smart notifications",
    price: 299.99,
    image: "/smartwatch-lifestyle.png",
    category: "Electronics",
    stock: 30,
    featured: true,
  },
  {
    id: "3",
    name: "Running Shoes",
    description: "Comfortable running shoes for all terrains",
    price: 129.99,
    image: "/running-shoes-on-track.png",
    category: "Sports",
    stock: 75,
    featured: true,
  },
  {
    id: "4",
    name: "Coffee Maker",
    description: "Automatic drip coffee maker with programmable timer",
    price: 89.99,
    image: "/modern-coffee-maker.png",
    category: "Home",
    stock: 25,
    featured: true,
  },
  {
    id: "5",
    name: "Laptop Backpack",
    description: "Durable laptop backpack with multiple compartments",
    price: 59.99,
    image: "/laptop-backpack.png",
    category: "Accessories",
    stock: 40,
  },
  {
    id: "6",
    name: "Bluetooth Speaker",
    description: "Portable Bluetooth speaker with excellent sound quality",
    price: 79.99,
    image: "/bluetooth-speaker.png",
    category: "Electronics",
    stock: 60,
  },
]

export const categories = ["Electronics", "Sports", "Home", "Accessories"]

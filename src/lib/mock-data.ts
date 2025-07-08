
export type MenuItem = {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  category: string;
  soldOut: boolean;
};

export type Chef = {
  id: string;
  name: string;
  title: 'Head Chef' | 'Sous Chef' | 'Pastry Chef' | 'Chef de Partie';
  bio: string;
  imageUrl: string;
};

export type Award = {
  id:string;
  title: string;
  year: number;
  issuer: string;
}

export type Coupon = {
  id: string;
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  isActive: boolean;
};

export type Order = {
  id: string;
  customerName: string;
  items: { name: string; quantity: number, price: number }[];
  total: number;
  status: 'Pending' | 'Processing' | 'Delivered' | 'Cancelled';
  date: string; // ISO date string
};

export const menuItems: MenuItem[] = [
  {
    id: '1',
    name: 'Jollof Rice & Chicken',
    description: 'A classic West African dish with fragrant rice cooked in a rich tomato and pepper sauce, served with succulent grilled chicken.',
    price: 17500,
    imageUrl: 'https://images.unsplash.com/photo-1599354607448-8ad6e92b027a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxNXx8am9sbG9mJTIwcmljZXxlbnwwfHx8fDE3NTE5MTY2NzJ8MA&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'Main Dishes',
    soldOut: false,
  },
  {
    id: '2',
    name: 'Spicy Suya Skewers',
    description: 'Tender beef skewers marinated in a spicy peanut blend, grilled to perfection. A popular Nigerian street food.',
    price: 7500,
    imageUrl: 'https://images.unsplash.com/photo-1626323109697-df55d20f06a8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw5fHxza2V3ZXJzfGVufDB8fHx8MTc1MTkxNjc2M3ww&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'Sides',
    soldOut: false,
  },
  {
    id: '3',
    name: 'Fried Plantains (Dodo)',
    description: 'Sweet, ripe plantains, deep-fried until golden brown and caramelized. The perfect sweet and savory side.',
    price: 3500,
    imageUrl: 'https://images.unsplash.com/photo-1676700310614-600f2aa255ef?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxMXx8RnJpZWQlMjBwbGFudGFpbnxlbnwwfHx8fDE3NTE5Njc2Njh8MA&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'Sides',
    soldOut: false,
  },
  {
    id: '4',
    name: 'Egusi Soup with Pounded Yam',
    description: 'A rich and savory soup made from ground melon seeds, spinach, and assorted meats, served with soft pounded yam.',
    price: 15000,
    imageUrl: 'https://i.postimg.cc/fk4nrjpx/egusi-1.jpg',
    category: 'Main Dishes',
    soldOut: false,
  },
  {
    id: '5',
    name: 'Zobo Drink',
    description: 'A refreshing and tangy hibiscus flower drink, infused with ginger and pineapple for a zesty kick.',
    price: 1500,
    imageUrl: 'https://i.postimg.cc/MTr9s6NR/zobo-1.jpg',
    category: 'Drinks',
    soldOut: false,
  },
  {
    id: '6',
    name: 'Puff Puff',
    description: 'Light and airy sweet dough balls, deep-fried to a golden perfection. An irresistible Nigerian snack.',
    price: 4000,
    imageUrl: 'https://images.unsplash.com/photo-1664993085274-80c6ba725ccc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxQdWZmJTIwcHVmZnxlbnwwfHx8fDE3NTE5Njc3Njl8MA&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'Desserts',
    soldOut: false,
  },
];

export const categories: string[] = ['All', 'Main Dishes', 'Sides', 'Drinks', 'Desserts'];

export const chefs: Chef[] = [
  {
    id: 'chef-1',
    name: 'Tunde Wey',
    title: 'Head Chef',
    bio: 'With over 20 years of experience in Nigerian and international cuisine, Chef Tunde is the creative force behind our menu.',
    imageUrl: 'https://placehold.co/400x500.png',
  },
  {
    id: 'chef-2',
    name: 'Adebisi Adeyemi',
    title: 'Sous Chef',
    bio: 'Adebisi brings a modern twist to traditional dishes, specializing in fusion flavors and artistic presentation.',
    imageUrl: 'https://placehold.co/400x500.png',
  },
  {
    id: 'chef-3',
    name: 'Chidinma Okoro',
    title: 'Pastry Chef',
    bio: 'Our queen of desserts, Chidinma crafts delightful sweets that are the perfect end to any meal.',
    imageUrl: 'https://placehold.co/400x500.png',
  },
];

export const awards: Award[] = [
  { id: 'award-1', title: 'Best Nigerian Restaurant', year: 2023, issuer: 'Lagos Food Critic Awards' },
  { id: 'award-2', title: 'Award of Excellence', year: 2022, issuer: 'Culinary Federation of Nigeria' },
  { id: 'award-3', title: 'Top Jollof Rice', year: 2021, issuer: 'West African Food Festival' },
];

export const coupons: Coupon[] = [
  { id: 'coupon-1', code: 'WELCOME10', discountType: 'percentage', discountValue: 10, isActive: true },
  { id: 'coupon-2', code: 'NAIRA10', discountType: 'fixed', discountValue: 1000, isActive: true },
  { id: 'coupon-3', code: 'INACTIVE', discountType: 'percentage', discountValue: 20, isActive: false },
];

export const orders: Order[] = [
    { id: 'order-1', customerName: 'Bisi Adebayo', items: [{ name: 'Jollof Rice & Chicken', quantity: 2, price: 17500 }, { name: 'Zobo Drink', quantity: 2, price: 1500 }], total: 38000, status: 'Delivered', date: '2024-07-20T10:30:00Z' },
    { id: 'order-2', customerName: 'Chike Okafor', items: [{ name: 'Egusi Soup with Pounded Yam', quantity: 1, price: 15000 }], total: 15000, status: 'Processing', date: '2024-07-21T12:00:00Z' },
    { id: 'order-3', customerName: 'Fatima Bello', items: [{ name: 'Spicy Suya Skewers', quantity: 5, price: 7500 }, { name: 'Puff Puff', quantity: 2, price: 4000 }], total: 45500, status: 'Pending', date: '2024-07-22T14:15:00Z' },
    { id: 'order-4', customerName: 'Emeka Nwosu', items: [{ name: 'Jollof Rice & Chicken', quantity: 1, price: 17500 }, { name: 'Fried Plantains (Dodo)', quantity: 1, price: 3500 }], total: 21000, status: 'Cancelled', date: '2024-07-22T11:00:00Z' },
    { id: 'order-5', customerName: 'Yemi Alade', items: [{ name: 'Egusi Soup with Pounded Yam', quantity: 3, price: 15000 }], total: 45000, status: 'Delivered', date: '2024-06-15T09:00:00Z' },
    { id: 'order-6', customerName: 'Femi Kuti', items: [{ name: 'Jollof Rice & Chicken', quantity: 5, price: 17500 }], total: 87500, status: 'Delivered', date: '2024-06-18T18:45:00Z' },
    { id: 'order-7', customerName: 'Sade Adu', items: [{ name: 'Spicy Suya Skewers', quantity: 10, price: 7500 }], total: 75000, status: 'Delivered', date: '2024-05-02T20:00:00Z' },
    { id: 'order-8', customerName: 'King Sunny Ade', items: [{ name: 'Puff Puff', quantity: 10, price: 4000 }], total: 40000, status: 'Delivered', date: '2024-05-28T13:20:00Z' },
];

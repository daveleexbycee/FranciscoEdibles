
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
  id: string;
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

export const menuItems: MenuItem[] = [
  {
    id: '1',
    name: 'Jollof Rice & Chicken',
    description: 'A classic West African dish with fragrant rice cooked in a rich tomato and pepper sauce, served with succulent grilled chicken.',
    price: 15.99,
    imageUrl: 'https://images.unsplash.com/photo-1599354607448-8ad6e92b027a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxNXx8am9sbG9mJTIwcmljZXxlbnwwfHx8fDE3NTE5MTY2NzJ8MA&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'Main Dishes',
    soldOut: false,
  },
  {
    id: '2',
    name: 'Spicy Suya Skewers',
    description: 'Tender beef skewers marinated in a spicy peanut blend, grilled to perfection. A popular Nigerian street food.',
    price: 8.50,
    imageUrl: 'https://placehold.co/400x300.png',
    category: 'Sides',
    soldOut: false,
  },
  {
    id: '3',
    name: 'Fried Plantains (Dodo)',
    description: 'Sweet, ripe plantains, deep-fried until golden brown and caramelized. The perfect sweet and savory side.',
    price: 4.99,
    imageUrl: 'https://placehold.co/400x300.png',
    category: 'Sides',
    soldOut: true,
  },
  {
    id: '4',
    name: 'Egusi Soup with Pounded Yam',
    description: 'A rich and savory soup made from ground melon seeds, spinach, and assorted meats, served with soft pounded yam.',
    price: 18.00,
    imageUrl: 'https://placehold.co/400x300.png',
    category: 'Main Dishes',
    soldOut: false,
  },
  {
    id: '5',
    name: 'Zobo Drink',
    description: 'A refreshing and tangy hibiscus flower drink, infused with ginger and pineapple for a zesty kick.',
    price: 3.50,
    imageUrl: 'https://placehold.co/400x300.png',
    category: 'Drinks',
    soldOut: false,
  },
  {
    id: '6',
    name: 'Puff Puff',
    description: 'Light and airy sweet dough balls, deep-fried to a golden perfection. An irresistible Nigerian snack.',
    price: 5.00,
    imageUrl: 'https://placehold.co/400x300.png',
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
  { id: 'coupon-2', code: 'NAIRA10', discountType: 'fixed', discountValue: 10, isActive: true },
  { id: 'coupon-3', code: 'INACTIVE', discountType: 'percentage', discountValue: 20, isActive: false },
];

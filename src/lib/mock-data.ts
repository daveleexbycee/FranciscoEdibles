export type MenuItem = {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  category: string;
  soldOut: boolean;
};

export const menuItems: MenuItem[] = [
  {
    id: '1',
    name: 'Jollof Rice & Chicken',
    description: 'A classic West African dish with fragrant rice cooked in a rich tomato and pepper sauce, served with succulent grilled chicken.',
    price: 15.99,
    imageUrl: 'https://placehold.co/400x300.png',
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

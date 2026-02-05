import type { MenuItem } from './types.js';

export const menu: MenuItem[] = [
  {
    id: 'app-1',
    name: 'Spring Rolls',
    description: 'Crispy vegetable spring rolls with sweet chili sauce',
    price: 8.99,
    category: 'appetizer'
  },
  {
    id: 'app-2',
    name: 'Chicken Wings',
    description: 'Crispy wings with your choice of buffalo or BBQ sauce',
    price: 12.99,
    category: 'appetizer'
  },
  {
    id: 'main-1',
    name: 'Grilled Salmon',
    description: 'Atlantic salmon with lemon butter sauce, served with vegetables',
    price: 24.99,
    category: 'main'
  },
  {
    id: 'main-2',
    name: 'Chicken Parmesan',
    description: 'Breaded chicken breast with marinara and melted mozzarella, served with pasta',
    price: 18.99,
    category: 'main'
  },
  {
    id: 'main-3',
    name: 'Classic Burger',
    description: 'Angus beef patty with lettuce, tomato, onion, and fries',
    price: 15.99,
    category: 'main'
  },
  {
    id: 'main-4',
    name: 'Caesar Salad',
    description: 'Romaine lettuce, parmesan, croutons with caesar dressing. Add chicken for $5',
    price: 12.99,
    category: 'main'
  },
  {
    id: 'drink-1',
    name: 'Soft Drink',
    description: 'Coke, Sprite, or Fanta',
    price: 2.99,
    category: 'drink'
  },
  {
    id: 'drink-2',
    name: 'Fresh Lemonade',
    description: 'House-made lemonade',
    price: 4.99,
    category: 'drink'
  },
  {
    id: 'dessert-1',
    name: 'Chocolate Brownie',
    description: 'Warm chocolate brownie with vanilla ice cream',
    price: 7.99,
    category: 'dessert'
  },
  {
    id: 'dessert-2',
    name: 'Cheesecake',
    description: 'New York style cheesecake with berry compote',
    price: 8.99,
    category: 'dessert'
  }
];

export function findMenuItem(name: string): MenuItem | undefined {
  const normalizedName = name.toLowerCase();
  return menu.find(item =>
    item.name.toLowerCase().includes(normalizedName) ||
    normalizedName.includes(item.name.toLowerCase())
  );
}

export function formatMenuForDisplay(): string {
  const categories = ['appetizer', 'main', 'drink', 'dessert'] as const;
  const categoryNames = {
    appetizer: 'Appetizers',
    main: 'Main Courses',
    drink: 'Drinks',
    dessert: 'Desserts'
  };

  return categories.map(category => {
    const items = menu.filter(item => item.category === category);
    const itemList = items
      .map(item => `- ${item.name}: $${item.price.toFixed(2)} - ${item.description}`)
      .join('\n');
    return `${categoryNames[category]}:\n${itemList}`;
  }).join('\n\n');
}

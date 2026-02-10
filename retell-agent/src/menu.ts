import type { MenuItem } from './types.js';

// Check Kebab
// export const menu: MenuItem[] = [
//   {
//     id: 'special-1',
//     name: 'Mon-Thur Special',
//     description: '14 Inch Pizza with 3 Toppings & Garlic Bread',
//     price: 14.5,
//     category: 'special'
//   },
//   {
//     id: 'special-2',
//     name: 'Any 2 x 14" Pizza Deal',
//     description: 'Any 2x 14" Pizzas',
//     price: 26.5,
//     category: 'special'
//   },
//   {
//     id: 'special-3',
//     name: 'Family Dinner',
//     description:
//       'Indian Mix Platter, Any 2 Main Courses (Chicken or Lamb), Any Side Veg Curry, Naan + 2x Pilau Rice, Poppadom (Mango Chutney & Spicy Onion), Large Fries',
//     price: 39.5,
//     category: 'special'
//   },
//   {
//     id: 'special-4',
//     name: 'Indian Special',
//     description:
//       'Chicken Tikka Masala or Chicken Rogan Josh, Onion Bhaji or Chicken Pakora, Rice',
//     price: 18.0,
//     category: 'special'
//   },
//   {
//     id: 'special-5',
//     name: 'Munchy Box',
//     description:
//       'Chicken Pakora, Vegetable Pakora, Chicken Tikka, Doner Meat, Naan Bread, Chips, 2 Dip & Can',
//     price: 13.5,
//     category: 'special'
//   }
// ];

// Burgo Pizza and Kebab
export const menu: MenuItem[] = [
  {
    id: 'meal-1',
    name: '12" Pizza Meal',
    description: '12" Pizza with 4 Toppings, Chips and Can',
    price: 18.0,
    category: 'meal-deal'
  },
  {
    id: 'meal-2',
    name: '9" Pizza Meal',
    description: '9" Pizza with 4 Toppings, Chips and Can',
    price: 15.0,
    category: 'meal-deal'
  },
  {
    id: 'meal-3',
    name: '14" Pizza Meal',
    description: '14" Pizza with 4 Toppings, Chips and Can',
    price: 20.0,
    category: 'meal-deal'
  },
  {
    id: 'meal-4',
    name: 'Doner Kebab Meal',
    description: 'Meal Comes With Chips & Can',
    price: 13.5,
    category: 'meal-deal'
  },
  {
    id: 'meal-5',
    name: 'Shawarma Kebab Meal',
    description: 'Meal Comes With Chips & Can',
    price: 14.0,
    category: 'meal-deal'
  },
  {
    id: 'meal-6',
    name: 'Mix Kebab Meal',
    description: 'Meal Comes With Chips & Can',
    price: 14.5,
    category: 'meal-deal'
  },
  {
    id: 'meal-7',
    name: 'Doner Wrap Meal',
    description: 'Meal Comes With Chips & Can of Drink',
    price: 11.0,
    category: 'meal-deal'
  },
  {
    id: 'meal-8',
    name: 'Mix Wrap Meal',
    description: 'Meal Comes With Chips & Can',
    price: 12.0,
    category: 'meal-deal'
  },
  {
    id: 'meal-9',
    name: 'Chicken Wrap Meal',
    description: 'Meal Comes With Chips & Can of Drink',
    price: 11.0,
    category: 'meal-deal'
  },
  {
    id: 'meal-10',
    name: '5 Pcs Chicken Tender Meal',
    description: 'Meal Comes With Chips & Can',
    price: 9.5,
    category: 'meal-deal'
  },
  {
    id: 'meal-11',
    name: '8 Pcs Chicken Nuggets Meal',
    description: '8 x Nuggets with Chips & Can',
    price: 9.5,
    category: 'meal-deal'
  }
];

// Example
// export const menu: MenuItem[] = [
//   {
//     id: 'app-1',
//     name: 'Spring Rolls',
//     description: 'Crispy vegetable spring rolls with sweet chili sauce',
//     price: 8.99,
//     category: 'appetizer'
//   },
//   {
//     id: 'app-2',
//     name: 'Chicken Wings',
//     description: 'Crispy wings with your choice of buffalo or BBQ sauce',
//     price: 12.99,
//     category: 'appetizer'
//   },
//   {
//     id: 'main-1',
//     name: 'Grilled Salmon',
//     description: 'Atlantic salmon with lemon butter sauce, served with vegetables',
//     price: 24.99,
//     category: 'main'
//   },
//   {
//     id: 'main-2',
//     name: 'Chicken Parmesan',
//     description: 'Breaded chicken breast with marinara and melted mozzarella, served with pasta',
//     price: 18.99,
//     category: 'main'
//   },
//   {
//     id: 'main-3',
//     name: 'Classic Burger',
//     description: 'Angus beef patty with lettuce, tomato, onion, and fries',
//     price: 15.99,
//     category: 'main'
//   },
//   {
//     id: 'main-4',
//     name: 'Caesar Salad',
//     description: 'Romaine lettuce, parmesan, croutons with caesar dressing. Add chicken for €5',
//     price: 12.99,
//     category: 'main'
//   },
//   {
//     id: 'drink-1',
//     name: 'Soft Drink',
//     description: 'Coke, Sprite, or Fanta',
//     price: 2.99,
//     category: 'drink'
//   },
//   {
//     id: 'drink-2',
//     name: 'Fresh Lemonade',
//     description: 'House-made lemonade',
//     price: 4.99,
//     category: 'drink'
//   },
//   {
//     id: 'dessert-1',
//     name: 'Chocolate Brownie',
//     description: 'Warm chocolate brownie with vanilla ice cream',
//     price: 7.99,
//     category: 'dessert'
//   },
//   {
//     id: 'dessert-2',
//     name: 'Cheesecake',
//     description: 'New York style cheesecake with berry compote',
//     price: 8.99,
//     category: 'dessert'
//   }
// ];

export function findMenuItem(name: string): MenuItem | undefined {
  const normalizedName = name.toLowerCase();
  return menu.find(item => {
    const itemName = item.name.toLowerCase();
    const itemDescription = item.description.toLowerCase();
    return itemName.includes(normalizedName) ||
      normalizedName.includes(itemName) ||
      itemDescription.includes(normalizedName);
  });
}

export function formatMenuForDisplay(): string {
  const grouped = new Map<string, MenuItem[]>();

  menu.forEach(item => {
    const items = grouped.get(item.category) || [];
    items.push(item);
    grouped.set(item.category, items);
  });

  return [...grouped.entries()]
    .map(([category, items]) => {
      const itemList = items
        .map(item => `- ${item.name}: €${item.price.toFixed(2)} - ${item.description}`)
        .join('\n');
      return `${category}:\n${itemList}`;
    })
    .join('\n\n');
}

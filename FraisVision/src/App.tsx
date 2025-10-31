import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './components/ui/card';
import { Button } from './components/ui/button';
import { Badge } from './components/ui/badge';
import { Progress } from './components/ui/progress';
import { Alert, AlertDescription } from './components/ui/alert';
import { Input } from './components/ui/input';
import { Label } from './components/ui/label';
import { Textarea } from './components/ui/textarea';
import { Switch } from './components/ui/switch';
import { Slider } from './components/ui/slider';
import { Separator } from './components/ui/separator';
import { 
  Home, 
  Scan, 
  Package, 
  ShoppingCart, 
  AlertTriangle, 
  Plus, 
  Calendar,
  Trash2,
  TrendingUp,
  Leaf,
  X,
  DollarSign,
  Bell,
  Brain,
  ArrowRight,
  CheckCircle,
  Settings,
  Thermometer,
  Zap,
  ChefHat,
  BarChart3,
  User,
  RefreshCw,
  Clock,
  Battery,
  Snowflake,
  Sun,
  PieChart,
  TrendingDown,
  Activity,
  Target,
  Shield,
  Volume2,
  VolumeX,
  Smartphone,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Search
} from 'lucide-react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

interface GroceryItem {
  id: string;
  name: string;
  category: string;
  purchaseDate: string;
  expiryDate: string;
  quantity: number;
  unit: string;
  barcode?: string;
  location?: 'fridge' | 'freezer' | 'pantry';
}

interface ShoppingItem {
  id: string;
  name: string;
  category: string;
  quantity: number;
  unit: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
}

interface FridgeSettings {
  temperature: number;
  freezerTemperature: number;
  energySaving: boolean;
  autoDefrost: boolean;
  doorAlarm: boolean;
  notifications: boolean;
}

interface ConsumptionData {
  month: string;
  meat: number;
  vegetables: number;
  dairy: number;
  fruits: number;
}

interface CategoryBreakdown {
  [key: string]: {
    name: string;
    items: { name: string; amount: number; color: string }[];
  };
}

interface NotificationItem {
  id: string;
  type: 'expiry' | 'spoiled' | 'door' | 'temperature' | 'energy';
  message: string;
  timestamp: string;
  severity: 'low' | 'medium' | 'high';
}

export default function App() {
  const [showOnboarding, setShowOnboarding] = useState(true);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showRecipeDropdown, setShowRecipeDropdown] = useState(false);
  const [showRecipeModal, setShowRecipeModal] = useState(false);
  const [showAddDropdown, setShowAddDropdown] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [recipeSearchQuery, setRecipeSearchQuery] = useState('');
  const [inventoryFilter, setInventoryFilter] = useState<'all' | 'fridge' | 'freezer' | 'pantry' | 'expiring' | 'fresh'>('all');
  const [groceries, setGroceries] = useState<GroceryItem[]>([
    // Expiring items (3-4 items)
    {
      id: '1',
      name: 'Bananas',
      category: 'Fruits',
      purchaseDate: '2025-08-02',
      expiryDate: '2025-08-09',
      quantity: 6,
      unit: 'pieces',
      location: 'pantry'
    },
    {
      id: '2',
      name: 'Yogurt',
      category: 'Dairy',
      purchaseDate: '2025-08-03',
      expiryDate: '2025-08-10',
      quantity: 2,
      unit: 'cups',
      location: 'fridge'
    },
    {
      id: '3',
      name: 'Spinach',
      category: 'Vegetables',
      purchaseDate: '2025-08-04',
      expiryDate: '2025-08-09',
      quantity: 200,
      unit: 'grams',
      location: 'fridge'
    },
    // Fresh items (remaining 22 items)
    {
      id: '4',
      name: 'Milk',
      category: 'Dairy',
      purchaseDate: '2025-08-04',
      expiryDate: '2025-08-15',
      quantity: 1,
      unit: 'bottle',
      location: 'fridge'
    },
    {
      id: '5',
      name: 'Chicken Breast',
      category: 'Meat',
      purchaseDate: '2025-08-05',
      expiryDate: '2025-08-20',
      quantity: 500,
      unit: 'grams',
      location: 'freezer'
    },
    {
      id: '6',
      name: 'Apples',
      category: 'Fruits',
      purchaseDate: '2025-08-05',
      expiryDate: '2025-08-20',
      quantity: 8,
      unit: 'pieces',
      location: 'pantry'
    },
    {
      id: '7',
      name: 'Cheddar Cheese',
      category: 'Dairy',
      purchaseDate: '2025-08-04',
      expiryDate: '2025-08-25',
      quantity: 250,
      unit: 'grams',
      location: 'fridge'
    },
    {
      id: '8',
      name: 'Salmon Fillet',
      category: 'Fish',
      purchaseDate: '2025-08-05',
      expiryDate: '2025-08-18',
      quantity: 400,
      unit: 'grams',
      location: 'freezer'
    },
    {
      id: '9',
      name: 'Broccoli',
      category: 'Vegetables',
      purchaseDate: '2025-08-05',
      expiryDate: '2025-08-16',
      quantity: 300,
      unit: 'grams',
      location: 'fridge'
    },
    {
      id: '10',
      name: 'Eggs',
      category: 'Dairy',
      purchaseDate: '2025-08-04',
      expiryDate: '2025-08-22',
      quantity: 12,
      unit: 'pieces',
      location: 'fridge'
    },
    {
      id: '11',
      name: 'Tomatoes',
      category: 'Vegetables',
      purchaseDate: '2025-08-05',
      expiryDate: '2025-08-17',
      quantity: 4,
      unit: 'pieces',
      location: 'pantry'
    },
    {
      id: '12',
      name: 'Ground Beef',
      category: 'Meat',
      purchaseDate: '2025-08-05',
      expiryDate: '2025-08-19',
      quantity: 500,
      unit: 'grams',
      location: 'freezer'
    },
    {
      id: '13',
      name: 'Bell Peppers',
      category: 'Vegetables',
      purchaseDate: '2025-08-05',
      expiryDate: '2025-08-18',
      quantity: 3,
      unit: 'pieces',
      location: 'fridge'
    },
    {
      id: '14',
      name: 'Greek Yogurt',
      category: 'Dairy',
      purchaseDate: '2025-08-04',
      expiryDate: '2025-08-20',
      quantity: 1,
      unit: 'container',
      location: 'fridge'
    },
    {
      id: '15',
      name: 'Oranges',
      category: 'Fruits',
      purchaseDate: '2025-08-05',
      expiryDate: '2025-08-19',
      quantity: 6,
      unit: 'pieces',
      location: 'pantry'
    },
    {
      id: '16',
      name: 'Carrots',
      category: 'Vegetables',
      purchaseDate: '2025-08-04',
      expiryDate: '2025-08-21',
      quantity: 500,
      unit: 'grams',
      location: 'fridge'
    },
    {
      id: '17',
      name: 'Bread',
      category: 'Grains',
      purchaseDate: '2025-08-05',
      expiryDate: '2025-08-15',
      quantity: 1,
      unit: 'loaf',
      location: 'pantry'
    },
    {
      id: '18',
      name: 'Butter',
      category: 'Dairy',
      purchaseDate: '2025-08-04',
      expiryDate: '2025-08-30',
      quantity: 250,
      unit: 'grams',
      location: 'fridge'
    },
    {
      id: '19',
      name: 'Strawberries',
      category: 'Fruits',
      purchaseDate: '2025-08-05',
      expiryDate: '2025-08-16',
      quantity: 250,
      unit: 'grams',
      location: 'fridge'
    },
    {
      id: '20',
      name: 'Onions',
      category: 'Vegetables',
      purchaseDate: '2025-08-04',
      expiryDate: '2025-08-25',
      quantity: 3,
      unit: 'pieces',
      location: 'pantry'
    },
    {
      id: '21',
      name: 'Rice',
      category: 'Grains',
      purchaseDate: '2025-08-04',
      expiryDate: '2025-12-30',
      quantity: 1,
      unit: 'kg',
      location: 'pantry'
    },
    {
      id: '22',
      name: 'Pasta',
      category: 'Grains',
      purchaseDate: '2025-08-04',
      expiryDate: '2025-12-15',
      quantity: 500,
      unit: 'grams',
      location: 'pantry'
    },
    {
      id: '23',
      name: 'Olive Oil',
      category: 'Oils',
      purchaseDate: '2025-08-04',
      expiryDate: '2026-08-04',
      quantity: 500,
      unit: 'ml',
      location: 'pantry'
    },
    {
      id: '24',
      name: 'Garlic',
      category: 'Vegetables',
      purchaseDate: '2025-08-04',
      expiryDate: '2025-08-20',
      quantity: 1,
      unit: 'bulb',
      location: 'pantry'
    },
    {
      id: '25',
      name: 'Lemon',
      category: 'Fruits',
      purchaseDate: '2025-08-05',
      expiryDate: '2025-08-18',
      quantity: 3,
      unit: 'pieces',
      location: 'fridge'
    }
  ]);

  const [shoppingList, setShoppingList] = useState<ShoppingItem[]>([
    {
      id: '1',
      name: 'Milk',
      category: 'Dairy',
      quantity: 1,
      unit: 'bottle',
      completed: false,
      priority: 'high'
    },
    {
      id: '2',
      name: 'Eggs',
      category: 'Dairy',
      quantity: 12,
      unit: 'pieces',
      completed: false,
      priority: 'medium'
    }
  ]);

  const [fridgeSettings, setFridgeSettings] = useState<FridgeSettings>({
    temperature: 4,
    freezerTemperature: -18,
    energySaving: false,
    autoDefrost: true,
    doorAlarm: true,
    notifications: true
  });

  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: '1',
      type: 'expiry',
      message: 'Bananas expire in 3 days - use for smoothies!',
      timestamp: '2025-08-06T09:00:00',
      severity: 'medium'
    },
    {
      id: '2',
      type: 'expiry',
      message: 'Yogurt expires in 4 days',
      timestamp: '2025-08-06T08:45:00',
      severity: 'medium'
    },
    {
      id: '3',
      type: 'door',
      message: 'Fridge door opened 18 times today',
      timestamp: '2025-08-06T08:30:00',
      severity: 'low'
    },
    {
      id: '4',
      type: 'energy',
      message: 'Energy usage 15% lower this week thanks to AI optimization',
      timestamp: '2025-08-06T07:15:00',
      severity: 'low'
    },
    {
      id: '5',
      type: 'temperature',
      message: 'Fridge temperature stable at 4.2°C',
      timestamp: '2025-08-06T06:00:00',
      severity: 'low'
    }
  ]);

  const [selectedPeriod, setSelectedPeriod] = useState({ month: 6, year: 2025 }); // July 2025
  
  const [categoryBreakdown] = useState<CategoryBreakdown>({
    'Meat': {
      name: 'Meat & Protein',
      items: [
        { name: 'Chicken Breast', amount: 450, color: '#8884d8' },
        { name: 'Salmon Fillet', amount: 320, color: '#82ca9d' },
        { name: 'Ground Beef', amount: 280, color: '#ffc658' },
        { name: 'Prawns', amount: 130, color: '#ff7c7c' }
      ]
    },
    'Vegetables': {
      name: 'Vegetables & Greens',
      items: [
        { name: 'Spinach', amount: 200, color: '#8dd1e1' },
        { name: 'Broccoli', amount: 180, color: '#d084d0' },
        { name: 'Carrots', amount: 150, color: '#ffb347' },
        { name: 'Bell Peppers', amount: 140, color: '#87ceeb' },
        { name: 'Tomatoes', amount: 120, color: '#98fb98' },
        { name: 'Onions', amount: 110, color: '#f0e68c' },
        { name: 'Lettuce', amount: 50, color: '#dda0dd' }
      ]
    },
    'Dairy': {
      name: 'Dairy Products',
      items: [
        { name: 'Milk', amount: 240, color: '#ffd700' },
        { name: 'Cheese', amount: 180, color: '#ff6347' },
        { name: 'Greek Yogurt', amount: 160, color: '#40e0d0' },
        { name: 'Butter', amount: 100, color: '#ee82ee' }
      ]
    },
    'Fruits': {
      name: 'Fresh Fruits',
      items: [
        { name: 'Bananas', amount: 180, color: '#ffa07a' },
        { name: 'Apples', amount: 150, color: '#20b2aa' },
        { name: 'Oranges', amount: 100, color: '#87cefa' },
        { name: 'Berries', amount: 60, color: '#deb887' }
      ]
    }
  });
  
  const [historicalData] = useState<Record<string, ConsumptionData[]>>({
    '2024': [
      { month: 'Jan', meat: 1100, vegetables: 750, dairy: 580, fruits: 380 },
      { month: 'Feb', meat: 1000, vegetables: 820, dairy: 520, fruits: 420 },
      { month: 'Mar', meat: 1200, vegetables: 700, dairy: 650, fruits: 480 },
      { month: 'Apr', meat: 950, vegetables: 800, dairy: 600, fruits: 360 },
      { month: 'May', meat: 1080, vegetables: 870, dairy: 540, fruits: 400 },
      { month: 'Jun', meat: 1180, vegetables: 830, dairy: 680, fruits: 440 },
      { month: 'Jul', meat: 1120, vegetables: 900, dairy: 640, fruits: 470 },
      { month: 'Aug', meat: 1250, vegetables: 950, dairy: 700, fruits: 510 },
      { month: 'Sep', meat: 1150, vegetables: 880, dairy: 660, fruits: 480 },
      { month: 'Oct', meat: 1300, vegetables: 920, dairy: 720, fruits: 520 },
      { month: 'Nov', meat: 1200, vegetables: 850, dairy: 680, fruits: 460 },
      { month: 'Dec', meat: 1350, vegetables: 980, dairy: 750, fruits: 540 }
    ],
    '2025': [
      { month: 'Jan', meat: 1200, vegetables: 800, dairy: 600, fruits: 400 },
      { month: 'Feb', meat: 1100, vegetables: 900, dairy: 550, fruits: 450 },
      { month: 'Mar', meat: 1300, vegetables: 750, dairy: 700, fruits: 500 },
      { month: 'Apr', meat: 1000, vegetables: 850, dairy: 650, fruits: 380 },
      { month: 'May', meat: 1150, vegetables: 920, dairy: 580, fruits: 420 },
      { month: 'Jun', meat: 1250, vegetables: 880, dairy: 720, fruits: 460 },
      { month: 'Jul', meat: 1180, vegetables: 950, dairy: 680, fruits: 490 }
    ]
  });

  const [activeTab, setActiveTab] = useState('home');
  const [showDetailedAnalytics, setShowDetailedAnalytics] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showQuantities, setShowQuantities] = useState(false);
  const [selectedPieSlice, setSelectedPieSlice] = useState<string | null>(null);
  const [showMonthYearDropdown, setShowMonthYearDropdown] = useState(false);
  const [aiEnergyMonitor, setAiEnergyMonitor] = useState(false);
  const [energyUsage] = useState(2.8); // kWh per day
  const [doorOpenTime] = useState(45); // seconds per day
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [showScanModal, setShowScanModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [doorOpenCount, setDoorOpenCount] = useState(23);
  const [fridgeStatus, setFridgeStatus] = useState({
    temperature: 4.2,
    freezerTemperature: -17.8,
    humidity: 65,
    energyMode: 'normal',
    doorStatus: 'closed'
  });

  const [newItem, setNewItem] = useState({
    name: '',
    category: '',
    expiryDate: '',
    quantity: 1,
    unit: '',
    location: 'fridge' as 'fridge' | 'freezer' | 'pantry'
  });

  const [userSettings, setUserSettings] = useState({
    name: 'John Doe',
    email: 'john@example.com',
    notifications: true,
    darkMode: false,
    language: 'English',
    units: 'metric'
  });

  const getDaysUntilExpiry = (expiryDate: string) => {
    const today = new Date();
    const expiry = new Date(expiryDate);
    const diffTime = expiry.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const getExpiringItems = () => {
    return groceries.filter(item => {
      const days = getDaysUntilExpiry(item.expiryDate);
      return days <= 3 && days >= 0;
    });
  };

  const getExpiredItems = () => {
    return groceries.filter(item => getDaysUntilExpiry(item.expiryDate) < 0);
  };

  const getSpoiledItems = () => {
    return groceries.filter(item => getDaysUntilExpiry(item.expiryDate) < -1);
  };

  const getFridgeItems = () => {
    return groceries.filter(item => item.location === 'fridge');
  };

  const getRecipeRecommendations = () => {
    const fridgeItems = getFridgeItems();
    const allItems = groceries;
    
    const recipes = [
      {
        id: '1',
        name: 'Chicken Spinach Salad',
        description: 'A healthy and protein-rich salad perfect for lunch',
        ingredients: [
          { name: 'Chicken Breast', amount: '200g', available: allItems.some(item => item.name === 'Chicken Breast') },
          { name: 'Spinach', amount: '100g', available: allItems.some(item => item.name === 'Spinach') },
          { name: 'Milk', amount: '50ml', available: allItems.some(item => item.name === 'Milk') },
          { name: 'Olive Oil', amount: '2 tbsp', available: false },
          { name: 'Lemon', amount: '1 piece', available: false }
        ],
        instructions: [
          'Season and cook chicken breast in a pan for 6-8 minutes each side',
          'Let chicken rest for 5 minutes, then slice thinly',
          'Wash and prepare fresh spinach leaves',
          'Mix olive oil, lemon juice, salt and pepper for dressing',
          'Combine spinach and chicken, drizzle with dressing',
          'Serve immediately while chicken is still warm'
        ],
        difficulty: 'Easy',
        time: '15 min',
        servings: 2,
        category: 'Salad'
      },
      {
        id: '2',
        name: 'Creamy Spinach Soup',
        description: 'A warm and comforting soup rich in nutrients',
        ingredients: [
          { name: 'Spinach', amount: '300g', available: allItems.some(item => item.name === 'Spinach') },
          { name: 'Milk', amount: '400ml', available: allItems.some(item => item.name === 'Milk') },
          { name: 'Onion', amount: '1 medium', available: false },
          { name: 'Garlic', amount: '2 cloves', available: false },
          { name: 'Butter', amount: '2 tbsp', available: false }
        ],
        instructions: [
          'Sauté diced onion and garlic in butter until soft',
          'Add spinach and cook until wilted (2-3 minutes)',
          'Pour in milk and bring to a gentle simmer',
          'Season with salt, pepper, and a pinch of nutmeg',
          'Blend until smooth using an immersion blender',
          'Serve hot with crusty bread or croutons'
        ],
        difficulty: 'Easy',
        time: '20 min',
        servings: 3,
        category: 'Soup'
      },
      {
        id: '3',
        name: 'Banana Smoothie',
        description: 'A quick and nutritious breakfast drink',
        ingredients: [
          { name: 'Bananas', amount: '2 pieces', available: allItems.some(item => item.name === 'Bananas') },
          { name: 'Milk', amount: '250ml', available: allItems.some(item => item.name === 'Milk') },
          { name: 'Honey', amount: '1 tbsp', available: false },
          { name: 'Ice cubes', amount: '4-5 pieces', available: false }
        ],
        instructions: [
          'Peel and slice the bananas',
          'Add bananas, milk, and honey to blender',
          'Add ice cubes for a colder smoothie',
          'Blend for 30-45 seconds until smooth',
          'Pour into glasses and serve immediately',
          'Garnish with banana slices if desired'
        ],
        difficulty: 'Very Easy',
        time: '5 min',
        servings: 2,
        category: 'Beverage'
      },
      {
        id: '4',
        name: 'Chicken Stir Fry',
        description: 'Quick and flavorful chicken with vegetables',
        ingredients: [
          { name: 'Chicken Breast', amount: '300g', available: allItems.some(item => item.name === 'Chicken Breast') },
          { name: 'Spinach', amount: '150g', available: allItems.some(item => item.name === 'Spinach') },
          { name: 'Soy Sauce', amount: '3 tbsp', available: false },
          { name: 'Garlic', amount: '2 cloves', available: false },
          { name: 'Vegetable Oil', amount: '2 tbsp', available: false }
        ],
        instructions: [
          'Cut chicken breast into bite-sized pieces',
          'Heat oil in a wok or large pan over high heat',
          'Add chicken and stir-fry for 5-6 minutes until cooked',
          'Add minced garlic and cook for 30 seconds',
          'Add spinach and stir-fry until wilted',
          'Season with soy sauce and serve over rice'
        ],
        difficulty: 'Medium',
        time: '12 min',
        servings: 2,
        category: 'Main Course'
      }
    ];
    
    // Calculate matching ingredients for each recipe
    const recipesWithMatches = recipes.map(recipe => ({
      ...recipe,
      matchingItems: recipe.ingredients.filter(ing => ing.available).length,
      totalIngredients: recipe.ingredients.length,
      matchPercentage: Math.round((recipe.ingredients.filter(ing => ing.available).length / recipe.ingredients.length) * 100)
    }));
    
    return recipesWithMatches
      .filter(recipe => recipe.matchingItems > 0)
      .sort((a, b) => b.matchingItems - a.matchingItems);
  };

  const openRecipeModal = (recipe: any) => {
    setSelectedRecipe(recipe);
    setShowRecipeModal(true);
    setShowRecipeDropdown(false);
  };

  const addGroceryItem = () => {
    if (newItem.name && newItem.category && newItem.expiryDate) {
      const item: GroceryItem = {
        id: Date.now().toString(),
        name: newItem.name,
        category: newItem.category,
        purchaseDate: new Date().toISOString().split('T')[0],
        expiryDate: newItem.expiryDate,
        quantity: newItem.quantity,
        unit: newItem.unit || 'pieces',
        location: newItem.location
      };
      setGroceries([...groceries, item]);
      setNewItem({ name: '', category: '', expiryDate: '', quantity: 1, unit: '', location: 'fridge' });
      setShowAddModal(false);
    }
  };

  const removeGroceryItem = (id: string) => {
    setGroceries(groceries.filter(item => item.id !== id));
  };

  const toggleShoppingItem = (id: string) => {
    setShoppingList(shoppingList.map(item => 
      item.id === id ? { ...item, completed: !item.completed } : item
    ));
  };

  const mockScanResult = () => {
    const mockItems = [
      { name: 'Greek Yogurt', category: 'Dairy', unit: 'container', location: 'fridge' },
      { name: 'Chicken Breast', category: 'Meat', unit: 'package', location: 'freezer' },
      { name: 'Baby Spinach', category: 'Vegetables', unit: 'bag', location: 'fridge' },
      { name: 'Orange Juice', category: 'Beverages', unit: 'carton', location: 'fridge' }
    ];
    
    const randomItem = mockItems[Math.floor(Math.random() * mockItems.length)];
    setNewItem({
      ...randomItem,
      expiryDate: '',
      quantity: 1,
      location: randomItem.location as 'fridge' | 'freezer' | 'pantry'
    });
    setShowScanModal(false);
    setShowAddModal(true);
  };

  const updateFridgeSettings = (key: keyof FridgeSettings, value: any) => {
    setFridgeSettings(prev => ({ ...prev, [key]: value }));
    
    // Auto-disable AI energy monitor when temperature sliders are changed
    if (key === 'temperature' || key === 'freezerTemperature') {
      setAiEnergyMonitor(false);
    }
  };

  const simulateFridgeOpen = () => {
    setDoorOpenCount(prev => prev + 1);
    setFridgeStatus(prev => ({ ...prev, doorStatus: 'open' }));
    setTimeout(() => {
      setFridgeStatus(prev => ({ ...prev, doorStatus: 'closed' }));
    }, 2000);
  };

  const removeNotification = (id: string) => {
    setNotifications(notifications.filter(notification => notification.id !== id));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  const getCurrentConsumptionData = () => {
    const yearData = historicalData[selectedPeriod.year.toString()];
    if (!yearData || !yearData[selectedPeriod.month]) return [];
    
    // Show data for only the selected month
    const monthData = yearData[selectedPeriod.month];
    return [
      { category: 'Meat', amount: monthData.meat, month: monthData.month },
      { category: 'Vegetables', amount: monthData.vegetables, month: monthData.month },
      { category: 'Dairy', amount: monthData.dairy, month: monthData.month },
      { category: 'Fruits', amount: monthData.fruits, month: monthData.month }
    ];
  };

  const getCurrentMonthData = () => {
    const yearData = historicalData[selectedPeriod.year.toString()];
    if (!yearData || !yearData[selectedPeriod.month]) return null;
    
    const monthData = yearData[selectedPeriod.month];
    const totalConsumption = monthData.meat + monthData.vegetables + monthData.dairy + monthData.fruits;
    
    return [
      { 
        name: 'Meat', 
        value: monthData.meat, 
        color: '#8884d8',
        percentage: Math.round((monthData.meat / totalConsumption) * 100)
      },
      { 
        name: 'Vegetables', 
        value: monthData.vegetables, 
        color: '#82ca9d',
        percentage: Math.round((monthData.vegetables / totalConsumption) * 100)
      },
      { 
        name: 'Dairy', 
        value: monthData.dairy, 
        color: '#ffc658',
        percentage: Math.round((monthData.dairy / totalConsumption) * 100)
      },
      { 
        name: 'Fruits', 
        value: monthData.fruits, 
        color: '#ff7c7c',
        percentage: Math.round((monthData.fruits / totalConsumption) * 100)
      }
    ];
  };

  const getYearlyTrendData = () => {
    const yearData = historicalData[selectedPeriod.year.toString()];
    if (!yearData) return [];
    
    return yearData.map(monthData => ({
      month: monthData.month,
      total: monthData.meat + monthData.vegetables + monthData.dairy + monthData.fruits
    }));
  };

  const getSelectedPeriodDisplay = () => {
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 
                   'July', 'August', 'September', 'October', 'November', 'December'];
    return `${months[selectedPeriod.month]} ${selectedPeriod.year}`;
  };

  const navigatePeriod = (direction: 'prev' | 'next') => {
    setSelectedPeriod(prev => {
      let newMonth = prev.month;
      let newYear = prev.year;
      
      if (direction === 'prev') {
        newMonth--;
        if (newMonth < 0) {
          newMonth = 11;
          newYear--;
        }
      } else {
        newMonth++;
        if (newMonth > 11) {
          newMonth = 0;
          newYear++;
        }
      }
      
      // Don't go beyond available data
      if (newYear < 2024 || (newYear === 2025 && newMonth > 6)) {
        return prev;
      }
      
      return { month: newMonth, year: newYear };
    });
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (showRecipeDropdown && !target.closest('[data-recipe-dropdown]')) {
        setShowRecipeDropdown(false);
      }
      if (showAddDropdown && !target.closest('[data-add-dropdown]') && !target.closest('[data-recipe-dropdown]')) {
        setShowAddDropdown(false);
      }
      if (showMonthYearDropdown && !target.closest('.relative')) {
        setShowMonthYearDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showRecipeDropdown, showAddDropdown, showMonthYearDropdown]);

  // Track scroll position for floating recipe button
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);



  // Onboarding Benefits Component
  if (showOnboarding) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
        <div className="max-w-md mx-auto bg-white min-h-screen">
          <div className="p-6 pt-12">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <Leaf className="h-10 w-10 text-primary-foreground" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Welcome to FreshTrack</h1>
              <p className="text-gray-600">Your smart fridge companion for a sustainable lifestyle</p>
            </div>

            {/* Benefits */}
            <div className="space-y-6 mb-8">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Leaf className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Smart Fridge Control</h3>
                  <p className="text-sm text-gray-600">Control temperature, energy settings, and monitor your smart fridge remotely.</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <ChefHat className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Recipe Recommendations</h3>
                  <p className="text-sm text-gray-600">Get personalized recipe suggestions based on ingredients in your fridge.</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <BarChart3 className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Consumption Analytics</h3>
                  <p className="text-sm text-gray-600">Track your monthly food consumption with detailed visual reports.</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Bell className="h-6 w-6 text-orange-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Smart Notifications</h3>
                  <p className="text-sm text-gray-600">Get alerts for spoiled food, door activity, and temperature changes.</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Zap className="h-6 w-6 text-red-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Energy Monitoring</h3>
                  <p className="text-sm text-gray-600">Optimize energy usage with smart scheduling and efficiency tracking.</p>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="bg-gradient-to-r from-green-500 to-blue-500 rounded-lg p-6 mb-8 text-white">
              <h3 className="font-semibold mb-4 text-center">Smart Fridge Users Save:</h3>
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <p className="text-2xl font-bold">40%</p>
                  <p className="text-sm opacity-90">Energy Costs</p>
                </div>
                <div>
                  <p className="text-2xl font-bold">60%</p>
                  <p className="text-sm opacity-90">Food Waste</p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button 
                onClick={() => setShowOnboarding(false)}
                className="w-full h-12 text-base"
              >
                Get Started
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              
              <Button 
                variant="ghost" 
                onClick={() => setShowOnboarding(false)}
                className="w-full h-12 text-base text-gray-600"
              >
                Skip for now
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-background ${userSettings.darkMode ? 'dark' : ''}`}>
      <div className={`max-w-md mx-auto min-h-screen ${userSettings.darkMode ? 'bg-black text-white' : 'bg-white'}`}>
        {/* Header */}
        <div className={`p-4 ${userSettings.darkMode ? 'bg-gray-900 text-white' : 'bg-primary text-primary-foreground'}`}>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-medium">FreshTrack</h1>
              <p className="text-sm opacity-90">Smart Fridge Management</p>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowNotifications(true)}
                className={`relative h-8 w-8 p-0 ${userSettings.darkMode ? 'text-white hover:bg-gray-700' : 'text-primary-foreground hover:bg-primary-foreground/10'}`}
              >
                <Bell className="h-5 w-5" />
                {notifications.length > 0 && (
                  <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full text-xs flex items-center justify-center text-white">
                    {notifications.length}
                  </span>
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="px-4 py-2 pb-20">
            <TabsContent value="home" className="mt-0 space-y-4 pb-2">
              {/* Large Items Tracked Display - Left Aligned */}
              <div 
                className="text-left py-6 cursor-pointer transition-all duration-200 hover:scale-105"
                onClick={() => setActiveTab('inventory')}
              >
                <div className="text-6xl font-bold text-primary mb-2">{groceries.length}</div>
                <p className="text-xl font-medium text-foreground">Items Tracked</p>
                <p className="text-sm text-muted-foreground">in your smart fridge</p>
                <div className="mt-3 flex items-center space-x-1 text-muted-foreground">
                  <ArrowRight className="h-4 w-4" />
                  <span className="text-xs">Tap to explore inventory</span>
                </div>
              </div>

              {/* Sliding Message Rectangles */}
              <div className="space-y-3">
                <div className="flex space-x-3 overflow-x-auto pb-2" style={{scrollbarWidth: 'none', msOverflowStyle: 'none'}}>
                  {/* Expired Items Alert */}
                  {(() => {
                    const expiredItems = getExpiredItems();
                    if (expiredItems.length > 0) {
                      return (
                        <div 
                          className="flex-shrink-0 w-64 h-20 bg-gradient-to-r from-red-500 to-red-600 rounded-2xl p-4 text-white shadow-lg cursor-pointer transition-transform hover:scale-105"
                          onClick={() => setActiveTab('inventory')}
                        >
                          <div className="flex items-center space-x-3 h-full">
                            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                              <AlertTriangle className="h-6 w-6 text-white" />
                            </div>
                            <div className="flex-1">
                              <p className="font-semibold">🚨 Items Expired!</p>
                              <p className="text-sm opacity-90">{expiredItems.length} item{expiredItems.length > 1 ? 's' : ''} need attention</p>
                            </div>
                          </div>
                        </div>
                      );
                    }
                    return null;
                  })()}

                  {/* Expiring Soon Alert */}
                  {(() => {
                    const expiringItems = getExpiringItems();
                    if (expiringItems.length > 0) {
                      return (
                        <div 
                          className="flex-shrink-0 w-64 h-20 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-2xl p-4 text-white shadow-lg cursor-pointer transition-transform hover:scale-105"
                          onClick={() => setActiveTab('inventory')}
                        >
                          <div className="flex items-center space-x-3 h-full">
                            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                              <Clock className="h-6 w-6 text-white" />
                            </div>
                            <div className="flex-1">
                              <p className="font-semibold">⏰ Expiring Soon!</p>
                              <p className="text-sm opacity-90">{expiringItems.length} item{expiringItems.length > 1 ? 's' : ''} need to be used</p>
                            </div>
                          </div>
                        </div>
                      );
                    }
                    return null;
                  })()}

                  {/* Search Function */}
                  <div 
                    className="flex-shrink-0 w-64 h-20 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl p-4 text-white shadow-lg cursor-pointer transition-transform hover:scale-105"
                    onClick={() => setActiveTab('inventory')}
                  >
                    <div className="flex items-center space-x-3 h-full">
                      <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                        <Package className="h-6 w-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold">🔍 Find Items</p>
                        <p className="text-sm opacity-90">Search through your inventory</p>
                      </div>
                    </div>
                  </div>

                  {/* Waste Reduction */}
                  <div 
                    className="flex-shrink-0 w-64 h-20 bg-gradient-to-r from-green-500 to-green-600 rounded-2xl p-4 text-white shadow-lg cursor-pointer transition-transform hover:scale-105"
                    onClick={() => setActiveTab('analytics')}
                  >
                    <div className="flex items-center space-x-3 h-full">
                      <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                        <TrendingUp className="h-6 w-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold">🌱 Waste Reduced</p>
                        <p className="text-sm opacity-90">
                          {(() => {
                            const currentData = getCurrentMonthData();
                            if (!currentData || currentData.length === 0) return 'Check analytics';
                            
                            const totalConsumption = currentData.reduce((sum, item) => sum + item.value, 0);
                            const wasteReduction = Math.min(95, Math.max(60, Math.floor((totalConsumption / 35))));
                            return `${wasteReduction}% this month`;
                          })()}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Energy Saved */}
                  <div 
                    className="flex-shrink-0 w-64 h-20 bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl p-4 text-white shadow-lg cursor-pointer transition-transform hover:scale-105"
                    onClick={() => setActiveTab('fridge')}
                  >
                    <div className="flex items-center space-x-3 h-full">
                      <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                        <Zap className="h-6 w-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold">⚡ Energy Status</p>
                        <p className="text-sm opacity-90">{energyUsage} kWh/day usage</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Smart Fridge Status - Clickable */}
              <Card 
                className="overflow-hidden cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-[1.02]"
                onClick={() => setActiveTab('fridge')}
              >
                <div 
                  className={`p-4 transition-all duration-300 ${
                    (() => {
                      if (aiEnergyMonitor) {
                        return 'bg-gradient-to-r from-blue-500 via-purple-500 to-green-500 text-white';
                      } else if (fridgeSettings.energySaving) {
                        return 'bg-gradient-to-r from-green-400 to-emerald-500 text-white';
                      } else {
                        return 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800';
                      }
                    })()
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <Thermometer className="h-5 w-5" />
                      <span className="font-medium">Fridge Status</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      {aiEnergyMonitor && <Brain className="h-4 w-4 animate-pulse" />}
                      {fridgeSettings.energySaving && !aiEnergyMonitor && <Leaf className="h-4 w-4" />}
                      <Badge 
                        variant="secondary" 
                        className={`${
                          aiEnergyMonitor || fridgeSettings.energySaving 
                            ? 'bg-white/20 text-white border-white/30' 
                            : 'bg-gray-800 text-white'
                        }`}
                      >
                        {aiEnergyMonitor ? "AI Optimized" : fridgeSettings.energySaving ? "Eco Mode" : "Normal"}
                      </Badge>
                      <ArrowRight className="h-4 w-4 opacity-70" />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center">
                      <p className="text-xl font-medium">{fridgeStatus.temperature}°C</p>
                      <p className="text-xs opacity-80">Fridge</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xl font-medium">{fridgeStatus.freezerTemperature}°C</p>
                      <p className="text-xs opacity-80">Freezer</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xl font-medium">{fridgeStatus.humidity}%</p>
                      <p className="text-xs opacity-80">Humidity</p>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Food Recommendations Panel */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium">🍽️ Recommended for You</h3>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => setShowRecipeDropdown(true)}
                    className="text-sm"
                  >
                    View All
                  </Button>
                </div>
                
                <div className="space-y-3">
                  {/* Full Width Recipe Cards */}
                  <div className="flex space-x-3 overflow-x-auto pb-2" style={{scrollbarWidth: 'none', msOverflowStyle: 'none'}}>
                    {/* Gourmet Burger */}
                    <div 
                      className="flex-shrink-0 w-80 h-40 bg-white rounded-xl shadow-lg overflow-hidden border cursor-pointer transition-transform hover:scale-105"
                      onClick={() => openRecipeModal({
                        id: 'burger',
                        name: 'Gourmet Burger',
                        description: 'Juicy beef patty with fresh ingredients and artisan bun',
                        ingredients: [
                          { name: 'Ground Beef', amount: '300g', available: true },
                          { name: 'Cheese', amount: '2 slices', available: true },
                          { name: 'Tomatoes', amount: '2 slices', available: true },
                          { name: 'Onions', amount: '1 medium', available: true },
                          { name: 'Bread', amount: '2 buns', available: true }
                        ],
                        instructions: [
                          'Season and form ground beef into patties',
                          'Heat grill or pan to medium-high heat',
                          'Cook patties for 4-5 minutes each side',
                          'Add cheese in the last minute of cooking',
                          'Toast buns lightly',
                          'Assemble burger with fresh vegetables and serve'
                        ],
                        difficulty: 'Medium',
                        time: '20 min',
                        servings: 2,
                        category: 'Main Course',
                        videoUrl: 'https://www.youtube.com/watch?v=example',
                        websiteUrl: 'https://www.foodnetwork.com/recipes/example'
                      })}
                    >
                      <div className="relative h-full">
                        <div 
                          className="absolute inset-0 bg-cover bg-center"
                          style={{
                            backgroundImage: 'url(https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&h=300&fit=crop&crop=center)'
                          }}
                        >
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                        </div>
                        <div className="absolute bottom-3 left-3 text-white">
                          <h4 className="text-lg font-bold">🍔 Gourmet Burger</h4>
                          <p className="text-sm opacity-90">Juicy & Satisfying</p>
                        </div>
                        <div className="absolute top-3 right-3 bg-black/30 backdrop-blur-sm rounded-full px-2 py-1">
                          <span className="text-white text-xs">20 min</span>
                        </div>
                        <div className="absolute bottom-3 right-3 text-white">
                          <div className="flex items-center space-x-1">
                            <span className="text-xs">5/5 ingredients</span>
                            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Salmon Bowl */}
                    <div 
                      className="flex-shrink-0 w-80 h-40 bg-white rounded-xl shadow-lg overflow-hidden border cursor-pointer transition-transform hover:scale-105"
                      onClick={() => openRecipeModal({
                        id: 'salmon-bowl',
                        name: 'Grilled Salmon Bowl',
                        description: 'Fresh salmon with vegetables and rice for a healthy meal',
                        ingredients: [
                          { name: 'Salmon Fillet', amount: '300g', available: true },
                          { name: 'Rice', amount: '1 cup', available: true },
                          { name: 'Broccoli', amount: '200g', available: true },
                          { name: 'Carrots', amount: '100g', available: true },
                          { name: 'Lemon', amount: '1 piece', available: true }
                        ],
                        instructions: [
                          'Cook rice according to package instructions',
                          'Season salmon with salt, pepper and lemon',
                          'Steam broccoli and carrots until tender',
                          'Grill salmon for 6-8 minutes each side',
                          'Assemble bowl with rice, vegetables and salmon',
                          'Serve with lemon wedges'
                        ],
                        difficulty: 'Medium',
                        time: '25 min',
                        servings: 2,
                        category: 'Healthy',
                        videoUrl: 'https://www.youtube.com/watch?v=example2',
                        websiteUrl: 'https://www.allrecipes.com/recipe/example'
                      })}
                    >
                      <div className="relative h-full">
                        <div 
                          className="absolute inset-0 bg-cover bg-center"
                          style={{
                            backgroundImage: 'url(https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=500&h=300&fit=crop&crop=center)'
                          }}
                        >
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                        </div>
                        <div className="absolute bottom-3 left-3 text-white">
                          <h4 className="text-lg font-bold">🐟 Grilled Salmon Bowl</h4>
                          <p className="text-sm opacity-90">Healthy & Nutritious</p>
                        </div>
                        <div className="absolute top-3 right-3 bg-black/30 backdrop-blur-sm rounded-full px-2 py-1">
                          <span className="text-white text-xs">25 min</span>
                        </div>
                        <div className="absolute bottom-3 right-3 text-white">
                          <div className="flex items-center space-x-1">
                            <span className="text-xs">5/5 ingredients</span>
                            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Pasta Dish */}
                    <div 
                      className="flex-shrink-0 w-80 h-40 bg-white rounded-xl shadow-lg overflow-hidden border cursor-pointer transition-transform hover:scale-105"
                      onClick={() => openRecipeModal({
                        id: 'pasta',
                        name: 'Creamy Chicken Pasta',
                        description: 'Rich and creamy pasta with tender chicken pieces',
                        ingredients: [
                          { name: 'Pasta', amount: '300g', available: true },
                          { name: 'Chicken Breast', amount: '300g', available: true },
                          { name: 'Milk', amount: '200ml', available: true },
                          { name: 'Garlic', amount: '3 cloves', available: true },
                          { name: 'Butter', amount: '50g', available: true }
                        ],
                        instructions: [
                          'Cook pasta according to package directions',
                          'Cut chicken into bite-sized pieces and season',
                          'Cook chicken in butter until golden brown',
                          'Add minced garlic and cook for 1 minute',
                          'Add milk and simmer until thickened',
                          'Toss with cooked pasta and serve hot'
                        ],
                        difficulty: 'Easy',
                        time: '18 min',
                        servings: 3,
                        category: 'Comfort Food',
                        videoUrl: 'https://www.youtube.com/watch?v=example3',
                        websiteUrl: 'https://www.bonappetit.com/recipe/example'
                      })}
                    >
                      <div className="relative h-full">
                        <div 
                          className="absolute inset-0 bg-cover bg-center"
                          style={{
                            backgroundImage: 'url(https://images.unsplash.com/photo-1555949258-eb67b1ef0ceb?w=500&h=300&fit=crop&crop=center)'
                          }}
                        >
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                        </div>
                        <div className="absolute bottom-3 left-3 text-white">
                          <h4 className="text-lg font-bold">🍝 Creamy Chicken Pasta</h4>
                          <p className="text-sm opacity-90">Rich & Comforting</p>
                        </div>
                        <div className="absolute top-3 right-3 bg-black/30 backdrop-blur-sm rounded-full px-2 py-1">
                          <span className="text-white text-xs">18 min</span>
                        </div>
                        <div className="absolute bottom-3 right-3 text-white">
                          <div className="flex items-center space-x-1">
                            <span className="text-xs">5/5 ingredients</span>
                            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* DIY Recipe Button */}
                    <div 
                      className="flex-shrink-0 w-80 h-40 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl shadow-lg overflow-hidden border cursor-pointer transition-transform hover:scale-105"
                      onClick={() => {
                        // Add DIY recipe functionality here
                        alert('DIY Recipe Creator - Coming Soon!');
                      }}
                    >
                      <div className="h-full p-6 flex flex-col items-center justify-center text-white relative">
                        <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mb-4">
                          <Plus className="h-8 w-8" />
                        </div>
                        <h4 className="text-lg font-bold text-center">✨ Create Your Own</h4>
                        <p className="text-sm opacity-90 text-center mt-1">DIY Recipe Builder</p>
                        <div className="absolute top-3 right-3">
                          <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
                            <ChefHat className="h-3 w-3" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="fridge" className="mt-0 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-medium">⚡ Energy Tracking</h2>
              </div>

              {/* Energy Usage Display */}
              <Card className="overflow-hidden">
                <CardContent className="p-0">
                  <div 
                    className={`p-6 text-center text-white bg-gradient-to-r ${
                      (() => {
                        const isEnergySaving = energyUsage <= 3.0; // Good energy usage threshold
                        return isEnergySaving 
                          ? 'from-green-400 via-green-500 to-green-600' 
                          : 'from-red-400 via-red-500 to-red-600';
                      })()
                    }`}
                  >
                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <p className="text-sm opacity-90 mb-1">Energy Usage</p>
                        <p className="text-2xl font-bold">{energyUsage} kWh</p>
                        <p className="text-xs opacity-90">per day</p>
                      </div>
                      <div>
                        <p className="text-sm opacity-90 mb-1">Door Open Time</p>
                        <p className="text-2xl font-bold">{doorOpenTime}s</p>
                        <p className="text-xs opacity-90">{doorOpenCount} opens today</p>
                      </div>
                    </div>
                    <div className="mt-4">
                      <p className="text-sm opacity-90">
                        {energyUsage <= 3.0 ? '🌱 Energy Efficient' : '⚠️ High Energy Usage'}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* AI Energy Monitor System */}
              <Card>
                <CardContent className="p-6">
                  <div className="text-center space-y-4">
                    <div>
                      <h3 className="text-lg font-medium mb-2">🤖 AI Energy Monitor</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Let AI optimize your fridge energy consumption automatically
                      </p>
                    </div>
                    
                    <Button
                      onClick={() => setAiEnergyMonitor(!aiEnergyMonitor)}
                      className={`w-full h-14 text-base transition-all duration-300 ${
                        aiEnergyMonitor 
                          ? 'bg-gradient-to-r from-blue-500 via-purple-500 to-green-500 hover:from-blue-600 hover:via-purple-600 hover:to-green-600 text-white shadow-lg transform hover:scale-105' 
                          : 'bg-muted hover:bg-muted/80 text-muted-foreground'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <Brain className="h-5 w-5" />
                        <span>
                          {aiEnergyMonitor ? '🟢 AI Monitor Active' : 'Activate AI Monitor'}
                        </span>
                      </div>
                    </Button>
                    
                    {aiEnergyMonitor && (
                      <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                        <div className="flex items-center space-x-2 mb-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                          <p className="text-sm font-medium text-blue-800">AI Monitor Status</p>
                        </div>
                        <p className="text-xs text-blue-700">
                          ✓ Learning your usage patterns<br/>
                          ✓ Optimizing temperature cycles<br/>
                          ✓ Monitoring door usage efficiency
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Temperature Control */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Thermometer className="h-5 w-5 text-blue-500" />
                    <span>Fridge</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Current: {fridgeStatus.temperature}°C</span>
                      <span>Target: {fridgeSettings.temperature}°C</span>
                    </div>
                    <Slider
                      value={[fridgeSettings.temperature]}
                      onValueChange={(value) => updateFridgeSettings('temperature', value[0])}
                      min={1}
                      max={8}
                      step={0.5}
                      className="w-full"
                    />
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>1°C</span>
                      <span>8°C</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Freezer Temperature Control */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Snowflake className="h-5 w-5 text-cyan-500" />
                    <span>Freezer</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Current: {fridgeStatus.freezerTemperature}°C</span>
                      <span>Target: {fridgeSettings.freezerTemperature}°C</span>
                    </div>
                    <Slider
                      value={[fridgeSettings.freezerTemperature]}
                      onValueChange={(value) => updateFridgeSettings('freezerTemperature', value[0])}
                      min={-25}
                      max={-10}
                      step={0.5}
                      className="w-full"
                    />
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>-25°C</span>
                      <span>-10°C</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Energy Efficiency Analytics */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Activity className="h-5 w-5 text-blue-500" />
                    <span>Energy Efficiency</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-green-50 rounded-lg">
                      <p className="text-xl font-bold text-green-600">92%</p>
                      <p className="text-xs text-green-700">Efficiency Score</p>
                    </div>
                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                      <p className="text-xl font-bold text-blue-600">$12</p>
                      <p className="text-xs text-blue-700">Monthly Cost</p>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Energy Goal Progress</span>
                      <span className="text-sm text-muted-foreground">85/100%</span>
                    </div>
                    <Progress value={85} className="h-2" />
                  </div>
                </CardContent>
              </Card>

              {/* Smart Settings */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Settings className="h-5 w-5 text-gray-500" />
                    <span>Smart Settings</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="font-medium">Energy Saving Mode</p>
                      <p className="text-sm text-muted-foreground">Optimize power consumption</p>
                    </div>
                    <Switch
                      checked={fridgeSettings.energySaving}
                      onCheckedChange={(checked) => updateFridgeSettings('energySaving', checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="font-medium">Auto Defrost</p>
                      <p className="text-sm text-muted-foreground">Automatic defrost cycle</p>
                    </div>
                    <Switch
                      checked={fridgeSettings.autoDefrost}
                      onCheckedChange={(checked) => updateFridgeSettings('autoDefrost', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="font-medium">Door Alarm</p>
                      <p className="text-sm text-muted-foreground">Alert when door left open</p>
                    </div>
                    <Switch
                      checked={fridgeSettings.doorAlarm}
                      onCheckedChange={(checked) => updateFridgeSettings('doorAlarm', checked)}
                    />
                  </div>
                </CardContent>
              </Card>


            </TabsContent>

            <TabsContent value="inventory" className="mt-0 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-medium">Inventory by Location</h2>
                <div className="flex items-center space-x-2">
                  {/* Enhanced Search Button */}
                  <Input
                    placeholder="🔍 Search items..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-48"
                  />
                </div>
              </div>

              {/* Filter Chips */}
              <div className="flex space-x-2 overflow-x-auto pb-2" style={{scrollbarWidth: 'none', msOverflowStyle: 'none'}}>
                {(['all', 'fridge', 'freezer', 'pantry', 'expiring', 'fresh'] as const).map((filter) => (
                  <Button
                    key={filter}
                    size="sm"
                    variant={inventoryFilter === filter ? "default" : "outline"}
                    onClick={() => setInventoryFilter(filter)}
                    className="flex-shrink-0 capitalize"
                  >
                    {filter === 'all' && '📦 All'}
                    {filter === 'fridge' && '❄️ Fridge'}
                    {filter === 'freezer' && '🧊 Freezer'}
                    {filter === 'pantry' && '🥫 Pantry'}
                    {filter === 'expiring' && '⏰ Expiring'}
                    {filter === 'fresh' && '✅ Fresh'}
                  </Button>
                ))}
              </div>

              {/* Location Tabs */}
              <div className="grid grid-cols-3 gap-2">
                {['fridge', 'freezer', 'pantry'].map((location) => (
                  <div key={location} className="text-center">
                    <p className="text-sm font-medium capitalize">{location}</p>
                    <p className="text-xs text-muted-foreground">
                      {groceries.filter(item => item.location === location).length} items
                    </p>
                  </div>
                ))}
              </div>

              <div className="space-y-3">
                {groceries
                  .filter(item => {
                    // Filter by search query
                    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                        item.category.toLowerCase().includes(searchQuery.toLowerCase());
                    
                    // Filter by category
                    const days = getDaysUntilExpiry(item.expiryDate);
                    const isExpiring = days <= 3 && days >= 0;
                    const isFresh = days > 3;
                    
                    let matchesFilter = true;
                    switch (inventoryFilter) {
                      case 'fridge':
                        matchesFilter = item.location === 'fridge';
                        break;
                      case 'freezer':
                        matchesFilter = item.location === 'freezer';
                        break;
                      case 'pantry':
                        matchesFilter = item.location === 'pantry';
                        break;
                      case 'expiring':
                        matchesFilter = isExpiring;
                        break;
                      case 'fresh':
                        matchesFilter = isFresh;
                        break;
                      default:
                        matchesFilter = true;
                    }
                    
                    return matchesSearch && matchesFilter;
                  })
                  .map(item => {
                    const days = getDaysUntilExpiry(item.expiryDate);
                    const isExpired = days < 0;
                    const isExpiring = days <= 3 && days >= 0;

                    return (
                      <Card key={item.id} className={isExpired ? 'border-destructive' : isExpiring ? 'border-orange-500' : ''}>
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <div className="flex items-center space-x-2">
                                <h3 className="font-medium">{item.name}</h3>
                                <Badge variant="outline" className="text-xs">
                                  {item.category}
                                </Badge>
                                <Badge variant="secondary" className="text-xs capitalize">
                                  {item.location}
                                </Badge>
                              </div>
                              <p className="text-sm text-muted-foreground">
                                {item.quantity} {item.unit}
                              </p>
                              <div className="flex items-center space-x-2 mt-2">
                                <Calendar className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm text-muted-foreground">
                                  Expires: {new Date(item.expiryDate).toLocaleDateString()}
                                </span>
                              </div>
                            </div>
                            <div className="flex flex-col items-end space-y-2">
                              <Badge 
                                variant={isExpired ? "destructive" : isExpiring ? "secondary" : "outline"}
                              >
                                {isExpired ? 'Expired' : isExpiring ? `${days}d left` : 'Fresh'}
                              </Badge>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => removeGroceryItem(item.id)}
                                className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                  
                {groceries
                  .filter(item => {
                    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                        item.category.toLowerCase().includes(searchQuery.toLowerCase());
                    
                    const days = getDaysUntilExpiry(item.expiryDate);
                    const isExpiring = days <= 3 && days >= 0;
                    const isFresh = days > 3;
                    
                    let matchesFilter = true;
                    switch (inventoryFilter) {
                      case 'fridge':
                        matchesFilter = item.location === 'fridge';
                        break;
                      case 'freezer':
                        matchesFilter = item.location === 'freezer';
                        break;
                      case 'pantry':
                        matchesFilter = item.location === 'pantry';
                        break;
                      case 'expiring':
                        matchesFilter = isExpiring;
                        break;
                      case 'fresh':
                        matchesFilter = isFresh;
                        break;
                      default:
                        matchesFilter = true;
                    }
                    
                    return matchesSearch && matchesFilter;
                  }).length === 0 && (
                  <div className="text-center py-8">
                    <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground mb-2">No items found</p>
                    <p className="text-sm text-muted-foreground">
                      {searchQuery ? `No items match "${searchQuery}"` : `No items in ${inventoryFilter} category`}
                    </p>
                  </div>
                )}
              </div>


            </TabsContent>

            <TabsContent value="analytics" className="mt-0 space-y-4">
              {!showDetailedAnalytics ? (
                <>
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-medium">🍽️ Food Analytics</h2>
                    <div className="relative">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowMonthYearDropdown(!showMonthYearDropdown)}
                        className="flex items-center space-x-2"
                      >
                        <Calendar className="h-4 w-4" />
                        <span>{getSelectedPeriodDisplay()}</span>
                      </Button>
                      
                      {showMonthYearDropdown && (
                        <div className={`absolute right-0 top-full mt-2 w-64 rounded-lg shadow-lg border z-50 ${userSettings.darkMode ? 'bg-gray-900 border-gray-700' : 'bg-white'}`}>
                          <div className="p-4 space-y-4">
                            <div>
                              <Label className={userSettings.darkMode ? 'text-white' : ''}>Month</Label>
                              <select
                                value={selectedPeriod.month}
                                onChange={(e) => setSelectedPeriod(prev => ({ ...prev, month: parseInt(e.target.value) }))}
                                className={`w-full p-2 border rounded-md ${userSettings.darkMode ? 'bg-gray-800 border-gray-600 text-white' : 'bg-background'}`}
                              >
                                {['January', 'February', 'March', 'April', 'May', 'June', 
                                  'July', 'August', 'September', 'October', 'November', 'December'].map((month, index) => (
                                  <option key={index} value={index} disabled={
                                    selectedPeriod.year === 2025 && index > 6
                                  }>
                                    {month}
                                  </option>
                                ))}
                              </select>
                            </div>
                            <div>
                              <Label className={userSettings.darkMode ? 'text-white' : ''}>Year</Label>
                              <select
                                value={selectedPeriod.year}
                                onChange={(e) => setSelectedPeriod(prev => ({ ...prev, year: parseInt(e.target.value) }))}
                                className={`w-full p-2 border rounded-md ${userSettings.darkMode ? 'bg-gray-800 border-gray-600 text-white' : 'bg-background'}`}
                              >
                                <option value={2024}>2024</option>
                                <option value={2025}>2025</option>
                              </select>
                            </div>
                            <Button 
                              size="sm" 
                              onClick={() => setShowMonthYearDropdown(false)}
                              className="w-full"
                            >
                              Done
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Total Consumption with Health-based Gradient */}
                  <Card className="overflow-hidden">
                    <CardContent className="p-0">
                      <div 
                        className={`p-6 text-center text-white bg-gradient-to-r ${
                          (() => {
                            const currentData = getCurrentMonthData();
                            if (!currentData) return 'from-gray-400 to-gray-600';
                            
                            const totalConsumption = currentData.reduce((sum, item) => sum + item.value, 0);
                            const isHealthy = totalConsumption >= 2500 && totalConsumption <= 4000; // Healthy range 2.5-4kg
                            
                            return isHealthy 
                              ? 'from-green-400 via-green-500 to-green-600' 
                              : 'from-red-400 via-red-500 to-red-600';
                          })()
                        }`}
                      >
                        <p className="text-sm opacity-90 mb-1">Total Consumption</p>
                        <p className="text-3xl font-bold">
                          {getCurrentMonthData() ? 
                            ((getCurrentMonthData()?.reduce((sum, item) => sum + item.value, 0) || 0) / 1000).toFixed(1) + ' kg' 
                            : 'N/A'}
                        </p>
                        <p className="text-sm opacity-90">{getSelectedPeriodDisplay()}</p>
                      </div>
                    </CardContent>
                  </Card>



                  {/* Interactive Pie Chart */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Consumption Analysis</CardTitle>
                      <CardDescription>
                        Click chart to toggle details • {getSelectedPeriodDisplay()}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {getCurrentMonthData() ? (
                        <div className="space-y-4">
                          <ResponsiveContainer width="100%" height={240}>
                            <PieChart>
                              <Pie
                                data={getCurrentMonthData()}
                                cx="50%"
                                cy="50%"
                                outerRadius={90}
                                dataKey="value"
                                onClick={(data) => {
                                  setSelectedPieSlice(selectedPieSlice === data.name ? null : data.name);
                                }}
                                className="cursor-pointer"
                                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                              >
                                {getCurrentMonthData()?.map((entry, index) => (
                                  <Cell 
                                    key={`cell-${index}`} 
                                    fill={entry.color} 
                                    stroke={selectedPieSlice === entry.name ? "#333" : "none"}
                                    strokeWidth={selectedPieSlice === entry.name ? 3 : 0}
                                  />
                                ))}
                              </Pie>
                              <Tooltip 
                                formatter={(value: number, name) => [`${value}g`, name]}
                              />
                            </PieChart>
                          </ResponsiveContainer>

                          {/* Category Breakdown */}
                          <div className="space-y-3">
                            {getCurrentMonthData()?.map((category) => (
                              <div 
                                key={category.name}
                                className={`flex items-center justify-between p-3 rounded-lg border transition-all cursor-pointer ${
                                  selectedPieSlice === category.name 
                                    ? 'bg-gray-50 border-gray-300' 
                                    : 'hover:bg-gray-50'
                                }`}
                                onClick={() => {
                                  setSelectedCategory(category.name);
                                  setShowDetailedAnalytics(true);
                                }}
                              >
                                <div className="flex items-center space-x-3">
                                  <div 
                                    className="w-4 h-4 rounded-full" 
                                    style={{ backgroundColor: category.color }}
                                  ></div>
                                  <span className="font-medium">{category.name}</span>
                                </div>
                                <div className="flex items-center space-x-3">
                                  <span className="text-sm font-medium">
                                    {category.value}g
                                  </span>
                                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <div className="text-center py-8">
                          <p className="text-muted-foreground">No data available for selected period</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Yearly Trend Chart */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <TrendingUp className="h-5 w-5 text-blue-500" />
                        <span>Consumption Trends - {selectedPeriod.year}</span>
                      </CardTitle>
                      <CardDescription>
                        Monthly consumption throughout the year
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={200}>
                        <LineChart data={getYearlyTrendData()}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="month" />
                          <YAxis 
                            label={{ value: 'Total (kg)', angle: -90, position: 'insideLeft' }}
                            tickFormatter={(value) => (value / 1000).toFixed(1)}
                          />
                          <Tooltip 
                            formatter={(value: number) => [`${(value / 1000).toFixed(1)}kg`, 'Total Consumption']}
                            labelFormatter={(label) => `Month: ${label}`}
                          />
                          <Line 
                            type="monotone" 
                            dataKey="total" 
                            stroke="#8884d8" 
                            strokeWidth={3}
                            dot={{ fill: '#8884d8', strokeWidth: 2, r: 4 }}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>


                </>
              ) : (
                /* Detailed Analytics View */
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Button
                      variant="ghost"
                      onClick={() => {
                        setShowDetailedAnalytics(false);
                        setSelectedCategory(null);
                      }}
                      className="flex items-center space-x-2"
                    >
                      <ArrowRight className="h-4 w-4 rotate-180" />
                      <span>Back to Overview</span>
                    </Button>
                    <div className="relative">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowMonthYearDropdown(!showMonthYearDropdown)}
                        className="flex items-center space-x-2"
                      >
                        <Calendar className="h-4 w-4" />
                        <span>{getSelectedPeriodDisplay()}</span>
                      </Button>
                      
                      {showMonthYearDropdown && (
                        <div className={`absolute right-0 top-full mt-2 w-64 rounded-lg shadow-lg border z-50 ${userSettings.darkMode ? 'bg-gray-900 border-gray-700' : 'bg-white'}`}>
                          <div className="p-4 space-y-4">
                            <div>
                              <Label className={userSettings.darkMode ? 'text-white' : ''}>Month</Label>
                              <select
                                value={selectedPeriod.month}
                                onChange={(e) => setSelectedPeriod(prev => ({ ...prev, month: parseInt(e.target.value) }))}
                                className={`w-full p-2 border rounded-md ${userSettings.darkMode ? 'bg-gray-800 border-gray-600 text-white' : 'bg-background'}`}
                              >
                                {['January', 'February', 'March', 'April', 'May', 'June', 
                                  'July', 'August', 'September', 'October', 'November', 'December'].map((month, index) => (
                                  <option key={index} value={index} disabled={
                                    selectedPeriod.year === 2025 && index > 6
                                  }>
                                    {month}
                                  </option>
                                ))}
                              </select>
                            </div>
                            <div>
                              <Label className={userSettings.darkMode ? 'text-white' : ''}>Year</Label>
                              <select
                                value={selectedPeriod.year}
                                onChange={(e) => setSelectedPeriod(prev => ({ ...prev, year: parseInt(e.target.value) }))}
                                className={`w-full p-2 border rounded-md ${userSettings.darkMode ? 'bg-gray-800 border-gray-600 text-white' : 'bg-background'}`}
                              >
                                <option value={2024}>2024</option>
                                <option value={2025}>2025</option>
                              </select>
                            </div>
                            <Button 
                              size="sm" 
                              onClick={() => setShowMonthYearDropdown(false)}
                              className="w-full"
                            >
                              Done
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {selectedCategory && categoryBreakdown[selectedCategory] && (
                    <>
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center space-x-2">
                            <Package className="h-5 w-5 text-primary" />
                            <span>{categoryBreakdown[selectedCategory].name}</span>
                          </CardTitle>
                          <CardDescription>
                            Detailed breakdown of {selectedCategory.toLowerCase()} consumption
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            {categoryBreakdown[selectedCategory].items.map((item, index) => {
                              const totalCategoryAmount = categoryBreakdown[selectedCategory].items.reduce((sum, i) => sum + i.amount, 0);
                              const percentage = Math.round((item.amount / totalCategoryAmount) * 100);
                              
                              return (
                                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                  <div className="flex items-center space-x-3">
                                    <div 
                                      className="w-4 h-4 rounded-full" 
                                      style={{ backgroundColor: item.color }}
                                    ></div>
                                    <span className="font-medium">{item.name}</span>
                                  </div>
                                  <div className="flex items-center space-x-3">
                                    <span className="text-sm text-muted-foreground">{percentage}%</span>
                                    <span className="text-sm font-medium">{item.amount}g</span>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </CardContent>
                      </Card>

                      {/* Subcategory Pie Chart */}
                      <Card>
                        <CardHeader>
                          <CardTitle>Distribution Breakdown</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <ResponsiveContainer width="100%" height={220}>
                            <PieChart>
                              <Pie
                                data={categoryBreakdown[selectedCategory].items}
                                cx="50%"
                                cy="50%"
                                outerRadius={80}
                                dataKey="amount"
                                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                              >
                                {categoryBreakdown[selectedCategory].items.map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                              </Pie>
                              <Tooltip formatter={(value) => [`${value}g`, 'Amount']} />
                            </PieChart>
                          </ResponsiveContainer>
                        </CardContent>
                      </Card>

                      {/* Monthly Trend for Category */}
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center space-x-2">
                            <TrendingUp className="h-5 w-5 text-green-500" />
                            <span>{selectedCategory} Trend - {selectedPeriod.year}</span>
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <ResponsiveContainer width="100%" height={180}>
                            <LineChart data={historicalData[selectedPeriod.year.toString()]?.map(month => ({
                              month: month.month,
                              amount: month[selectedCategory.toLowerCase() as keyof ConsumptionData] as number
                            })) || []}>
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis dataKey="month" />
                              <YAxis 
                                label={{ value: 'Grams', angle: -90, position: 'insideLeft' }}
                              />
                              <Tooltip formatter={(value) => [`${value}g`, selectedCategory]} />
                              <Line 
                                type="monotone" 
                                dataKey="amount" 
                                stroke="#82ca9d" 
                                strokeWidth={2}
                                dot={{ fill: '#82ca9d', r: 3 }}
                              />
                            </LineChart>
                          </ResponsiveContainer>
                        </CardContent>
                      </Card>
                    </>
                  )}
                </div>
              )}
            </TabsContent>

            <TabsContent value="shopping" className="mt-0 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-medium">Shopping List</h2>
                <Badge variant="outline">
                  {shoppingList.filter(item => !item.completed).length} pending
                </Badge>
              </div>

              <div className="space-y-3">
                {shoppingList.map(item => (
                  <Card key={item.id} className={item.completed ? 'opacity-60' : ''}>
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          checked={item.completed}
                          onChange={() => toggleShoppingItem(item.id)}
                          className="h-4 w-4 rounded border-gray-300"
                        />
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <h3 className={`font-medium ${item.completed ? 'line-through' : ''}`}>
                              {item.name}
                            </h3>
                            <Badge 
                              variant={item.priority === 'high' ? 'destructive' : item.priority === 'medium' ? 'secondary' : 'outline'}
                              className="text-xs"
                            >
                              {item.priority}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {item.quantity} {item.unit} • {item.category}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Smart Suggestions */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <TrendingUp className="h-5 w-5 text-blue-600" />
                    <span>Smart Suggestions</span>
                  </CardTitle>
                  <CardDescription>
                    Based on your consumption patterns
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm font-medium">You usually buy milk every 4 days</p>
                    <p className="text-xs text-muted-foreground">Consider adding to your list</p>
                  </div>
                  <div className="p-3 bg-green-50 rounded-lg">
                    <p className="text-sm font-medium">Spinach inventory is low</p>
                    <p className="text-xs text-muted-foreground">Based on your current fridge contents</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="settings" className="mt-0 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-medium">Settings</h2>
                <Button variant="outline" size="sm">
                  <User className="h-4 w-4 mr-2" />
                  Profile
                </Button>
              </div>

              {/* User Profile */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <User className="h-5 w-5 text-primary" />
                    <span>User Profile</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      value={userSettings.name}
                      onChange={(e) => setUserSettings({...userSettings, name: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={userSettings.email}
                      onChange={(e) => setUserSettings({...userSettings, email: e.target.value})}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Notification Settings */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Bell className="h-5 w-5 text-orange-500" />
                    <span>Notifications</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="font-medium">Push Notifications</p>
                      <p className="text-sm text-muted-foreground">Receive alerts on your device</p>
                    </div>
                    <Switch
                      checked={userSettings.notifications}
                      onCheckedChange={(checked) => setUserSettings({...userSettings, notifications: checked})}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="font-medium">Email Notifications</p>
                      <p className="text-sm text-muted-foreground">Get updates via email</p>
                    </div>
                    <Switch defaultChecked={false} />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="font-medium">SMS Alerts</p>
                      <p className="text-sm text-muted-foreground">Critical alerts via SMS</p>
                    </div>
                    <Switch defaultChecked={false} />
                  </div>
                </CardContent>
              </Card>

              {/* App Preferences */}
              <Card className={userSettings.darkMode ? 'bg-gray-900 border-gray-700' : ''}>
                <CardHeader>
                  <CardTitle className={`flex items-center space-x-2 ${userSettings.darkMode ? 'text-white' : ''}`}>
                    <Settings className={`h-5 w-5 ${userSettings.darkMode ? 'text-gray-300' : 'text-gray-500'}`} />
                    <span>App Preferences</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className={`font-medium ${userSettings.darkMode ? 'text-white' : ''}`}>Dark Mode</p>
                      <p className={`text-sm ${userSettings.darkMode ? 'text-gray-400' : 'text-muted-foreground'}`}>Toggle dark theme</p>
                    </div>
                    <Switch
                      checked={userSettings.darkMode}
                      onCheckedChange={(checked) => setUserSettings({...userSettings, darkMode: checked})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className={userSettings.darkMode ? 'text-white' : ''}>Language</Label>
                    <Input 
                      value={userSettings.language} 
                      disabled 
                      className={userSettings.darkMode ? 'bg-gray-800 border-gray-600 text-white' : ''}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className={userSettings.darkMode ? 'text-white' : ''}>Units</Label>
                    <Input 
                      value={userSettings.units} 
                      disabled 
                      className={userSettings.darkMode ? 'bg-gray-800 border-gray-600 text-white' : ''}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Security */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Shield className="h-5 w-5 text-green-500" />
                    <span>Security</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button variant="outline" className="w-full justify-start">
                    <Lock className="h-4 w-4 mr-2" />
                    Change Password
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Smartphone className="h-4 w-4 mr-2" />
                    Two-Factor Authentication
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Eye className="h-4 w-4 mr-2" />
                    Privacy Settings
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </div>

          {/* Fixed Bottom Navigation */}
          <TabsList className={`fixed bottom-0 left-0 right-0 grid w-full grid-cols-5 border-t z-50 max-w-md mx-auto ${userSettings.darkMode ? 'bg-gray-900 border-gray-700' : 'bg-white'}`}>
            <TabsTrigger value="home" className="flex flex-col space-y-0.5 py-2">
              <Home className="h-4 w-4" />
              <span className="text-xs font-medium">Home</span>
              <span className="text-[10px] text-muted-foreground leading-tight">Dashboard</span>
            </TabsTrigger>
            <TabsTrigger value="inventory" className="flex flex-col space-y-0.5 py-2">
              <Package className="h-4 w-4" />
              <span className="text-xs font-medium">Inventory</span>
              <span className="text-[10px] text-muted-foreground leading-tight">Items</span>
            </TabsTrigger>
            <TabsTrigger value="fridge" className="flex flex-col space-y-0.5 py-2">
              <Zap className="h-4 w-4" />
              <span className="text-xs font-medium">Energy</span>
              <span className="text-[10px] text-muted-foreground leading-tight">Tracking</span>
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex flex-col space-y-0.5 py-2">
              <BarChart3 className="h-4 w-4" />
              <span className="text-xs font-medium">Analytics</span>
              <span className="text-[10px] text-muted-foreground leading-tight">Reports</span>
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex flex-col space-y-0.5 py-2">
              <Settings className="h-4 w-4" />
              <span className="text-xs font-medium">Settings</span>
              <span className="text-[10px] text-muted-foreground leading-tight">Profile</span>
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Enhanced Recipe Dropdown for Home Page */}
        {activeTab === 'home' && showRecipeDropdown && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={() => setShowRecipeDropdown(false)}>
            <div 
              className={`w-full max-w-lg rounded-xl shadow-2xl border-2 max-h-[85vh] overflow-hidden ${userSettings.darkMode ? 'bg-gray-900 border-gray-600' : 'bg-white border-gray-200'} backdrop-blur-sm`}
              onClick={(e) => e.stopPropagation()}
            >
              <div className={`p-6 border-b bg-gradient-to-r from-orange-50 to-pink-50 ${userSettings.darkMode ? 'border-gray-700 from-gray-800 to-gray-800' : 'border-gray-100'}`}>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className={`font-bold text-xl flex items-center space-x-2 ${userSettings.darkMode ? 'text-white' : 'text-gray-800'}`}>
                      <span>🍽️ Recipe Magic</span>
                    </h3>
                    <p className={`text-sm ${userSettings.darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Delicious recipes from your fresh ingredients</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowRecipeDropdown(false)}
                    className="h-8 w-8 p-0"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                
                {/* Recipe Search */}
                <div className="mt-4">
                  <Input
                    placeholder="🔍 Search recipes..."
                    value={recipeSearchQuery}
                    onChange={(e) => setRecipeSearchQuery(e.target.value)}
                    className={`w-full ${userSettings.darkMode ? 'bg-gray-800 border-gray-600 text-white' : ''}`}
                  />
                </div>
              </div>
              
              <div className="overflow-y-auto max-h-[calc(85vh-140px)] p-3">
                {/* Featured Recipe Cards - Vertical Layout */}
                <div className="space-y-4">
                  {/* Filter recipes by search */}
                  {[
                    {
                      id: 'burger',
                      name: 'Gourmet Burger',
                      description: 'Juicy beef patty with fresh ingredients and artisan bun',
                      ingredients: [
                        { name: 'Ground Beef', amount: '300g', available: true },
                        { name: 'Cheese', amount: '2 slices', available: true },
                        { name: 'Tomatoes', amount: '2 slices', available: true },
                        { name: 'Onions', amount: '1 medium', available: true },
                        { name: 'Bread', amount: '2 buns', available: true }
                      ],
                      instructions: [
                        'Season and form ground beef into patties',
                        'Heat grill or pan to medium-high heat',
                        'Cook patties for 4-5 minutes each side',
                        'Add cheese in the last minute of cooking',
                        'Toast buns lightly',
                        'Assemble burger with fresh vegetables and serve'
                      ],
                      difficulty: 'Medium',
                      time: '20 min',
                      servings: 2,
                      category: 'Main Course',
                      videoUrl: 'https://www.youtube.com/watch?v=example',
                      websiteUrl: 'https://www.foodnetwork.com/recipes/example'
                    },
                    {
                      id: 'salmon-bowl',
                      name: 'Grilled Salmon Bowl',
                      description: 'Fresh salmon with vegetables and rice for a healthy meal',
                      ingredients: [
                        { name: 'Salmon Fillet', amount: '300g', available: true },
                        { name: 'Rice', amount: '1 cup', available: true },
                        { name: 'Broccoli', amount: '200g', available: true },
                        { name: 'Carrots', amount: '100g', available: true },
                        { name: 'Lemon', amount: '1 piece', available: true }
                      ],
                      instructions: [
                        'Cook rice according to package instructions',
                        'Season salmon with salt, pepper and lemon',
                        'Steam broccoli and carrots until tender',
                        'Grill salmon for 6-8 minutes each side',
                        'Assemble bowl with rice, vegetables and salmon',
                        'Serve with lemon wedges'
                      ],
                      difficulty: 'Medium',
                      time: '25 min',
                      servings: 2,
                      category: 'Healthy',
                      videoUrl: 'https://www.youtube.com/watch?v=example2',
                      websiteUrl: 'https://www.allrecipes.com/recipe/example'
                    },
                    {
                      id: 'pasta',
                      name: 'Creamy Chicken Pasta',
                      description: 'Rich and creamy pasta with tender chicken pieces',
                      ingredients: [
                        { name: 'Pasta', amount: '300g', available: true },
                        { name: 'Chicken Breast', amount: '300g', available: true },
                        { name: 'Milk', amount: '200ml', available: true },
                        { name: 'Garlic', amount: '3 cloves', available: true },
                        { name: 'Butter', amount: '50g', available: true }
                      ],
                      instructions: [
                        'Cook pasta according to package directions',
                        'Cut chicken into bite-sized pieces and season',
                        'Cook chicken in butter until golden brown',
                        'Add minced garlic and cook for 1 minute',
                        'Add milk and simmer until thickened',
                        'Toss with cooked pasta and serve hot'
                      ],
                      difficulty: 'Easy',
                      time: '18 min',
                      servings: 3,
                      category: 'Comfort Food',
                      videoUrl: 'https://www.youtube.com/watch?v=example3',
                      websiteUrl: 'https://www.bonappetit.com/recipe/example'
                    },
                    ...getRecipeRecommendations()
                  ]
                  .filter(recipe => 
                    recipe.name.toLowerCase().includes(recipeSearchQuery.toLowerCase()) ||
                    recipe.description.toLowerCase().includes(recipeSearchQuery.toLowerCase()) ||
                    recipe.category.toLowerCase().includes(recipeSearchQuery.toLowerCase())
                  )
                  .slice(0, 7)
                  .map((recipe) => (
                    <div 
                      key={recipe.id}
                      className="bg-white rounded-xl shadow-lg overflow-hidden border cursor-pointer transition-transform hover:scale-[1.02]"
                      onClick={() => openRecipeModal(recipe)}
                    >
                      <div className="flex">
                        <div 
                          className="w-32 h-24 bg-cover bg-center flex-shrink-0"
                          style={{
                            backgroundImage: recipe.id === 'burger' 
                              ? 'url(https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=200&h=150&fit=crop&crop=center)'
                              : recipe.id === 'salmon-bowl'
                              ? 'url(https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=200&h=150&fit=crop&crop=center)'
                              : recipe.id === 'pasta'
                              ? 'url(https://images.unsplash.com/photo-1555949258-eb67b1ef0ceb?w=200&h=150&fit=crop&crop=center)'
                              : 'url(https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=200&h=150&fit=crop&crop=center)'
                          }}
                        ></div>
                        <div className="p-4 flex-1">
                          <h4 className="font-medium text-sm mb-1">{recipe.name}</h4>
                          <p className="text-xs text-muted-foreground mb-2">{recipe.description}</p>
                          <div className="flex items-center justify-between text-xs">
                            <span className="flex items-center space-x-1">
                              <Clock className="h-3 w-3" />
                              <span>{recipe.time}</span>
                            </span>
                            <div className="flex items-center space-x-1">
                              <span>{recipe.ingredients ? recipe.ingredients.filter((ing: any) => ing.available).length : recipe.matchingItems}/{recipe.ingredients ? recipe.ingredients.length : recipe.totalIngredients} ingredients</span>
                              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Attractive Centered Recipe Button - visible on inventory page */}
        {activeTab === 'inventory' && (
          <div className="fixed bottom-24 left-1/2 transform -translate-x-1/2 z-40" data-recipe-dropdown>
            <div className="relative">
              <Button 
                size="lg"
                onClick={() => setShowRecipeDropdown(!showRecipeDropdown)}
                className="h-16 px-8 rounded-full shadow-2xl text-white border-0 flex items-center justify-center space-x-3 bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 hover:from-orange-600 hover:via-red-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105"
              >
                <ChefHat className="h-6 w-6" />
                <span className="text-base font-medium">🍳 Cook Something Delicious!</span>
              </Button>
              
              {getRecipeRecommendations().length > 0 && (
                <Badge className="absolute -top-3 -right-3 h-8 w-8 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 text-white flex items-center justify-center text-sm font-medium p-0 border-3 border-white shadow-lg animate-pulse">
                  {getRecipeRecommendations().length}
                </Badge>
              )}
              
              {showRecipeDropdown && (
                <div className={`absolute left-1/2 transform -translate-x-1/2 bottom-full mb-6 w-80 rounded-xl shadow-2xl border-2 z-50 max-h-96 overflow-y-auto ${userSettings.darkMode ? 'bg-gray-900 border-gray-600' : 'bg-white border-gray-200'} backdrop-blur-sm`}>
                  <div className={`p-4 border-b bg-gradient-to-r from-orange-50 to-pink-50 rounded-t-xl ${userSettings.darkMode ? 'border-gray-700 from-gray-800 to-gray-800' : 'border-gray-100'}`}>
                    <h3 className={`font-semibold text-lg flex items-center space-x-2 ${userSettings.darkMode ? 'text-white' : 'text-gray-800'}`}>
                      <span>🍽️ Recipe Magic</span>
                    </h3>
                    <p className={`text-sm ${userSettings.darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Delicious recipes from your fresh ingredients</p>
                  </div>
                  
                  {getRecipeRecommendations().length > 0 ? (
                    <div className="p-2">
                      {getRecipeRecommendations().map((recipe) => (
                        <div 
                          key={recipe.id}
                          className={`p-3 rounded-md cursor-pointer border-b last:border-b-0 ${userSettings.darkMode ? 'hover:bg-gray-800 border-gray-700 text-white' : 'hover:bg-gray-50'}`}
                          onClick={() => openRecipeModal(recipe)}
                        >
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex-1">
                              <h4 className="font-medium text-sm">{recipe.name}</h4>
                              <p className={`text-xs mb-2 ${userSettings.darkMode ? 'text-gray-400' : 'text-muted-foreground'}`}>{recipe.description}</p>
                            </div>
                            <Badge variant="outline" className="text-xs ml-2">
                              {recipe.difficulty}
                            </Badge>
                          </div>
                          
                          <div className="flex items-center justify-between text-xs">
                            <div className="flex items-center space-x-3">
                              <span className="flex items-center space-x-1">
                                <Clock className="h-3 w-3" />
                                <span>{recipe.time}</span>
                              </span>
                              <span>{recipe.servings} servings</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <span className={userSettings.darkMode ? 'text-gray-400' : 'text-muted-foreground'}>
                                {recipe.matchingItems}/{recipe.totalIngredients} ingredients
                              </span>
                              <div className="w-16 bg-gray-200 rounded-full h-1.5">
                                <div 
                                  className="bg-green-500 h-1.5 rounded-full" 
                                  style={{ width: `${recipe.matchPercentage}%` }}
                                ></div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-8 text-center">
                      <div className="text-6xl mb-4">🥘</div>
                      <p className={`text-base font-medium mb-2 ${userSettings.darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Ready to Cook?</p>
                      <p className={`text-sm ${userSettings.darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Add more fresh ingredients to unlock amazing recipe suggestions! ✨</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Scan Modal */}
        {showScanModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className={`rounded-lg p-6 m-4 w-full max-w-sm ${userSettings.darkMode ? 'bg-gray-900 text-white' : 'bg-white'}`}>
              <div className="flex items-center justify-between mb-4">
                <h3 className={`text-lg font-medium ${userSettings.darkMode ? 'text-white' : ''}`}>Scan Barcode</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowScanModal(false)}
                  className="h-8 w-8 p-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="bg-gray-100 rounded-lg p-8 mb-4 text-center">
                <Scan className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground mb-4">
                  Position the barcode within the frame
                </p>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 mb-4">
                  <div className="h-16 flex items-center justify-center">
                    <span className="text-muted-foreground">📱 Camera View</span>
                  </div>
                </div>
              </div>

              <Button onClick={mockScanResult} className="w-full">
                Simulate Scan
              </Button>
            </div>
          </div>
        )}

        {/* Add Item Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className={`rounded-lg p-6 w-full max-w-sm max-h-[90vh] overflow-y-auto ${userSettings.darkMode ? 'bg-gray-900 text-white' : 'bg-white'}`}>
              <div className="flex items-center justify-between mb-4">
                <h3 className={`text-lg font-medium ${userSettings.darkMode ? 'text-white' : ''}`}>Add Item</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setShowAddModal(false);
                    setNewItem({ name: '', category: '', expiryDate: '', quantity: 1, unit: '', location: 'fridge' });
                  }}
                  className="h-8 w-8 p-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="name" className={userSettings.darkMode ? 'text-white' : ''}>Item Name</Label>
                  <Input
                    id="name"
                    value={newItem.name}
                    onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                    placeholder="e.g., Milk, Bread, Apples"
                    className={userSettings.darkMode ? 'bg-gray-800 border-gray-600 text-white' : ''}
                  />
                </div>

                <div>
                  <Label htmlFor="category" className={userSettings.darkMode ? 'text-white' : ''}>Category</Label>
                  <Input
                    id="category"
                    value={newItem.category}
                    onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
                    placeholder="e.g., Dairy, Fruits, Vegetables"
                    className={userSettings.darkMode ? 'bg-gray-800 border-gray-600 text-white' : ''}
                  />
                </div>

                <div>
                  <Label htmlFor="location" className={userSettings.darkMode ? 'text-white' : ''}>Location</Label>
                  <select
                    id="location"
                    value={newItem.location}
                    onChange={(e) => setNewItem({ ...newItem, location: e.target.value as 'fridge' | 'freezer' | 'pantry' })}
                    className={`w-full p-2 border rounded-md ${userSettings.darkMode ? 'bg-gray-800 border-gray-600 text-white' : 'bg-background'}`}
                  >
                    <option value="fridge">Fridge</option>
                    <option value="freezer">Freezer</option>
                    <option value="pantry">Pantry</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="quantity" className={userSettings.darkMode ? 'text-white' : ''}>Quantity</Label>
                    <Input
                      id="quantity"
                      type="number"
                      value={newItem.quantity}
                      onChange={(e) => setNewItem({ ...newItem, quantity: parseInt(e.target.value) || 1 })}
                      min="1"
                      className={userSettings.darkMode ? 'bg-gray-800 border-gray-600 text-white' : ''}
                    />
                  </div>
                  <div>
                    <Label htmlFor="unit" className={userSettings.darkMode ? 'text-white' : ''}>Unit</Label>
                    <Input
                      id="unit"
                      value={newItem.unit}
                      onChange={(e) => setNewItem({ ...newItem, unit: e.target.value })}
                      placeholder="pieces, kg, bottles"
                      className={userSettings.darkMode ? 'bg-gray-800 border-gray-600 text-white' : ''}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="expiry" className={userSettings.darkMode ? 'text-white' : ''}>Expiry Date</Label>
                  <Input
                    id="expiry"
                    type="date"
                    value={newItem.expiryDate}
                    onChange={(e) => setNewItem({ ...newItem, expiryDate: e.target.value })}
                    className={userSettings.darkMode ? 'bg-gray-800 border-gray-600 text-white' : ''}
                  />
                </div>

                <Button onClick={addGroceryItem} className="w-full">
                  Add Item
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Notifications Modal */}
        {showNotifications && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className={`rounded-lg p-6 w-full max-w-sm max-h-[90vh] overflow-y-auto ${userSettings.darkMode ? 'bg-gray-900 text-white' : 'bg-white'}`}>
              <div className="flex items-center justify-between mb-4">
                <h3 className={`text-lg font-medium ${userSettings.darkMode ? 'text-white' : ''}`}>Notifications</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowNotifications(false)}
                  className="h-8 w-8 p-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              {notifications.length === 0 ? (
                <div className="text-center py-8">
                  <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No notifications</p>
                  <p className="text-sm text-muted-foreground">You're all caught up!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">
                      {notifications.length} notification{notifications.length !== 1 ? 's' : ''}
                    </p>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={clearAllNotifications}
                      className="text-xs"
                    >
                      Clear All
                    </Button>
                  </div>

                  <div className="space-y-3">
                    {notifications.map(notification => (
                      <div key={notification.id} className={`p-3 rounded-lg border ${
                        notification.severity === 'high' ? 'border-red-200 bg-red-50' :
                        notification.severity === 'medium' ? 'border-orange-200 bg-orange-50' :
                        'border-blue-200 bg-blue-50'
                      }`}>
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                              {notification.type === 'expiry' && <Calendar className="h-4 w-4 text-orange-600" />}
                              {notification.type === 'spoiled' && <AlertTriangle className="h-4 w-4 text-red-600" />}
                              {notification.type === 'door' && <Activity className="h-4 w-4 text-blue-600" />}
                              {notification.type === 'temperature' && <Thermometer className="h-4 w-4 text-blue-600" />}
                              {notification.type === 'energy' && <Zap className="h-4 w-4 text-green-600" />}
                              <Badge 
                                variant={
                                  notification.severity === 'high' ? 'destructive' :
                                  notification.severity === 'medium' ? 'secondary' :
                                  'outline'
                                }
                                className="text-xs"
                              >
                                {notification.severity}
                              </Badge>
                            </div>
                            <p className="text-sm font-medium">{notification.message}</p>
                            <p className="text-xs text-muted-foreground mt-1">
                              {new Date(notification.timestamp).toLocaleString()}
                            </p>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeNotification(notification.id)}
                            className="h-6 w-6 p-0 text-muted-foreground hover:text-destructive ml-2"
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Enhanced Recipe Details Modal */}
        {showRecipeModal && selectedRecipe && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className={`rounded-lg w-full max-w-md max-h-[90vh] overflow-hidden ${userSettings.darkMode ? 'bg-gray-900 text-white' : 'bg-white'}`}>
              {/* Recipe Header with Image */}
              <div className="relative h-48">
                <div 
                  className="absolute inset-0 bg-cover bg-center"
                  style={{
                    backgroundImage: selectedRecipe.id === 'burger' 
                      ? 'url(https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&h=300&fit=crop&crop=center)'
                      : selectedRecipe.id === 'salmon-bowl'
                      ? 'url(https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=500&h=300&fit=crop&crop=center)'
                      : selectedRecipe.id === 'pasta'
                      ? 'url(https://images.unsplash.com/photo-1555949258-eb67b1ef0ceb?w=500&h=300&fit=crop&crop=center)'
                      : 'url(https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=500&h=300&fit=crop&crop=center)'
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowRecipeModal(false)}
                  className="absolute top-4 right-4 h-8 w-8 p-0 bg-black/20 backdrop-blur-sm text-white hover:bg-black/40"
                >
                  <X className="h-4 w-4" />
                </Button>
                <div className="absolute bottom-4 left-4 text-white">
                  <h3 className="text-xl font-bold mb-1">{selectedRecipe.name}</h3>
                  <p className="text-sm opacity-90">{selectedRecipe.description}</p>
                </div>
              </div>

              <div className="p-6 overflow-y-auto max-h-[calc(90vh-192px)]">
                {/* Recipe Info */}
                <div className="mb-6">
                  <div className="flex items-center space-x-4 text-sm">
                    <div className="flex items-center space-x-1">
                      <Clock className="h-4 w-4 text-blue-500" />
                      <span>{selectedRecipe.time}</span>
                    </div>
                    <Badge variant="outline">{selectedRecipe.difficulty}</Badge>
                    <span>{selectedRecipe.servings} servings</span>
                  </div>
                </div>

                {/* External Links */}
                {(selectedRecipe.videoUrl || selectedRecipe.websiteUrl) && (
                  <div className="mb-6">
                    <h4 className={`font-medium mb-3 flex items-center space-x-2 ${userSettings.darkMode ? 'text-white' : ''}`}>
                      <Activity className="h-4 w-4 text-purple-500" />
                      <span>Learn More</span>
                    </h4>
                    <div className="flex space-x-2">
                      {selectedRecipe.videoUrl && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => window.open(selectedRecipe.videoUrl, '_blank')}
                          className="flex items-center space-x-1"
                        >
                          <span>🎥</span>
                          <span>Video</span>
                        </Button>
                      )}
                      {selectedRecipe.websiteUrl && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => window.open(selectedRecipe.websiteUrl, '_blank')}
                          className="flex items-center space-x-1"
                        >
                          <span>🌐</span>
                          <span>Website</span>
                        </Button>
                      )}
                    </div>
                  </div>
                )}

                <Separator className="my-4" />

                {/* Ingredients */}
                <div className="mb-6">
                  <h4 className={`font-medium mb-3 flex items-center space-x-2 ${userSettings.darkMode ? 'text-white' : ''}`}>
                    <Package className="h-4 w-4 text-green-500" />
                    <span>Ingredients</span>
                    <Badge variant="secondary" className="text-xs">
                      {selectedRecipe.matchingItems || selectedRecipe.ingredients.filter((ing: any) => ing.available).length}/{selectedRecipe.totalIngredients || selectedRecipe.ingredients.length} available
                    </Badge>
                  </h4>
                  <div className="space-y-2">
                    {selectedRecipe.ingredients.map((ingredient: any, index: number) => (
                      <div key={index} className={`flex items-center justify-between p-2 rounded-md ${userSettings.darkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
                        <div className="flex items-center space-x-2">
                          <div className={`w-2 h-2 rounded-full ${ingredient.available ? 'bg-green-500' : 'bg-red-500'}`}></div>
                          <span className="text-sm">{ingredient.name}</span>
                        </div>
                        <span className={`text-sm ${userSettings.darkMode ? 'text-gray-400' : 'text-muted-foreground'}`}>{ingredient.amount}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator className="my-4" />

                {/* Instructions */}
                <div className="mb-6">
                  <h4 className={`font-medium mb-3 flex items-center space-x-2 ${userSettings.darkMode ? 'text-white' : ''}`}>
                    <CheckCircle className="h-4 w-4 text-blue-500" />
                    <span>Instructions</span>
                  </h4>
                  <div className="space-y-3">
                    {selectedRecipe.instructions.map((instruction: string, index: number) => (
                      <div key={index} className="flex items-start space-x-3">
                        <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-medium flex-shrink-0 mt-0.5">
                          {index + 1}
                        </div>
                        <p className="text-sm leading-relaxed">{instruction}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-3">
                  <Button 
                    className="flex-1"
                    onClick={() => {
                      setShowRecipeModal(false);
                    }}
                  >
                    Start Cooking
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => {
                      const missingIngredients = selectedRecipe.ingredients.filter((ing: any) => !ing.available);
                      if (missingIngredients.length > 0) {
                        alert(`Missing ingredients: ${missingIngredients.map((ing: any) => ing.name).join(', ')}`);
                      }
                      setShowRecipeModal(false);
                    }}
                  >
                    Add Missing Items
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
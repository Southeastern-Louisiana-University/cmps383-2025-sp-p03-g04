import React, { useState } from "react";
import { View, Text, FlatList, Image, TouchableOpacity, ScrollView, TextInput } from "react-native";


// Define the type for menu items
type MenuItem = {
    id: string;
    name: string;
    description: string;
    price: string;
    image: string;
    category: string;
  };
  type CartItem = {
    foodItemId: string;
    quantity: number;
    specialInstructions?: string;
  };
  
// Food Categories
const categories = [
  "Chef's Starters",
  "Salads",
  "Sandwiches",
  "Burgers",
  "Entrees",
  "Desserts",
  "Beverages",
  "Candy",
];

// All Food Items
const items = [
  // Chef's Starters (1–17)
  {
    id: "1",
    name: "Chicken Tenders",
    description: "Seasoned fries, choice of BBQ, Buffalo, Nashville Hot, or ranch dressing",
    price: "$16.49",
    image: "https://images.unsplash.com/photo-1562967914-608f82629710?auto=format&fit=crop&w=1173&q=80",
    category: "Chef's Starters",
  },
  {
    id: "2",
    name: "Impossible Chicken Nuggets",
    description: "Plant-based nuggets with dipping sauce and fries",
    price: "$14.99",
    image: "https://images.unsplash.com/photo-1585325701956-60dd9c8553bc?auto=format&fit=crop&w=880&q=80",
    category: "Chef's Starters",
  },
  {
    id: "3",
    name: "Chicken Wings",
    description: "Bone-in wings with sauce options, celery & carrots",
    price: "$19.99",
    image: "https://images.unsplash.com/photo-1567620832903-9fc6debc209f?auto=format&fit=crop&w=780&q=80",
    category: "Chef's Starters",
  },
  {
    id: "4",
    name: "Boneless Wings",
    description: "Boneless wings with ranch or blue cheese",
    price: "$13.99",
    image: "https://images.unsplash.com/photo-1614398751058-eb2e0bf63e53?auto=format&fit=crop&w=880&q=80",
    category: "Chef's Starters",
  },
  {
    id: "5",
    name: "Wonton Mozzarella Sticks",
    description: "Wonton-wrapped mozzarella with marinara",
    price: "$11.99",
    image: "https://images.unsplash.com/photo-1548340748-6d498c3f1c46?auto=format&fit=crop&w=1074&q=80",
    category: "Chef's Starters",
  },
  {
    id: "6",
    name: "Southwest Wonton Rolls",
    description: "Wonton rolls with chicken, veggies, cheese & ranch",
    price: "$9.99",
    image: "https://images.unsplash.com/photo-1553787497-6a6c68c10505?auto=format&fit=crop&w=1170&q=80",
    category: "Chef's Starters",
  },
  {
    id: "7",
    name: "Fried Pickles",
    description: "Crispy pickle chips with chipotle ranch",
    price: "$9.99",
    image: "https://images.unsplash.com/photo-1594608671998-381ab2944fbd?auto=format&fit=crop&w=1172&q=80",
    category: "Chef's Starters",
  },
  {
    id: "8",
    name: "Chewy Pretzel Bites",
    description: "Warm pretzel bites with cheese sauce",
    price: "$10.99",
    image: "https://images.unsplash.com/photo-1593958812614-2db6a598c71c?auto=format&fit=crop&w=880&q=80",
    category: "Chef's Starters",
  },
  {
    id: "9",
    name: "Tavern Platter",
    description: "Chicken tenders, mozzarella sticks, fries with cheese and bacon",
    price: "$23.49",
    image: "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?auto=format&fit=crop&w=880&q=80",
    category: "Chef's Starters",
  },
  {
    id: "10",
    name: "Game Day Platter",
    description: "Mini cheeseburgers, wings, loaded fries",
    price: "$22.79",
    image: "https://images.unsplash.com/photo-1579208030886-b937da0925dc?auto=format&fit=crop&w=1170&q=80",
    category: "Chef's Starters",
  },
  {
    id: "11",
    name: "Nachos Grande",
    description: "Loaded nachos with beans, cheese, salsa, guac & more",
    price: "$11.79",
    image: "https://images.unsplash.com/photo-1582169296194-e4d644c48063?auto=format&fit=crop&w=1100&q=80",
    category: "Chef's Starters",
  },
  {
    id: "12",
    name: "Quesadilla",
    description: "Cheese quesadilla with salsa, sour cream, guac",
    price: "$10.49",
    image: "https://images.unsplash.com/photo-1599974579688-8dbdd335c77f?auto=format&fit=crop&w=1194&q=80",
    category: "Chef's Starters",
  },
  {
    id: "13",
    name: "Chip & Dip Trio",
    description: "Tortilla chips with salsa, guac, cheese sauce",
    price: "$8.99",
    image: "https://images.unsplash.com/photo-1546069901-5ec6a79120b0?auto=format&fit=crop&w=880&q=80",
    category: "Chef's Starters",
  },
  {
    id: "14",
    name: "Sweet Potato Waffle Fries",
    description: "Served with ketchup and honey mustard",
    price: "$8.99",
    image: "https://images.unsplash.com/photo-1519676867240-f03562e64548?auto=format&fit=crop&w=1170&q=80",
    category: "Chef's Starters",
  },
  {
    id: "15",
    name: "Onion Rings",
    description: "Served with chipotle ranch and ketchup",
    price: "$9.99",
    image: "https://images.unsplash.com/photo-1588511886774-ddd428377a80?auto=format&fit=crop&w=686&q=80",
    category: "Chef's Starters",
  },
  {
    id: "16",
    name: "Loaded Fries",
    description: "Fries with cheese, bacon, and green onions",
    price: "$10.49",
    image: "https://images.unsplash.com/photo-1600891964092-4316c288032e?auto=format&fit=crop&w=1170&q=80",
    category: "Chef's Starters",
  },
  {
    id: "17",
    name: "French Fries",
    description: "Classic crispy fries with ketchup",
    price: "$6.49",
    image: "https://images.unsplash.com/photo-1518013431117-eb1465fa5752?auto=format&fit=crop&w=1170&q=80",
    category: "Chef's Starters",
  },

  // Salads (18–23)
  {
    id: "18",
    name: "Cherry Chicken Pecan Salad",
    description: "Chicken, mixed greens, feta cheese, toasted pecans, red onion, dried cherries, white balsamic",
    price: "$14.99",
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=1170&q=80",
    category: "Salads",
  },
  {
    id: "19",
    name: "BLT Salad",
    description: "Applewood-smoked bacon, diced tomato, romaine lettuce, shaved parmesan cheese, green onions, ranch dressing",
    price: "$10.99",
    image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=1760&q=80",
    category: "Salads",
  },
  {
    id: "20",
    name: "Chicken Caesar Salad",
    description: "Grilled chicken, romaine lettuce, parmesan cheese, croutons, caesar dressing",
    price: "$15.39",
    image: "https://images.unsplash.com/photo-1599021419847-d8a7a6aba5b5?auto=format&fit=crop&w=1178&q=80",
    category: "Salads",
  },
  {
    id: "21",
    name: "Southwest BBQ Crispy Chicken Salad",
    description: "Chicken tenders, applewood-smoked bacon, romaine lettuce, pico de gallo, black beans, cheddar and jack cheese, avocado, cilantro, corn, green pepper, crispy onion strings, ranch dressing and BBQ sauce",
    price: "$16.99",
    image: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=1153&q=80",
    category: "Salads",
  },
  {
    id: "22",
    name: "Side Caesar Salad",
    description: "Romaine Lettuce, Caesar Dressing, Croutons, Parmesan",
    price: "$5.99",
    image: "https://images.unsplash.com/photo-1551248429-40975aa4de74?auto=format&fit=crop&w=1495&q=80",
    category: "Salads",
  },
  {
    id: "23",
    name: "Side Dinner Salad",
    description: "Romaine lettuce, tomato, cucumber, cheddar and jack cheeses, croutons, choice of dressing",
    price: "$5.99",
    image: "https://images.unsplash.com/photo-1607532941433-304659e8198a?auto=format&fit=crop&w=1078&q=80",
    category: "Salads",
  },


  // Sandwiches (24–32)
  {
    id: "24",
    name: "Honey Dijon Chicken Wrap",
    description: "Chicken tenders, cheddar and jack cheeses, romaine lettuce, diced tomatoes, honey mustard sauce, flour tortilla. Served with French fries.",
    price: "$15.49",
    image: "https://images.unsplash.com/photo-1553909489-cd47e0907980?auto=format&fit=crop&w=1025&q=80",
    category: "Sandwiches",
  },
  {
    id: "25",
    name: "Crispy Chicken Ranch Sandwich",
    description: "Lightly battered chicken breast, American cheese, lettuce, tomato, pickles, grilled onions, ranch dressing, brioche bun. Served with French fries.",
    price: "$15.99",
    image: "https://images.unsplash.com/photo-1606755962773-d324e0a13086?auto=format&fit=crop&w=687&q=80",
    category: "Sandwiches",
  },
  {
    id: "26",
    name: "Chicken Chipotle Sliders",
    description: "Four crispy chicken tenders, sweet Hawaiian rolls, dill pickles, chipotle honey BBQ ranch. Served with French fries.",
    price: "$16.99",
    image: "https://images.unsplash.com/photo-1565299507177-b0ac66763828?auto=format&fit=crop&w=722&q=80",
    category: "Sandwiches",
  },
  {
    id: "27",
    name: "Nashville Hot Chicken Sandwich",
    description: "Crispy chicken breast tossed in Nashville Hot spice rub, pepper jack, lettuce, pickles, red onion, chipotle ranch, brioche bun. Served with French fries.",
    price: "$15.99",
    image: "https://images.unsplash.com/photo-1587593810167-a84920ea0781?auto=format&fit=crop&w=1170&q=80",
    category: "Sandwiches",
  },
  {
    id: "28",
    name: "Buffalo Chicken Wrap",
    description: "Crispy chicken tenders, Buffalo sauce, lettuce, tomato, red onion, ranch or blue cheese dressing, flour tortilla. Served with French fries.",
    price: "$15.49",
    image: "https://images.unsplash.com/photo-1627662168806-DF415659d1Aa?auto=format&fit=crop&w=1080&q=80",
    category: "Sandwiches",
  },
  {
    id: "29",
    name: "Chicken B.A.L.T Sandwich",
    description: "Grilled chicken breast, guacamole, bacon, tomato, pickled red onions, mayo, lettuce. Served with French fries.",
    price: "$16.99",
    image: "https://images.unsplash.com/photo-1603046891744-76e6300f6eaf?auto=format&fit=crop&w=687&q=80",
    category: "Sandwiches",
  },
  {
    id: "30",
    name: "Hot Honey Chicken Sandwich",
    description: "Fried chicken breast tossed in hot honey sauce, fried pickles and onion straws. Served with French fries.",
    price: "$15.99",
    image: "https://images.unsplash.com/photo-1606755962773-d324e0a13086?auto=format&fit=crop&w=687&q=80",
    category: "Sandwiches",
  },
  {
    id: "31",
    name: "Smash Burger Wrap",
    description: "Two smash burger patties, cheddar, lettuce, tomato, red onion, pickles, Tavern sauce, flour tortilla. Served with French fries.",
    price: "$15.99",
    image: "https://images.unsplash.com/photo-1553909489-cd47e0907980?auto=format&fit=crop&w=1025&q=80",
    category: "Sandwiches",
  },
  {
    id: "32",
    name: "Cherry Chicken Pecan Wrap",
    description: "Mixed greens, chicken, feta cheese, toasted pecans, red onion, dried cherries, white balsamic. Served with French fries.",
    price: "$15.49",
    image: "https://images.unsplash.com/photo-1553909489-cd47e0907980?auto=format&fit=crop&w=1025&q=80",
    category: "Sandwiches",
  },

  // Burgers (33–39)
  {
    id: "33",
    name: "Hollywood Heat",
    description: "Double smash burger, applewood-smoked bacon, pepperjack cheese, guacamole, crispy onion strings, jalapenos, sriracha mayo. Served with French fries.",
    price: "$16.99",
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=1599&q=80",
    category: "Burgers",
  },
  {
    id: "34",
    name: "Tavern Burger",
    description: "Double smash burger, cheddar, lettuce, red onion, dill pickles and Tavern Sauce. Served with French fries",
    price: "$15.99",
    image: "https://images.unsplash.com/photo-1572802419224-296b0aeee0d9?auto=format&fit=crop&w=1115&q=80",
    category: "Burgers",
  },
  {
    id: "35",
    name: "Bacon Cheeseburger",
    description: "Double smash burger, applewood-smoked bacon, cheddar and Tavern Sauce. Served with French fries",
    price: "$15.99",
    image: "https://images.unsplash.com/photo-1547584370-2cc98b8b8dc8?auto=format&fit=crop&w=1171&q=80",
    category: "Burgers",
  },
  {
    id: "36",
    name: "Classic Double",
    description: "Double smash burger, American cheese, lettuce, tomato, and ketchup. Served with French fries",
    price: "$15.99",
    image: "https://images.unsplash.com/photo-1550317138-10000687a72b?auto=format&fit=crop&w=1520&q=80",
    category: "Burgers",
  },
  {
    id: "37",
    name: "Slider Burger Trio",
    description: "Three sliders with caramelized onions, pickles, American cheese, on mini brioche buns. Served with French fries.",
    price: "$15.99",
    image: "https://images.unsplash.com/photo-1607013251379-e6eecfffe234?auto=format&fit=crop&w=1599&q=80",
    category: "Burgers",
  },
  {
    id: "38",
    name: "Impossible Smash Burger",
    description: "One Impossible burger plant-based patty with American cheese, lettuce, tomato, red onion, pickles and Tavern sauce served with French Fries",
    price: "$15.99",
    image: "https://images.unsplash.com/photo-1582196016295-f8c8bd4b3a99?auto=format&fit=crop&w=880&q=80",
    category: "Burgers",
  },
  {
    id: "39",
    name: "Smash Melt",
    description: "Two smash burger patties, American, cheddar, and pepper jack cheese, applewood-smoked bacon, onion, tomato, Tavern sauce, Texas toast. Served with French Fries",
    price: "$16.49",
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=1599&q=80",
    category: "Burgers",
  },
  // Entrees
  {
    id: "40",
    name: "Chicken Taco Platter",
    description: "Three flour tortilla tacos, lettuce, pico de gallo, cheddar and jack cheese, sour cream, served with fire-roasted salsa, guacamole and tortilla chips",
    price: "$16.49",
    image: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&w=780&q=80",
    category: "Entrees"
  },
  {
    id: "41",
    name: "Fried Chicken Bacon Ranch Burrito",
    description: "Boneless chicken wings, applewood-smoked bacon, guacamole, cheddar and jack cheeses, pico de gallo, ranch, stuffed with French fries in a flour tortilla and served with tortilla chips and a side of fire-roasted salsa",
    price: "$16.49",
    image: "https://images.unsplash.com/photo-1626700051175-6818013e1d4f?auto=format&fit=crop&w=1632&q=80",
    category: "Entrees"
  },
  {
    id: "42",
    name: "Tex Mex Bowl",
    description: "Nacho chicken, romaine lettuce, tex mex quinoa, black beans, roasted corn, peppers, pico de gallo, cheddar and jack cheese, guacamole, sour cream drizzle, jalapeños, cilantro",
    price: "$15.99",
    image: "https://images.unsplash.com/photo-1513456852971-30c0b8199d4d?auto=format&fit=crop&w=735&q=80",
    category: "Entrees"
  },
   // Desserts
   {
    id: "43",
    name: "Churros",
    description: "Coated with cinnamon sugar and served with salted caramel and chocolate sauce",
    price: "$8.99",
    image: "https://images.unsplash.com/photo-1624471339371-1e812757614c?auto=format&fit=crop&w=687&q=80",
    category: "Desserts"
  },
  {
    id: "44",
    name: "Funnel Cake Sticks",
    description: "Served with salted caramel and chocolate sauce",
    price: "$10.99",
    image: "https://images.unsplash.com/photo-1604773124275-7b0d435e5a8a?auto=format&fit=crop&w=1170&q=80",
    category: "Desserts"
  },
  {
    id: "45",
    name: "Funnel Cake Stick Sundae",
    description: "Vanilla ice cream, chocolate and caramel sauce, whipped cream, pecans, sprinkles, with a cherry on top",
    price: "$12.99",
    image: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?auto=format&fit=crop&w=654&q=80",
    category: "Desserts"
  },
  {
    id: "46",
    name: "Brownie Ice Cream Bomb",
    description: "Freshly baked fudge brownie topped with vanilla ice cream, chocolate and caramel drizzle, whipped cream, sprinkles, and a cherry on top",
    price: "$11.49",
    image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=687&q=80",
    category: "Desserts"
  },// Beverages
  {
    id: "47",
    name: "Shakes",
    description: "Classic milkshake",
    price: "$7.49",
    image: "https://images.unsplash.com/photo-1577805947697-89e18249e211?auto=format&fit=crop&w=746&q=80",
    category: "Beverages"
  },
  {
    id: "48",
    name: "Large Soda",
    description: "Large fountain soda",
    price: "$8.45",
    image: "https://images.unsplash.com/photo-1625772299848-391b6a87d7b3?auto=format&fit=crop&w=687&q=80",
    category: "Beverages"
  },
  {
    id: "49",
    name: "Regular Soda",
    description: "Regular fountain soda",
    price: "$7.20",
    image: "https://images.unsplash.com/photo-1567103472667-6898f3a79cf2?auto=format&fit=crop&w=687&q=80",
    category: "Beverages"
  },
  {
    id: "50",
    name: "Large Unsweet Iced Tea",
    description: "Large unsweet iced tea",
    price: "$7.25",
    image: "https://images.unsplash.com/photo-1556679343-c1306ee3f376?auto=format&fit=crop&w=764&q=80",
    category: "Beverages"
  },
  {
    id: "51",
    name: "Regular Unsweet Iced Tea",
    description: "Regular unsweet iced tea",
    price: "$6.25",
    image: "https://images.unsplash.com/photo-1556679343-c1306ee3f376?auto=format&fit=crop&w=764&q=80",
    category: "Beverages"
  },
  {
    id: "52",
    name: "Large Sweet Tea",
    description: "Large sweet iced tea",
    price: "$7.25",
    image: "https://images.unsplash.com/photo-1556679343-c1306ee3f376?auto=format&fit=crop&w=764&q=80",
    category: "Beverages"
  },
  {
    id: "53",
    name: "Regular Sweet Tea",
    description: "Regular sweet iced tea",
    price: "$6.25",
    image: "https://images.unsplash.com/photo-1556679343-c1306ee3f376?auto=format&fit=crop&w=764&q=80",
    category: "Beverages"
  },
  {
    id: "54",
    name: "ICEE Large",
    description: "Large ICEE frozen beverage",
    price: "$8.05",
    image: "https://images.unsplash.com/photo-1581636625048-328f23359788?auto=format&fit=crop&w=764&q=80",
    category: "Beverages"
  },
  {
    id: "55",
    name: "ICEE Junior",
    description: "Junior size ICEE frozen beverage",
    price: "$7.55",
    image: "https://images.unsplash.com/photo-1541591425581-5f79c8ce41b6?auto=format&fit=crop&w=687&q=80",
    category: "Beverages"
  },
  // Candy
  {
    id: "56",
    name: "Buncha Crunch",
    description: "Chocolate candy",
    price: "$5.49",
    image: "https://images.unsplash.com/photo-1581798459219-306262b0f79d?auto=format&fit=crop&w=1170&q=80",
    category: "Candy"
  },
  {
    id: "57",
    name: "Cookie Dough Bites",
    description: "Chocolate covered cookie dough bites",
    price: "$6.00",
    image: "https://images.unsplash.com/photo-1621939514649-280e2ee25f60?auto=format&fit=crop&w=1170&q=80",
    category: "Candy"
  },
  {
    id: "58",
    name: "Dots",
    description: "Fruity gumdrops",
    price: "$5.49",
    image: "https://images.unsplash.com/photo-1600359756098-8bc52195bbf4?auto=format&fit=crop&w=688&q=80",
    category: "Candy"
  },
  {
    id: "59",
    name: "Lifesaver Gummi",
    description: "Fruit-flavored gummy rings",
    price: "$6.00",
    image: "https://images.unsplash.com/photo-1599629954294-14df9ec8127c?auto=format&fit=crop&w=735&q=80",
    category: "Candy"
  },
  {
    id: "60",
    name: "M&M Peanut",
    description: "Chocolate covered peanuts",
    price: "$6.00",
    image: "https://images.unsplash.com/photo-1629364995224-79567664190c?auto=format&fit=crop&w=880&q=80",
    category: "Candy"
  },
  {
    id: "61",
    name: "M&M Plain",
    description: "Milk chocolate candies",
    price: "$6.00",
    image: "https://images.unsplash.com/photo-1581798459330-2127561a2159?auto=format&fit=crop&w=1170&q=80",
    category: "Candy"
  },
  {
    id: "62",
    name: "Milk Duds",
    description: "Chocolate-covered caramels",
    price: "$5.49",
    image: "https://images.unsplash.com/photo-1621939514649-280e2ee25f60?auto=format&fit=crop&w=1170&q=80",
    category: "Candy"
  },
  {
    id: "63",
    name: "Reeses Pieces",
    description: "Peanut butter candy",
    price: "$6.00",
    image: "https://images.unsplash.com/photo-1575224526242-ff76827246e4?auto=format&fit=crop&w=1170&q=80",
    category: "Candy"
  },
  {
    id: "64",
    name: "Skittles",
    description: "Fruit-flavored candy",
    price: "$6.00",
    image: "https://images.unsplash.com/photo-1600359756098-8bc52195bbf4?auto=format&fit=crop&w=688&q=80",
    category: "Candy"
  },
];

export default function ConcessionsScreen() {
    const [selectedCategory, setSelectedCategory] = useState("Chef's Starters");
    const [cart, setCart] = useState<CartItem[]>([]);
    const [deliveryType, setDeliveryType] = useState<"ToSeat" | "Pickup">("Pickup");
    const [reservationId, setReservationId] = useState<number | null>(null);
  
    const filteredItems = items.filter((item) => item.category === selectedCategory);
  
    const placeOrder = () => {
      const orderRequest = {
        deliveryType,
        reservationId: deliveryType === "ToSeat" ? reservationId : null,
        orderItems: cart,
      };
  
      console.log(JSON.stringify(orderRequest, null, 2));
      alert("Order placed successfully!");
      setCart([]); // Clear the cart after placing the order
    };
  
    return (
      <View style={{ flex: 1, backgroundColor: "#F5F5F5" }}>
        <View style={{ backgroundColor: "#8BC34A", padding: 20 }}>
          <Text style={{ color: "white", fontSize: 20, fontWeight: "bold", textAlign: "center" }}>
            Lion's Den
          </Text>
        </View>
  
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 10, paddingHorizontal: 10 }}>
          {categories.map((category) => (
            <TouchableOpacity
              key={category}
              style={{
                paddingHorizontal: 15,
                paddingVertical: 8,
                marginHorizontal: 5,
                borderRadius: 20,
                backgroundColor: selectedCategory === category ? "#8BC34A" : "#E0E0E0",
              }}
              onPress={() => setSelectedCategory(category)}
            >
              <Text style={{ color: selectedCategory === category ? "white" : "black", fontSize: 14 }}>
                {category}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
  
        <Text style={{ fontSize: 18, fontWeight: "bold", marginLeft: 15, marginTop: 15 }}>{selectedCategory}</Text>
  
        <FlatList
          data={filteredItems}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={{ backgroundColor: "white", margin: 15, padding: 15, borderRadius: 10, shadowOpacity: 0.1 }}>
              <Image
                source={{ uri: item.image }}
                style={{ width: "100%", height: 100, borderRadius: 10 }}
                resizeMode="cover"
              />
              <Text style={{ fontSize: 16, fontWeight: "bold", marginTop: 10 }}>{item.name}</Text>
              <Text style={{ color: "gray", marginTop: 5 }}>{item.description}</Text>
              <Text style={{ fontSize: 16, fontWeight: "bold", color: "#4CAF50", marginTop: 5 }}>{item.price}</Text>
              <TouchableOpacity 
                style={{ backgroundColor: "#4CAF50", padding: 10, borderRadius: 10, marginTop: 10 }}
                onPress={() => {
                  setCart([...cart, { foodItemId: item.id, quantity: 1 }]);
                }}
              >
                <Text style={{ color: "white", textAlign: "center", fontWeight: "bold" }}>Add</Text>
              </TouchableOpacity>
            </View>
          )}
        />
  
        <View style={{ padding: 15 }}>
          <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 10 }}>Delivery Options</Text>
          <View style={{ flexDirection: "row", marginBottom: 10 }}>
            <TouchableOpacity
              style={{
                padding: 10,
                borderRadius: 10,
                backgroundColor: deliveryType === "Pickup" ? "#4CAF50" : "#E0E0E0",
                marginRight: 10,
              }}
              onPress={() => setDeliveryType("Pickup")}
            >
              <Text style={{ color: deliveryType === "Pickup" ? "white" : "black" }}>Pickup</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                padding: 10,
                borderRadius: 10,
                backgroundColor: deliveryType === "ToSeat" ? "#4CAF50" : "#E0E0E0",
              }}
              onPress={() => setDeliveryType("ToSeat")}
            >
              <Text style={{ color: deliveryType === "ToSeat" ? "white" : "black" }}>To Seat</Text>
            </TouchableOpacity>
          </View>
          {deliveryType === "ToSeat" && (
            <TextInput
              style={{ borderWidth: 1, borderColor: "#E0E0E0", borderRadius: 10, padding: 10, marginBottom: 10 }}
              placeholder="Reservation ID"
              keyboardType="numeric"
              onChangeText={(text) => setReservationId(Number(text))}
            />
          )}
          <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 10 }}>Your Cart</Text>
          {cart.map((cartItem, index) => (
            <View key={index} style={{ marginBottom: 10 }}>
              <Text>{items.find(item => item.id === cartItem.foodItemId)?.name}</Text>
              <Text>Quantity: {cartItem.quantity}</Text>
              {cartItem.specialInstructions && <Text>Instructions: {cartItem.specialInstructions}</Text>}
            </View>
          ))}
          <TouchableOpacity 
            style={{ backgroundColor: "#4CAF50", padding: 10, borderRadius: 10, marginTop: 10 }}
            onPress={placeOrder}
          >
            <Text style={{ color: "white", textAlign: "center", fontWeight: "bold" }}>Place Order</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
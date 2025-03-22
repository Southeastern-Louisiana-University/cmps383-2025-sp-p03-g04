using System;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using Selu383.SP25.P03.Api.Features.Concessions;

namespace Selu383.SP25.P03.Api.Data
{
    public static class SeedConcessions
    {
        public static void Initialize(IServiceProvider serviceProvider)
        {
            using (var context = new DataContext(serviceProvider.GetRequiredService<DbContextOptions<DataContext>>()))
            {
                // Check if we already have food categories
                if (context.FoodCategories.Any())
                {
                    return;   // DB has been seeded
                }

                // Create categories
                var startersCategory = new FoodCategory { Name = "Chef's Starters" };
                var saladsCategory = new FoodCategory { Name = "Salads" };
                var sandwichesCategory = new FoodCategory { Name = "Sandwiches" };
                var burgersCategory = new FoodCategory { Name = "Burgers" };
                var entreesCategory = new FoodCategory { Name = "Entrees" };
                var dessertsCategory = new FoodCategory { Name = "Desserts" };
                var beveragesCategory = new FoodCategory { Name = "Beverages" };
                var candyCategory = new FoodCategory { Name = "Candy" };

                context.FoodCategories.AddRange(
                    startersCategory,
                    saladsCategory,
                    sandwichesCategory,
                    burgersCategory,
                    entreesCategory,
                    dessertsCategory,
                    beveragesCategory,
                    candyCategory
                );

                context.SaveChanges();

                // Add Chef's Starters items
                context.FoodItems.AddRange(
                    new FoodItem { 
                        Name = "Chicken Tenders", 
                        Description = "Seasoned fries, choice of BBQ, Buffalo, Nashville Hot, or ranch dressing", 
                        Price = 16.49m, 
                        CategoryId = startersCategory.Id,
                        ImageUrl = "https://images.unsplash.com/photo-1562967914-608f82629710?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1173&q=80"
                    },
                    new FoodItem { 
                        Name = "Impossible Chicken Nuggets", 
                        Description = "Eight Impossible plant-based nuggets with choice of dipping sauce and side of French fries", 
                        Price = 14.99m, 
                        CategoryId = startersCategory.Id,
                        ImageUrl = "https://images.unsplash.com/photo-1585325701956-60dd9c8553bc?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=880&q=80"
                    },
                    new FoodItem { 
                        Name = "Chicken Wings", 
                        Description = "One pound of bone-in wings, tossed with either BBQ, Buffalo, Nashville Hot, Garlic Parmesan, Hot Honey or Jamaican Jerk dry rub, served with celery and carrot sticks, choice of ranch or blue cheese dressing", 
                        Price = 19.99m, 
                        CategoryId = startersCategory.Id,
                        ImageUrl = "https://images.unsplash.com/photo-1567620832903-9fc6debc209f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=780&q=80"
                    },
                    new FoodItem { 
                        Name = "Boneless Wings", 
                        Description = "Tossed with either Buffalo, Nashville Hot, BBQ, Hot Honey, Garlic Parmesan or Jamaican Jerk dry rub, served with celery and carrot sticks, choice of ranch or blue cheese", 
                        Price = 13.99m, 
                        CategoryId = startersCategory.Id,
                        ImageUrl = "https://images.unsplash.com/photo-1614398751058-eb2e0bf63e53?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=880&q=80"
                    },
                    new FoodItem { 
                        Name = "Wonton Mozzarella Sticks", 
                        Description = "Wonton wrapped Grande Mozzarella cheese, marinara sauce", 
                        Price = 11.99m, 
                        CategoryId = startersCategory.Id,
                        ImageUrl = "https://images.unsplash.com/photo-1548340748-6d498c3f1c46?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1074&q=80"
                    },
                    new FoodItem { 
                        Name = "Southwest Wonton Rolls", 
                        Description = "Chicken, roasted corn, peppers, black beans, cheddar and jack cheese, fire roasted salsa, side of chipotle ranch", 
                        Price = 9.99m, 
                        CategoryId = startersCategory.Id,
                        ImageUrl = "https://images.unsplash.com/photo-1553787497-6a6c68c10505?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80"
                    },
                    new FoodItem { 
                        Name = "Fried Pickles", 
                        Description = "Lightly breaded dill pickle chips served with chipotle ranch dressing", 
                        Price = 9.99m, 
                        CategoryId = startersCategory.Id,
                        ImageUrl = "https://images.unsplash.com/photo-1594608671998-381ab2944fbd?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1172&q=80"
                    },
                    new FoodItem { 
                        Name = "Chewy Pretzel Bites", 
                        Description = "Served with cheddar cheese sauce", 
                        Price = 10.99m, 
                        CategoryId = startersCategory.Id,
                        ImageUrl = "https://images.unsplash.com/photo-1593958812614-2db6a598c71c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=880&q=80"
                    },
                    new FoodItem { 
                        Name = "Tavern Platter", 
                        Description = "Four chicken tenders, three wonton mozzarella sticks, seasoned fries with cheddar cheese sauce and applewood-smoked bacon", 
                        Price = 23.49m, 
                        CategoryId = startersCategory.Id,
                        ImageUrl = "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=880&q=80"
                    },
                    new FoodItem { 
                        Name = "Game Day Platter", 
                        Description = "Three mini cheeseburgers, half-pound of chicken wings, seasoned fries with cheddar cheese sauce and applewood-smoked bacon", 
                        Price = 22.79m, 
                        CategoryId = startersCategory.Id,
                        ImageUrl = "https://images.unsplash.com/photo-1579208030886-b937da0925dc?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80"
                    },
                    new FoodItem { 
                        Name = "Nachos Grande", 
                        Description = "Tortilla chips, cheddar cheese sauce, black beans, pico de gallo, lettuce, jalapeno, fire-roasted salsa, guacamole, sour cream. Add nacho chicken, taco beef or Al Pastor Pork for add'l charge", 
                        Price = 11.79m, 
                        CategoryId = startersCategory.Id,
                        ImageUrl = "https://images.unsplash.com/photo-1582169296194-e4d644c48063?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1100&q=80"
                    },
                    new FoodItem { 
                        Name = "Quesadilla", 
                        Description = "Flour tortilla, cheddar and jack cheese and pico de gallo with guacamole, sour cream and fire-roasted salsa on the side. Add nacho chicken, taco beef or Al Pastor pork for add'l charge", 
                        Price = 10.49m, 
                        CategoryId = startersCategory.Id,
                        ImageUrl = "https://images.unsplash.com/photo-1599974579688-8dbdd335c77f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1194&q=80"
                    },
                    new FoodItem { 
                        Name = "Chip & Dip Trio", 
                        Description = "Tortilla chips, cheddar cheese, fire-roasted salsa, guacamole", 
                        Price = 8.99m, 
                        CategoryId = startersCategory.Id,
                        ImageUrl = "https://images.unsplash.com/photo-1546069901-5ec6a79120b0?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=880&q=80"
                    },
                    new FoodItem { 
                        Name = "Sweet Potato Waffle Fries", 
                        Description = "Served with Ketchup and Honey Mustard", 
                        Price = 8.99m, 
                        CategoryId = startersCategory.Id,
                        ImageUrl = "https://images.unsplash.com/photo-1519676867240-f03562e64548?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80"
                    },
                    new FoodItem { 
                        Name = "Onion Rings", 
                        Description = "Served with chipotle ranch and ketchup", 
                        Price = 9.99m, 
                        CategoryId = startersCategory.Id,
                        ImageUrl = "https://images.unsplash.com/photo-1588511886774-ddd428377a80?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=686&q=80"
                    },
                    new FoodItem { 
                        Name = "Loaded Fries", 
                        Description = "Cheddar cheese sauce, applewood-smoked bacon, green onions", 
                        Price = 10.49m, 
                        CategoryId = startersCategory.Id,
                        ImageUrl = "https://images.unsplash.com/photo-1600891964092-4316c288032e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80"
                    },
                    new FoodItem { 
                        Name = "French Fries", 
                        Description = "Classic crispy french fries", 
                        Price = 6.49m, 
                        CategoryId = startersCategory.Id,
                        ImageUrl = "https://images.unsplash.com/photo-1518013431117-eb1465fa5752?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80"
                    }
                );

                // Add Salads items
                context.FoodItems.AddRange(
                    new FoodItem { 
                        Name = "Cherry Chicken Pecan Salad", 
                        Description = "Chicken, mixed greens, feta cheese, toasted pecans, red onion, dried cherries, white balsamic", 
                        Price = 14.99m, 
                        CategoryId = saladsCategory.Id,
                        ImageUrl = "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80"
                    },
                    new FoodItem { 
                        Name = "BLT Salad", 
                        Description = "Applewood-smoked bacon, diced tomato, romaine lettuce, shaved parmesan cheese, green onions, ranch dressing", 
                        Price = 10.99m, 
                        CategoryId = saladsCategory.Id,
                        ImageUrl = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1760&q=80"
                    },
                    new FoodItem { 
                        Name = "Chicken Caesar Salad", 
                        Description = "Grilled chicken, romaine lettuce, parmesan cheese, croutons, caesar dressing", 
                        Price = 15.39m, 
                        CategoryId = saladsCategory.Id,
                        ImageUrl = "https://images.unsplash.com/photo-1599021419847-d8a7a6aba5b5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1178&q=80"
                    },
                    new FoodItem { 
                        Name = "Southwest BBQ Crispy Chicken Salad", 
                        Description = "Chicken tenders, applewood-smoked bacon, romaine lettuce, pico de gallo, black beans, cheddar and jack cheese, avocado, cilantro, corn, green pepper, crispy onion strings, ranch dressing and BBQ sauce", 
                        Price = 16.99m, 
                        CategoryId = saladsCategory.Id,
                        ImageUrl = "https://images.unsplash.com/photo-1490645935967-10de6ba17061?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1153&q=80"
                    },
                    new FoodItem { 
                        Name = "Side Caesar Salad", 
                        Description = "Romaine Lettuce, Caesar Dressing, Croutons, Parmesan", 
                        Price = 5.99m, 
                        CategoryId = saladsCategory.Id,
                        ImageUrl = "https://images.unsplash.com/photo-1551248429-40975aa4de74?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1495&q=80"
                    },
                    new FoodItem { 
                        Name = "Side Dinner Salad", 
                        Description = "Romaine lettuce, tomato, cucumber, cheddar and jack cheeses, croutons, choice of dressing", 
                        Price = 5.99m, 
                        CategoryId = saladsCategory.Id,
                        ImageUrl = "https://images.unsplash.com/photo-1607532941433-304659e8198a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1078&q=80"
                    }
                );

                    // Add Sandwiches items
context.FoodItems.AddRange(
    new FoodItem { 
        Name = "Honey Dijon Chicken Wrap", 
        Description = "Chicken tenders, cheddar and jack cheeses, romaine lettuce, diced tomatoes, honey mustard sauce, flour tortilla. Served with French fries.", 
        Price = 15.49m, 
        CategoryId = sandwichesCategory.Id,
        ImageUrl = "https://images.unsplash.com/photo-1553909489-cd47e0907980?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1025&q=80"
    },
    new FoodItem { 
        Name = "Crispy Chicken Ranch Sandwich", 
        Description = "Lightly battered chicken breast, American cheese, lettuce, tomato, dill pickles, grilled onions and ranch dressing, on a brioche bun. Served with French fries.", 
        Price = 15.99m, 
        CategoryId = sandwichesCategory.Id,
        ImageUrl = "https://images.unsplash.com/photo-1606755962773-d324e0a13086?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80"
    },
    new FoodItem { 
        Name = "Chicken Chipotle Sliders", 
        Description = "Four crispy chicken tenders, sweet Hawaiian rolls, dill pickles, chipotle honey BBQ ranch. Served with French fries.", 
        Price = 16.99m, 
        CategoryId = sandwichesCategory.Id,
        ImageUrl = "https://images.unsplash.com/photo-1565299507177-b0ac66763828?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=722&q=80"
    },
    new FoodItem { 
        Name = "Nashville Hot Chicken Sandwich", 
        Description = "Crispy chicken breast tossed with Nashville Hot spice rub and butter, pepper jack, lettuce, pickles, red onion and chipotle ranch dressing on a brioche bun. Served with French fries", 
        Price = 15.99m, 
        CategoryId = sandwichesCategory.Id,
        ImageUrl = "https://images.unsplash.com/photo-1587593810167-a84920ea0781?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80"
    },
    new FoodItem { 
        Name = "Buffalo Chicken Wrap", 
        Description = "Crispy chicken tenders, Buffalo sauce, lettuce, tomato, red onion and choice of ranch or blue cheese dressing on a flour tortilla. Served with French fries.", 
        Price = 15.49m, 
        CategoryId = sandwichesCategory.Id,
        ImageUrl = "https://images.unsplash.com/photo-1627662168806-DF415659d1Aa?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1080&q=80"
    },
    new FoodItem { 
        Name = "Chicken B.A.L.T Sandwich", 
        Description = "Grilled chicken breast, guacamole, applewood smoked bacon, sliced tomatoes, pickled red onions, mayo and lettuce. Served with French fries.", 
        Price = 16.99m, 
        CategoryId = sandwichesCategory.Id,
        ImageUrl = "https://images.unsplash.com/photo-1603046891744-76e6300f6eaf?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80"
    },
    new FoodItem { 
        Name = "Hot Honey Chicken Sandwich", 
        Description = "Fried chicken breast tossed in hot honey sauce, fried pickles and fried onion straws. Served with French fries.", 
        Price = 15.99m, 
        CategoryId = sandwichesCategory.Id,
        ImageUrl = "https://images.unsplash.com/photo-1606755962773-d324e0a13086?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80"
    },
    new FoodItem { 
        Name = "Smash Burger Wrap", 
        Description = "Two smash burger patties, cheddar cheese, romaine lettuce, diced tomato, red onion, dill pickles, Tavern sauce, flour tortilla. Served with French fries.", 
        Price = 15.99m, 
        CategoryId = sandwichesCategory.Id,
        ImageUrl = "https://images.unsplash.com/photo-1553909489-cd47e0907980?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1025&q=80"
    },
    new FoodItem { 
        Name = "Cherry Chicken Pecan Wrap", 
        Description = "Mixed greens, chicken, feta cheese, toasted pecans, red onion, dried cherries, white balsamic. Served with French fries.", 
        Price = 15.49m, 
        CategoryId = sandwichesCategory.Id,
        ImageUrl = "https://images.unsplash.com/photo-1553909489-cd47e0907980?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1025&q=80"
    }
);

// Add Burgers items
context.FoodItems.AddRange(
    new FoodItem { 
        Name = "Hollywood Heat", 
        Description = "Double smash burger, applewood-smoked bacon, pepperjack cheese, guacamole, crispy onion strings, jalapenos, sriracha mayo. Served with French fries.", 
        Price = 16.99m, 
        CategoryId = burgersCategory.Id,
        ImageUrl = "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1599&q=80"
    },
    new FoodItem { 
        Name = "Tavern Burger", 
        Description = "Double smash burger, cheddar, lettuce, red onion, dill pickles and Tavern Sauce. Served with French fries", 
        Price = 15.99m, 
        CategoryId = burgersCategory.Id,
        ImageUrl = "https://images.unsplash.com/photo-1572802419224-296b0aeee0d9?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1115&q=80"
    },
    new FoodItem { 
        Name = "Bacon Cheeseburger", 
        Description = "Double smash burger, applewood-smoked bacon, cheddar and Tavern Sauce. Served with French fries", 
        Price = 15.99m, 
        CategoryId = burgersCategory.Id,
        ImageUrl = "https://images.unsplash.com/photo-1547584370-2cc98b8b8dc8?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1171&q=80"
    },
    new FoodItem { 
        Name = "Classic Double", 
        Description = "Double smash burger, American cheese, lettuce, tomato, and ketchup. Served with French fries", 
        Price = 15.99m, 
        CategoryId = burgersCategory.Id,
        ImageUrl = "https://images.unsplash.com/photo-1550317138-10000687a72b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1520&q=80"
    },
    new FoodItem { 
        Name = "Slider Burger Trio", 
        Description = "Three sliders with caramelized onions, pickles, American cheese, on mini brioche buns. Served with French fries.", 
        Price = 15.99m, 
        CategoryId = burgersCategory.Id,
        ImageUrl = "https://images.unsplash.com/photo-1607013251379-e6eecfffe234?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1599&q=80"
    },
    new FoodItem { 
        Name = "Impossible Smash Burger", 
        Description = "One Impossible burger plant-based patty with American cheese, lettuce, tomato, red onion, pickles and Tavern sauce served with French Fries", 
        Price = 15.99m, 
        CategoryId = burgersCategory.Id,
        ImageUrl = "https://images.unsplash.com/photo-1582196016295-f8c8bd4b3a99?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=880&q=80"
    },
    new FoodItem { 
        Name = "Smash Melt", 
        Description = "Two smash burger patties, American, cheddar, and pepper jack cheese, applewood-smoked bacon, onion, tomato, Tavern sauce, Texas toast. Served with French Fries", 
        Price = 16.49m, 
        CategoryId = burgersCategory.Id,
        ImageUrl = "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1599&q=80"
    }
);

// Add Entrees items
context.FoodItems.AddRange(
    new FoodItem { 
        Name = "Chicken Taco Platter", 
        Description = "Three flour tortilla tacos, lettuce, pico de gallo, cheddar and jack cheese, sour cream, served with fire-roasted salsa, guacamole and tortilla chips", 
        Price = 16.49m, 
        CategoryId = entreesCategory.Id,
        ImageUrl = "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=780&q=80"
    },
    new FoodItem { 
        Name = "Fried Chicken Bacon Ranch Burrito", 
        Description = "Boneless chicken wings, applewood-smoked bacon, guacamole, cheddar and jack cheeses, pico de gallo, ranch, stuffed with French fries in a flour tortilla and served with tortilla chips and a side of fire-roasted salsa", 
        Price = 16.49m, 
        CategoryId = entreesCategory.Id,
        ImageUrl = "https://images.unsplash.com/photo-1626700051175-6818013e1d4f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1632&q=80"
    },
    new FoodItem { 
        Name = "Tex Mex Bowl", 
        Description = "Nacho chicken, romaine lettuce, tex mex quinoa, black beans, roasted corn, peppers, pico de gallo, cheddar and jack cheese, guacamole, sour cream drizzle, jalapeños, cilantro", 
        Price = 15.99m, 
        CategoryId = entreesCategory.Id,
        ImageUrl = "https://images.unsplash.com/photo-1513456852971-30c0b8199d4d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=735&q=80"
    }
);

// Add Desserts items
context.FoodItems.AddRange(
    new FoodItem { 
        Name = "Churros", 
        Description = "Coated with cinnamon sugar and served with salted caramel and chocolate sauce", 
        Price = 8.99m, 
        CategoryId = dessertsCategory.Id,
        ImageUrl = "https://images.unsplash.com/photo-1624471339371-1e812757614c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80"
    },
    new FoodItem { 
        Name = "Funnel Cake Sticks", 
        Description = "Served with salted caramel and chocolate sauce", 
        Price = 10.99m, 
        CategoryId = dessertsCategory.Id,
        ImageUrl = "https://images.unsplash.com/photo-1604773124275-7b0d435e5a8a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80"
    },
    new FoodItem { 
        Name = "Funnel Cake Stick Sundae", 
        Description = "Vanilla ice cream, chocolate and caramel sauce, whipped cream, pecans, sprinkles, with a cherry on top", 
        Price = 12.99m, 
        CategoryId = dessertsCategory.Id,
        ImageUrl = "https://images.unsplash.com/photo-1563805042-7684c019e1cb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=654&q=80"
    },
    new FoodItem { 
        Name = "Brownie Ice Cream Bomb", 
        Description = "Freshly baked fudge brownie topped with vanilla ice cream, chocolate and caramel drizzle, whipped cream, sprinkles, and a cherry on top", 
        Price = 11.49m, 
        CategoryId = dessertsCategory.Id,
        ImageUrl = "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80"
    }
);

// Add Beverages items
context.FoodItems.AddRange(
    new FoodItem { 
        Name = "Shakes", 
        Description = "Classic milkshake", 
        Price = 7.49m, 
        CategoryId = beveragesCategory.Id,
        ImageUrl = "https://images.unsplash.com/photo-1577805947697-89e18249e211?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=746&q=80"
    },
    new FoodItem { 
        Name = "Large Soda", 
        Description = "Large fountain soda", 
        Price = 8.45m, 
        CategoryId = beveragesCategory.Id,
        ImageUrl = "https://images.unsplash.com/photo-1625772299848-391b6a87d7b3?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80"
    },
    new FoodItem { 
        Name = "Regular Soda", 
        Description = "Regular fountain soda", 
        Price = 7.20m, 
        CategoryId = beveragesCategory.Id,
        ImageUrl = "https://images.unsplash.com/photo-1567103472667-6898f3a79cf2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80"
    },
    new FoodItem { 
        Name = "Large Unsweet Iced Tea", 
        Description = "Large unsweet iced tea", 
        Price = 7.25m, 
        CategoryId = beveragesCategory.Id,
        ImageUrl = "https://images.unsplash.com/photo-1556679343-c1306ee3f376?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=764&q=80"
    },
    new FoodItem { 
        Name = "Regular Unsweet Iced Tea", 
        Description = "Regular unsweet iced tea", 
        Price = 6.25m, 
        CategoryId = beveragesCategory.Id,
        ImageUrl = "https://images.unsplash.com/photo-1556679343-c1306ee3f376?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=764&q=80"
    },
    new FoodItem { 
        Name = "Large Sweet Tea", 
        Description = "Large sweet iced tea", 
        Price = 7.25m, 
        CategoryId = beveragesCategory.Id,
        ImageUrl = "https://images.unsplash.com/photo-1556679343-c1306ee3f376?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=764&q=80"
    },
    new FoodItem { 
        Name = "Regular Sweet Tea", 
        Description = "Regular sweet iced tea", 
        Price = 6.25m, 
        CategoryId = beveragesCategory.Id,
        ImageUrl = "https://images.unsplash.com/photo-1556679343-c1306ee3f376?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=764&q=80"
    },
    new FoodItem { 
        Name = "ICEE Large", 
        Description = "Large ICEE frozen beverage", 
        Price = 8.05m, 
        CategoryId = beveragesCategory.Id,
        ImageUrl = "https://images.unsplash.com/photo-1581636625048-328f23359788?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=764&q=80"
    },
    new FoodItem { 
        Name = "ICEE Junior", 
        Description = "Junior size ICEE frozen beverage", 
        Price = 7.55m, 
        CategoryId = beveragesCategory.Id,
        ImageUrl = "https://images.unsplash.com/photo-1541591425581-5f79c8ce41b6?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80"
    }
);

// Add Candy items
context.FoodItems.AddRange(
    new FoodItem { 
        Name = "Buncha Crunch", 
        Description = "Chocolate candy", 
        Price = 5.49m, 
        CategoryId = candyCategory.Id,
        ImageUrl = "https://images.unsplash.com/photo-1581798459219-306262b0f79d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80"
    },
    new FoodItem { 
        Name = "Cookie Dough Bites", 
        Description = "Chocolate covered cookie dough bites", 
        Price = 6.00m, 
        CategoryId = candyCategory.Id,
        ImageUrl = "https://images.unsplash.com/photo-1621939514649-280e2ee25f60?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80"
    },
    new FoodItem { 
        Name = "Dots", 
        Description = "Fruity gumdrops", 
        Price = 5.49m, 
        CategoryId = candyCategory.Id,
        ImageUrl = "https://images.unsplash.com/photo-1600359756098-8bc52195bbf4?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=688&q=80"
    },
    new FoodItem { 
        Name = "Lifesaver Gummi", 
        Description = "Fruit-flavored gummy rings", 
        Price = 6.00m, 
        CategoryId = candyCategory.Id,
        ImageUrl = "https://images.unsplash.com/photo-1599629954294-14df9ec8127c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=735&q=80"
    },
    new FoodItem { 
        Name = "M&M Peanut", 
        Description = "Chocolate covered peanuts", 
        Price = 6.00m, 
        CategoryId = candyCategory.Id,
        ImageUrl = "https://images.unsplash.com/photo-1629364995224-79567664190c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=880&q=80"
    },
    new FoodItem { 
        Name = "M&M Plain", 
        Description = "Milk chocolate candies", 
        Price = 6.00m, 
        CategoryId = candyCategory.Id,
        ImageUrl = "https://images.unsplash.com/photo-1581798459330-2127561a2159?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80"
    },
    new FoodItem { 
        Name = "Milk Duds", 
        Description = "Chocolate-covered caramels", 
        Price = 5.49m, 
        CategoryId = candyCategory.Id,
        ImageUrl = "https://images.unsplash.com/photo-1621939514649-280e2ee25f60?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80"
    },
    new FoodItem { 
        Name = "Reeses Pieces", 
        Description = "Peanut butter candy", 
        Price = 6.00m, 
        CategoryId = candyCategory.Id,
        ImageUrl = "https://images.unsplash.com/photo-1575224526242-ff76827246e4?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80"
    },
    new FoodItem { 
        Name = "Skittles", 
        Description = "Fruit-flavored candy", 
        Price = 6.00m, 
        CategoryId = candyCategory.Id,
        ImageUrl = "https://images.unsplash.com/photo-1600359756098-8bc52195bbf4?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=688&q=80"
    }
);

context.SaveChanges();
            }
        }
    }
}
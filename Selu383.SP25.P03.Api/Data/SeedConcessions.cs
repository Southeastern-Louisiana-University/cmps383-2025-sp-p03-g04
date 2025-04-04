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
                // Always reseed to ensure latest data
                if (context.FoodCategories.Any())
                {
                    // Remove existing categories and items
                    context.FoodOrderItems.RemoveRange(context.FoodOrderItems);
                    context.FoodItems.RemoveRange(context.FoodItems);
                    context.FoodCategories.RemoveRange(context.FoodCategories);
                    context.SaveChanges();
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

                // Seed food items with verified image URLs
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
                        ImageUrl = "https://media.istockphoto.com/id/1362421857/photo/crispy-mozzarella-sticks-wrapped-in-wonton-wrappers.webp?a=1&b=1&s=612x612&w=0&k=20&c=3QehhnsB9JnWroOTVdKUhJgIH2D2JXQ_bCOp4p0egks="
                    },
                    new FoodItem { 
                        Name = "Southwest Wonton Rolls", 
                        Description = "Chicken, roasted corn, peppers, black beans, cheddar and jack cheese, fire roasted salsa, side of chipotle ranch", 
                        Price = 9.99m, 
                        CategoryId = startersCategory.Id,
                        ImageUrl = "https://media.istockphoto.com/id/175937858/photo/fried-rolls.webp?a=1&b=1&s=612x612&w=0&k=20&c=4nY1XQn2h07ELoEJAGl6UfWJngHAjkir5XsKwq0jzdY="
                    },
                    new FoodItem { 
                        Name = "Fried Pickles", 
                        Description = "Lightly breaded dill pickle chips served with chipotle ranch dressing", 
                        Price = 9.99m, 
                        CategoryId = startersCategory.Id,
                        ImageUrl = "https://media.istockphoto.com/id/469869101/photo/southern-fried-pickles.webp?a=1&b=1&s=612x612&w=0&k=20&c=JdaXDbOjVv4PoyXzD5CwaN0anap8wUYzp1QP25DWnO4="
                    },
                    new FoodItem { 
                        Name = "Chewy Pretzel Bites", 
                        Description = "Served with cheddar cheese sauce", 
                        Price = 10.99m, 
                        CategoryId = startersCategory.Id,
                        ImageUrl = "https://media.istockphoto.com/id/1253331799/photo/soft-pretzel-bites-on-a-baking-tray.webp?a=1&b=1&s=612x612&w=0&k=20&c=vsimA7Yt2euX7D-BNQJOps8ZAfWlI5UF7QaUWf1w4FE="
                    },
                    new FoodItem { 
                        Name = "Tavern Platter", 
                        Description = "Four chicken tenders, three wonton mozzarella sticks, seasoned fries with cheddar cheese sauce and applewood-smoked bacon", 
                        Price = 23.49m, 
                        CategoryId = startersCategory.Id,
                        ImageUrl = "https://media.istockphoto.com/id/1492716588/photo/food-photos-various-entrees-appetizers-deserts-etc.jpg?s=612x612&w=0&k=20&c=7VbQjto_VN1hJmTuUyXpKm0AvUI8MTol4Rkl6WqWI-c="
                    },
                    new FoodItem { 
                        Name = "Game Day Platter", 
                        Description = "Three mini cheeseburgers, half-pound of chicken wings, seasoned fries with cheddar cheese sauce and applewood-smoked bacon", 
                        Price = 22.79m, 
                        CategoryId = startersCategory.Id,
                        ImageUrl = "https://media.istockphoto.com/id/1498243668/photo/tasty-cheeseburger-with-lettuce-cheddar-cheese-tomato-and-pickles-burger-bun-with-sesame.webp?a=1&b=1&s=612x612&w=0&k=20&c=ZphkSrWnciLD-hcWMA1WAXdKIFCNnH9EHasGDRX6P4U="
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
                        ImageUrl = "https://media.istockphoto.com/id/957887642/photo/spicy-homemade-cheesey-queso-dip.webp?a=1&b=1&s=612x612&w=0&k=20&c=ClR-XEyxJgRxlWJCiL7dj9MGvr_Yj80MN0s7eCFA4uE="
                    },
                    new FoodItem { 
                        Name = "Sweet Potato Waffle Fries", 
                        Description = "Served with Ketchup and Honey Mustard", 
                        Price = 8.99m, 
                        CategoryId = startersCategory.Id,
                        ImageUrl = "https://media.istockphoto.com/id/1135821873/photo/homemade-sweet-potatoe-waffle-fries.webp?a=1&b=1&s=612x612&w=0&k=20&c=sGiB6VGTh3xh6R_ClGzNWpvB2D4Acb_F3RUPTpUZPvk="
                    },
                    new FoodItem { 
                        Name = "Onion Rings", 
                        Description = "Served with chipotle ranch and ketchup", 
                        Price = 9.99m, 
                        CategoryId = startersCategory.Id,
                        ImageUrl = "https://media.istockphoto.com/id/483773093/photo/onion-rings.webp?a=1&b=1&s=612x612&w=0&k=20&c=4Nf75-AVBBR0CDRkC_CEG7BFhZNs9VeTyIixjUjUy4o="
                    },
                    new FoodItem { 
                        Name = "Loaded Fries", 
                        Description = "Cheddar cheese sauce, applewood-smoked bacon, green onions", 
                        Price = 10.49m, 
                        CategoryId = startersCategory.Id,
                        ImageUrl = "https://media.istockphoto.com/id/1125081388/photo/loaded-chili-cheese-french-fries.webp?a=1&b=1&s=612x612&w=0&k=20&c=7s4Zk2WlgvSaM1f5qL-DAE6XKO6rQ1fHF_WcECB35Ig="
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
                        ImageUrl = "https://media.istockphoto.com/id/991861846/photo/homemade-cesar-salad-with-chicken-lettuce-and-parmesan.webp?a=1&b=1&s=612x612&w=0&k=20&c=lGzBXd30zY4RMPpD9JGG8XL8ii_2e2g2xzJqC71uzoY="
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
        ImageUrl = "https://media.istockphoto.com/id/1249008469/photo/spicy-nashville-hot-chicken-sandwich-with-coleslaw-and-pickles.webp?a=1&b=1&s=612x612&w=0&k=20&c=wI9Uo1Ex5PVVwPkdgnryEu0nMjfzPPwKtMV3dkTlCns="
    },
    new FoodItem { 
        Name = "Buffalo Chicken Wrap", 
        Description = "Crispy chicken tenders, Buffalo sauce, lettuce, tomato, red onion and choice of ranch or blue cheese dressing on a flour tortilla. Served with French fries.", 
        Price = 15.49m, 
        CategoryId = sandwichesCategory.Id,
        ImageUrl = "https://media.istockphoto.com/id/1317922284/photo/buffalo-chicken-blue-cheese-wrap.webp?a=1&b=1&s=612x612&w=0&k=20&c=SQsI6lFybQHDCo4BD0n8ywTixEhwr_ww4mXnE__PE-0="
    },
    new FoodItem { 
        Name = "Chicken B.A.L.T Sandwich", 
        Description = "Grilled chicken breast, guacamole, applewood smoked bacon, sliced tomatoes, pickled red onions, mayo and lettuce. Served with French fries.", 
        Price = 16.99m, 
        CategoryId = sandwichesCategory.Id,
        ImageUrl = "https://media.istockphoto.com/id/457918787/photo/kebab-with-french-fries.webp?a=1&b=1&s=612x612&w=0&k=20&c=Y8IE_gcQ4okqdv8sbWDAcw-d0PAWpSNMuD3f05TpFus="
    },
    new FoodItem { 
        Name = "Hot Honey Chicken Sandwich", 
        Description = "Fried chicken breast tossed in hot honey sauce, fried pickles and fried onion straws. Served with French fries.", 
        Price = 15.99m, 
        CategoryId = sandwichesCategory.Id,
        ImageUrl = "https://media.istockphoto.com/id/2172843221/photo/fried-chicken-sandwich.webp?a=1&b=1&s=612x612&w=0&k=20&c=Evr675ZipvZqdhMDNWXab7mOy5G1TyPONF1wzXfz2_8="
    },
    new FoodItem { 
        Name = "Smash Burger Wrap", 
        Description = "Two smash burger patties, cheddar cheese, romaine lettuce, diced tomato, red onion, dill pickles, Tavern sauce, flour tortilla. Served with French fries.", 
        Price = 15.99m, 
        CategoryId = sandwichesCategory.Id,
        ImageUrl = "https://media.istockphoto.com/id/1499246538/photo/preparing-the-viral-big-m-smash-burger-taco.webp?a=1&b=1&s=612x612&w=0&k=20&c=_CLS8A-hGJM2k14X6iWlD0LuFBUVelv3CpgvZDnWKOs="
    },
    new FoodItem { 
        Name = "Cherry Chicken Pecan Wrap", 
        Description = "Mixed greens, chicken, feta cheese, toasted pecans, red onion, dried cherries, white balsamic. Served with French fries.", 
        Price = 15.49m, 
        CategoryId = sandwichesCategory.Id,
        ImageUrl = "https://media.istockphoto.com/id/1356818887/photo/roast-chicken-blt-lettuce-wrap-sandwich.webp?a=1&b=1&s=612x612&w=0&k=20&c=rULhAzptIRXjueq_K82zRAX0A7UNdp0LYyIWWwd54VU="
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
        ImageUrl = "https://media.istockphoto.com/id/1775171327/photo/cheeseburger.webp?a=1&b=1&s=612x612&w=0&k=20&c=2_YQRO6pr9CIXV2XkJUm3J3hHMmQuUuxlqaylz91LSM="
    },
    new FoodItem { 
        Name = "Smash Melt", 
        Description = "Two smash burger patties, American, cheddar, and pepper jack cheese, applewood-smoked bacon, onion, tomato, Tavern sauce, Texas toast. Served with French Fries", 
        Price = 16.49m, 
        CategoryId = burgersCategory.Id,
        ImageUrl = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTlHy6WQnH9dKF2UhC3IoFwrFD7bM5ZWwopYPoDmZKV&s"
    }
);

// Add Entrees items
context.FoodItems.AddRange(
    new FoodItem { 
        Name = "Chicken Taco Platter", 
        Description = "Three flour tortilla tacos, lettuce, pico de gallo, cheddar and jack cheese, sour cream, served with fire-roasted salsa, guacamole and tortilla chips", 
        Price = 16.49m, 
        CategoryId = entreesCategory.Id,
        ImageUrl = "https://media.istockphoto.com/id/1853294101/photo/the-viral-smash-ground-chicken-cheese-burger-taco.webp?a=1&b=1&s=612x612&w=0&k=20&c=dbyv2yH3NqY4OmeBl4Bb_qf04oq1_DiphpFo2vo5JrM="
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
        ImageUrl = "https://media.istockphoto.com/id/468988439/photo/close-up-of-many-churros-with-sugar.webp?a=1&b=1&s=612x612&w=0&k=20&c=7mV40iyDua0tkFhBvb1Mnsv2I6agEEz5lqrJoQXsXpg="
    },
    new FoodItem { 
        Name = "Funnel Cake Sticks", 
        Description = "Served with salted caramel and chocolate sauce", 
        Price = 10.99m, 
        CategoryId = dessertsCategory.Id,
        ImageUrl = "https://media.istockphoto.com/id/811665838/photo/funnel-cake.webp?a=1&b=1&s=612x612&w=0&k=20&c=2d-1KXg-oBGxc422gulFwVCn7Aa37gK2_G1frkFjWMk="
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
        ImageUrl = "https://media.istockphoto.com/id/172192393/photo/milkshake-trio.webp?a=1&b=1&s=612x612&w=0&k=20&c=mh6GSqNWnPdVmo78R3TIX92Dj2Seus2e9scTG98ovEw="
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
        ImageUrl = "https://media.istockphoto.com/id/1633413449/photo/coffee-with-orange-juice.jpg?s=612x612&w=0&k=20&c=6wNiX10YJdZ6fFxvV-wXXannfz4LmE_kehmEpS5xbUs="
    },
    new FoodItem { 
        Name = "Regular Unsweet Iced Tea", 
        Description = "Regular unsweet iced tea", 
        Price = 6.25m, 
        CategoryId = beveragesCategory.Id,
        ImageUrl = "https://media.istockphoto.com/id/904627686/photo/fresh-brewed-iced-tea-in-a-clear-cup-on-a-white-background.webp?a=1&b=1&s=612x612&w=0&k=20&c=odAF0Zxt0oRTwrJRRZ1Nu5htGkd3F-i39UuoVJBI6W0="
    },
    new FoodItem { 
        Name = "Large Sweet Tea", 
        Description = "Large sweet iced tea", 
        Price = 7.25m, 
        CategoryId = beveragesCategory.Id,
        ImageUrl = "https://media.istockphoto.com/id/471350903/photo/boston-iced-tea.webp?a=1&b=1&s=612x612&w=0&k=20&c=m4c8VjZ7g6ESwQH8avdIrB-nRs8Wqyh7sxlX9PB5y58="
    },
    new FoodItem { 
        Name = "Regular Sweet Tea", 
        Description = "Regular sweet iced tea", 
        Price = 6.25m, 
        CategoryId = beveragesCategory.Id,
        ImageUrl = "https://media.istockphoto.com/id/471350903/photo/boston-iced-tea.webp?a=1&b=1&s=612x612&w=0&k=20&c=m4c8VjZ7g6ESwQH8avdIrB-nRs8Wqyh7sxlX9PB5y58="
    },
    new FoodItem { 
        Name = "ICEE Large", 
        Description = "Large ICEE frozen beverage", 
        Price = 8.05m, 
        CategoryId = beveragesCategory.Id,
        ImageUrl = "https://www.icee.com/wp-content/uploads/2019/12/blue-raspberry-icee@2x.png"
    },
    new FoodItem { 
        Name = "ICEE Junior", 
        Description = "Junior size ICEE frozen beverage", 
        Price = 7.55m, 
        CategoryId = beveragesCategory.Id,
        ImageUrl = "https://cdnimg.webstaurantstore.com/images/products/large/736018/2519317.jpg"
    }
);

// Add Candy items
context.FoodItems.AddRange(
    new FoodItem { 
        Name = "Buncha Crunch", 
        Description = "Chocolate candy", 
        Price = 5.49m, 
        CategoryId = candyCategory.Id,
        ImageUrl = "https://m.media-amazon.com/images/I/710Yn-aHzhL.jpg"
    },
    new FoodItem { 
        Name = "Cookie Dough Bites", 
        Description = "Chocolate covered cookie dough bites", 
        Price = 6.00m, 
        CategoryId = candyCategory.Id,
        ImageUrl = "https://i5.walmartimages.com/asr/f3adc482-ba6f-407e-a495-bc8508c5af32.41093c5fa639e3de49d64a2879e588f8.jpeg"
    },
    new FoodItem { 
        Name = "Dots", 
        Description = "Fruity gumdrops", 
        Price = 5.49m, 
        CategoryId = candyCategory.Id,
        ImageUrl = "https://tootsie.com/app/uploads/2024/08/DOTS.Original.ProductDetailLargeImage.png"
    },
    new FoodItem { 
        Name = "Lifesaver Gummi", 
        Description = "Fruit-flavored gummy rings", 
        Price = 6.00m, 
        CategoryId = candyCategory.Id,
        ImageUrl = "https://allcitycandy.com/cdn/shop/products/lifesaversgummiesbagside_2048x.jpg?v=1666968543"
    },
    new FoodItem { 
        Name = "M&M Peanut", 
        Description = "Chocolate covered peanuts", 
        Price = 6.00m, 
        CategoryId = candyCategory.Id,
        ImageUrl = "https://snackboxusa.com/cdn/shop/products/M_MPeanut.jpg?v=1606378598&width=1080"
    },
    new FoodItem { 
        Name = "M&M Plain", 
        Description = "Milk chocolate candies", 
        Price = 6.00m, 
        CategoryId = candyCategory.Id,
        ImageUrl = "https://allcitycandy.com/cdn/shop/products/m_mmilkchocolatebagfront1.jpg?v=1651519269"
    },
    new FoodItem { 
        Name = "Milk Duds", 
        Description = "Chocolate-covered caramels", 
        Price = 5.49m, 
        CategoryId = candyCategory.Id,
        ImageUrl = "https://m.media-amazon.com/images/I/716jBOMrWlL.jpg"
    },
    new FoodItem { 
        Name = "Reeses Pieces", 
        Description = "Peanut butter candy", 
        Price = 6.00m, 
        CategoryId = candyCategory.Id,
        ImageUrl = "https://m.media-amazon.com/images/I/714Z9vJPIUL.jpg"
    },
    new FoodItem { 
        Name = "Skittles", 
        Description = "Fruit-flavored candy", 
        Price = 6.00m, 
        CategoryId = candyCategory.Id,
        ImageUrl = "https://i5.walmartimages.com/seo/Skittles-Original-Chewy-Candy-Share-Size-4-oz-Bag_7950ce9d-b691-4472-82a0-86863a324809.76a441b806255c51f8b937b3967a9781.jpeg"
    }
);


                context.SaveChanges();
            }
        }
    }
}
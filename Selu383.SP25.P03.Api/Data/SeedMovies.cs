using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using Selu383.SP25.P03.Api.Features.Movies;

namespace Selu383.SP25.P03.Api.Data
{
    public static class SeedMovies
    {
        public static void Initialize(IServiceProvider serviceProvider)
        {
            using (var context = new DataContext(serviceProvider.GetRequiredService<DbContextOptions<DataContext>>()))
            {
                // Check if we should re-seed
                bool shouldReseed = false;

                if (context.Movies.Count() < 30)
                {
                    shouldReseed = true;
                }
                
                context.Movies.RemoveRange(context.Movies);
                context.SaveChanges();
                shouldReseed = true;
                
                if (!shouldReseed)
                {
                    return; 
                }
                
                var moviesToSeed = new List<Movie>
{
    new Movie {
        Title = "Disney's Snow White",
        Description = "A live-action musical reimagining of the classic 1937 film, opens exclusively in theaters March 21, 2025. Starring Rachel Zegler in the title role and Gal Gadot as her stepmother, the Evil Queen, the magical music adventure jourmneys back to this timeless story.",
        PosterUrl = "https://s3.us-east-1.amazonaws.com/mt-website-prod-contentbucket-1tg1jr7b5zn9a/images/movie-posters/HO00005969.jpg?w=205&h=307",
        Runtime = 109,
        Rating = "PG",
        ReleaseDate = new DateTime(2025, 3, 20),
        TmdbId = 447273
    },
    new Movie {
        Title = "A Working Man",
        Description = "Levon Cade left behind a decorated military career in the black ops to live a simple life working construction. But when his boss's daughter, who is like family to him, is taken by human traffickers, his search to bring her home uncovers a world of corruption far greater than he ever could have imagined.",
        PosterUrl = "https://s3.us-east-1.amazonaws.com/mt-website-prod-contentbucket-1tg1jr7b5zn9a/images/movie-posters/HO00005860.jpg?w=205&h=307",
        Runtime = 116,
        Rating = "R",
        ReleaseDate = new DateTime(2025, 3, 27),
        TmdbId = 1197306
    },
    new Movie {
        Title = "The Woman In the Yard",
        Description = "A lone, spectral woman shrouded entirely in black appears on a family's front lawn without explanation. Where did she come from? What does she want? When will she leave? Only The Woman in the Yard knows.",
        PosterUrl = "https://s3.us-east-1.amazonaws.com/mt-website-prod-contentbucket-1tg1jr7b5zn9a/images/movie-posters/HO00005971.jpg?w=205&h=307",
        Runtime = 88,
        Rating = "PG-13",
        ReleaseDate = new DateTime(2025, 3, 27),
        TmdbId = 1244944
    },
    new Movie {
        Title = "The Chosen: Last Supper Part 1",
        Description = "Jesus rides into the holy city as king, but finds his Father's house has been turned from a place of prayer into a corrupt market. As the Jewish High Priest schemes against the would-be Messiah, Jesus strikes first—turning the tables on religious corruption.",
        PosterUrl = "https://s3.us-east-1.amazonaws.com/mt-website-prod-contentbucket-1tg1jr7b5zn9a/images/movie-posters/HO00006118.jpg?w=205&h=307",
        Runtime = 130,
        Rating = "TBD",
        ReleaseDate = new DateTime(2025, 3, 27),
        TmdbId = 1380393
    },
    new Movie {
        Title = "Death of a Unicorn",
        Description = "A father and daughter accidentally hit and kill a unicorn while en route to a weekend retreat, where his billionare boss seeks to exploit the creature's miraculous curative properties.",
        PosterUrl = "https://s3.us-east-1.amazonaws.com/mt-website-prod-contentbucket-1tg1jr7b5zn9a/images/movie-posters/HO00006195.jpg?w=205&h=307",
        Runtime = 108,
        Rating = "R",
        ReleaseDate = new DateTime(2025, 3, 27),
        TmdbId = 1153714
    },
    new Movie {
        Title = "Captain America: Brave New World",
        Description = "After meeting with newly elected U.S. President Thaddeus Ross, Sam finds himself in the middle of an international incident.",
        PosterUrl = "https://s3.us-east-1.amazonaws.com/mt-website-prod-contentbucket-1tg1jr7b5zn9a/images/movie-posters/HO00005936.jpg?w=205&h=307",
        Runtime = 118,
        Rating = "PG-13",
        ReleaseDate = new DateTime(2025, 2, 13),
        TmdbId = 822119
    },
    new Movie {
        Title = "Novocaine",
        Description = "When the girl of his dreams is kidnapped, everyman Nate turns his inability to feel pain into an unexpected strength in his fight to get her back.",
        PosterUrl = "https://s3.us-east-1.amazonaws.com/mt-website-prod-contentbucket-1tg1jr7b5zn9a/images/movie-posters/HO00005968.jpg?w=205&h=307",
        Runtime = 110,
        Rating = "R",
        ReleaseDate = new DateTime(2025, 3, 13),
        TmdbId = 1195506
    },
    new Movie {
        Title = "The Alto Knights",
        Description = "From Warner Bros. Pictures, \"The Alto Knights\" stars Academy Award winner Robert De Niro in a dual role, directed by Academy Award-winning filmmaker Barry Levinson. The film follows two of New York's most notorious organized crime bosses, Frank Costello and Vito Genovese, as they vie for control of the city's streets.",
        PosterUrl = "https://s3.us-east-1.amazonaws.com/mt-website-prod-contentbucket-1tg1jr7b5zn9a/images/movie-posters/HO00005970.jpg?w=205&h=307",
        Runtime = 123,
        Rating = "R",
        ReleaseDate = new DateTime(2025, 3, 20),
        TmdbId = 1013601
    },
    new Movie {
        Title = "Black Bag",
        Description = "From Director Steven Soderbergh, Black Bag is a gripping spy drama about legendary intelligence agents George Woodhouse and his beloved wife Kathryn. When she is suspected of betraying the nation, George faces the ultimate test - loyalty to his marriage or his country.",
        PosterUrl = "https://s3.us-east-1.amazonaws.com/mt-website-prod-contentbucket-1tg1jr7b5zn9a/images/movie-posters/HO00005967.jpg?w=205&h=307",
        Runtime = 93,
        Rating = "R",
        ReleaseDate = new DateTime(2025, 3, 13),
        TmdbId = 1233575
    },
    new Movie {
        Title = "The Penguin Lessons",
        Description = "Inspired by the true story of a disillusioned Englishman who went to work in a school in Argentina in 1976. Expecting an easy ride, Tom discovers a divided nation and a class of unteachable students. However, after he rescues a penguin from an oil-slicked beach, his life is turned upside-down.",
        PosterUrl = "https://s3.us-east-1.amazonaws.com/mt-website-prod-contentbucket-1tg1jr7b5zn9a/images/movie-posters/HO00006110.jpg?w=205&h=307",
        Runtime = 110,
        Rating = "PG-13",
        ReleaseDate = new DateTime(2025, 3, 28),
        TmdbId = 1086497
    },
    new Movie {
        Title = "Mickey 17",
        Description = "From the Academy Award-winning writer/director of \"Parasite,\" Bong Joon Ho, comes his next groundbreaking cinematic experience, \"Mickey 17.\" The unlikely hero, Mickey Barnes has found himself in the extraordinary circumstance of working for an employer who demands the ultimate commitment to the job… to die, for a living.",
        PosterUrl = "https://s3.us-east-1.amazonaws.com/mt-website-prod-contentbucket-1tg1jr7b5zn9a/images/movie-posters/HO00005868.jpg?w=205&h=307",
        Runtime = 137,
        Rating = "R",
        ReleaseDate = new DateTime(2025, 3, 6),
        TmdbId = 696506
    },
    new Movie {
        Title = "Dog Man",
        Description = "When a faithful police dog and his human police officer owner are injured together on the job, a harebrained but life-saving surgery fuses the two of them together and Dog Man is born. Dog Man is sworn to protect and serve—and fetch, sit and roll over.",
        PosterUrl = "https://s3.us-east-1.amazonaws.com/mt-website-prod-contentbucket-1tg1jr7b5zn9a/images/movie-posters/HO00005869.jpg?w=205&h=307",
        Runtime = 89,
        Rating = "PG",
        ReleaseDate = new DateTime(2025, 1, 30),
        TmdbId = 774370
    },
    new Movie {
        Title = "The Day The Earth Blew Up: A Looney Tunes Movie",
        Description = "That's not all folks! From Ketchup Entertainment, Warner Bros. Animation, director Pete Browngardt, and the creative team behind the award-winning \"Looney Tunes Cartoons\" comes THE DAY THE EARTH BLEW UP: A LOONEY TUNES MOVIE, a brand new buddy comedy starring one of the greatest comedic duos in history-Porky Pig and Daffy Duck!",
        PosterUrl = "https://s3.us-east-1.amazonaws.com/mt-website-prod-contentbucket-1tg1jr7b5zn9a/images/movie-posters/HO00006006.jpg?w=205&h=307",
        Runtime = 91,
        Rating = "PG",
        ReleaseDate = new DateTime(2025, 3, 13),
        TmdbId = 870360
    },
    new Movie {
        Title = "Locked",
        Description = "From producer Sam Raimi comes a relentless horror-thriller where luxury becomes deadly. When Eddie (Bill Skarsgård) breaks into a luxury SUV, he steps into a deadly trap set by William (Anthony Hopkins), a self-proclaimed vigilante delivering his own brand of twisted justice. With no means of escape, Eddie must fight to survive in a ride where escape is an illusion, survival is a nightmare, and justice shifts into high gear.",
        PosterUrl = "https://s3.us-east-1.amazonaws.com/mt-website-prod-contentbucket-1tg1jr7b5zn9a/images/movie-posters/HO00006152.jpg?w=205&h=307",
        Runtime = 95,
        Rating = "R",
        ReleaseDate = new DateTime(2025, 3, 21),
        TmdbId = 1083968
    },
    new Movie {
        Title = "One of Them Days: Laugh Along",
        Description = "Best friends and roommates Dreux and Alyssa are about to have One of Them Days. When they discover Alyssa's boyfriend has blown their rent money, the duo finds themselves going to extremes in a comical race against the clock to avoid eviction and keep their friendship intact.",
        PosterUrl = "https://s3.us-east-1.amazonaws.com/mt-website-prod-contentbucket-1tg1jr7b5zn9a/images/movie-posters/HO00006265.jpg?w=205&h=307",
        Runtime = 102,
        Rating = "R",
        ReleaseDate = new DateTime(2025, 3, 28),
        TmdbId = 1280672
    },
    new Movie {
        Title = "The Monkey",
        Description = "When twin brothers Bill and Hal find their father's old monkey toy in the attic, a series of gruesome deaths start. The siblings decide to throw the toy away and move on with their lives, growing apart over the years.",
        PosterUrl = "https://s3.us-east-1.amazonaws.com/mt-website-prod-contentbucket-1tg1jr7b5zn9a/images/movie-posters/HO00005937.jpg?w=205&h=307",
        Runtime = 98,
        Rating = "R",
        ReleaseDate = new DateTime(2025, 2, 20),
        TmdbId = 1124620
    },
    new Movie {
        Title = "The Wild Robot",
        Description = "From DreamWorks Animation comes a new adaptation of a literary sensation, Peter Brown's beloved, award-winning, #1 New York Times bestseller, The Wild Robot. The epic adventure follows the journey of a robot—ROZZUM unit 7134, \"Roz\" for short — that is shipwrecked on an uninhabited island and must learn to adapt to the harsh surroundings, gradually building relationships with the animals on the island and becoming the adoptive parent of an orphaned gosling.",
        PosterUrl = "https://s3.us-east-1.amazonaws.com/mt-website-prod-contentbucket-1tg1jr7b5zn9a/images/movie-posters/HO00005342.jpg?w=205&h=307",
        Runtime = 102,
        Rating = "PG",
        ReleaseDate = new DateTime(2024, 9, 26),
        TmdbId = 1184918
    },
    new Movie {
        Title = "The Last Supper",
        Description = "From executive producer Chris Tomlin, THE LAST SUPPER is a powerful and reverent cinematic celebration of the ultimate act of divine love and sacrifice, as experienced by those who walked beside Jesus Christ. The sacred story reveals untold perspectives, illuminating the profound Biblical truths behind the moments that shaped salvation history.",
        PosterUrl = "https://s3.us-east-1.amazonaws.com/mt-website-prod-contentbucket-1tg1jr7b5zn9a/images/movie-posters/HO00006093.jpg?w=205&h=307",
        Runtime = 114,
        Rating = "PG-13",
        ReleaseDate = new DateTime(2025, 3, 13),
        TmdbId = 1380415
    },
    new Movie {
        Title = "Audrey's Children",
        Description = "Dr. Audrey Evans joins world-renowned children's hospital and battles sexism, medical conventions, and the subterfuge of her peers to develop revolutionary treatments and purchase the first Ronald McDonald House, impacting millions.",
        PosterUrl = "https://s3.us-east-1.amazonaws.com/mt-website-prod-contentbucket-1tg1jr7b5zn9a/images/movie-posters/HO00006236.jpg?w=205&h=307",
        Runtime = 110,
        Rating = "PG",
        ReleaseDate = new DateTime(2025, 3, 28),
        TmdbId = 1003083
    },
    new Movie {
        Title = "Paddington in Peru",
        Description = "Full of Paddington's signature blend of wit, charm, and laugh-out-loud humor, Paddington in Peru finds the beloved, marmalade-loving bear lost in the jungle on an exciting, high-stakes adventure. When Paddington discovers his beloved Aunt Lucy has gone missing from the Home for Retired Bears, he and the Brown family head to the wilds of Peru to look for her, the only clue to her whereabouts a spot marked on an enigmatic map.",
        PosterUrl = "https://s3.us-east-1.amazonaws.com/mt-website-prod-contentbucket-1tg1jr7b5zn9a/images/movie-posters/HO00005870.jpg?w=205&h=307",
        Runtime = 106,
        Rating = "PG",
        ReleaseDate = new DateTime(2025, 2, 13),
        TmdbId = 516729
    },
    new Movie {
        Title = "Mad Square",
        Description = "Three college buddies navigate their way through campus life, leading to wild adventures and laugh-out-loud moments.",
        PosterUrl = "https://s3.us-east-1.amazonaws.com/mt-website-prod-contentbucket-1tg1jr7b5zn9a/images/movie-posters/HO00006233.jpg?w=205&h=307",
        Runtime = 126,
        Rating = "TBD",
        ReleaseDate = new DateTime(2025, 3, 28),
        TmdbId = 1003083
    },
    new Movie {
        Title = "Sikandar",
        Description = "Salman Khan (last seen in TIGER 3) & Rashmika Mandanna (last seen in PUSHPA 2) combine forces this Eid in an action thriller from the accomplished director of GHAJINI, A. R. Murugadoss.",
        PosterUrl = "https://s3.us-east-1.amazonaws.com/mt-website-prod-contentbucket-1tg1jr7b5zn9a/images/movie-posters/HO00006241.jpg?w=205&h=307",
        Runtime = 148,
        Rating = "TBD",
        ReleaseDate = new DateTime(2025, 3, 29),
        TmdbId = 607139
    },
    new Movie {
        Title = "Last Breath",
        Description = "A heart-pounding film that follows seasoned deep-sea divers as they battle the raging elements to rescue their crewmate trapped hundreds of feet below the ocean's surface. Based on a true story, LAST BREATH is an electrifying story about teamwork, resilience, and a race against time to do the impossible.",
        PosterUrl = "https://s3.us-east-1.amazonaws.com/mt-website-prod-contentbucket-1tg1jr7b5zn9a/images/movie-posters/HO00005939.jpg?w=205&h=307",
        Runtime = 93,
        Rating = "PG-13",
        ReleaseDate = new DateTime(2025, 2, 27),
        TmdbId = 972533
    },
    new Movie {
        Title = "Magazine Dreams",
        Description = "MAGAZINE DREAMS follows aspiring bodybuilder Killian Maddox, who looks after his ailing grandfather while pursuing his dreams and struggling to find human connection. Maddox's obsession with being the best and one day gracing the cover of a magazine like his hero Brad Vanderhorn (O'Hearn) ultimately leads to a downward spiral as his rage grows and his grip starts to slip.",
        PosterUrl = "https://s3.us-east-1.amazonaws.com/mt-website-prod-contentbucket-1tg1jr7b5zn9a/images/movie-posters/HO00004544.jpg?w=205&h=307",
        Runtime = 124,
        Rating = "R",
        ReleaseDate = new DateTime(2025, 3, 21),
        TmdbId = 784524
    },
    new Movie {
        Title = "Mufasa: The Lion King",
        Description = "Mufasa: The Lion King enlists Rafiki to relay the legend of Mufasa to young lion cub Kiara, daughter of Simba and Nala, with Timon and Pumbaa lending their signature schtick. Told in flashbacks, the story introduces Mufasa as an orphaned cub, lost and alone until he meets a sympathetic lion named Taka—the heir to a royal bloodline.",
        PosterUrl = "https://s3.us-east-1.amazonaws.com/mt-website-prod-contentbucket-1tg1jr7b5zn9a/images/movie-posters/HO00005580.jpg?w=205&h=307",
        Runtime = 118,
        Rating = "PG",
        ReleaseDate = new DateTime(2024, 12, 20),
        TmdbId = 762509
    },
    new Movie {
        Title = "Bob Trevino Likes It",
        Description = "BOB TREVINO LIKES IT is inspired by the true friendship that writer/director Tracie Laymon found with a stranger in real life while looking for her father online. Often playing the role of caretaker to people like her father, who should be caring for her, Lily Trevino longs for familial connection.",
        PosterUrl = "https://s3.us-east-1.amazonaws.com/mt-website-prod-contentbucket-1tg1jr7b5zn9a/images/movie-posters/HO00006092.jpg?w=205&h=307",
        Runtime = 102,
        Rating = "PG-13",
        ReleaseDate = new DateTime(2025, 3, 28),
        TmdbId = 1169789
    },
    new Movie {
        Title = "L2: Empuraan",
        Description = "The journey of Stephen Nedumpally, a man leading a double life as Khureshi Ab'raam, an enigmatic leader of a powerful global crime syndicate.",
        PosterUrl = "https://s3.us-east-1.amazonaws.com/mt-website-prod-contentbucket-1tg1jr7b5zn9a/images/movie-posters/HO00006262.jpg?w=205&h=307",
        Runtime = 178,
        Rating = "TBD",
        ReleaseDate = new DateTime(2025, 3, 27),
        TmdbId = 627336
    },
    new Movie {
        Title = "Imagine Dragons: Live from the Hollywood Bowl",
        Description = "Globally renowned, GRAMMY® Award-winning band Imagine Dragons enlisted the LA Film Orchestra to perform their biggest hits and new chart-topping songs against the backdrop of the iconic Hollywood Bowl. During a nearly two-hour concert, the band fuses their explosive, cathartic sound with gorgeous, intricate symphonic arrangements played on stage by over 50 musicians.",
        PosterUrl = "https://s3.us-east-1.amazonaws.com/mt-website-prod-contentbucket-1tg1jr7b5zn9a/images/movie-posters/HO00006126.jpg?w=205&h=307",
        Runtime = 130,
        Rating = "TBD",
        ReleaseDate = new DateTime(2025, 3, 26),
        TmdbId = 1429460
    },
    new Movie {
        Title = "Veera Dheera Sooran: Part 2",
        Description = "Veera Dheera Sooran: Part 2 revolves around Kaali, a provision store owner and a loving husband and father, whose involvement in a dangerous crime network and his mysterious mission forms the rest of the story.",
        PosterUrl = "https://s3.us-east-1.amazonaws.com/mt-website-prod-contentbucket-1tg1jr7b5zn9a/images/movie-posters/HO00006263.jpg?w=205&h=307",
        Runtime = 162,
        Rating = "TBD",
        ReleaseDate = new DateTime(2025, 3, 27),
        TmdbId = 1198208
    },
    new Movie {
        Title = "Robinhood",
        Description = "Robinhood - #VN2 Mythri Movie Makers starring Nithiin as lead actor. Directed by Venky Kudmula, Music by GV Prakash Kumar, Produced by Naveen Yerneni & Y. Ravi Shankar under Mythri Movie Makers Banner.",
        PosterUrl = "https://s3.us-east-1.amazonaws.com/mt-website-prod-contentbucket-1tg1jr7b5zn9a/images/movie-posters/HO00005982.jpg?w=205&h=307",
        Runtime = 154,
        Rating = "TBD",
        ReleaseDate = new DateTime(2025, 3, 28),
        TmdbId = 1120762
    },
    new Movie {
        Title = "The Unbreakable Boy",
        Description = "From Kingdom Story Company, the team behind Jesus Revolution and The Best Christmas Pageant Ever, and Lionsgate, the studio behind Wonder, comes The Unbreakable Boy. When his parents, Scott (Zachary Levi) and Teresa (Meghann Fahy), learn that Austin is both autistic and has brittle bone disease, they initially worry for their son's future.",
        PosterUrl = "https://s3.us-east-1.amazonaws.com/mt-website-prod-contentbucket-1tg1jr7b5zn9a/images/movie-posters/HO00002582.jpg?w=205&h=307",
        Runtime = 109,
        Rating = "PG",
        ReleaseDate = new DateTime(2025, 2, 20),
        TmdbId = 765897
    },
    new Movie {
        Title = "Day of Reckoning",
        Description = "A struggling sheriff teams up with a tough U.S. Marshal to detain a cunning female outlaw. As tensions rise within their posse, they must face an approaching gang led by the prisoner's violent husband.",
        PosterUrl = "https://s3.us-east-1.amazonaws.com/mt-website-prod-contentbucket-1tg1jr7b5zn9a/images/movie-posters/HO00006240.jpg?w=205&h=307",
        Runtime = 106,
        Rating = "R",
        ReleaseDate = new DateTime(2025, 3, 28),
        TmdbId = 1120763
    },
    new Movie {
        Title = "October 8",
        Description = "OCTOBER 8 offers a searing look at the eruption of antisemitism on college campuses, social media and in the streets of America starting the day after Hamas' attack on Israel on October 7.",
        PosterUrl = "https://s3.us-east-1.amazonaws.com/mt-website-prod-contentbucket-1tg1jr7b5zn9a/images/movie-posters/HO00006227.jpg?w=205&h=307",
        Runtime = 100,
        Rating = "R",
        ReleaseDate = new DateTime(2025, 3, 14),
        TmdbId = 1120764
    },
    new Movie {
        Title = "Princess Mononoke: 4k IMAX Exclusive",
        Description = "A beautifully realized tale of civilization versus nature, PRINCESS MONONOKE is a true epic by Japan's master animator Hayao Miyazaki. While protecting his village from a rampaging boar-god, the young warrior Ashitaka becomes afflicted with a deadly curse. To find the cure that will save his life, he journeys deep into the sacred depths of the Great Forest Spirit's realm.",
        PosterUrl = "https://s3.us-east-1.amazonaws.com/mt-website-prod-contentbucket-1tg1jr7b5zn9a/images/movie-posters/HO00005036.jpg?w=205&h=307",
        Runtime = 133,
        Rating = "PG-13",
        ReleaseDate = new DateTime(2025, 3, 26),
        TmdbId = 1120765
    },
    new Movie {
        Title = "One of Them Days",
        Description = "Best friends and roommates Dreux (Keke Palmer) and Alyssa (SZA) are about to have One of Them Days. When they discover Alyssa's boyfriend has blown their rent money, the duo finds themselves going to extremes in a comical race against the clock to avoid eviction and keep their friendship intact.",
        PosterUrl = "https://s3.us-east-1.amazonaws.com/mt-website-prod-contentbucket-1tg1jr7b5zn9a/images/movie-posters/HO00005871.jpg?w=205&h=307",
        Runtime = 97,
        Rating = "R",
        ReleaseDate = new DateTime(2025, 1, 16),
        TmdbId = 1280672
    },
    new Movie {
        Title = "Court: State VS a Nobody",
        Description = "A determined lawyer takes on a high-stakes case to defend a 19-year-old boy, challenging a system that has already branded him guilty.",
        PosterUrl = "https://s3.us-east-1.amazonaws.com/mt-website-prod-contentbucket-1tg1jr7b5zn9a/images/movie-posters/HO00006214.jpg?w=205&h=307",
        Runtime = 155,
        Rating = "TBD",
        ReleaseDate = new DateTime(2025, 3, 14),
        TmdbId = 1424217
    },
    new Movie {
        Title = "Ash",
        Description = "On the mysterious planet of Ash, Riya (Eiza González) awakens to find her crew slaughtered. When a man named Brion (Aaron Paul) arrives to rescue her, an ordeal of psychological and physical terror ensues while Riya and Brion must decide if they can trust one another to survive.",
        PosterUrl = "https://s3.us-east-1.amazonaws.com/mt-website-prod-contentbucket-1tg1jr7b5zn9a/images/movie-posters/HO00006097.jpg?w=205&h=307",
        Runtime = 95,
        Rating = "R",
        ReleaseDate = new DateTime(2025, 3, 21),
        TmdbId = 931349
    },
    new Movie {
        Title = "A Complete Unknown",
        Description = "New York, 1961. Against the backdrop of a vibrant music scene and tumultuous cultural upheaval, an enigmatic 19-year-old from Minnesota arrives with his guitar and revolutionary talent, destined to change the course of American music. He forges intimate relationships with music icons of Greenwich Village on his meteoric rise, culminating in a groundbreaking and controversial performance that reverberates worldwide.",
        PosterUrl = "https://s3.us-east-1.amazonaws.com/mt-website-prod-contentbucket-1tg1jr7b5zn9a/images/movie-posters/HO00005583.jpg?w=205&h=307",
        Runtime = 141,
        Rating = "R",
        ReleaseDate = new DateTime(2024, 12, 25),
        TmdbId = 661539
    },
    new Movie {
        Title = "Wicked",
        Description = "Wicked, the untold story of the witches of Oz, stars Emmy, Grammy and Tony winning powerhouse Cynthia Erivo (Harriet, Broadway's The Color Purple) as Elphaba, a young woman, misunderstood because of her unusual green skin, who has yet to discover her true power, and Grammy-winning, multi-platinum recording artist and global superstar Ariana Grande as Glinda, a popular young woman, gilded by privilege and ambition, who has yet to discover her true heart.",
        PosterUrl = "https://s3.us-east-1.amazonaws.com/mt-website-prod-contentbucket-1tg1jr7b5zn9a/images/movie-posters/HO00005508.jpg?w=205&h=307",
        Runtime = 160,
        Rating = "PG",
        ReleaseDate = new DateTime(2024, 11, 21),
        TmdbId = 402431
    },
    new Movie {
        Title = "Becoming Led Zeppelin",
        Description = "Becoming Led Zeppelin, a documentary that dives into the rise of the epochal rock group, has been completed. It is the only documentary of its kind that the band themselves have participated in. The documentary, which was first announced in 2019, includes new interviews with Jimmy Page, Robert Plant and John Paul Jones, as well as rare archival interviews with the band's late drummer John Bonham.",
        PosterUrl = "https://s3.us-east-1.amazonaws.com/mt-website-prod-contentbucket-1tg1jr7b5zn9a/images/movie-posters/HO00005953.jpg?w=205&h=307",
        Runtime = 121,
        Rating = "PG-13",
        ReleaseDate = new DateTime(2025, 2, 7),
        TmdbId = 857800
    },
    new Movie {
        Title = "Top Gun",
        Description = "Two rising but reckless Naval officers - Pete (Maverick) Mitchell and Nick (Goose) Bradshaw - are recruited for Top Gun; an elite US Flying school for advanced fighter pilots. There, the macho classmates engage in a dangerous competition to outdo their rivals and Maverick begins a relationship with a civilian instructor.",
        PosterUrl = "https://s3.us-east-1.amazonaws.com/mt-website-prod-contentbucket-1tg1jr7b5zn9a/images/movie-posters/HO00005388.jpg?w=205&h=307",
        Runtime = 110,
        Rating = "PG",
        ReleaseDate = new DateTime(2025, 3, 16),
        TmdbId = 744
    }
                };
                
                // Add movies that don't already exist
                foreach (var movie in moviesToSeed)
                {
                    // Check if movie already exists by title
                    bool exists = context.Movies.Any(m => m.Title == movie.Title);
                    
                    if (!exists)
                    {
                        context.Movies.Add(movie);
                    }
                }
                
                // Save changes to the database
                context.SaveChanges();
            }
        }
    }
}
using System;
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
                // Look for any movies
                if (context.Movies.Any())
                {
                    return;   // DB has been seeded
                }

                context.Movies.AddRange(
                    new Movie
                    {
                        Title = "Avengers: Endgame",
                        Description = "After the devastating events of Avengers: Infinity War, the universe is in ruins. With the help of remaining allies, the Avengers assemble once more in order to reverse Thanos' actions and restore balance to the universe.",
                        PosterUrl = "https://image.tmdb.org/t/p/w500/or06FN3Dka5tukK1e9sl16pB3iy.jpg",
                        Runtime = 181,
                        Rating = "PG-13",
                        ReleaseDate = new DateTime(2019, 4, 26),
                        TmdbId = 299534
                    },
                    new Movie
                    {
                        Title = "Dune",
                        Description = "Paul Atreides, a brilliant and gifted young man born into a great destiny beyond his understanding, must travel to the most dangerous planet in the universe to ensure the future of his family and his people.",
                        PosterUrl = "https://image.tmdb.org/t/p/w500/d5NXSklXo0qyIYkgV94XAgMIckC.jpg",
                        Runtime = 155,
                        Rating = "PG-13",
                        ReleaseDate = new DateTime(2021, 10, 22),
                        TmdbId = 438631
                    },
                    new Movie
                    {
                        Title = "The Batman",
                        Description = "When the Riddler, a sadistic serial killer, begins murdering key political figures in Gotham, Batman is forced to investigate the city's hidden corruption and question his family's involvement.",
                        PosterUrl = "https://image.tmdb.org/t/p/w500/74xTEgt7R36Fpooo50r9T25onhq.jpg",
                        Runtime = 176,
                        Rating = "PG-13",
                        ReleaseDate = new DateTime(2022, 3, 4),
                        TmdbId = 414906
                    },
                    new Movie
                    {
                        Title = "Top Gun: Maverick",
                        Description = "After more than thirty years of service as one of the Navy's top aviators, Pete Mitchell is where he belongs, pushing the envelope as a courageous test pilot and dodging the advancement in rank that would ground him.",
                        PosterUrl = "https://image.tmdb.org/t/p/w500/62HCnUTziyWcpDaBO2i1DX17ljH.jpg",
                        Runtime = 131,
                        Rating = "PG-13",
                        ReleaseDate = new DateTime(2022, 5, 27),
                        TmdbId = 361743
                    },
                    new Movie
                    {
                        Title = "The Super Mario Bros. Movie",
                        Description = "While working underground to fix a water main, Brooklyn plumbers Mario and Luigi are transported through a mysterious pipe to a magical new world.",
                        PosterUrl = "https://image.tmdb.org/t/p/w500/qNBAXBIQlnOThrVvA6mA2B5ggV6.jpg",
                        Runtime = 92,
                        Rating = "PG",
                        ReleaseDate = new DateTime(2023, 4, 5),
                        TmdbId = 502356
                    }
                );

                context.SaveChanges();
            }
        }
    }
}
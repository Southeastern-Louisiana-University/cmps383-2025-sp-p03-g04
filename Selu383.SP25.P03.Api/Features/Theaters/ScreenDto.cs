namespace Selu383.SP25.P03.Api.Features.Theaters
{
public class ScreenDto
{
    public int Id { get; set; }
    public required string Name { get; set; }
    public int Capacity { get; set; }
    public int TheaterId { get; set; }
    public required string TheaterName { get; set; }
}
}
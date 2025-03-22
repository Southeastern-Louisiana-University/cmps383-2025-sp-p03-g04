namespace Selu383.SP25.P03.Api.Features.Theaters
{
public class SeatDto
{
    public int Id { get; set; }
    public required string Row { get; set; }
    public int Number { get; set; }
    public int ScreenId { get; set; }
    public SeatStatus Status { get; set; } = SeatStatus.Available;
}
}
using Luce.Application.Abstractions.Dtos;
using Luce.Application.Abstractions.Persistence;
using Luce.Application.Abstractions.Services;
using Luce.Domain.Entities;

namespace Luce.Application.Services;

public class ContactService : IContactService
{
    private readonly IApplicationDbContext _db;

    public ContactService(IApplicationDbContext db) => _db = db;

    public async Task<int> SubmitAsync(ContactCreateDto dto, CancellationToken cancellationToken = default)
    {
        var entity = new ContactMessage
        {
            Name = dto.Name,
            Email = dto.Email,
            Phone = dto.Phone,
            Message = dto.Message,
            CreatedAt = DateTimeOffset.UtcNow
        };
        _db.ContactMessages.Add(entity);
        await _db.SaveChangesAsync(cancellationToken);
        return entity.Id;
    }
}

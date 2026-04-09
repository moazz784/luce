using Luce.Application.Abstractions.Dtos;
using Luce.Application.Abstractions.Persistence;
using Luce.Application.Abstractions.Services;
using Luce.Domain.Entities;
using Microsoft.EntityFrameworkCore;

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

    public async Task<IReadOnlyList<ContactMessageAdminDto>> GetAllAsync(CancellationToken cancellationToken = default)
    {
        var list = await _db.ContactMessages
            .AsNoTracking()
            .OrderByDescending(m => m.CreatedAt)
            .ThenByDescending(m => m.Id)
            .ToListAsync(cancellationToken);
        return list.Select(m => new ContactMessageAdminDto
        {
            Id = m.Id,
            Name = m.Name,
            Email = m.Email,
            Phone = m.Phone,
            Message = m.Message,
            CreatedAt = m.CreatedAt,
        }).ToList();
    }

    public async Task<bool> DeleteAsync(int id, CancellationToken cancellationToken = default)
    {
        var entity = await _db.ContactMessages.FirstOrDefaultAsync(m => m.Id == id, cancellationToken);
        if (entity is null)
            return false;
        _db.ContactMessages.Remove(entity);
        await _db.SaveChangesAsync(cancellationToken);
        return true;
    }
}

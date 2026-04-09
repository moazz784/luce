using Luce.Application.Abstractions.Dtos;

namespace Luce.Application.Abstractions.Services;

public interface INewsService
{
    Task<IReadOnlyList<NewsPublicDto>> GetPublishedAsync(CancellationToken cancellationToken = default);
    Task<IReadOnlyList<NewsAdminDto>> GetAllAsync(CancellationToken cancellationToken = default);
    Task<NewsAdminDto?> GetByIdAsync(int id, CancellationToken cancellationToken = default);
    Task<NewsAdminDto> CreateAsync(NewsCreateDto dto, CancellationToken cancellationToken = default);
    Task<NewsAdminDto?> UpdateAsync(int id, NewsUpdateDto dto, CancellationToken cancellationToken = default);
    Task<bool> DeleteAsync(int id, CancellationToken cancellationToken = default);
}

public interface IEventService
{
    Task<IReadOnlyList<EventPublicDto>> GetPublicAsync(CancellationToken cancellationToken = default);
    Task<IReadOnlyList<EventAdminDto>> GetAllAsync(CancellationToken cancellationToken = default);
    Task<EventAdminDto?> GetByIdAsync(int id, CancellationToken cancellationToken = default);
    Task<EventAdminDto> CreateAsync(EventCreateDto dto, CancellationToken cancellationToken = default);
    Task<EventAdminDto?> UpdateAsync(int id, EventUpdateDto dto, CancellationToken cancellationToken = default);
    Task<bool> DeleteAsync(int id, CancellationToken cancellationToken = default);
}

public interface IAwardService
{
    Task<IReadOnlyList<AwardPublicDto>> GetPublicAsync(CancellationToken cancellationToken = default);
    Task<IReadOnlyList<AwardAdminDto>> GetAllAsync(CancellationToken cancellationToken = default);
    Task<AwardAdminDto?> GetByIdAsync(int id, CancellationToken cancellationToken = default);
    Task<AwardAdminDto> CreateAsync(AwardCreateDto dto, CancellationToken cancellationToken = default);
    Task<AwardAdminDto?> UpdateAsync(int id, AwardUpdateDto dto, CancellationToken cancellationToken = default);
    Task<bool> DeleteAsync(int id, CancellationToken cancellationToken = default);
}

public interface IAlumniService
{
    Task<IReadOnlyList<AlumniPublicDto>> GetPublicAsync(CancellationToken cancellationToken = default);
    Task<IReadOnlyList<AlumniAdminDto>> GetAllAsync(CancellationToken cancellationToken = default);
    Task<AlumniAdminDto?> GetByIdAsync(int id, CancellationToken cancellationToken = default);
    Task<AlumniAdminDto> CreateAsync(AlumniCreateDto dto, CancellationToken cancellationToken = default);
    Task<AlumniAdminDto?> UpdateAsync(int id, AlumniUpdateDto dto, CancellationToken cancellationToken = default);
    Task<bool> DeleteAsync(int id, CancellationToken cancellationToken = default);
}

public interface IHeroService
{
    Task<IReadOnlyList<HeroSlidePublicDto>> GetPublicAsync(CancellationToken cancellationToken = default);
    Task<IReadOnlyList<HeroSlideAdminDto>> GetAllAsync(CancellationToken cancellationToken = default);
    Task<HeroSlideAdminDto?> GetByIdAsync(int id, CancellationToken cancellationToken = default);
    Task<HeroSlideAdminDto> CreateAsync(HeroSlideCreateDto dto, CancellationToken cancellationToken = default);
    Task<HeroSlideAdminDto?> UpdateAsync(int id, HeroSlideUpdateDto dto, CancellationToken cancellationToken = default);
    Task<bool> DeleteAsync(int id, CancellationToken cancellationToken = default);
}

public interface ISyndicateService
{
    Task<IReadOnlyList<SyndicatePublicDto>> GetPublicAsync(CancellationToken cancellationToken = default);
    Task<IReadOnlyList<SyndicateAdminDto>> GetAllAsync(CancellationToken cancellationToken = default);
    Task<SyndicateAdminDto?> GetByIdAsync(int id, CancellationToken cancellationToken = default);
    Task<SyndicateAdminDto> CreateAsync(SyndicateCreateDto dto, CancellationToken cancellationToken = default);
    Task<SyndicateAdminDto?> UpdateAsync(int id, SyndicateUpdateDto dto, CancellationToken cancellationToken = default);
    Task<bool> DeleteAsync(int id, CancellationToken cancellationToken = default);
}

public interface IContactService
{
    Task<int> SubmitAsync(ContactCreateDto dto, CancellationToken cancellationToken = default);
    Task<IReadOnlyList<ContactMessageAdminDto>> GetAllAsync(CancellationToken cancellationToken = default);
    Task<bool> DeleteAsync(int id, CancellationToken cancellationToken = default);
}

public interface IHomeBundleService
{
    Task<HomeBundleDto> GetAsync(CancellationToken cancellationToken = default);
}

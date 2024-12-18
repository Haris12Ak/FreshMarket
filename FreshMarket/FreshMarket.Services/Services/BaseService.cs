using AutoMapper;
using Microsoft.EntityFrameworkCore;

namespace FreshMarket.Services.Services
{
    public class BaseService<T, Tdb> where T : class where Tdb : class
    {
        protected ApplicationDbContext _dbContext;
        protected IMapper _mapper;

        public BaseService(ApplicationDbContext dbContext, IMapper mapper)
        {
            _dbContext = dbContext;
            _mapper = mapper;
        }

        public virtual async Task<List<T>> GetAll()
        {
            var set = _dbContext.Set<Tdb>();

            var data = await set.ToListAsync();

            return _mapper.Map<List<T>>(data);
        }

        public virtual async Task<T> GetById(int id)
        {
            var set = _dbContext.Set<Tdb>();

            var data = await set.FindAsync(id);

            if (data == null)
                return null;

            return _mapper.Map<T>(data);
        }
    }
}

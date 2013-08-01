

using System;
using VSC.Web.Data.Models;
namespace VSC.Web.Data.Access
{
    // from http://www.asp.net/mvc/tutorials/getting-started-with-ef-using-mvc/implementing-the-repository-and-unit-of-work-patterns-in-an-asp-net-mvc-application
    public class UnitOfWork : IDisposable
    {
        private SigmaContext _context = new SigmaContext();
        private GenericRepository<CountryProfile> _countryProfileRepository;
        private GenericRepository<Schedule> _scheduleRepository;
        private GenericRepository<GeoName> _geoNameRepository;
        private GenericRepository<DemandForcast> _demandForcastRepository;
        private GenericRepository<CountryBoundary> _countryBoundaryRepository;
 
        //private GenericRepository<Result> _resultRepository;

        public GenericRepository<CountryProfile> CountryProfileRepository
        {
            get
            {

                if (this._countryProfileRepository == null)
                {
                    this._countryProfileRepository = new GenericRepository<CountryProfile>(_context);
                }
                return _countryProfileRepository;
            }
        }

        public GenericRepository<Schedule> ScheduleRepository
        {
            get
            {

                if (this._scheduleRepository == null)
                {
                    this._scheduleRepository = new GenericRepository<Schedule>(_context);
                }
                return _scheduleRepository;
            }
        }

        public GenericRepository<GeoName> GeoNameRepository
        {
            get
            {

                if (this._geoNameRepository == null)
                {
                    this._geoNameRepository = new GenericRepository<GeoName>(_context);
                }
                return _geoNameRepository;
            }
        }

        public GenericRepository<DemandForcast> DemandForcastRepository
        {
            get
            {

                if (this._demandForcastRepository == null)
                {
                    this._demandForcastRepository = new GenericRepository<DemandForcast>(_context);
                }
                return _demandForcastRepository;
            }
        }

        public GenericRepository<CountryBoundary>       CountryBoundaryRepository
        {
            get
            {

                if (this._countryBoundaryRepository == null)
                {
                    this._countryBoundaryRepository = new GenericRepository<CountryBoundary>(_context);
                }
                return _countryBoundaryRepository;
            }
        }
 
        public void Save()
        {
            _context.SaveChanges();
        }

        private bool disposed = false;

        protected virtual void Dispose(bool disposing)
        {
            if (!this.disposed)
            {
                if (disposing)
                {
                    _context.Dispose();
                }
            }
            this.disposed = true;
        }

        public void Dispose()
        {
            Dispose(true);
            GC.SuppressFinalize(this);
        }
    }
}
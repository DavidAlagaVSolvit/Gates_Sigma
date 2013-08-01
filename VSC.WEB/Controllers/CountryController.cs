using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity.Infrastructure;
using System.Data.Spatial;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using VSC.Web.Data.Access;
using VSC.Web.Data.Models;


namespace VSC.Web.Controllers
{
    // all data is read only for now 
    public class CountryController : ApiController
    {

        private UnitOfWork _unitOfWork = new UnitOfWork();


        // GET api/Country/List
        [HttpGet]
        public string Ping()
        {
            return DateTime.Now + "  " + GetType().Name + " is alive and kicking for another day ";
        }


        // GET api/CountryProfile/GetAllCountryProfiles
        [HttpGet]
        public IEnumerable<CountryProfile> Profiles()
        {
            return _unitOfWork.CountryProfileRepository.Get().OrderBy(c => c.CountryName);
        }

        // GET api/Country/Find/5
        // id can be geoname id or IsoNumeric value 
        [HttpGet]
        public CountryProfile Find(int id)
        {
            //get the country profile and all related records 

            CountryProfile record = _unitOfWork
                .CountryProfileRepository
                .Get(x => x.GeoNameId == id || x.IsoNumeric == id, includeProperties: "GeoName,GeoName.Demograhics,GeoName.Schedules,GeoName.ImunizationLocations")
                .FirstOrDefault<CountryProfile>();

            CountryBoundary boundary = _unitOfWork.CountryBoundaryRepository.Get(b => b.IsoNumeric == record.IsoNumeric).FirstOrDefault<CountryBoundary>();
            if (record == null)
            {

                throw new HttpResponseException(Request.CreateResponse(HttpStatusCode.NotFound));
            }
            else
            {
                record.Shape = boundary.Shape;
            }

            return record;
        }

        [HttpGet]
        public CountryProfile FindByLocation(string latitude = "0", string longitude = "0")
        {

            CountryProfile record = null;
            int coodinateSystemId = 4326;

            DbGeometry p = DbGeometry.PointFromText("POINT(" + longitude + " " + latitude + ")", coodinateSystemId);
            if (p.IsValid)
            {
                CountryBoundary boundary = _unitOfWork.CountryBoundaryRepository.Get(s => p.Intersects(s.Shape)).FirstOrDefault<CountryBoundary>();

                if (!string.IsNullOrEmpty(boundary.CountryName))
                {
                    record = _unitOfWork.CountryProfileRepository
                   .Get(x => x.IsoNumeric == boundary.IsoNumeric, includeProperties: "GeoName,GeoName.Demograhics,GeoName.Schedules,GeoName.ImunizationLocations")
                   .FirstOrDefault<CountryProfile>();
                    if (record != null)
                    {
                        record.Shape = boundary.Shape;
                    }
                }
            }
            else {
                System.Diagnostics.Debug.WriteLine(p.AsText() + " is not valid !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
            }

            return record;
        }
       
        // api/Country/Admin/US/1
        [HttpGet]
        public IQueryable<GeoName> Admin(string countryCode = "US", string level = "1")
        {

            string featureCode = "ADM" + level;

            var records = _unitOfWork.GeoNameRepository
                .Get(g => g.CountryCode == countryCode && g.FeatureCode == featureCode, includeProperties: "Demograhics,Schedules,DemandForcasts").
                //.Get(g => g.CountryCode == countryCode && g.FeatureCode == featureCode, includeProperties: "Demograhics,Schedules,ImunizationLocations,DemandForcasts").
                OrderBy(o => o.Name).AsQueryable();
            return records;
        }


        //// api/Country/Model/2963597/1/ 
        //[HttpGet]
        //public IQueryable<DemandForcast> Model(string type = "demand", int geoNameId = 2963597, int radius = 1)
        //{

        //    //var records = _unitOfWork.DemandForcastRepository
        //    //    .Get(g => g.GeoNameId == geoNameId,includeProperties: "DemandForcastResults")
        //    //    .AsQueryable();


        //    //using (var db = new ForcastContext())
        //    //{
        //    //    Forcast r = db.DemandForcasts.Find(geoNameId);
        //    //    if (r == null)
        //    //    {
        //    //        ForcastResult d = new ForcastResult();
        //    //        d.ParameterName = "Total Population";
        //    //        d.OrgionalValue = 0;
        //    //        d.InSideCoveredValue = 0;
        //    //        d.InSideNotCoveredValue = 0;
        //    //        d.OutSideNotCoveredValue = 0;


        //    //        r = new Forcast();
        //    //        r.GeoNameId = geoNameId;
        //    //        r.CatchmentRadius = radius;
        //    //        r.PercentCoverage = percent;
        //    //        r.ForcastResults = new List<ForcastResult>();
        //    //        r.ForcastResults.Add(d);
        //    //        // db.DemandForcasts.Add(r);
        //    //        // db.SaveChanges();

        //    //    }

        //    //}

        //    return null;// records;// "Modeling " + type + "  for location " + geoNameId + " radius  " + radius + "  percent " + percent;
        //}

        protected override void Dispose(bool disposing)
        {
            _unitOfWork.Dispose();
            base.Dispose(disposing);
        }
    }
}

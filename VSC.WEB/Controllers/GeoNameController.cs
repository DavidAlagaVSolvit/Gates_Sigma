using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Data.Spatial;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web;
using System.Web.Http;
using VSC.Web.Data.Access;
using VSC.Web.Data.Models;

namespace VSC.Web.Controllers
{
    public class GeoNameController : ApiController
    {

        private UnitOfWork _unitOfWork = new UnitOfWork();
 
        [HttpGet]
        public string Ping()
        {
            return DateTime.Now + "  " + GetType().Name + " is alive and kicking for another day ";
        }

    
        [HttpGet]
        public IQueryable<GeoName> Admin(string countryCode = "US", string level = "1")
        {

            string featureCode = "ADM" + level;

            var records = _unitOfWork.GeoNameRepository
                .Get(g => g.CountryCode == countryCode && g.FeatureCode == featureCode, includeProperties: "Demograhics,Schedules,ImunizationLocations").
                OrderBy(o => o.Name).AsQueryable();
            return records;
        }



  
        [HttpGet]
        public GeoName Find(int id)
        {
            GeoName record = _unitOfWork.GeoNameRepository
                 .Get(x => x.GeoNameId == id, includeProperties: "Demograhics,Schedules,ImunizationLocations").FirstOrDefault<GeoName>();
            if (record == null)
            {
                record = new GeoName();
            }

            return record;
        }

        [HttpGet]
        public GeoName FindByLocation(string Latitude, string Longitude, int coordinateSystemId = 4326, double tolerance = 0.0 )
        {
            //localhost:62806/api/country/FindByLocation/0/0/4326/1
            DbGeometry p = DbGeometry.PointFromText("POINT(" + Longitude + " " + Latitude + ")", coordinateSystemId);
          
            GeoName record = _unitOfWork.GeoNameRepository
                 .Get(x => p.Buffer(tolerance).Intersects(x.Geom))
                 .FirstOrDefault<GeoName>();
 
            return record;
        }


        // PUT api/GeoName/5
        //public HttpResponseMessage PutGeoName(int id, GeoName geoname)
        //{
        //    if (!ModelState.IsValid)
        //    {
        //        return Request.CreateErrorResponse(HttpStatusCode.BadRequest, ModelState);
        //    }

        //    if (id != geoname.GeoNameId)
        //    {
        //        return Request.CreateResponse(HttpStatusCode.BadRequest);
        //    }

        //    db.Entry(geoname).State = EntityState.Modified;

        //    try
        //    {
        //        db.SaveChanges();
        //    }
        //    catch (DbUpdateConcurrencyException ex)
        //    {
        //        return Request.CreateErrorResponse(HttpStatusCode.NotFound, ex);
        //    }

        //    return Request.CreateResponse(HttpStatusCode.OK);
        //}

        // POST api/GeoName
        //public HttpResponseMessage PostGeoName(GeoName geoname)
        //{
        //    if (ModelState.IsValid)
        //    {
        //        db.GeoNames.Add(geoname);
        //        db.SaveChanges();

        //        HttpResponseMessage response = Request.CreateResponse(HttpStatusCode.Created, geoname);
        //        response.Headers.Location = new Uri(Url.Link("DefaultApi", new { id = geoname.GeoNameId }));
        //        return response;
        //    }
        //    else
        //    {
        //        return Request.CreateErrorResponse(HttpStatusCode.BadRequest, ModelState);
        //    }
        //}

        // DELETE api/GeoName/5
        //public HttpResponseMessage DeleteGeoName(int id)
        //{
        //    GeoName geoname = db.GeoNames.Find(id);
        //    if (geoname == null)
        //    {
        //        return Request.CreateResponse(HttpStatusCode.NotFound);
        //    }

        //    db.GeoNames.Remove(geoname);

        //    try
        //    {
        //        db.SaveChanges();
        //    }
        //    catch (DbUpdateConcurrencyException ex)
        //    {
        //        return Request.CreateErrorResponse(HttpStatusCode.NotFound, ex);
        //    }

        //    return Request.CreateResponse(HttpStatusCode.OK, geoname);
        //}

        protected override void Dispose(bool disposing)
        {
            _unitOfWork.Dispose();
            base.Dispose(disposing);
        }
    }
}
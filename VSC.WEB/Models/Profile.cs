using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using VSC.Web.Data.Models;

namespace VSC.Web.Models
{
    public class Profile
    {
        public string CountryCode { get; set; }
        public string CountryName { get; set; }
        public int IsoNumeric { get; set; }
        public string IsoAlpha3 { get; set; }
        public int GeoNameId { get; set; }
        public  double West { get; set; }
        public double North { get; set; }
        public  double East { get; set; }
        public double South { get; set; }
        public string MapServiceURL { get; set; }

        public Schedule VaccineSchedule { get; set; }
        public ICollection <GeoName> Admin1{ get; set; }
        public GeoName SelecteAdmin1 { get; set; }
    }
}
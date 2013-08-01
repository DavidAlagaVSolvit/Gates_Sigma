using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Data.Spatial;
namespace VSC.Web.Data.Models
{
    public partial class CountryProfile
    {
        public DbGeometry Shape { get; set; }
    }
}
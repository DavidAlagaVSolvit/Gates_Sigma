using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace VSC.Web.Data.Models
{
    public partial class GeoName
    {

        private double _selectedDemandForcastPrecent = 1.0;

        public double SelectedDemandForcastCoveragePercent
        {
            get { return _selectedDemandForcastPrecent; }
            set { _selectedDemandForcastPrecent = value; }
        }

        private int _selectedDemandForcastCatchmentSize = 1;

        public int SelectedDemandForcastCatachmentSize
        {
            get { return _selectedDemandForcastCatchmentSize; }
            set { _selectedDemandForcastCatchmentSize = value; }
        }

        //public DemandForcast SelectedDemandForcast
        //{
        //    get
        //    {
        //        var q = from d in DemandForcasts
        //                where d.Radius == SelectedDemandForcastCatachmentSize
        //                select d;

        //        DemandForcast f = q.FirstOrDefault<DemandForcast>();
        //        if (f != null)
        //        {
        //            f.PercentCoverage = SelectedDemandForcastPercent;
        //        }

        //        return f;
        //    }
        //}
    }
}
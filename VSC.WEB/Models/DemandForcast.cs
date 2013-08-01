using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace VSC.Web.Data.Models
{
    public partial class DemandForcast
    {
        // Formulas and connstants 

        // used to calcualte percent coverage 
        private double _percentCoverage = 1.00;
        public double PercentCoverage
        {
            get { return _percentCoverage; }
            set { _percentCoverage = value; }
        }

        // 
        public int PrecentPopulationNotCoveredInCatachment
        {
            get
            {
                var p = PopulationCoveredInCatachment == null ? 0 : PopulationCoveredInCatachment;
                var val = p - (p * PercentCoverage);
                return (int)val;
            }
        }

        //
        public int PrecentPopulationCoveredInCatachment
        {
            get
            {
                var p = PopulationCoveredInCatachment == null ? 0 : PopulationCoveredInCatachment;
                var val = p * PercentCoverage;
                return (int)val;
            }
        }

    
  
        #region Total Population 
 
        // Y/1000 * 1.01 * 50.54
        // where y = total population 
        public int TotalPopulationBirths
        {
            get
            {
                var y = TotalPopulation == null ? 0 : TotalPopulation;
                var val = (y/ 1000) * 1.01 * 50.54;
                return (int)val;
            }
        }
        // Births * 2.76 * 0.336
        public int TotalPopulationInfant // 0 to 11 months
        {
            get
            {
                var val = TotalPopulationBirths * 2.76 * 0.336;
                return (int)val;
            }
        }

        // Y * 10.84 * 0.0194
        // where y = total population 
        public int TotalPopulationUnder5
        {
            get
            {
                var y =  TotalPopulation == null ? 0 : TotalPopulation;
                var val = y * 10.84 * 0.0194;
                return (int)val;
            }
        }

        //Y * 1.07 * 0.4816
        // where y = total population 
        public int TotalPopulationSchoolAge
        {
            get
            {
                var y =  TotalPopulation == null ? 0 : TotalPopulation;
                var val = y * 1.07 * 0.4816;
                return (int)val;
            }
        }

        // Y * 0.5
        // where y = total population 
        public int TotalPopulationFemale
        {
            get
            {
                var y =  TotalPopulation == null ? 0 : TotalPopulation;
                var val = y * 0.5;
                return (int)val;
            }
        }

        // Female * 2.08 * 0.22
        public int TotalPopulationBirthing
        {
            get
            {
                var val = TotalPopulationFemale * 2.08 * 0.22;
                return (int)val;
            }
        }

        //Births + Births * 0.664
        public int TotalPopulationPregnant
        {
            get
            {

                var val = (TotalPopulationBirths * 2) * 0.664;
                return (int)val;
            }
        }
        #endregion

        #region Total Population Covered In Catachment



        //public int PopulationCoveredInCatachment
        //{
        //    get
        //    {
        //        var y = PopulationCoveredInCatachment == null ? 0 : PopulationCoveredInCatachment;
        //        var val = (y / 1000) * 1.01 * 50.54;
        //        return (int)val;
        //    }
        //}

                // Y/1000 * 1.01 * 50.54
        // where y = total population 
        public int PopulationCoveredInCatachmentBirths
        {
            get
            {
                var y = PopulationCoveredInCatachment == null ? 0 : PopulationCoveredInCatachment;
                var val = (y / 1000) * 1.01 * 50.54;
                return (int)val;
            }
        }
        // Births * 2.76 * 0.336
        public int PopulationCoveredInCatachmentInfant // 0 to 11 months
        {
            get
            {
                var val = PopulationCoveredInCatachmentBirths * 2.76 * 0.336;
                return (int)val;
            }
        }

        // Y * 10.84 * 0.0194
        // where y = total population 
        public int PopulationCoveredInCatachmentUnder5
        {
            get
            {
                var y = PopulationCoveredInCatachment == null ? 0 : PopulationCoveredInCatachment;
                var val = y * 10.84 * 0.0194;
                return (int)val;
            }
        }

        //Y * 1.07 * 0.4816
        // where y = total population 
        public int PopulationCoveredInCatachmentSchoolAge
        {
            get
            {
                var y =  PopulationCoveredInCatachment == null ? 0 : PopulationCoveredInCatachment;
                var val = y * 1.07 * 0.4816;
                return (int)val;
            }
        }

        // Y * 0.5
        // where y = total population 
        public int PopulationCoveredInCatachmentFemale
        {
            get
            {
                var y = PopulationCoveredInCatachment == null ? 0 : PopulationCoveredInCatachment;
                var val = y * 0.5;
                return (int)val;
            }
        }

        // Female * 2.08 * 0.22
        public int PopulationCoveredInCatachmentBirthing
        {
            get
            {
                var val = PopulationCoveredInCatachmentFemale * 2.08 * 0.22;
                return (int)val;
            }
        }

        //Births + Births * 0.664
        public int PopulationCoveredInCatachmentPregnant
        {
            get
            {

                var val = (PopulationCoveredInCatachmentBirths * 2) * 0.664;
                return (int)val;
            }
        }
        #endregion 
        #region PopuationNotCoveredInCatchment
        public int PopuationNotCoveredInCatchment
        {
            get
            { 
                //var tp = TotalPopulation == null ? 0 : TotalPopulation;
               // PopuationNotCoveredInCatchment = PopulationCoveredInCatachment  * PercentCoverage
                
                var y =  PopulationCoveredInCatachment - (PopulationCoveredInCatachment * PercentCoverage) ;
                return (int)y;
            }
        }
        // Y/1000 * 1.01 * 50.54
        // where y = total population 
        public int PopuationNotCoveredInCatchmentBirths
        {
            get
            {
                var y = PopuationNotCoveredInCatchment;
                var val = (y / 1000) * 1.01 * 50.54;
                return (int)val;
            }
        }
        // Births * 2.76 * 0.336
        public int PopuationNotCoveredInCatchmentInfant // 0 to 11 months
        {
            get
            {
                var val = PopuationNotCoveredInCatchmentBirths * 2.76 * 0.336;
                return (int)val;
            }
        }

        // Y * 10.84 * 0.0194
        // where y = total population 
        public int PopuationNotCoveredInCatchmentUnder5
        {
            get
            {
                var y = PopuationNotCoveredInCatchment;
                var val = y * 10.84 * 0.0194;
                return (int)val;
            }
        }

        //Y * 1.07 * 0.4816
        // where y = total population 
        public int PopuationNotCoveredInCatchmentSchoolAge
        {
            get
            {
                var y = PopuationNotCoveredInCatchment;
                var val = y * 1.07 * 0.4816;
                return (int)val;
            }
        }

        // Y * 0.5
        // where y = total population 
        public int PopuationNotCoveredInCatchmentFemale
        {
            get
            {
                var y = PopuationNotCoveredInCatchment;
                var val = y * 0.5;
                return (int)val;
            }
        }

        // Female * 2.08 * 0.22
        public int PopuationNotCoveredInCatchmentBirthing
        {
            get
            {
                var val = PopuationNotCoveredInCatchmentFemale * 2.08 * 0.22;
                return (int)val;
            }
        }

        //Births + Births * 0.664
        public int PopuationNotCoveredInCatchmentPregnant
        {
            get
            {

                var val = (PopuationNotCoveredInCatchmentBirths * 2) * 0.664;
                return (int)val;
            }
        }
  

        #endregion

        #region PopulationOutsideOfCatachment
       
        // Y/1000 * 1.01 * 50.54
        // where y = total population 
        public int PopulationOutsideOfCatachmentBirths
        {
            get
            {

                var y = PopulationOutsideOfCatachment == null ? 0 : PopulationOutsideOfCatachment;
                var val = (y / 1000) * 1.01 * 50.54;
                return (int)val;
            }
        }
        // Births * 2.76 * 0.336
        public int PopulationOutsideOfCatachmentInfant // 0 to 11 months
        {
            get
            {
                var val = PopuationNotCoveredInCatchmentBirths * 2.76 * 0.336;
                return (int)val;
            }
        }

        // Y * 10.84 * 0.0194
        // where y = total population 
        public int PopulationOutsideOfCatachmentUnder5
        {
            get
            {
                var y = PopulationOutsideOfCatachment == null ? 0 : PopulationOutsideOfCatachment;
                var val = y * 10.84 * 0.0194;
                return (int)val;
            }
        }

        //Y * 1.07 * 0.4816
        // where y = total population 
        public int PopulationOutsideOfCatachmentSchoolAge
        {
            get
            {
                var y = PopulationOutsideOfCatachment == null ? 0 : PopulationOutsideOfCatachment;
                var val = y * 1.07 * 0.4816;
                return (int)val;
            }
        }

        // Y * 0.5
        // where y = total population 
        public int PopulationOutsideOfCatachmentFemale
        {
            get
            {
                var y = PopulationOutsideOfCatachment == null ? 0 : PopulationOutsideOfCatachment;
                var val = y * 0.5;
                return (int)val;
            }
        }

        // Female * 2.08 * 0.22
        public int PopulationOutsideOfCatachmentBirthing
        {
            get
            {
                var val = PopuationNotCoveredInCatchmentFemale * 2.08 * 0.22;
                return (int)val;
            }
        }

        //Births + Births * 0.664
        public int PopulationOutsideOfCatachmentPregnant
        {
            get
            {

                var val = (PopuationNotCoveredInCatchmentBirths * 2) * 0.664;
                return (int)val;
            }
        }
        
#endregion
    }
}
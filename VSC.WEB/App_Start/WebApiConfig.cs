using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Http;

namespace VSC.Web
{
    public static class WebApiConfig
    {
        public static void Register(HttpConfiguration config)
        {

            config.Routes.MapHttpRoute(
              name: "ActionApi",
              routeTemplate: "api/{controller}/{action}/{id}",
              defaults: new { id = RouteParameter.Optional }
          );
            //FindByLocation
            config.Routes.MapHttpRoute(
             name: "CountyProfileApi",
             routeTemplate: "api/{controller}/{action}/{countryCode}/{level}",
             defaults: new
             {
                 controller = "country",
                 action = "admin",
                 countryCode = RouteParameter.Optional,
                 level = RouteParameter.Optional
             }
         );

            config.Routes.MapHttpRoute(
            name: "FindByLocationApi",
            routeTemplate: "api/{controller}/{action}/{latitude}/{longitude}",
                //{coordinateSystemId}/{tolerance}
           defaults: new
           {
               controller = "country",
               action = "FindByLocation",
               latitude = RouteParameter.Optional,
               longitude = RouteParameter.Optional
               //coordinateSystemId = RouteParameter.Optional,
               //tolerance = RouteParameter.Optional

           }
);

            config.Routes.MapHttpRoute(
             name: "ModelApi",
             routeTemplate: "api/{controller}/{action}/{type}/{geonameid}/{radius}/{percent}",
             defaults: new
             {
                 controller = "country",
                 action = "model",
                 type = RouteParameter.Optional,
                 geonameid = RouteParameter.Optional,
                 radius = RouteParameter.Optional,
                 percent = RouteParameter.Optional
             }
         );

            //config.Routes.MapHttpRoute(
            // name: "GeoNameApi",
            // routeTemplate: "api/{controller}/{action}/{countryCode}/{level}",
            //   defaults: new
            // {
            //     controller = "geoname",
            //     action = "admin",
            //     countryCode = RouteParameter.Optional,
            //     level = RouteParameter.Optional
            // }
            // );

            config.EnableQuerySupport();

        }
    }
}
// demo only 
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Web;
using System.Diagnostics;
using System.Net;

namespace VSC.Web
{
    /// <summary>
    /// Summary description for FileDownloadHandler
    /// </summary>
    public class FileDownloadHandler : IHttpHandler
    {
        private const string FILE_NAME_PARAMETER = "file";
        private const string FILE_DOCUMENT_DIRECTORY = "~/App_Data/";
        private string fileName = null;
        private string filePath = null;
        private string contentType = "text/plain";
        private HttpResponse response = null;
        private FileInfo file = null;

        public void ProcessRequest(HttpContext context)
        {
            response = context.Response;

            fileName = context.Request.QueryString[FILE_NAME_PARAMETER].ToString();
            filePath = HttpContext.Current.Server.MapPath(FILE_DOCUMENT_DIRECTORY + fileName);

            //Don't allow response to be cached
            response.Clear();
            response.Cache.SetCacheability(HttpCacheability.NoCache);
            response.Cache.SetNoStore();
            response.Cache.SetExpires(DateTime.MinValue);
            try
            {
                file = new FileInfo(filePath);
                if (!file.Exists)
                {
                    context.Response.StatusCode = (int)HttpStatusCode.InternalServerError;
                    context.Response.End();
                    return;
                }
                response.AddHeader("Content-Disposition", "attachment; filename=" + file.Name);
                response.AddHeader("Content-Length", file.Length.ToString());
                switch (file.Extension.ToUpper())
                {
                    case ".CSV":
                        contentType = "text/csv"; //"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
                        break;
                    case ".DOCX":
                        contentType = "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
                        break;
                    default:
                        Debug.WriteLine("content type not found for " + file.Extension.ToUpper());
                        break;
                }
                response.ContentType = contentType;
                response.WriteFile(file.FullName);
            }
            catch (Exception e)
            {
                Debug.WriteLine(e.StackTrace);
                response.StatusCode = (int)HttpStatusCode.InternalServerError;

            }
            finally
            {
                context.ApplicationInstance.CompleteRequest();
                response.Flush();
                response.Clear();
                response.End();
            }
        }



        public bool ValidateParameters(HttpContext context)
        {
            bool isValid = false;

            //Validate some stuff...true if cool, false if not
            isValid = true;
            return isValid;

        }

        public bool IsReusable
        {
            get
            {
                return false;
            }
        }
    }
}
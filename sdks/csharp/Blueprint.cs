using System;

namespace Blueprint.Sdk
{
    /// <summary>
    /// Blueprint SDK for C#
    /// </summary>
    public class Blueprint
    {
        private string version = "1.0.0";
        
        /// <summary>
        /// Returns a greeting message
        /// </summary>
        public string Hello()
        {
            return "Hello from Blueprint SDK!";
        }
        
        /// <summary>
        /// Returns the SDK version
        /// </summary>
        public string GetVersion()
        {
            return version;
        }
    }
}

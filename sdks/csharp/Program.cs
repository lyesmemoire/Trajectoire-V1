using System;
using Blueprint.Sdk;

class Program
{
    static void Main(string[] args)
    {
        var bp = new Blueprint();
        Console.WriteLine(bp.Hello());
        Console.WriteLine($"SDK Version: {bp.GetVersion()}");
    }
}

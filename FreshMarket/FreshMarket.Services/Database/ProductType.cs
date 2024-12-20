﻿namespace FreshMarket.Services.Database
{
    public class ProductType
    {
        public int ProductTypeId { get; set; }
        public string Name { get; set; } = string.Empty;
        public string? Description { get; set; }

        public ICollection<Product> Products { get; set; } = new List<Product>();
    }
}

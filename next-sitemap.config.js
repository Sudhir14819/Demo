/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.SITE_URL || "https://ecommerce-platform.vercel.app",
  generateRobotsTxt: true,
  generateIndexSitemap: false,
  exclude: ["/admin/*", "/api/*", "/checkout/success", "/checkout/cancel", "/404", "/500"],
  robotsTxtOptions: {
    policies: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin/", "/api/", "/checkout/"],
      },
      {
        userAgent: "Googlebot",
        allow: "/",
        disallow: ["/admin/", "/api/"],
      },
    ],
    additionalSitemaps: [
      "https://ecommerce-platform.vercel.app/sitemap-products.xml",
      "https://ecommerce-platform.vercel.app/sitemap-categories.xml",
    ],
  },
  transform: async (config, path) => {
    // Custom priority and changefreq for different pages
    const customConfig = {
      "/": { priority: 1.0, changefreq: "daily" },
      "/products": { priority: 0.9, changefreq: "daily" },
      "/categories": { priority: 0.8, changefreq: "weekly" },
      "/about": { priority: 0.6, changefreq: "monthly" },
      "/contact": { priority: 0.6, changefreq: "monthly" },
      "/privacy": { priority: 0.3, changefreq: "yearly" },
      "/terms": { priority: 0.3, changefreq: "yearly" },
    }

    const pageConfig = customConfig[path] || { priority: 0.7, changefreq: "weekly" }

    return {
      loc: path,
      lastmod: new Date().toISOString(),
      priority: pageConfig.priority,
      changefreq: pageConfig.changefreq,
    }
  },
}

/** @type {import('next-sitemap').IConfig} */
module.exports = {
    siteUrl: process.env.NEXT_PUBLIC_BASE_URL || 'https://yemekcuzdani.com',
    generateRobotsTxt: true,
    changefreq: 'daily',
    priority: 0.7,
    sitemapSize: 5000,
    additionalPaths: async (config) => {
      // API'den tarif verilerini çekin
      const res = await fetch('https://api.yemekcuzdani.com/api/v1/recipes/category-list');
      const tarifler = await res.json();
  
      // API'den kategorileri çekin
      const res2 = await fetch('https://api.yemekcuzdani.com/api/v1/recipes/search-ingredient', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: "" }), // Boş name değeri gönderiliyor
      });
      const kategoriler = await res2.json();
  
      // Rotayı oluşturun
      const tarifPaths = tarifler.map((tarif) => ({
        loc: `/tarif/${tarif.seo_url}`,
        changefreq: 'daily',
        priority: 0.8,
      }));
  
      const kategoriPaths = kategoriler.map((kategori) => ({
        loc: `/kategoriler/${kategori.seo_url}`,
        changefreq: 'weekly',
        priority: 0.7,
      }));
  
      return [...tarifPaths, ...kategoriPaths];
    },
  };
  
// Puck Component Configurations
// Organized by category: Navigation, Introduction, Content, Social Proof, Business

import Navigation from '../landing/Navigation';
import Footer from '../landing/Footer';

export const puckComponents = {
  // ==================== NAVIGATION ====================
  'Site Header': {
    fields: {},
    defaultProps: {},
    render: () => {
      return <Navigation />;
    },
  },

  'Site Footer': {
    fields: {},
    defaultProps: {},
    render: () => {
      return <Footer />;
    },
  },

  'Custom Header': {
    fields: {
      logo: { type: "text", label: "Logo URL" },
      logoAlt: { type: "text", label: "Logo Alt Text" },
      menuItems: {
        type: "array",
        arrayFields: {
          label: { type: "text", label: "Menu Label" },
          link: { type: "text", label: "Menu Link" },
        },
        label: "Menu Items",
        defaultItemProps: {
          label: "Link",
          link: "#",
        },
      },
      ctaText: { type: "text", label: "CTA Button Text" },
      ctaLink: { type: "text", label: "CTA Button Link" },
      backgroundColor: { type: "text", label: "Background Color" },
    },
    defaultProps: {
      logo: "/logo.svg",
      logoAlt: "Logo",
      menuItems: [
        { label: "Home", link: "/" },
        { label: "Features", link: "/features" },
        { label: "Pricing", link: "/pricing" },
        { label: "About", link: "/about" },
      ],
      ctaText: "Get Started",
      ctaLink: "/signup",
      backgroundColor: "white",
    },
    render: ({ logo, logoAlt, menuItems, ctaText, ctaLink, backgroundColor }) => {
      return (
        <header className={`sticky top-0 z-50 bg-${backgroundColor} shadow-md`}>
          <nav className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <img src={logo} alt={logoAlt} className="h-10" />
              </div>
              <ul className="hidden md:flex items-center space-x-8">
                {menuItems.map((item, idx) => (
                  <li key={idx}>
                    <a href={item.link} className="text-gray-700 hover:text-blue-600 transition-colors">
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
              {ctaText && (
                <a
                  href={ctaLink}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors font-semibold"
                >
                  {ctaText}
                </a>
              )}
            </div>
          </nav>
        </header>
      );
    },
  },

  'Custom Footer': {
    fields: {
      logo: { type: "text", label: "Logo URL" },
      logoAlt: { type: "text", label: "Logo Alt Text" },
      description: { type: "textarea", label: "Company Description" },
      columns: {
        type: "array",
        arrayFields: {
          title: { type: "text", label: "Column Title" },
          links: {
            type: "array",
            arrayFields: {
              label: { type: "text", label: "Link Label" },
              url: { type: "text", label: "Link URL" },
            },
          },
        },
        label: "Footer Columns",
        defaultItemProps: {
          title: "Column",
          links: [{ label: "Link", url: "#" }],
        },
      },
      socialLinks: {
        type: "array",
        arrayFields: {
          platform: { type: "text", label: "Platform" },
          url: { type: "text", label: "URL" },
        },
        label: "Social Links",
        defaultItemProps: {
          platform: "Twitter",
          url: "#",
        },
      },
      copyrightText: { type: "text", label: "Copyright Text" },
    },
    defaultProps: {
      logo: "/logo.svg",
      logoAlt: "Logo",
      description: "Building amazing products for the web.",
      columns: [
        {
          title: "Product",
          links: [
            { label: "Features", url: "/features" },
            { label: "Pricing", url: "/pricing" },
          ],
        },
        {
          title: "Company",
          links: [
            { label: "About", url: "/about" },
            { label: "Blog", url: "/blog" },
          ],
        },
      ],
      socialLinks: [
        { platform: "Twitter", url: "#" },
        { platform: "LinkedIn", url: "#" },
      ],
      copyrightText: "© 2024 Your Company. All rights reserved.",
    },
    render: ({ logo, logoAlt, description, columns, socialLinks, copyrightText }) => {
      return (
        <footer className="bg-gray-900 text-gray-300 py-12">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
              <div className="col-span-1">
                <img src={logo} alt={logoAlt} className="h-10 mb-4 brightness-0 invert" />
                <p className="text-sm">{description}</p>
              </div>
              {columns.map((column, idx) => (
                <div key={idx}>
                  <h3 className="font-semibold text-white mb-4">{column.title}</h3>
                  <ul className="space-y-2">
                    {column.links?.map((link, linkIdx) => (
                      <li key={linkIdx}>
                        <a href={link.url} className="hover:text-white transition-colors">
                          {link.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
              <p className="text-sm">{copyrightText}</p>
              <div className="flex space-x-4 mt-4 md:mt-0">
                {socialLinks.map((social, idx) => (
                  <a key={idx} href={social.url} className="hover:text-white transition-colors">
                    {social.platform}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </footer>
      );
    },
  },

  // ==================== INTRODUCTION ====================
  Hero: {
    fields: {
      title: { type: "text", label: "Hero Title" },
      subtitle: { type: "textarea", label: "Hero Subtitle" },
      primaryButtonText: { type: "text", label: "Primary Button Text" },
      primaryButtonLink: { type: "text", label: "Primary Button Link" },
      secondaryButtonText: { type: "text", label: "Secondary Button Text" },
      secondaryButtonLink: { type: "text", label: "Secondary Button Link" },
      backgroundImage: { type: "text", label: "Background Image URL" },
      imagePosition: {
        type: "select",
        options: [
          { label: "Left", value: "left" },
          { label: "Right", value: "right" },
          { label: "Background", value: "background" },
        ],
        label: "Image Position",
      },
      image: { type: "text", label: "Hero Image URL" },
    },
    defaultProps: {
      title: "Build Amazing Products",
      subtitle: "The fastest way to create modern, responsive websites with our powerful platform.",
      primaryButtonText: "Get Started",
      primaryButtonLink: "/signup",
      secondaryButtonText: "Learn More",
      secondaryButtonLink: "/about",
      backgroundImage: "",
      imagePosition: "right",
      image: "https://vsifesaczqscrutqgojh.supabase.co/storage/v1/object/public/media/website/notwp.png",
    },
    render: ({
      title,
      subtitle,
      primaryButtonText,
      primaryButtonLink,
      secondaryButtonText,
      secondaryButtonLink,
      backgroundImage,
      imagePosition,
      image,
    }) => {
      const isBackground = imagePosition === "background";
      return (
        <section
          className={`py-20 ${isBackground ? "bg-cover bg-center relative" : "bg-gradient-to-br from-blue-50 to-indigo-100"}`}
          style={isBackground ? { backgroundImage: `url(${backgroundImage})` } : {}}
        >
          {isBackground && <div className="absolute inset-0 bg-black bg-opacity-50" />}
          <div className={`container mx-auto px-4 ${isBackground ? "relative z-10" : ""}`}>
            <div className={`flex flex-col ${imagePosition === "right" ? "md:flex-row" : imagePosition === "left" ? "md:flex-row-reverse" : ""} items-center gap-12`}>
              <div className={`flex-1 ${isBackground ? "text-white text-center" : ""}`}>
                <h1 className={`text-5xl md:text-6xl font-bold mb-6 ${isBackground ? "text-white" : "text-gray-900"}`}>
                  {title}
                </h1>
                <p className={`text-xl mb-8 ${isBackground ? "text-gray-200" : "text-gray-600"}`}>
                  {subtitle}
                </p>
                <div className="flex flex-wrap gap-4">
                  {primaryButtonText && (
                    <a
                      href={primaryButtonLink}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-semibold transition-colors text-lg"
                    >
                      {primaryButtonText}
                    </a>
                  )}
                  {secondaryButtonText && (
                    <a
                      href={secondaryButtonLink}
                      className={`px-8 py-4 rounded-lg font-semibold transition-colors text-lg ${
                        isBackground
                          ? "border-2 border-white text-white hover:bg-white hover:text-gray-900"
                          : "border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white"
                      }`}
                    >
                      {secondaryButtonText}
                    </a>
                  )}
                </div>
              </div>
              {!isBackground && image && (
                <div className="flex-1">
                  <img src={image} alt={title} className="rounded-lg shadow-2xl w-full" />
                </div>
              )}
            </div>
          </div>
        </section>
      );
    },
  },

  // ==================== CONTENT ====================
  Bento: {
    fields: {
      title: { type: "text", label: "Section Title" },
      subtitle: { type: "textarea", label: "Section Subtitle" },
      items: {
        type: "array",
        arrayFields: {
          title: { type: "text", label: "Item Title" },
          description: { type: "textarea", label: "Item Description" },
          image: { type: "text", label: "Item Image URL" },
          size: {
            type: "select",
            options: [
              { label: "Small", value: "small" },
              { label: "Medium", value: "medium" },
              { label: "Large", value: "large" },
            ],
            label: "Item Size",
          },
        },
        label: "Bento Items",
        defaultItemProps: {
          title: "Feature",
          description: "Description of this feature",
          image: "https://vsifesaczqscrutqgojh.supabase.co/storage/v1/object/public/media/website/notwp.png",
          size: "medium",
        },
      },
    },
    defaultProps: {
      title: "Everything You Need",
      subtitle: "Powerful features to help you succeed",
      items: [
        { title: "Fast Performance", description: "Lightning-fast load times", image: "https://vsifesaczqscrutqgojh.supabase.co/storage/v1/object/public/media/website/notwp.png", size: "large" },
        { title: "Secure", description: "Enterprise-grade security", image: "https://vsifesaczqscrutqgojh.supabase.co/storage/v1/object/public/media/website/notwp.png", size: "small" },
        { title: "Scalable", description: "Grows with your business", image: "https://vsifesaczqscrutqgojh.supabase.co/storage/v1/object/public/media/website/notwp.png", size: "medium" },
      ],
    },
    render: ({ title, subtitle, items }) => {
      const sizeClasses = {
        small: "col-span-1 row-span-1",
        medium: "col-span-1 md:col-span-2 row-span-1",
        large: "col-span-1 md:col-span-2 row-span-2",
      };
      return (
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4 text-gray-900">{title}</h2>
              <p className="text-xl text-gray-600">{subtitle}</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 auto-rows-fr gap-4">
              {items.map((item, idx) => (
                <div
                  key={idx}
                  className={`${sizeClasses[item.size]} bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl p-6 flex flex-col justify-end overflow-hidden relative group hover:shadow-xl transition-shadow`}
                >
                  <img
                    src={item.image}
                    alt={item.title}
                    className="absolute inset-0 w-full h-full object-cover opacity-20 group-hover:opacity-30 transition-opacity"
                  />
                  <div className="relative z-10">
                    <h3 className="text-2xl font-bold mb-2 text-gray-900">{item.title}</h3>
                    <p className="text-gray-700">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      );
    },
  },

  ArticleCard: {
    fields: {
      title: { type: "text", label: "Article Title" },
      excerpt: { type: "textarea", label: "Article Excerpt" },
      image: { type: "text", label: "Article Image URL" },
      author: { type: "text", label: "Author Name" },
      authorImage: { type: "text", label: "Author Image URL" },
      date: { type: "text", label: "Publication Date" },
      category: { type: "text", label: "Category" },
      link: { type: "text", label: "Article Link" },
    },
    defaultProps: {
      title: "Article Title",
      excerpt: "This is a brief excerpt of the article content that provides a preview of what readers can expect.",
      image: "https://vsifesaczqscrutqgojh.supabase.co/storage/v1/object/public/media/website/notwp.png",
      author: "John Doe",
      authorImage: "https://vsifesaczqscrutqgojh.supabase.co/storage/v1/object/public/media/website/notwp.png",
      date: "Jan 1, 2024",
      category: "Technology",
      link: "/article",
    },
    render: ({ title, excerpt, image, author, authorImage, date, category, link }) => {
      return (
        <article className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow mb-6">
          <img src={image} alt={title} className="w-full h-48 object-cover" />
          <div className="p-6">
            <span className="text-sm font-semibold text-blue-600 uppercase">{category}</span>
            <h3 className="text-2xl font-bold mt-2 mb-3 text-gray-900">{title}</h3>
            <p className="text-gray-600 mb-4">{excerpt}</p>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <img src={authorImage} alt={author} className="w-10 h-10 rounded-full mr-3" />
                <div>
                  <p className="font-semibold text-sm text-gray-900">{author}</p>
                  <p className="text-xs text-gray-500">{date}</p>
                </div>
              </div>
              <a href={link} className="text-blue-600 hover:text-blue-700 font-semibold">
                Read More →
              </a>
            </div>
          </div>
        </article>
      );
    },
  },

  FeatureCards: {
    fields: {
      title: { type: "text", label: "Section Title" },
      subtitle: { type: "textarea", label: "Section Subtitle" },
      features: {
        type: "array",
        arrayFields: {
          icon: { type: "text", label: "Icon (emoji or URL)" },
          title: { type: "text", label: "Feature Title" },
          description: { type: "textarea", label: "Feature Description" },
        },
        label: "Features",
        defaultItemProps: {
          icon: "🚀",
          title: "Feature Title",
          description: "Feature description goes here",
        },
      },
    },
    defaultProps: {
      title: "Powerful Features",
      subtitle: "Everything you need to succeed",
      features: [
        { icon: "🚀", title: "Fast Performance", description: "Blazing fast load times and optimized performance" },
        { icon: "🔒", title: "Secure", description: "Enterprise-grade security and data protection" },
        { icon: "📱", title: "Responsive", description: "Works perfectly on all devices and screen sizes" },
      ],
    },
    render: ({ title, subtitle, features }) => {
      return (
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4 text-gray-900">{title}</h2>
              <p className="text-xl text-gray-600">{subtitle}</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {features.map((feature, idx) => (
                <div key={idx} className="bg-white p-8 rounded-xl shadow-md hover:shadow-xl transition-shadow">
                  <div className="text-4xl mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-bold mb-3 text-gray-900">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      );
    },
  },

  CardGrid: {
    fields: {
      title: { type: "text", label: "Section Title" },
      subtitle: { type: "textarea", label: "Section Subtitle" },
      columns: {
        type: "select",
        options: [
          { label: "2 Columns", value: "2" },
          { label: "3 Columns", value: "3" },
          { label: "4 Columns", value: "4" },
        ],
        label: "Number of Columns",
      },
      cards: {
        type: "array",
        arrayFields: {
          image: { type: "text", label: "Card Image URL" },
          title: { type: "text", label: "Card Title" },
          description: { type: "textarea", label: "Card Description" },
          link: { type: "text", label: "Card Link" },
        },
        label: "Cards",
        defaultItemProps: {
          image: "https://vsifesaczqscrutqgojh.supabase.co/storage/v1/object/public/media/website/notwp.png",
          title: "Card Title",
          description: "Card description",
          link: "#",
        },
      },
    },
    defaultProps: {
      title: "Our Projects",
      subtitle: "Check out our recent work",
      columns: "3",
      cards: [
        { image: "https://vsifesaczqscrutqgojh.supabase.co/storage/v1/object/public/media/website/notwp.png", title: "Project 1", description: "Description of project 1", link: "#" },
        { image: "https://vsifesaczqscrutqgojh.supabase.co/storage/v1/object/public/media/website/notwp.png", title: "Project 2", description: "Description of project 2", link: "#" },
        { image: "https://vsifesaczqscrutqgojh.supabase.co/storage/v1/object/public/media/website/notwp.png", title: "Project 3", description: "Description of project 3", link: "#" },
      ],
    },
    render: ({ title, subtitle, columns, cards }) => {
      const colClasses = {
        "2": "md:grid-cols-2",
        "3": "md:grid-cols-3",
        "4": "md:grid-cols-4",
      };
      return (
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4 text-gray-900">{title}</h2>
              <p className="text-xl text-gray-600">{subtitle}</p>
            </div>
            <div className={`grid grid-cols-1 ${colClasses[columns]} gap-8`}>
              {cards.map((card, idx) => (
                <a key={idx} href={card.link} className="group">
                  <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow">
                    <img src={card.image} alt={card.title} className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300" />
                    <div className="p-6">
                      <h3 className="text-xl font-bold mb-2 text-gray-900">{card.title}</h3>
                      <p className="text-gray-600">{card.description}</p>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>
      );
    },
  },

  TwoColumn: {
    fields: {
      imagePosition: {
        type: "select",
        options: [
          { label: "Left", value: "left" },
          { label: "Right", value: "right" },
        ],
        label: "Image Position",
      },
      image: { type: "text", label: "Image URL" },
      title: { type: "text", label: "Title" },
      description: { type: "textarea", label: "Description" },
      buttonText: { type: "text", label: "Button Text" },
      buttonLink: { type: "text", label: "Button Link" },
      features: {
        type: "array",
        arrayFields: {
          text: { type: "text", label: "Feature Text" },
        },
        label: "Feature List",
        defaultItemProps: {
          text: "Feature item",
        },
      },
    },
    defaultProps: {
      imagePosition: "right",
      image: "https://vsifesaczqscrutqgojh.supabase.co/storage/v1/object/public/media/website/notwp.png",
      title: "Build Better Products",
      description: "Our platform provides all the tools you need to create amazing products that your customers will love.",
      buttonText: "Learn More",
      buttonLink: "#",
      features: [
        { text: "Easy to use interface" },
        { text: "Powerful features" },
        { text: "24/7 support" },
      ],
    },
    render: ({ imagePosition, image, title, description, buttonText, buttonLink, features }) => {
      return (
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className={`flex flex-col ${imagePosition === "right" ? "md:flex-row" : "md:flex-row-reverse"} items-center gap-12`}>
              <div className="flex-1">
                <img src={image} alt={title} className="rounded-lg shadow-xl w-full" />
              </div>
              <div className="flex-1">
                <h2 className="text-4xl font-bold mb-4 text-gray-900">{title}</h2>
                <p className="text-xl text-gray-600 mb-6">{description}</p>
                {features && features.length > 0 && (
                  <ul className="mb-6 space-y-2">
                    {features.map((feature, idx) => (
                      <li key={idx} className="flex items-center text-gray-700">
                        <span className="text-green-500 mr-2">✓</span>
                        {feature.text}
                      </li>
                    ))}
                  </ul>
                )}
                {buttonText && (
                  <a
                    href={buttonLink}
                    className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
                  >
                    {buttonText}
                  </a>
                )}
              </div>
            </div>
          </div>
        </section>
      );
    },
  },

  Articles: {
    fields: {
      title: { type: "text", label: "Section Title" },
      subtitle: { type: "textarea", label: "Section Subtitle" },
      articles: {
        type: "array",
        arrayFields: {
          title: { type: "text", label: "Article Title" },
          excerpt: { type: "textarea", label: "Article Excerpt" },
          image: { type: "text", label: "Article Image URL" },
          category: { type: "text", label: "Category" },
          date: { type: "text", label: "Date" },
          link: { type: "text", label: "Article Link" },
        },
        label: "Articles",
        defaultItemProps: {
          title: "Article Title",
          excerpt: "Article excerpt",
          image: "https://vsifesaczqscrutqgojh.supabase.co/storage/v1/object/public/media/website/notwp.png",
          category: "News",
          date: "Jan 1, 2024",
          link: "#",
        },
      },
    },
    defaultProps: {
      title: "Latest Articles",
      subtitle: "Stay updated with our latest insights",
      articles: [
        {
          title: "Getting Started with Web Development",
          excerpt: "Learn the basics of web development and start building amazing websites",
          image: "https://vsifesaczqscrutqgojh.supabase.co/storage/v1/object/public/media/website/notwp.png",
          category: "Tutorial",
          date: "Jan 15, 2024",
          link: "#",
        },
      ],
    },
    render: ({ title, subtitle, articles }) => {
      return (
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4 text-gray-900">{title}</h2>
              <p className="text-xl text-gray-600">{subtitle}</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {articles.map((article, idx) => (
                <article key={idx} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow">
                  <img src={article.image} alt={article.title} className="w-full h-48 object-cover" />
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-semibold text-blue-600 uppercase">{article.category}</span>
                      <span className="text-sm text-gray-500">{article.date}</span>
                    </div>
                    <h3 className="text-xl font-bold mb-2 text-gray-900">{article.title}</h3>
                    <p className="text-gray-600 mb-4">{article.excerpt}</p>
                    <a href={article.link} className="text-blue-600 hover:text-blue-700 font-semibold">
                      Read More →
                    </a>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      );
    },
  },

  Faq: {
    fields: {
      title: { type: "text", label: "Section Title" },
      subtitle: { type: "textarea", label: "Section Subtitle" },
      faqs: {
        type: "array",
        arrayFields: {
          question: { type: "text", label: "Question" },
          answer: { type: "textarea", label: "Answer" },
        },
        label: "FAQ Items",
        defaultItemProps: {
          question: "What is this?",
          answer: "This is the answer to the question.",
        },
      },
    },
    defaultProps: {
      title: "Frequently Asked Questions",
      subtitle: "Find answers to common questions",
      faqs: [
        { question: "How does it work?", answer: "It works by doing amazing things that help you succeed." },
        { question: "What are the pricing options?", answer: "We offer flexible pricing plans to suit your needs." },
        { question: "Do you offer support?", answer: "Yes, we provide 24/7 customer support for all our users." },
      ],
    },
    render: ({ title, subtitle, faqs }) => {
      return (
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4 max-w-3xl">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4 text-gray-900">{title}</h2>
              <p className="text-xl text-gray-600">{subtitle}</p>
            </div>
            <div className="space-y-4">
              {faqs.map((faq, idx) => (
                <details key={idx} className="bg-gray-50 rounded-lg p-6 group">
                  <summary className="font-semibold text-lg cursor-pointer text-gray-900 list-none flex justify-between items-center">
                    {faq.question}
                    <span className="text-blue-600 group-open:rotate-180 transition-transform">▼</span>
                  </summary>
                  <p className="mt-4 text-gray-600">{faq.answer}</p>
                </details>
              ))}
            </div>
          </div>
        </section>
      );
    },
  },

  Cta: {
    fields: {
      title: { type: "text", label: "CTA Title" },
      description: { type: "textarea", label: "CTA Description" },
      primaryButtonText: { type: "text", label: "Primary Button Text" },
      primaryButtonLink: { type: "text", label: "Primary Button Link" },
      secondaryButtonText: { type: "text", label: "Secondary Button Text" },
      secondaryButtonLink: { type: "text", label: "Secondary Button Link" },
      backgroundColor: {
        type: "select",
        options: [
          { label: "Blue Gradient", value: "blue" },
          { label: "Purple Gradient", value: "purple" },
          { label: "Green Gradient", value: "green" },
        ],
        label: "Background Style",
      },
    },
    defaultProps: {
      title: "Ready to Get Started?",
      description: "Join thousands of satisfied customers and take your business to the next level.",
      primaryButtonText: "Start Free Trial",
      primaryButtonLink: "/signup",
      secondaryButtonText: "Contact Sales",
      secondaryButtonLink: "/contact",
      backgroundColor: "blue",
    },
    render: ({ title, description, primaryButtonText, primaryButtonLink, secondaryButtonText, secondaryButtonLink, backgroundColor }) => {
      const bgClasses = {
        blue: "bg-gradient-to-r from-blue-600 to-indigo-600",
        purple: "bg-gradient-to-r from-purple-600 to-pink-600",
        green: "bg-gradient-to-r from-green-600 to-teal-600",
      };
      return (
        <section className={`py-20 ${bgClasses[backgroundColor]}`}>
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">{title}</h2>
            <p className="text-xl mb-8 text-white/90 max-w-2xl mx-auto">{description}</p>
            <div className="flex flex-wrap gap-4 justify-center">
              {primaryButtonText && (
                <a
                  href={primaryButtonLink}
                  className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors text-lg"
                >
                  {primaryButtonText}
                </a>
              )}
              {secondaryButtonText && (
                <a
                  href={secondaryButtonLink}
                  className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors text-lg"
                >
                  {secondaryButtonText}
                </a>
              )}
            </div>
          </div>
        </section>
      );
    },
  },

  // ==================== SOCIAL PROOF ====================
  Testimonials: {
    fields: {
      title: { type: "text", label: "Section Title" },
      subtitle: { type: "textarea", label: "Section Subtitle" },
      testimonials: {
        type: "array",
        arrayFields: {
          quote: { type: "textarea", label: "Testimonial Quote" },
          author: { type: "text", label: "Author Name" },
          role: { type: "text", label: "Author Role" },
          company: { type: "text", label: "Company" },
          avatar: { type: "text", label: "Avatar URL" },
          rating: {
            type: "select",
            options: [
              { label: "5 Stars", value: "5" },
              { label: "4 Stars", value: "4" },
              { label: "3 Stars", value: "3" },
            ],
            label: "Rating",
          },
        },
        label: "Testimonials",
        defaultItemProps: {
          quote: "This product changed my life!",
          author: "John Doe",
          role: "CEO",
          company: "Company Inc",
          avatar: "https://vsifesaczqscrutqgojh.supabase.co/storage/v1/object/public/media/website/notwp.png",
          rating: "5",
        },
      },
    },
    defaultProps: {
      title: "What Our Customers Say",
      subtitle: "Don't just take our word for it",
      testimonials: [
        {
          quote: "This platform has transformed the way we work. Highly recommended!",
          author: "Jane Smith",
          role: "Product Manager",
          company: "Tech Corp",
          avatar: "https://vsifesaczqscrutqgojh.supabase.co/storage/v1/object/public/media/website/notwp.png",
          rating: "5",
        },
      ],
    },
    render: ({ title, subtitle, testimonials }) => {
      return (
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4 text-gray-900">{title}</h2>
              <p className="text-xl text-gray-600">{subtitle}</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, idx) => (
                <div key={idx} className="bg-white p-8 rounded-xl shadow-md">
                  <div className="flex mb-4">
                    {[...Array(parseInt(testimonial.rating))].map((_, i) => (
                      <span key={i} className="text-yellow-400 text-xl">★</span>
                    ))}
                  </div>
                  <p className="text-gray-700 mb-6 italic">&ldquo;{testimonial.quote}&rdquo;</p>
                  <div className="flex items-center">
                    <img src={testimonial.avatar} alt={testimonial.author} className="w-12 h-12 rounded-full mr-4" />
                    <div>
                      <p className="font-semibold text-gray-900">{testimonial.author}</p>
                      <p className="text-sm text-gray-600">{testimonial.role} at {testimonial.company}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      );
    },
  },

  Stats: {
    fields: {
      title: { type: "text", label: "Section Title" },
      subtitle: { type: "textarea", label: "Section Subtitle" },
      stats: {
        type: "array",
        arrayFields: {
          number: { type: "text", label: "Stat Number" },
          label: { type: "text", label: "Stat Label" },
          suffix: { type: "text", label: "Suffix (e.g., +, %)" },
        },
        label: "Stats",
        defaultItemProps: {
          number: "100",
          label: "Happy Customers",
          suffix: "+",
        },
      },
    },
    defaultProps: {
      title: "By the Numbers",
      subtitle: "Our impact in statistics",
      stats: [
        { number: "10K", label: "Active Users", suffix: "+" },
        { number: "99.9", label: "Uptime", suffix: "%" },
        { number: "500", label: "Companies Trust Us", suffix: "+" },
        { number: "24/7", label: "Support", suffix: "" },
      ],
    },
    render: ({ title, subtitle, stats }) => {
      return (
        <section className="py-20 bg-blue-600 text-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4">{title}</h2>
              <p className="text-xl opacity-90">{subtitle}</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, idx) => (
                <div key={idx} className="text-center">
                  <div className="text-5xl font-bold mb-2">
                    {stat.number}{stat.suffix}
                  </div>
                  <div className="text-lg opacity-90">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      );
    },
  },

  Customers: {
    fields: {
      title: { type: "text", label: "Section Title" },
      subtitle: { type: "textarea", label: "Section Subtitle" },
      logos: {
        type: "array",
        arrayFields: {
          src: { type: "text", label: "Logo URL" },
          alt: { type: "text", label: "Company Name" },
        },
        label: "Customer Logos",
        defaultItemProps: {
          src: "https://vsifesaczqscrutqgojh.supabase.co/storage/v1/object/public/media/website/notwp.png",
          alt: "Company",
        },
      },
    },
    defaultProps: {
      title: "Trusted by Leading Companies",
      subtitle: "Join thousands of companies using our platform",
      logos: [
        { src: "https://vsifesaczqscrutqgojh.supabase.co/storage/v1/object/public/media/website/notwp.png", alt: "Company 1" },
        { src: "https://vsifesaczqscrutqgojh.supabase.co/storage/v1/object/public/media/website/notwp.png", alt: "Company 2" },
        { src: "https://vsifesaczqscrutqgojh.supabase.co/storage/v1/object/public/media/website/notwp.png", alt: "Company 3" },
        { src: "https://vsifesaczqscrutqgojh.supabase.co/storage/v1/object/public/media/website/notwp.png", alt: "Company 4" },
      ],
    },
    render: ({ title, subtitle, logos }) => {
      return (
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4 text-gray-900">{title}</h2>
              <p className="text-xl text-gray-600">{subtitle}</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center">
              {logos.map((logo, idx) => (
                <div key={idx} className="flex justify-center items-center grayscale hover:grayscale-0 transition-all">
                  <img src={logo.src} alt={logo.alt} className="max-h-16 w-auto" />
                </div>
              ))}
            </div>
          </div>
        </section>
      );
    },
  },

  // ==================== BUSINESS ====================
  Pricing: {
    fields: {
      title: { type: "text", label: "Section Title" },
      subtitle: { type: "textarea", label: "Section Subtitle" },
      plans: {
        type: "array",
        arrayFields: {
          name: { type: "text", label: "Plan Name" },
          price: { type: "text", label: "Price" },
          period: { type: "text", label: "Billing Period" },
          description: { type: "textarea", label: "Plan Description" },
          features: {
            type: "array",
            arrayFields: {
              text: { type: "text", label: "Feature" },
            },
          },
          buttonText: { type: "text", label: "Button Text" },
          buttonLink: { type: "text", label: "Button Link" },
          highlighted: { type: "radio", options: [{ label: "Yes", value: true }, { label: "No", value: false }], label: "Highlight Plan" },
        },
        label: "Pricing Plans",
        defaultItemProps: {
          name: "Starter",
          price: "$29",
          period: "per month",
          description: "Perfect for small teams",
          features: [{ text: "Feature 1" }, { text: "Feature 2" }],
          buttonText: "Get Started",
          buttonLink: "/signup",
          highlighted: false,
        },
      },
    },
    defaultProps: {
      title: "Simple, Transparent Pricing",
      subtitle: "Choose the plan that's right for you",
      plans: [
        {
          name: "Starter",
          price: "$29",
          period: "per month",
          description: "Perfect for small teams",
          features: [{ text: "Up to 5 users" }, { text: "10 GB storage" }, { text: "Email support" }],
          buttonText: "Get Started",
          buttonLink: "/signup",
          highlighted: false,
        },
        {
          name: "Professional",
          price: "$99",
          period: "per month",
          description: "For growing businesses",
          features: [{ text: "Up to 20 users" }, { text: "100 GB storage" }, { text: "Priority support" }, { text: "Advanced features" }],
          buttonText: "Get Started",
          buttonLink: "/signup",
          highlighted: true,
        },
      ],
    },
    render: ({ title, subtitle, plans }) => {
      return (
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4 text-gray-900">{title}</h2>
              <p className="text-xl text-gray-600">{subtitle}</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {plans.map((plan, idx) => (
                <div
                  key={idx}
                  className={`bg-white rounded-xl p-8 ${
                    plan.highlighted ? "ring-4 ring-blue-600 shadow-2xl scale-105" : "shadow-md"
                  }`}
                >
                  {plan.highlighted && (
                    <span className="bg-blue-600 text-white text-sm font-semibold px-3 py-1 rounded-full">Most Popular</span>
                  )}
                  <h3 className="text-2xl font-bold mt-4 mb-2 text-gray-900">{plan.name}</h3>
                  <div className="mb-4">
                    <span className="text-5xl font-bold text-gray-900">{plan.price}</span>
                    <span className="text-gray-600"> {plan.period}</span>
                  </div>
                  <p className="text-gray-600 mb-6">{plan.description}</p>
                  <ul className="mb-8 space-y-3">
                    {plan.features?.map((feature, featureIdx) => (
                      <li key={featureIdx} className="flex items-center text-gray-700">
                        <span className="text-green-500 mr-2">✓</span>
                        {feature.text}
                      </li>
                    ))}
                  </ul>
                  <a
                    href={plan.buttonLink}
                    className={`block w-full text-center py-3 rounded-lg font-semibold transition-colors ${
                      plan.highlighted
                        ? "bg-blue-600 text-white hover:bg-blue-700"
                        : "bg-gray-100 text-gray-900 hover:bg-gray-200"
                    }`}
                  >
                    {plan.buttonText}
                  </a>
                </div>
              ))}
            </div>
          </div>
        </section>
      );
    },
  },

  ContactUs: {
    fields: {
      title: { type: "text", label: "Section Title" },
      subtitle: { type: "textarea", label: "Section Subtitle" },
      email: { type: "text", label: "Contact Email" },
      phone: { type: "text", label: "Contact Phone" },
      address: { type: "textarea", label: "Address" },
      showForm: { type: "radio", options: [{ label: "Yes", value: true }, { label: "No", value: false }], label: "Show Contact Form" },
    },
    defaultProps: {
      title: "Get in Touch",
      subtitle: "We'd love to hear from you. Send us a message and we'll respond as soon as possible.",
      email: "hello@example.com",
      phone: "+1 (555) 123-4567",
      address: "123 Main Street\nSan Francisco, CA 94102",
      showForm: true,
    },
    render: ({ title, subtitle, email, phone, address, showForm }) => {
      return (
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4 text-gray-900">{title}</h2>
              <p className="text-xl text-gray-600">{subtitle}</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div>
                <div className="mb-8">
                  <h3 className="text-xl font-semibold mb-2 text-gray-900">Email</h3>
                  <a href={`mailto:${email}`} className="text-blue-600 hover:text-blue-700">{email}</a>
                </div>
                <div className="mb-8">
                  <h3 className="text-xl font-semibold mb-2 text-gray-900">Phone</h3>
                  <a href={`tel:${phone}`} className="text-blue-600 hover:text-blue-700">{phone}</a>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2 text-gray-900">Address</h3>
                  <p className="text-gray-600 whitespace-pre-line">{address}</p>
                </div>
              </div>
              {showForm && (
                <div>
                  <form className="space-y-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-1">Name</label>
                      <input
                        type="text"
                        id="name"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-1">Email</label>
                      <input
                        type="email"
                        id="email"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label htmlFor="message" className="block text-sm font-semibold text-gray-700 mb-1">Message</label>
                      <textarea
                        id="message"
                        rows="4"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                      ></textarea>
                    </div>
                    <button
                      type="submit"
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition-colors"
                    >
                      Send Message
                    </button>
                  </form>
                </div>
              )}
            </div>
          </div>
        </section>
      );
    },
  },
};

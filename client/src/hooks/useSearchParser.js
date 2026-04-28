import Fuse from 'fuse.js';

// Define valid attribute values
const ATTRIBUTES = {
  colors: [
    'red', 'blue', 'green', 'yellow', 'black', 'white', 'gray', 'grey',
    'pink', 'purple', 'orange', 'brown', 'beige', 'navy', 'maroon',
    'cyan', 'magenta', 'lime', 'olive', 'teal', 'gold', 'silver',
    'khaki', 'turquoise', 'lavender', 'coral', 'ivory', 'cream'
  ],
  genders: ['men', 'male', 'women', 'female', 'unisex', 'kids', 'boy', 'girl', 'men s', 'women s'],
  materials: [
    'cotton', 'silk', 'polyester', 'wool', 'linen', 'denim', 'leather',
    'synthetic', 'rayon', 'nylon', 'spandex', 'elastic', 'mesh',
    'satin', 'chiffon', 'velvet', 'corduroy', 'khaki', 'fleece',
    'bamboo', 'hemp', 'blended', 'blend', 'mix', 'mixed'
  ],
  seasons: ['summer', 'winter', 'spring', 'fall', 'autumn', 'monsoon', 'spring', 'casual', 'formal'],
  productTypes: [
    'shirt', 'tshirt', 't-shirt', 'pants', 'jeans', 'shorts', 'skirt',
    'dress', 'jacket', 'coat', 'sweater', 'hoodie', 'polo', 'blazer',
    'saree', 'kurta', 'lehenga', 'suit', 'top', 'blouse', 'vest',
    'trouser', 'capri', 'jumpsuit', 'romper', 'cardigan', 'shrug', 'bra'
  ],
  priceRanges: [
    { text: ['under 500', 'below 500', 'under500', 'below500', '<500'], range: 'under500' },
    { text: ['500 to 1000', '500-1000', '500 1000', '500 1000'], range: '500-1000' },
    { text: ['1000 to 2000', '1000-2000', '1000 2000'], range: '1000-2000' },
    { text: ['above 2000', 'above2000', '>2000', '2000+', 'expensive'], range: 'above2000' }
  ]
};

// Fuse.js options for fuzzy matching
const fuseOptions = {
  includeScore: true,
  threshold: 0.6, // Allow more fuzziness (0.6 means 60% can be different)
  ignoreLocation: true,
  minMatchCharLength: 2
};

export const useSearchParser = () => {
  /**
   * Parse search query and extract attributes
   * Returns object with extracted attributes and remaining query text
   */
  const parseQuery = (query) => {
    if (!query || typeof query !== 'string') {
      return {
        color: null,
        gender: null,
        material: null,
        season: null,
        productType: null,
        priceRange: null,
        remainingQuery: ''
      };
    }

    const lowerQuery = query.toLowerCase();
    let remainingQuery = lowerQuery;
    const extractedAttrs = {
      color: null,
      gender: null,
      material: null,
      season: null,
      productType: null,
      priceRange: null
    };

    // Extract price range first
    for (const priceOption of ATTRIBUTES.priceRanges) {
      for (const priceText of priceOption.text) {
        if (lowerQuery.includes(priceText)) {
          extractedAttrs.priceRange = priceOption.range;
          remainingQuery = remainingQuery.replace(priceText, '');
          break;
        }
      }
      if (extractedAttrs.priceRange) break;
    }

    // Use Fuse.js for fuzzy matching of colors
    const colorFuse = new Fuse(ATTRIBUTES.colors, fuseOptions);
    const colorMatches = colorFuse.search(remainingQuery);
    if (colorMatches.length > 0) {
      extractedAttrs.color = colorMatches[0].item;
      remainingQuery = remainingQuery.replace(colorMatches[0].item, '');
    }

    // Use Fuse.js for fuzzy matching of genders
    const genderFuse = new Fuse(ATTRIBUTES.genders, fuseOptions);
    const genderMatches = genderFuse.search(remainingQuery);
    if (genderMatches.length > 0) {
      const matched = genderMatches[0].item;
      // Normalize gender
      if (matched.includes('men') || matched === 'male' || matched === 'boy') {
        extractedAttrs.gender = 'men';
      } else if (matched.includes('women') || matched === 'female' || matched === 'girl') {
        extractedAttrs.gender = 'women';
      } else if (matched === 'unisex') {
        extractedAttrs.gender = 'unisex';
      }
      remainingQuery = remainingQuery.replace(matched, '');
    }

    // Use Fuse.js for fuzzy matching of materials
    const materialFuse = new Fuse(ATTRIBUTES.materials, fuseOptions);
    const materialMatches = materialFuse.search(remainingQuery);
    if (materialMatches.length > 0) {
      extractedAttrs.material = materialMatches[0].item;
      remainingQuery = remainingQuery.replace(materialMatches[0].item, '');
    }

    // Use Fuse.js for fuzzy matching of seasons
    const seasonFuse = new Fuse(ATTRIBUTES.seasons, fuseOptions);
    const seasonMatches = seasonFuse.search(remainingQuery);
    if (seasonMatches.length > 0) {
      extractedAttrs.season = seasonMatches[0].item;
      remainingQuery = remainingQuery.replace(seasonMatches[0].item, '');
    }

    // Use Fuse.js for fuzzy matching of product types
    const productTypeFuse = new Fuse(ATTRIBUTES.productTypes, fuseOptions);
    const productTypeMatches = productTypeFuse.search(remainingQuery);
    if (productTypeMatches.length > 0) {
      extractedAttrs.productType = productTypeMatches[0].item;
      remainingQuery = remainingQuery.replace(productTypeMatches[0].item, '');
    }

    // Clean up remaining query (trim and remove extra spaces)
    remainingQuery = remainingQuery
      .replace(/\s+/g, ' ')
      .trim();

    return {
      ...extractedAttrs,
      remainingQuery
    };
  };

  /**
   * Build search URL with extracted attributes
   */
  const buildSearchUrl = (query) => {
    const parsed = parseQuery(query);
    const searchUrl = new URL('http://localhost:3000/products/search');

    // Add remaining query (product name search)
    if (parsed.remainingQuery) {
      searchUrl.searchParams.append('q', parsed.remainingQuery);
    } else {
      // If no remaining query, use the original query
      searchUrl.searchParams.append('q', query);
    }

    // Add extracted attributes
    if (parsed.color) {
      searchUrl.searchParams.append('color', parsed.color);
    }
    if (parsed.gender) {
      searchUrl.searchParams.append('gender', parsed.gender);
    }
    if (parsed.material) {
      searchUrl.searchParams.append('material', parsed.material);
    }
    if (parsed.season) {
      searchUrl.searchParams.append('season', parsed.season);
    }
    if (parsed.productType) {
      searchUrl.searchParams.append('product_type', parsed.productType);
    }
    if (parsed.priceRange) {
      searchUrl.searchParams.append('priceRange', parsed.priceRange);
    }

    return {
      url: searchUrl,
      parsed
    };
  };

  return {
    parseQuery,
    buildSearchUrl
  };
};

export default useSearchParser;

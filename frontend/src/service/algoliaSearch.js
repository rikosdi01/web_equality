import { algoliasearch } from 'algoliasearch';

const ALGOLIA_APP_ID = import.meta.env.VITE_ALGOLIA_APP_ID;
const ALGOLIA_SEARCH_KEY = import.meta.env.VITE_ALGOLIA_SEARCH_KEY;
const ALGOLIA_INDEX_NAME = import.meta.env.VITE_ALGOLIA_INDEX_NAME;

const client = algoliasearch(ALGOLIA_APP_ID, ALGOLIA_SEARCH_KEY);

async function searchProducts(query) {
  const response = await client.search([
    {
      indexName: ALGOLIA_INDEX_NAME,
      query: query,
    }
  ]);
  return response.results[0].hits;
}

export default searchProducts;

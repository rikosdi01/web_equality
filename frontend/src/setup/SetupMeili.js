// // setupMeili.js

// import client from "../service/meiliClient.js";

// async function setupMeiliSearch() {
//   const index = client.index('equality_products');

//   await index.updateSearchableAttributes(['type', 'model', 'dataString', 'important']);
//   await index.updateDisplayedAttributes(['id', 'type', 'model', 'het', 'createdAt', 'individual', 'equality', 'important']);
  
//   console.log('Searchable attributes updated!');
// }

// setupMeiliSearch();
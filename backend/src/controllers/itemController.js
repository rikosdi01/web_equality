const ItemService = require('../services/ItemService');
const searchEqualities = require('../config/searchEqualities')

const ItemController = {
  async getItems(req, res) {
    try {
      const item = await ItemService.getItems();
      res.json(item);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch item" });
    }
  },

  async getItemById(req, res) {
    const { id } = req.params;
    try {
      const item = await ItemService.getItemById(id);
      res.json(item);
    } catch (error) {
      res.status(500).json({ error: `Gagal menemukan id ${id}` });
    }
  },

  async createItem(req, res) {
    try {
      const data = req.body;
      console.log(data);
      const newItem = await ItemService.createItem(req.body);
      res.status(201).json(newItem);
    } catch (error) {
      console.error("CREATE ITEM ERROR:", error); // Log detail error
      res.status(500).json({ error: "Failed to create item" });
    }
  },

  async updateItem(req, res) {
    const { id } = req.params;
    try {
      await ItemService.updateItem(id, req.body);
      res.status(200).json({ message: "Item updated" });
    } catch (error) {
      res.status(500).json({ error: "Failed to update item" });
    }
  },

  async deleteItem(req, res) {
    const { id } = req.params;
    try {
      await ItemService.deleteItem(id);
      res.status(200).json({ message: "Item deleted" });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete item" });
    }
  },

  // Menambahkan fungsi pencarian ke controller
  // async searchItem(req, res) {
  //   const { query } = req.query;
  //   console.log("Received search query:", query); // DEBUG

  //   if (!query || query.length < 2) {
  //     return res.status(400).json({ error: "Query parameter is required and must be at least 2 characters" });
  //   }

  //   try {
  //     const results = await searchEqualities(query); // <- pastikan ini sesuai
  //     res.json(results);
  //   } catch (error) {
  //     console.error("Search error:", error);
  //     res.status(500).json({ error: "Search failed" });
  //   }
  // }
}

module.exports = ItemController;

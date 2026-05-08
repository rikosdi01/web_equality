const EqualityService = require('../services/equalityService');
const searchEqualities = require('../config/searchEqualities')

const EqualityController = {
  async getEqualities(req, res) {
    try {
      const equality = await EqualityService.getEqualities();
      res.json(equality);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch equality" });
    }
  },

  async getEqualityById(req, res) {
    const { id } = req.params;
    try {
      const equality = await EqualityService.getEqualityById(id);
      res.json(equality);
    } catch (error) {
      res.status(500).json({ error: `Gagal menemukan id ${id}` });
    }
  },

  async createEquality(req, res) {
    try {
      const newEquality = await EqualityService.createEquality(req.body);
      res.status(201).json(newEquality);
    } catch (error) {
      console.error("CREATE EQUALITY ERROR:", error); // Log detail error
      res.status(500).json({ error: "Failed to create equality" });
    }
  },

  async updateEquality(req, res) {
    const { id } = req.params;
    try {
      await EqualityService.updateEquality(id, req.body);
      res.status(200).json({ message: "Equality updated" });
    } catch (error) {
      res.status(500).json({ error: "Failed to update equality" });
    }
  },

  async deleteEquality(req, res) {
    const { id } = req.params;
    try {
      await EqualityService.deleteEquality(id);
      res.status(200).json({ message: "Equality deleted" });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete equality" });
    }
  },

  // Menambahkan fungsi pencarian ke controller
  async searchEqualities(req, res) {
    const { query } = req.query;
    console.log("Received search query:", query); // DEBUG

    if (!query || query.length < 2) {
      return res.status(400).json({ error: "Query parameter is required and must be at least 2 characters" });
    }

    try {
      const results = await searchEqualities(query); // <- pastikan ini sesuai
      res.json(results);
    } catch (error) {
      console.error("Search error:", error);
      res.status(500).json({ error: "Search failed" });
    }
  }
}

module.exports = EqualityController;

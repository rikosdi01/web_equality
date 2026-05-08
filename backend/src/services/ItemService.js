const db = require('../config/db');

const ItemService = {
    async getItems() {
        try {
            const result = await db.query('SELECT * FROM master_item ORDER BY type, model');
            return result.rows;
        } catch (error) {
            console.error("DB Query error:", error);
            throw error;
        }
    },

    async getItemById(id) {
        try {
            const result = await db.query('SELECT * FROM master_item WHERE id = $1', [id]);
            return result.rows[0]; // asumsi hanya satu data yang dikembalikan
        } catch (error) {
            console.error("DB Query error:", error);
            throw error;
        }
    },

    async createItem(data) {
        const { model, type, merk, het, packaging_id, sales_id, equality_id, user_email, created_at, updated_at } = data;
        const result = await db.query(
            `INSERT INTO master_item (model, type, merk, het, packaging_id, sales_id, equality_id, user_email, created_at, updated_at)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`,
            [model, type, merk, het, packaging_id, sales_id, equality_id, user_email, created_at, updated_at]
        );
        return result.rows[0];
    },

    async updateItem(id, data) {
        try {
            const { model, type, merk, het, packaging_id, sales_id, equality_id, user_email, created_at, updated_at } = data;
            const result = await db.query(
                `UPDATE master_item SET
                    model = $1, type = $2, merk = $3, het = $4, packaging_id = $5, sales_id = $6,
                    equality_id = $7, user_email = $8, created_at = $9, updated_at = $10
                WHERE id = $11 RETURNING *`,
                [model, type, merk, het, packaging_id, sales_id, equality_id, user_email, created_at, updated_at, id]
            );
            return result.rows[0];
        } catch (error) {
            console.error("DB Query error:", error);
            throw error;
        }
    },

    async deleteItem(id) {
        try {
            const result = await db.query('DELETE FROM master_item WHERE id = $1 RETURNING *', [id]);
            return result.rows[0];
        } catch (error) {
            console.error("DB Query error:", error);
            throw error;
        }
    }
};

module.exports = ItemService;
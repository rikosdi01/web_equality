const db = require('../config/db');

const EqualityService = {
    async getEqualities() {
        try {
            const result = await db.query('SELECT * FROM equalities ORDER BY type, model');
            return result.rows;
        } catch (error) {
            console.error("DB Query error:", error);
            throw error;
        }
    },

    async getEqualityById(id) {
        try {
            const result = await db.query('SELECT * FROM equalities WHERE id = $1', [id]);
            return result.rows[0]; // asumsi hanya satu data yang dikembalikan
        } catch (error) {
            console.error("DB Query error:", error);
            throw error;
        }
    },

    async createEquality(data) {
        const { created_at, updated_at, dataString, type, model, merk, spec, important, het, user, equality } = data;
        const result = await db.query(
            `INSERT INTO equalities (created_at, updated_at, data_string, is_individual, is_individual_acc, is_individual_description, is_individual_user, is_individual_updated_at, type, model, merk, spec, important, het, user_name, equality)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16) RETURNING *`,
            [created_at, updated_at, dataString, type, model, merk, spec, important, het, user, equality]
        );
        return result.rows[0];
    },

    async updateEquality(id, data) {
        try {
            const { created_at, updated_at, dataString, type, model, merk, spec, important, het, user_name, equality } = data;
            const result = await db.query(
                `UPDATE equalities SET 
                    created_at = $1, updated_at = $2, data_string = $3, type = $4, model = $5, merk = $6, 
                    spec = $7, important = $8, het = $9, user_name = $10, equality = $11 
                WHERE id = $12 RETURNING *`,
                [
                    created_at, 
                    updated_at, 
                    dataString, 
                    type, 
                    model, 
                    merk,
                    JSON.stringify(spec),  // ✅ convert to JSON string
                    important, 
                    het, 
                    user_name, 
                    JSON.stringify(equality),  // ✅ convert to JSON string
                    id
                ]
              );              
            return result.rows[0];
        } catch (error) {
            console.error("DB Query error:", error);
            throw error;
        }
    },     

    async deleteEquality(id) {
        try {
            const result = await db.query('DELETE FROM equalities WHERE id = $1 RETURNING *', [id]);
            return result.rows[0];
        } catch (error) {
            console.error("DB Query error:", error);
            throw error;
        }
    }
};

module.exports = EqualityService;
import { addDoc, collection, deleteDoc, doc, getDoc, onSnapshot, orderBy, query, updateDoc } from "firebase/firestore"
import { db } from "../firebase";
// import client from "../service/meiliClient";

export default class EqualityProductsRepository {
    static getEqualityProducts(callback) {
        try {
            const equalityProductsQuery = query(
                collection(db, "Persamaan"),
                orderBy("type"),
                orderBy("model")
            );

            return onSnapshot(equalityProductsQuery, async (querySnapshot) => {
                const equalityProducts = querySnapshot.docs.map(doc => {
                    const docData = doc.data();
                
                    // Buat string gabungan dari array `data`
                    const dataArray = Array.isArray(docData.data) ? docData.data : [];
                    const dataString = dataArray.join(' ');
                
                    return {
                        id: doc.id,
                        ...docData,
                        dataString, // tambahkan ke objek
                    };
                });
                

                callback(equalityProducts);

                // kirim ke MeiliSearch (index ulang setiap update)
                // try {
                //     const index = client.index('equality_products');
                //     await index.addDocuments(equalityProducts); // update data di MeiliSearch
                // } catch (e) {
                //     console.error("Error syncing to MeiliSearch:", e);
                // }
            });
        } catch (error) {
            console.error("Error listening to equalityProducts: ", error);
        }
    }

    static async getEqualityProductById(equalityProductsId) {
        try {
            const docRef = doc(db, "Persamaan", equalityProductsId);
            const docSnapshot = await getDoc(docRef);
            if (docSnapshot.exists()) {
                return { id: docSnapshot.id, ...docSnapshot.data() };
            } else {
                return null;
            }
        } catch (error) {
            console.error("Error fetching equalityProducts: ", error);
            throw error;
        }
    }

    static async createEqualityProduct(equalityProducts) {
        try {
            const docRef = await addDoc(collection(db, "Persamaan"), equalityProducts);
            await updateDoc(doc(db, "Persamaan", docRef.id), { id: docRef.id });
            return docRef.id;
        } catch (error) {
            console.error("Error creating equalityProducts: ", error);
            throw error;
        }
    }

    static async updateEqualityProduct(equalityProductsId, updatedEqualityProduct) {
        try {
            const docRef = doc(db, "Persamaan", equalityProductsId);
            await updateDoc(docRef, updatedEqualityProduct);
        } catch (error) {
            console.error("Error updating equalityProducts: ", error);
            throw error;
        }
    }

    static async deleteEqualityProduct(equalityProductsId) {
        try {
            const docRef = doc(db, "Persamaan", equalityProductsId);
            await deleteDoc(docRef);  // Delete the document from Firestore
        } catch (error) {
            console.error("Error deleting equalityProducts: ", error);
            throw error;
        }
    }

    static async deleteEqualityProducts(equalityProductsId) {
        try {
            if (!Array.isArray(equalityProductsId)) {
                equalityProductsId = [equalityProductsId]; // Ubah jadi array jika bukan array
            }

            const deletePromises = equalityProductsId.map(async (id) => {
                const docRef = doc(db, "Persamaan", id);
                await deleteDoc(docRef);
            });

            await Promise.all(deletePromises); // Menjalankan semua penghapusan bersamaan
        } catch (error) {
            console.error("Error deleting equalityProducts: ", error);
            throw error;
        }
    }
}
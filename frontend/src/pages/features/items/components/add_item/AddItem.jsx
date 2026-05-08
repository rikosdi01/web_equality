import { useContext, useState } from 'react';
import './AddItem.css';
import { Layers, LayoutDashboard, Box, Calculator } from "lucide-react";
import { useToast } from '../../../../../context/ToastContext';
import ContentHeader from '../../../../../components/content_header/ContentHeader';
import InputLabel from '../../../../../components/input/input_label/InputLabel';
import ActionButton from '../../../../../components/button/actionbutton/ActionButton';
import Formatting from '../../../../../utils/format/Formatting';
import { AuthContext } from '../../../../../context/AuthContext';
import axios from 'axios';
import { useAccessToken } from '../../../../../context/AccessTokenContext';

const API_URL = import.meta.env.VITE_API_URL;

const AddItem = () => {
    const { showToast } = useToast();
    const { currentUser } = useContext(AuthContext);
    const { accessToken } = useAccessToken(); // langsung reactive!

    // Core
    const [type, setType] = useState("");
    const [model, setModel] = useState("");
    const [merk, setMerk] = useState("");
    const [het, setHet] = useState("");

    // Error
    const [typeError, setTypeError] = useState("");
    const [modelError, setModelError] = useState("");
    const [merkError, setMerkError] = useState("");

    const now = new Date();
    const formattedDate = Formatting.formatDateForPostgres(now);


    const [loading, setLoading] = useState(false);


    const handleTypeChange = (e) => {
        setType(e.target.value);
        if (e.target.value.trim()) setTypeError("");
    };

    const handleModelChange = (e) => {
        setModel(e.target.value);
        if (e.target.value.trim()) setModelError("");
    };

    const handleMerkChange = (e) => {
        setMerk(e.target.value);
        if (e.target.value.trim()) setMerkError("");
    };

    const handleReset = () => {
        setType("");
        setModel("");
        setMerk("");
        setHet("");
    };

    const handleCreateItem = async (e) => {
        e.preventDefault();
        setLoading(true);

        let valid = true;

        if (!type.trim()) {
            setTypeError('Tipe tidak boleh kosong!');
            valid = false;
        }

        if (!model.trim()) {
            setModelError('Model tidak boleh kosong!');
            valid = false;
        }

        if (!merk.trim()) {
            setMerkError('Merek tidak boleh kosong!');
            valid = false;
        }

        if (!valid) {
            setLoading(false);
            return;
        }

        try {
            const response = await axios.post(
                `${API_URL}/items/new`, // Contoh: http://localhost:12462/api/equality/new
                {
                    created_at: formattedDate,
                    updated_at: formattedDate,
                    type,
                    model,
                    merk,
                    het: parseInt(het.replace(/\D/g, ""), 10) || 0,
                    packaging_id: null, // Nilai default jika belum ada
                    sales_id: null,     // Nilai default jika belum ada
                    equality_id: null,  // Nilai default jika belum ada
                    user_email: currentUser.email,
                },
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`, // atau sesuaikan dengan cara kamu simpan token
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (response.status === 200 || response.status === 201) {
                handleReset();
                showToast('berhasil', 'Persamaan berhasil ditambahkan!');
            } else {
                showToast('gagal', 'Gagal menambahkan persamaan!');
            }
        } catch (error) {
            console.error('Terjadi kesalahan: ', error);
            showToast('gagal', 'Gagal menambahkan persamaan baru!');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="main-container">
            <ContentHeader title="Tambah Item" />

            <div className='add-form-input'>
                <div>
                    <InputLabel
                        label="Tipe"
                        icon={<Layers className='input-icon' />}
                        value={type}
                        onChange={handleTypeChange}
                    />
                    {typeError && <div className="error-input">{typeError}</div>}
                </div>

                <div>
                    <InputLabel
                        label="Merek"
                        icon={<LayoutDashboard className='input-icon' />}
                        value={merk}
                        onChange={handleMerkChange}
                    />
                    {merkError && <div className="error-input">{merkError}</div>}
                </div>
            </div>

            <div className='add-form-input'>
                <div>
                    <InputLabel
                        label="Model"
                        icon={<Box className='input-icon' />}
                        value={model}
                        onChange={handleModelChange}
                    />
                    {modelError && <div className="error-input">{modelError}</div>}
                </div>

                <div>
                    <InputLabel
                        label="HET"
                        type="text"
                        icon={<Calculator className='input-icon' />}
                        value={het}
                        onChange={(e) => {
                            const rawValue = e.target.value.replace(/\D/g, ""); // Hanya angka
                            setHet(rawValue ? Formatting.formatCurrencyIDR(parseInt(rawValue)) : "");
                        }}
                    />
                </div>
            </div>

            <div className='add-item-actions'>
                <ActionButton
                    title="Reset"
                    background="linear-gradient(to top right,rgb(241, 66, 66),rgb(245, 51, 51))"
                    color="white"
                    onclick={handleReset}
                />

                <ActionButton
                    title={loading ? "Menyimpan..." : "Simpan"}
                    disabled={loading}
                    onclick={handleCreateItem}
                />
            </div>
        </div>
    )
}

export default AddItem;
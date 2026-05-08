import { useContext, useState } from 'react';
import './AddEquality.css';
import { KeyRound, ClipboardPen, Layers, LayoutDashboard, Box, Calculator, ListCollapse } from "lucide-react";
import { useToast } from '../../../../../context/ToastContext';
import ContentHeader from '../../../../../components/content_header/ContentHeader';
import InputLabel from '../../../../../components/input/input_label/InputLabel';
import ActionButton from '../../../../../components/button/actionbutton/ActionButton';
import Formatting from '../../../../../utils/format/Formatting';
import InputField from '../../../../../components/input/input_field/InputField';
import CheckboxAttribute from '../../../../../components/checkbox_attribute/CheckboxAttribute';
import { Timestamp } from 'firebase/firestore';
import { AuthContext } from '../../../../../context/AuthContext';
import EqualityProductsRepository from '../../../../../repository/EqualityProductsRepository';
import HistoryEqualityRepository from '../../../../../repository/HistoryEqualityRepository';
import axios from 'axios';
import { useAccessToken } from '../../../../../context/AccessTokenContext';

const API_URL = import.meta.env.VITE_API_URL;

const AddEquality = () => {
    const { showToast } = useToast();
    const { currentUser } = useContext(AuthContext);
    const { accessToken } = useAccessToken(); // langsung reactive!
    
    // Core
    const [type, setType] = useState("");
    const [model, setModel] = useState("");
    const [merk, setMerk] = useState("");
    const [het, setHet] = useState("");
    const [important, setImportant] = useState("");
    const [spec, setSpec] = useState([""]);

    // Error
    const [typeError, setTypeError] = useState("");
    const [modelError, setModelError] = useState("");
    const [merkError, setMerkError] = useState("");

    const now = new Date();
    const formattedDate = Formatting.formatDateForPostgres(now);

    // Equality
    const [equalities, setEqualities] = useState([
        { model: "", acc: "", description: "", updated_at: now, user: currentUser.email }
    ]);

    // Individual
    const [isIndividual, setIsIndividual] = useState(false);
    const [individualAcc, setIndividualAcc] = useState("");
    const [individualDescription, setIndividualDescription] = useState("");

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

    const handleChange = (index, field, value) => {
        const updated = [...equalities];
        updated[index] = {
            ...updated[index],
            [field]: value,
            updated_at: now,
            user: currentUser.email,
        };

        setEqualities(updated);

        // Cek hanya field input
        const relevantFields = ['model', 'acc', 'description'];
        const isAnyFilled = relevantFields.some(key => updated[index][key]?.trim() !== "");
        const isAllEmpty = relevantFields.every(key => updated[index][key]?.trim() === "");

        // Tambah baris baru jika form terakhir diisi
        if (isAnyFilled && index === equalities.length - 1) {
            setEqualities([
                ...updated,
                { model: "", acc: "", description: "" } // Tidak pakai updated_at & user di form baru
            ]);
        }

        // Hapus baris kalau kosong semua & masih ada lebih dari 1 baris
        if (isAllEmpty && equalities.length > 1) {
            const filtered = updated.filter((_, i) => i !== index);
            setEqualities(filtered);
        }
    };


    // Fungsi untuk menangani penambahan dan penghapusan warning secara otomatis
    const handleInputChange = (index, value, list, setFunction) => {
        // Membuat salinan dari list yang diterima untuk diubah
        const updatedValues = [...list]; // Salin array untuk menjaga immutability
        updatedValues[index] = value;

        // Jika input diubah menjadi kosong, hapus input berikutnya
        if (value.trim() === "" && updatedValues.length > index + 1) {
            updatedValues.splice(index + 1); // Menghapus input berikutnya jika kosong
        }

        // Jika input sebelumnya diubah menjadi tidak kosong, tambahkan input baru
        if (value.trim() !== "" && updatedValues.length === index + 1) {
            updatedValues.push(""); // Menambahkan input baru jika input sebelumnya ada isinya
        }

        // Menggunakan setFunction untuk memperbarui nilai list
        setFunction(updatedValues);
    }

    const handleReset = () => {
        setType("");
        setModel("");
        setMerk("");
        setHet("");
        setImportant("");
        setSpec([""]);

        setEqualities([
            { model: "", acc: "", description: "", updated_at: Timestamp.now(), user: currentUser.email }
        ]);

        setIndividualAcc("");
        setIndividualDescription("");
    };

    const handleCreateEquality = async (e) => {
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

        const dataArray = [
            `${type} ${model} ${merk}`,
            ...equalities
                .filter(eq => eq.model.trim())
                .map(eq => `${type} ${eq.model} ${merk}`)
        ];

        const filteredSpec = spec.filter((sp) => sp.trim() !== "");
        const filteredEquality = equalities.filter(eq =>
            eq.model.trim() || eq.acc.trim() || eq.description.trim()
        );

        try {
            const response = await axios.post(
                `${API_URL}/equalities/new`, // Contoh: http://localhost:12462/api/equality/new
                {
                    created_at: formattedDate,
                    updated_at: formattedDate,
                    dataString: dataArray,
                    is_individual: isIndividual,
                    is_individual_acc: individualAcc,
                    is_individual_description: individualDescription,
                    is_individual_user: currentUser.email,
                    is_individual_updated_at: formattedDate,
                    type,
                    model,
                    merk,
                    spec: JSON.stringify(filteredSpec),
                    important,
                    het: parseInt(het.replace(/\D/g, ""), 10) || 0,
                    user: currentUser.email,
                    equality: JSON.stringify(filteredEquality),
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
            <ContentHeader title="Tambah Pesanan" />

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

            <div className='add-form-input'>
                <InputLabel
                    label="Informasi Penting"
                    icon={<ClipboardPen className='input-icon' />}
                    value={important}
                    onChange={(e) => setImportant(e.target.value)}
                />
            </div>

            {/* Peringatan (dengan input dinamis) */}
            <div className='list-item-container'>
                <div className='list-item-header'>Spesifikasi</div>
                {spec.map((sp, index) => (
                    <div key={index} className='list-item-specific'>
                        <InputField
                            label="Spesifikasi"
                            icon={<ListCollapse className='input-icon' />}
                            value={sp}
                            onChange={(e) => handleInputChange(index, e.target.value, spec, setSpec)}
                        />
                    </div>
                ))}
            </div>

            <CheckboxAttribute
                id={"isIndividual"}
                values={isIndividual}
                onChange={() => setIsIndividual(!isIndividual)}
                label="Tersendiri?"
            />

            {isIndividual ? (
                <div className='add-form-input'>
                    <InputLabel
                        label="Acc"
                        icon={<KeyRound className='input-icon' />}
                        value={individualAcc}
                        onChange={(e) => setIndividualAcc(e.target.value)}
                    />
                    <InputLabel
                        label="Deskripsi"
                        icon={<ClipboardPen className='input-icon' />}
                        value={individualDescription}
                        onChange={(e) => setIndividualDescription(e.target.value)}
                    />
                </div>
            ) : (
                <div className='list-item-container'>
                    <div className='list-item-header'>Persamaan</div>
                    {equalities.map((item, index) => (
                        <div className='add-form-input-area' key={index}>
                            <div>
                                <InputLabel
                                    label="Model Persamaan"
                                    icon={<Box className='input-icon' />}
                                    value={item.model}
                                    onChange={(e) => handleChange(index, "model", e.target.value)}
                                />
                            </div>
                            <div>
                                <InputLabel
                                    label="Acc"
                                    icon={<KeyRound className='input-icon' />}
                                    value={item.acc}
                                    onChange={(e) => handleChange(index, "acc", e.target.value)}
                                />
                            </div>
                            <div>
                                <InputLabel
                                    label="Deskripsi"
                                    icon={<Calculator className='input-icon' />}
                                    value={item.description}
                                    onChange={(e) => handleChange(index, "description", e.target.value)}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            )}

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
                    onclick={handleCreateEquality}
                />
            </div>
        </div>
    )
}

export default AddEquality;
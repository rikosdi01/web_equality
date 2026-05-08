import { useContext, useEffect, useMemo, useState } from 'react';
import './DetailsItem.css';
import { KeyRound, ClipboardPen, Layers, LayoutDashboard, Box, Calculator, ListCollapse, History, RefreshCcw } from "lucide-react";
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
import { useNavigate, useParams } from 'react-router-dom';
import { useEqualityProducts } from '../../../../../context/EqualityProductsContext';
import HistoryList from '../../../recent/components/HistoryList';
import DatePickerStatistic from '../../../../../components/picker/DatePicker';
import Dropdown from '../../../../../components/select/Dropdown';
import axios from 'axios';
import ConfirmationModal from '../../../../../components/modal/confirmation_modal/ConfirmationModal';
import { useAccessToken } from '../../../../../context/AccessTokenContext';

const API_URL = import.meta.env.VITE_API_URL;

const DetailsItem = () => {
    const { showToast } = useToast();
    const { currentUser } = useContext(AuthContext);
    const { id } = useParams();
    const navigate = useNavigate();
    const { accessToken } = useAccessToken(); // langsung reactive!

    // Core
    const [type, setType] = useState("");
    const [model, setModel] = useState("");
    const [merk, setMerk] = useState("");
    const [het, setHet] = useState("");
    const [packagingId, setPackagingId] = useState(0);
    const [salesId, setSalesId] = useState(0);
    const [equalityId, setEqualityId] = useState(0);
    const [createdAt, setCreatedAt] = useState(0);

    // Error
    const [typeError, setTypeError] = useState("");
    const [modelError, setModelError] = useState("");
    const [merkError, setMerkError] = useState("");

    const now = new Date();
    const formattedDate = Formatting.formatDateForPostgres(now);


    const [loading, setLoading] = useState(false);

    const [openModal, setOpenModal] = useState(false);

    // Fetch Item By ID
    useEffect(() => {
        if (id && accessToken) {
            fetchItemById();
        }
    }, [id, accessToken]);

    // Function For Fetch Item By ID
    const fetchItemById = async () => {
        if (!accessToken) return; // cegah request saat token belum siap

        try {
            setLoading(true);
            const response = await axios.get(`${API_URL}/items/${id}`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
                withCredentials: true, // Jika menggunakan refreshToken dari cookie
            });

            const data = response.data;
            console.log(data);

            if (!response.status === 200) throw new Error(data.error || 'Gagal fetch data');

            setType(data.type || "");
            setModel(data.model || "");
            setMerk(data.merk || "");
            setHet(data.het || "");
            setPackagingId(data.packaging_id);
            setSalesId(data.sales_id);
            setEqualityId(data.equality_id);

            setCreatedAt(data.created_at || formattedDate);
        } catch (error) {
            showToast('gagal', error?.response?.data?.error || error.message);
        } finally {
            setLoading(false);
        }
    };

    // Handle Type Error
    const handleTypeChange = (e) => {
        setType(e.target.value);
        if (e.target.value.trim()) setTypeError("");
    };

    // Handle Model Error
    const handleModelChange = (e) => {
        setModel(e.target.value);
        if (e.target.value.trim()) setModelError("");
    };

    // Handle Merk Error
    const handleMerkChange = (e) => {
        setMerk(e.target.value);
        if (e.target.value.trim()) setMerkError("");
    };

    // Handle Toggle Modal For Delete
    const handleToggleModal = () => {
        setOpenModal(!openModal);
    }

    // Function to Delete Item
    const handleDeleteItem = async () => {
        try {
            // Gantilah URL dengan endpoint yang sesuai
            await axios.delete(`${API_URL}/items/${id}`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`, // Jika menggunakan token otentikasi
                }
            });

            showToast('berhasil', 'Item berhasil dihapus');
            navigate(-1, { replace: true });
        } catch (error) {
            console.error("Gagal menghapus Item", error);
            showToast('gagal', 'Item gagal dihapus');
        }
    };

    // Fucntion to Edit Item
    const handleEditItem = async (e) => { // Tambahkan 'e' di sini
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

        if (!valid) return setLoading(false);

        try {
            const updatedEquality = {
                created_at: createdAt,
                updated_at: formattedDate,
                type,
                model,
                merk,
                het,
                packaging_id: packagingId,
                sales_id: salesId,
                equality_id: equalityId,
                user_email: currentUser.email,
            };

            await fetch(`${API_URL}/items/${id}`, {
                method: 'PUT',
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedEquality),
            });

            showToast('berhasil', 'Item berhasil ditambahkan!');
        } catch (error) {
            console.error('Terjadi kesalahan: ', error);
            showToast('gagal', 'Gagal menambahkan item baru!');
        } finally {
            setLoading(false);
        }
    };


    return (
        <div className="main-container">
            {/* Header */}
            <ContentHeader
                title="Rincian Item"
            />

            {/* Form */}
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
                        value={Formatting.formatCurrencyIDR(het)}
                        onChange={(e) => {
                            const rawValue = e.target.value.replace(/\D/g, ""); // Hanya angka
                            const parsedValue = rawValue ? parseInt(rawValue, 10) : 0;
                            setHet(parsedValue);
                        }}
                    />
                </div>
            </div>

            {/* Action Button */}
            <div className='add-item-actions'>
                <ActionButton
                    title="Hapus"
                    background="linear-gradient(to top right,rgb(241, 66, 66),rgb(245, 51, 51))"
                    color="white"
                    onclick={handleToggleModal}
                />

                <ActionButton
                    title={loading ? "Menyimpan..." : "Simpan"}
                    disabled={loading}
                    onclick={handleEditItem}
                />
            </div>

            <div>
                <ConfirmationModal
                    title="Item"
                    isOpen={openModal}
                    onClose={() => setOpenModal(false)}
                    onclick={handleDeleteItem}
                />
            </div>
        </div>
    )
}

export default DetailsItem;
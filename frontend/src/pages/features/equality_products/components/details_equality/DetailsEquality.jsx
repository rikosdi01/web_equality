import { useContext, useEffect, useMemo, useState } from 'react';
import './DetailsEquality.css';
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

const DetailsEquality = () => {
    const { showToast } = useToast();
    const { currentUser } = useContext(AuthContext);
    const { equalityProducts } = useEqualityProducts();
    const { id } = useParams();
    const navigate = useNavigate();
    const { accessToken } = useAccessToken(); // langsung reactive!

    // Core
    const [type, setType] = useState("");
    const [model, setModel] = useState("");
    const [merk, setMerk] = useState("");
    const [het, setHet] = useState("");
    const [important, setImportant] = useState("");
    const [spec, setSpec] = useState([""]);
    const [createdAt, setCreatedAt] = useState("");

    // Error
    const [typeError, setTypeError] = useState("");
    const [modelError, setModelError] = useState("");
    const [merkError, setMerkError] = useState("");

    const [originalEquality, setOriginalEquality] = useState(null);

    const now = new Date();
    const formattedDate = Formatting.formatDateForPostgres(now);

    // Equality
    const [equalities, setEqualities] = useState([
        { model: "", acc: "", description: "", updatedAt: now, user: currentUser.email }
    ]);

    // Individual
    const [isIndividual, setIsIndividual] = useState(false);
    const [individualAcc, setIndividualAcc] = useState("");
    const [individualDescription, setIndividualDescription] = useState("");

    const [openMutation, setOpenMutation] = useState(false);

    const [equality, setEquality] = useState([]);

    const [loading, setLoading] = useState(false);

    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [selectedId, setSelectedId] = useState('Semua');
    const [openModal, setOpenModal] = useState(false);

    const handleToggleModal = () => {
        setOpenModal(!openModal);
    }

    useEffect(() => {
        if (id && accessToken) {
            fetchEqualityById();
        }
    }, [id, accessToken]);

    const fetchEqualityById = async () => {
        if (!accessToken) return;
        try {
            setLoading(true);
            const response = await axios.get(`${API_URL}/equalities/${id}`, {
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
            setImportant(data.important || "");
            setSpec(data.spec || [""]);
            setEqualities(data.equality || [
                {
                    model: data.equality?.[0]?.model || "",
                    acc: data.equality?.[0]?.acc || "",
                    description: data.equality?.[0]?.description || "",
                    updatedAt: data.equality?.[0]?.updated_at || formattedDate,
                    user: data.equality?.[0]?.user || currentUser.email
                }
            ]);
            setOriginalEquality(data);
            setCreatedAt(data.created_at || formattedDate);
        } catch (error) {
            showToast('gagal', error?.response?.data?.error || error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!id) return;

        setLoading(true); // mulai loading

        const unsubscribe = HistoryEqualityRepository.getHistoryEqualitiesById((history) => {
            setEquality(history);
            setLoading(false); // selesai loading setelah data masuk
        }, id);

        // Cleanup listener saat komponen unmount atau id berubah
        return () => unsubscribe();
    }, [id]);

    useEffect(() => {
        // Set startDate to the first day of the current month
        const firstDayOfMonth = new Date();
        firstDayOfMonth.setDate(1); // Set day to 1 to get the first day of the month

        // Set endDate to today
        const today = new Date();

        // Update the state
        setStartDate(firstDayOfMonth);
        setEndDate(today);
    }, []);

    const handleResetDatePicker = () => {
        // Set startDate to the first day of the current month
        const firstDayOfMonth = new Date();
        firstDayOfMonth.setDate(1); // Set day to 1 to get the first day of the month

        // Set endDate to today
        const today = new Date();

        // Update the state to reset to default values
        setStartDate(firstDayOfMonth);
        setEndDate(today);
    };

    const mutationStatus = [
        { id: 'Semua', name: "Semua" },
        { id: 'Add', name: "Tambah Induk" },
        { id: 'AddSub', name: "Tambah Sub Induk" },
        { id: 'Edit', name: "Edit Induk" },
        { id: 'EditSub', name: "Edit Sub Induk" },
        { id: 'Delete', name: "Hapus Induk" },
        { id: 'DeleteSub', name: "Hapus Sub Induk" },
        { id: 'Individual', name: "Tersendiri" },
    ]

    const filteredEquality = useMemo(() => {
        return equality.filter((equal) => {
            const isMatchType =
                selectedId === "Semua" || equal.type === selectedId;

            // Pastikan equal.date adalah Timestamp dan memiliki properti seconds
            let equalityDate;
            if (equal.createdAt && equal.createdAt.seconds) {
                equalityDate = new Date(equal.createdAt.seconds * 1000);
            } else if (equal.date && equal.date.seconds) {
                equalityDate = new Date(equal.date.seconds * 1000);
            } else {
                equalityDate = new Date(equal.date); // fallback jika bukan Timestamp
            }

            // Normalize startDate and endDate
            const normalizedStart = new Date(startDate);
            normalizedStart.setHours(0, 0, 0, 0);

            const normalizedEnd = new Date(endDate);
            normalizedEnd.setHours(23, 59, 59, 999);

            const isMatchDate =
                (!startDate || equalityDate >= normalizedStart) &&
                (!endDate || equalityDate <= normalizedEnd);

            return isMatchType && isMatchDate;
        });
    }, [equality, selectedId, startDate, endDate]);


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
                { model: "", acc: "", description: "" } // Tidak pakai updatedAt & user di form baru
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

    const handleDeleteEquality = async () => {
        try {
            // Gantilah URL dengan endpoint yang sesuai
            await axios.delete(`${API_URL}/equalities/${id}`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`, // Jika menggunakan token otentikasi
                }
            });

            showToast('berhasil', 'Persamaan berhasil dihapus');
            navigate(-1, { replace: true });
        } catch (error) {
            console.error("Gagal menghapus Persamaan", error);
            showToast('gagal', 'Persamaan gagal dihapus');
        }
    };

    const handlEditEquality = async (e) => { // Tambahkan 'e' di sini
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

        const data = [
            `${type} ${model} ${merk}`,
            ...equalities
                .filter(eq => eq.model.trim())
                .map(eq => `${type} ${eq.model} ${merk}`)
        ];

        const filteredSpec = spec.filter((sp) => sp.trim() !== "");
        const filteredEquality = equalities.filter(eq =>
            eq.model.trim() || eq.acc.trim() || eq.description.trim()
        );

        console.log('data: ', data);
        console.log('filteredSpec: ', filteredSpec);
        console.log('filteredEquality: ', filteredEquality);

        const edittedMain = [];

        if (originalEquality?.type !== type) {
            edittedMain.push({ typeField: "Tipe", oldText: originalEquality.type || "", newText: type });
        }
        if (originalEquality?.model !== model) {
            edittedMain.push({ typeField: "Model", oldText: originalEquality.model || "", newText: model });
        }
        if (originalEquality?.merk !== merk) {
            edittedMain.push({ typeField: "Merek", oldText: originalEquality.merk || "", newText: merk });
        }
        if (originalEquality?.het !== het) {
            edittedMain.push({ typeField: "Het", oldText: originalEquality.het || "", newText: het });
        }
        if (originalEquality?.important !== important) {
            edittedMain.push({ typeField: "Penting", oldText: originalEquality.important || "", newText: important });
        }

        // Handle spec changes (from array to string)
        const oldSpec = originalEquality?.spec || [];
        const oldSpecString = oldSpec.join(" | ");
        const newSpecString = filteredSpec.join(" | ");

        if (oldSpecString !== newSpecString) {
            edittedMain.push({
                typeField: "Spesifikasi",
                oldText: oldSpecString,
                newText: newSpecString,
            });
        }

        try {
            const updatedEquality = {
                created_at: createdAt,
                updated_at: formattedDate,
                dataString: data,
                type,
                model,
                merk,
                spec: filteredSpec,  // Pastikan ini adalah string JSON yang valid
                important,
                het,
                user_name: currentUser.email,
                equality: filteredEquality,  // Pastikan ini adalah string JSON yang valid
            };

            const historyEquality = edittedMain.length > 0 ? {
                equalityId: id,
                acc: '',
                core: `${type} ${model} ${merk}`,
                type: 'Edit',
                user: currentUser.email,
                createdAt: Timestamp.now(),
                editted: edittedMain,
            } : null;

            // List model baru (AddSub)
            const addedModels = filteredEquality
                .filter(eq => {
                    const existsInOriginal = originalEquality?.equality?.some(old =>
                        old.model === eq.model
                    );
                    return !existsInOriginal;
                })
                .map(eq => eq.model);

            // Equality sub data
            const historyEqualities = filteredEquality.map((eq) => {
                // Skip jika termasuk data baru (AddSub)
                if (addedModels.includes(eq.model)) return null;

                const oldEq = originalEquality?.equality?.find(old =>
                    old.model === eq.model
                );

                const edittedSub = [];

                if (oldEq?.model !== eq.model) {
                    edittedSub.push({ typeField: "model", oldText: oldEq?.model || "", newText: eq.model });
                }
                if (oldEq?.acc !== eq.acc) {
                    edittedSub.push({ typeField: "acc", oldText: oldEq?.acc || "", newText: eq.acc });
                }
                if (oldEq?.description !== eq.description) {
                    edittedSub.push({ typeField: "deskripsi", oldText: oldEq?.description || "", newText: eq.description });
                }

                if (edittedSub.length === 0) return null;

                return {
                    equalityId: id,
                    acc: eq.acc || '',
                    core: `${type} ${model} ${merk}`,
                    type: 'EditSub',
                    user: currentUser.email,
                    createdAt: Timestamp.now(),
                    editted: edittedSub,
                };
            }).filter(Boolean);

            const historyAddEqualities = addedModels
                .map(modelName => {
                    const eq = filteredEquality.find(item => item.model === modelName);
                    if (!eq) return null;

                    return {
                        equalityId: id,
                        type: 'AddSub',
                        core: `${type} ${model} ${merk}`,
                        equality: `${type} ${eq.model} ${merk}`,
                        acc: eq.acc || '',
                        description: eq.description || '',
                        user: currentUser.email,
                        createdAt: Timestamp.now(),
                    };
                })
                .filter(Boolean); // buang null kalau ada yang tidak ditemukan


            // if (historyEquality) {
            //     await fetch('/api/history-equality', {
            //         method: 'POST',
            //         headers: { 'Content-Type': 'application/json' },
            //         body: JSON.stringify(historyEquality),
            //     });
            // }
            // if (historyEqualities.length > 0) {
            //     await Promise.all(
            //         historyEqualities.map(item =>
            //             fetch('/api/history-equality', {
            //                 method: 'POST',
            //                 headers: { 'Content-Type': 'application/json' },
            //                 body: JSON.stringify(item),
            //             })
            //         )
            //     );
            // }
            // if (historyAddEqualities.length > 0) {
            //     await Promise.all(
            //         historyAddEqualities.map(item =>
            //             fetch('/api/history-equality', {
            //                 method: 'POST',
            //                 headers: { 'Content-Type': 'application/json' },
            //                 body: JSON.stringify(item),
            //             })
            //         )
            //     );
            // }

            console.log('Not JSON: ', updatedEquality);
            console.log('JSON: ', JSON.stringify(updatedEquality));  // Cek apakah data JSON valid


            await fetch(`${API_URL}/equalities/${id}`, {
                method: 'PUT',
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedEquality),
            });

            showToast('berhasil', 'Persamaan berhasil ditambahkan!');
        } catch (error) {
            console.error('Terjadi kesalahan: ', error);
            showToast('gagal', 'Gagal menambahkan persamaan baru!');
        } finally {
            setLoading(false);
        }
    };

    const handleOpenMutation = () => {
        setOpenMutation(true);
    }

    const handleCloseModal = () => {
        setOpenMutation(false);
    };

    return (
        <div className="main-container">
            <ContentHeader
                title="Rincian Persamaan"
                enableTrailing={true}
                trailingIcon={<History size={22} />}
                trailingLabel={"Lihat Mutasi"}
                trailingClick={handleOpenMutation}
            />

            {openMutation && (
                <div className='mutation-modal'>
                    <div className="mutation-modal-container" onClick={(e) => e.stopPropagation()}>
                        <button className="close-button" onClick={handleCloseModal}>✖</button>
                        <div className='mutation-subtitle'>Histori Persamaan</div>
                        <div className='mutation-modal-content'>
                            <div className='mutation-modal-header'>
                                <Dropdown
                                    icon={<RefreshCcw className='input-icon' />}
                                    selectedId={selectedId}
                                    setSelectedId={setSelectedId}
                                    values={mutationStatus}
                                    width="200px"
                                />

                                <div className='detail-date-area'>
                                    <DatePickerStatistic
                                        startDate={startDate}
                                        endDate={endDate}
                                        setStartDate={setStartDate}
                                        setEndDate={setEndDate}
                                    />
                                    <button type='button' className='reset-button' onClick={handleResetDatePicker}>
                                        Reset
                                    </button>
                                </div>
                            </div>

                            <div className='mutation-modal-history'>
                                {loading ? (
                                    <p>Loading...</p>
                                ) : (
                                    <HistoryList historyEqualities={filteredEquality} />
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}

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
                {(spec.length > 0 ? spec : [""]).map((sp, index) => (
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
                    {(equalities.length > 0 ? equalities : [{}]).map((item, index) => (
                        <div className='add-form-input-area' key={index}>
                            <div>
                                <InputLabel
                                    label="Model Persamaan"
                                    icon={<Box className='input-icon' />}
                                    value={item.model || ""}
                                    onChange={(e) => handleChange(index, "model", e.target.value)}
                                />
                            </div>
                            <div>
                                <InputLabel
                                    label="Acc"
                                    icon={<KeyRound className='input-icon' />}
                                    value={item.acc || ""}
                                    onChange={(e) => handleChange(index, "acc", e.target.value)}
                                />
                            </div>
                            <div>
                                <InputLabel
                                    label="Deskripsi"
                                    icon={<Calculator className='input-icon' />}
                                    value={item.description || ""}
                                    onChange={(e) => handleChange(index, "description", e.target.value)}
                                />
                            </div>
                        </div>
                    ))}
                </div>

            )}

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
                    onclick={handlEditEquality}
                />
            </div>

            <div>
                <ConfirmationModal
                    title="Persamaan"
                    isOpen={openModal}
                    onClose={() => setOpenModal(false)}
                    onclick={handleDeleteEquality}
                />
            </div>
        </div>
    )
}

export default DetailsEquality;
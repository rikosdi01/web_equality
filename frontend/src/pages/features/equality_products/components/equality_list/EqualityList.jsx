import { Edit, Trash2 } from 'lucide-react';
import './EqualityList.css';
import { useEffect, useState } from 'react';
import Formatting from '../../../../../utils/format/Formatting';
import parse from 'html-react-parser';
import { Tooltip } from 'react-tooltip'
import { useNavigate } from 'react-router-dom';
import EqualityProductsRepository from '../../../../../repository/EqualityProductsRepository';
import ConfirmationModal from '../../../../../components/modal/confirmation_modal/ConfirmationModal';
import axios from 'axios';
import { useToast } from '../../../../../context/ToastContext';
import { useAccessToken } from '../../../../../context/AccessTokenContext';

const API_URL = import.meta.env.VITE_API_URL;

const EqualityList = ({ data, autoExpand = false, isLoading }) => {
    const { showToast } = useToast();
    const navigate = useNavigate();
    const [expanded, setExpanded] = useState(autoExpand);
    const [activeTooltipId, setActiveTooltipId] = useState(null);  // Track active tooltip
    const [openModal, setOpenModal] = useState(false);
    const { accessToken } = useAccessToken(); // langsung reactive!

    const handleToggleModal = () => {
        setOpenModal(!openModal);
    }

    // Sync autoExpand ke state expanded jika berubah
    useEffect(() => {
        setExpanded(autoExpand);
    }, [autoExpand]);

    const toggleExpanded = () => setExpanded(!expanded);

    // Konversi nilai 'equality' dari object jadi array (kalau bentuknya {1: {...}, 2: {...}})
    const equalityItems = data.equality ? Object.values(data.equality).filter(e => typeof e === 'object') : [];

    const handleTooltipHover = (tooltipId) => {
        setActiveTooltipId(tooltipId);  // Set the active tooltip when hovered
    };

    const handleTooltipLeave = () => {
        setActiveTooltipId(null);  // Reset the active tooltip when mouse leaves
    };

    const handleDetailsEquality = (id) => {
        navigate(`/equality-products/${id}`)
    }

    const handleDeleteEquality = async () => {
        try {
            // Gantilah URL dengan endpoint yang sesuai
            await axios.delete(`${API_URL}/equalities/${data.id}`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`, // Jika menggunakan token otentikasi
                }
            });

            showToast('berhasil', 'Persamaan berhasil dihapus');
        } catch (error) {
            console.error("Gagal menghapus Persamaan", error);
            showToast('gagal', 'Persamaan gagal dihapus');
        }
    };


    return (
        <div
            className={`equality-products-list ${expanded ? 'expanded' : ''}`}
            onClick={
                Array.isArray(data.equality) && data.equality.length > 0 && !openModal
                    ? toggleExpanded
                    : undefined
            }
        >
            <div className="equality-products-list-right">
                {data.individual && (
                    <>
                        <div
                            id={`individual-tooltip-${data.id}`}
                            className="equality-products-individual"
                            style={{ cursor: 'pointer' }}
                            onMouseEnter={() => handleTooltipHover(`individual-tooltip-${data.id}`)}
                            onMouseLeave={handleTooltipLeave}
                        >
                            Tersendiri
                        </div>
                        <Tooltip
                            anchorSelect={`#individual-tooltip-${data.id}`}
                            place="bottom"
                            style={{
                                whiteSpace: 'pre-line',
                                zIndex: activeTooltipId === `individual-tooltip-${data.id}` ? 9999 : 1, // Increase z-index for active tooltip
                            }}
                        >
                            {`Acc: ${data.individual.acc || '-'}\nUser: ${data.individual.user || '-'}\nDeskripsi: ${data.individual.description || '-'}\nTanggal: ${Formatting.formatDatePostgres(data.individual.updated_at)}`}
                        </Tooltip>
                    </>
                )}
                {Formatting.formatCurrencyIDR(data.het)}
            </div>

            <div className='equality-products-type'>
                Tipe: {
                    data?._formatted?.type
                        ? parse(data._formatted.type)
                        : data.type
                }
            </div>
            <div>
                Model: {
                    data?._formatted?.model
                        ? parse(data._formatted.model)
                        : data.model
                }
            </div>

            <div className='equality-products-date'>
                Tanggal: {Formatting.formatDatePostgres(data.created_at)}
            </div>

            {data.important && (
                <div className='equality-products-important'>{data.important}</div>
            )}

            <div className='equality-products-icon'>
                <Edit
                    className='equality-products-icon-edit'
                    size={22}
                    onClick={(e) => {
                        e.stopPropagation(); // Supaya tidak trigger toggleExpanded
                        handleDetailsEquality(data.id);
                    }}
                />

                <Trash2
                    className='equality-products-icon-trash'
                    size={22}
                    onClick={(e) => {
                        e.stopPropagation(); // Supaya tidak trigger toggleExpanded
                        handleToggleModal();
                    }}
                />
            </div>

            {expanded && equalityItems.length > 0 && (
                <div className='equality-products-list-expanded'>
                    <div className='equality-products-list-subtitle'>Persamaan:</div>
                    <div className='equality-products-list-details'>

                        {equalityItems.map((item, index) => {
                            const tooltipId = `tooltip-${data.objectID || data.id}-${index}`;
                            const tooltipText = `
                                Acc: ${item.acc || '-'}
                                User: ${item.user || '-'}
                                Deskripsi: ${item.description || '-'}
                                Tanggal: ${Formatting.formatDatePostgres(item.updated_at)}
                            `;

                            return (
                                <div key={index}>
                                    <div
                                        id={tooltipId}
                                        className="equality-products-list-item"
                                        style={{ cursor: 'pointer', textDecoration: 'underline dotted' }}
                                        onMouseEnter={() => handleTooltipHover(tooltipId)}
                                        onMouseLeave={handleTooltipLeave}
                                    >
                                        {data?._formatted?.equality?.[index]?.model
                                            ? parse(data._formatted.equality[index].model)
                                            : item?.model || 'Tanpa model'}
                                    </div>
                                    <Tooltip
                                        anchorSelect={`#${tooltipId}`}
                                        place="bottom"
                                        style={{
                                            whiteSpace: 'pre-line',
                                            zIndex: activeTooltipId === tooltipId ? 9999 : 1, // Increase z-index for active tooltip
                                        }}
                                    >
                                        {tooltipText.trim()}
                                    </Tooltip>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

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

export default EqualityList;

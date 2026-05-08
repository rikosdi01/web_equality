import { Box, CalendarDays, Search } from 'lucide-react';
import ContentHeader from '../../../components/content_header/ContentHeader';
import InputField from '../../../components/input/input_field/InputField';
import './SalesProducts.css'
import Dropdown from '../../../components/select/Dropdown';
import { useState } from 'react';

const SalesProducts = () => {
    const [selectedId, setSelectedId] = useState('Semua');

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

    return (
        <div className="equality-products">
            <ContentHeader title={"Penjualan Barang"} enableBack={false} />

            <div className='sales-products-header'>
                <InputField label={"Cari..."} icon={<Search className='input-icon' />} />
                <InputField label={"Periode"} icon={<CalendarDays className='input-icon' />} />
            </div>

            <div className='sales-products-header-secondary'>
            <Dropdown
                icon={<Box className='input-icon' />}
                selectedId={selectedId}
                setSelectedId={setSelectedId}
                values={mutationStatus}
                width="200px"
            />
            </div>

            <table>
                <thead>
                    <tr>
                        <th>Nama Item</th>
                        <th>Kategori Item</th>
                        <th>Tahun 2023</th>
                        <th>Tahun 2024</th>
                        <th>Tahun 2025</th>
                        <th>Penjualan 3 bulan</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>As Kick Stater Beat</td>
                        <td>As Kick Stater</td>
                        <td>50</td>
                        <td>55</td>
                        <td>45</td>
                        <td>50</td>
                    </tr>
                    <tr>
                        <td>As Kick Stater Beat Fi</td>
                        <td>As Kick Stater</td>
                        <td>86</td>
                        <td>54</td>
                        <td>78</td>
                        <td>73</td>
                    </tr>
                </tbody>
            </table>
        </div>
    )
}

export default SalesProducts;
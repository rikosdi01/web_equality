import { Plus, Search } from 'lucide-react';
import ContentHeader from '../../../components/content_header/ContentHeader';
import InputField from '../../../components/input/input_field/InputField';
import './Items.css';
import { useEffect, useState } from 'react';
// import { searchEqualityProducts } from '../../../api/SearchEqualityProducts';
import ActionButton from '../../../components/button/actionbutton/ActionButton';
import { useNavigate } from 'react-router-dom';
import searchEqualityProducts from '../../../api/SearchEqualityProducts';
import { useAccessToken } from '../../../context/AccessTokenContext';
import { useItems } from '../../../utils/hooks/useItems';

const Items = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchTriggered, setSearchTriggered] = useState(false);
  const { accessToken } = useAccessToken();

  const { items, isLoading } = useItems();

  const navigate = useNavigate();

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setSearchResults(items);
      setSearchTriggered(false); // reset trigger
      setIsSearching(false);
    } else {
      const delayDebounce = setTimeout(async () => {
        setIsSearching(true);
        try {
          const results = await searchEqualityProducts(searchTerm, accessToken);
          setSearchResults(results);
          setSearchTriggered(true); // trigger expansion
        } catch (error) {
          console.error('Backend search error:', error);
          setSearchResults([]);
          setSearchTriggered(false);
        } finally {
          setIsSearching(false);
        }
      }, 500);

      return () => clearTimeout(delayDebounce);
    }
  }, [searchTerm, items]);

  const navigationToCreateItem = () => {
    navigate('/items/new')
  }

    const navigationToDetailItem = (id) => {
    navigate(`/items/${id}`)
  }

  return (
    <div className="equality-products">
      <ContentHeader title={"Master Item"} enableBack={false} />

      <div className='equality-products-action'>
        <ActionButton
          title="Item"
          icon={<Plus size={16} />}
          padding='8px 12px'
          fontSize='14px'
          onclick={navigationToCreateItem}
        />
      </div>

      <div className='equality-products-search'>
        <InputField
          label="Cari Item"
          icon={<Search className='input-icon' />}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className='table-container'>
        <table>
          <thead>
            <tr>
              <th>Tipe</th>
              <th>Model</th>
              <th>HET</th>
              <th>Kemasan Item</th>
              <th>Isi Item</th>
              <th>Satuan Item</th>
              <th>Penjualan</th>
              <th>Induk</th>
            </tr>
          </thead>
          <tbody>
            {(searchTriggered ? searchResults : items)?.map((item, index) => (
              <tr key={index} onClick={() => navigationToDetailItem(item.id)}>
                <td>{item.type} {item.merk}</td>
                <td>{item.model}</td>
                <td>{`Rp. ${Number(item.het).toLocaleString('id-ID')}`}</td>
                <td>{item.product_packaging}</td>
                <td>{item.product_content}</td>
                <td>{item.product_set}</td>
                <td>-</td>
                <td>Persamaan ke-{item.id}</td>
              </tr>
            ))}
          </tbody>

        </table>
      </div>

    </div>
  );
}

export default Items;
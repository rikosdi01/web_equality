import { Plus, Search } from 'lucide-react';
import ContentHeader from '../../../components/content_header/ContentHeader';
import InputField from '../../../components/input/input_field/InputField';
import './EqualityProducts.css';
import EqualityList from './components/equality_list/EqualityList';
import { useEffect, useState } from 'react';
// import { searchEqualityProducts } from '../../../api/SearchEqualityProducts';
import ActionButton from '../../../components/button/actionbutton/ActionButton';
import { useNavigate } from 'react-router-dom';
import { useEqualities } from '../../../utils/hooks/useEqualities';
import searchEqualityProducts from '../../../api/SearchEqualityProducts';
import { useAccessToken } from '../../../context/AccessTokenContext';

const EqualityProducts = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchTriggered, setSearchTriggered] = useState(false);
  const { accessToken } = useAccessToken(); 

  const { equalities, isLoading } = useEqualities();

  const navigate = useNavigate();

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setSearchResults(equalities);
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
  }, [searchTerm, equalities]);  

  const navigationToCreateEquality = () => {
    navigate('/equality-products/new')
  }

  return (
    <div className="equality-products">
      <ContentHeader title={"Persamaan Barang"} enableBack={false} />

      <div className='equality-products-action'>
        <ActionButton
          title="Persamaan"
          icon={<Plus size={16} />}
          padding='8px 12px'
          fontSize='14px'
          onclick={navigationToCreateEquality}
        />
      </div>

      <div className='equality-products-search'>
        <InputField
          label="Cari Persamaan"
          icon={<Search className='input-icon' />}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="equality-products-content">
        {searchResults.map((equality) => (
          <EqualityList
            key={equality.objectID || equality.id}  // gunakan objectID jika ada, jika tidak gunakan id
            data={equality}
            autoExpand={searchTriggered} // Akan true hanya saat sedang mencari
            searchResults={searchResults}
            isLoading={isLoading}
          />
        ))}
      </div>

    </div>
  );
}

export default EqualityProducts;
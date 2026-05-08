import { useHistoryEquality } from '../../../context/HistoryEqualityContext';
import HistoryList from './components/HistoryList';
import './Recent.css';

const Recent = () => {
    const { historyEqualities, isLoading } = useHistoryEquality();
    return (
        <div className='recent-wrapper'>
            <HistoryList historyEqualities={historyEqualities} />
        </div>
    );
};

export default Recent;

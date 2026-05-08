import './HistoryList.css';

const formatDate = (timestamp) => {
    const date = new Date(timestamp.seconds * 1000);
    return date.toLocaleString('id-ID', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
};

const HistoryList = ({ historyEqualities }) => {
    const timeline = historyEqualities.map((item) => {
        const { type, createdAt, core, equality, acc, description, user, newText, oldText } = item;

        let text = null;
        switch (type) {
            case 'Add':
                text = (
                    <>
                        Ditambahkan <span className="induk-name">{core}</span> sebagai <strong>(Induk)</strong>{' '}
                        <hr />
                        {user && <>Oleh: <span className="user">{user}</span></>}
                        {acc && <>Acc: <span className="acc">{acc}</span></>}
                    </>
                );
                break;
            case 'AddSub':
                text = (
                    <>
                        Ditambahkan <span className="sub-induk-name">{equality}</span> sebagai <strong>(Sub-Induk)</strong>
                        <hr />
                        Dari: <span className="induk-name">{core}</span>{' '}
                        <div>{user && <>Oleh: <span className="user">{user}</span></>}</div>
                        <div>{acc && <>Acc: <span className="acc">{acc}</span></>}</div>
                        {description && <> Keterangan: <span className="deskripsi">{description}</span></>}
                    </>
                );
                break;
            case 'Edit':
                text = (
                    <>
                        Diedit <span className="induk-name">{core}</span>{' '}
                        <hr />
                        <div className="edit-list">
                            {
                                item.editted.map((edit, i) => (
                                    <div key={i}>
                                        {`${edit.typeField} : `}
                                        <span className={edit.typeField.toLowerCase()}>{edit.oldText || '(Kosong)'}</span> →{' '}
                                        <span className={edit.typeField.toLowerCase()}>{edit.newText || '(Kosong)'}</span>
                                    </div>
                                ))
                            }
                        </div>
                        <div>{user && <>Oleh: <span className="user">{user}</span></>}</div>
                    </>
                );
                break;
            case 'EditSub':
                text = (
                    <>
                        Sub-Induk <span className="sub-induk-name">{equality}</span> dari induk <span className="induk-name">{core}</span> diubah
                        <hr />
                        <div className="edit-list">
                            {
                                item.editted.map((edit, i) => (
                                    <div key={i}>
                                        {`${edit.typeField} : `}
                                        <span className={edit.typeField.toLowerCase()}>{edit.oldText || '(Kosong)'}</span> →{' '}
                                        <span className={edit.typeField.toLowerCase()}>{edit.newText || '(Kosong)'}</span>
                                    </div>
                                ))
                            }
                        </div>
                        <div>{user && <>Oleh: <span className="user">{user}</span></>}</div>
                    </>
                );
                break;

            case 'Delete':
                text = (
                    <>
                        Induk <span className="induk-name">{core}</span> dihapus
                        <hr />
                        <div>{user && <>Oleh: <span className="user">{user}</span></>}</div>
                        {description && <>Keterangan: <span className="deskripsi">{description}</span></>}
                    </>
                );
                break;
            case 'DeleteSub':
                text = (
                    <>
                        Sub-Induk <span className="sub-induk-name">{equality}</span> dari induk <span className="induk-name">{core}</span> dihapus{' '}
                        <hr />
                        <div>{user && <>Oleh: <span className="user">{user}</span></>}</div>
                        <div>{acc && <>Acc: <span className="acc">{acc}</span></>}</div>
                        {description && <>Keterangan: <span className="deskripsi">{description}</span></>}
                    </>
                );
                break;
            case 'Individual':
                text = (
                    <>
                        <span className="induk-name">{core}</span> diset sebagai <strong>(Tersendiri)</strong>{' '}
                        <hr />
                        <div>{user && <>Oleh: <span className="user">{user}</span></>}</div>
                        {acc && <>Acc: <span className="acc">{acc}</span></>}
                        {description && <>Keterangan: <span className="deskripsi">{description}</span></>}
                    </>
                );
                break;
            default:
                text = <>Aktivitas tidak dikenali</>;
        }

        return {
            date: createdAt,
            type,
            text,
        };
    });

    // Urutkan berdasarkan tanggal terbaru
    const sortedTimeline = timeline.sort((a, b) => b.date.seconds - a.date.seconds);

    return (
        <div className="recent-container">
            {sortedTimeline.map((item, index) => (
                <div key={index} className={`recent-item ${item.type}`}>
                    <div className="recent-item-date">{formatDate(item.date)}</div>
                    {item.text}
                </div>
            ))}
        </div>
    );
};

export default HistoryList;

import { useNavigate } from 'react-router-dom';
import './ContentHeader.css'
import { ArrowLeft, Printer } from 'lucide-react';
import React from "react";

const ContentHeader = ({ title, enableTrailing = false, enableBack = true, trailingIcon, trailingLabel, trailingClick }) => {
    const navigate = useNavigate();

    const handleBackPage = () => {
        navigate(-1);
    };

    return (
        <div className='content-header'>
            {enableBack && (
                <button className="back-page" onClick={handleBackPage}>
                    <span><ArrowLeft size={20} /></span>
                    Kembali
                </button>
            )}

            <div className='content-title'>{title}</div>

            {enableTrailing && (
                <button className="trailing-content" onClick={trailingClick}>
                    <span>{trailingIcon}</span>
                    {trailingLabel}
                </button>
            )}
        </div>
    )
}

export default ContentHeader;
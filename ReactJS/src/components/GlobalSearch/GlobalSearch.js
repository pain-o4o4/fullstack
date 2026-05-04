import React, { useState, useEffect, useRef } from 'react';
import { useDebouncedCallback } from 'use-debounce';
import axios from 'axios'; // We use the instance if it exported 'isCancel', but axios.isCancel is on default axios
import { searchGlobal } from '../../services/userService';
import './GlobalSearch.scss';
import { FormattedMessage } from 'react-intl';
import { useNavigate } from 'react-router-dom';

const GlobalSearch = ({ isOpen, onClose }) => {
    const navigate = useNavigate();
    const [keyword, setKeyword] = useState('');
    const [results, setResults] = useState({ doctors: [], clinics: [], specialties: [], handbooks: [] });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const controllerRef = useRef(null);
    const isComposingRef = useRef(false);
    const searchRef = useRef(null);
    const inputRef = useRef(null);

    // Focus input when modal opens
    useEffect(() => {
        if (isOpen && inputRef.current) {
            inputRef.current.focus();
            document.body.style.overflow = 'hidden'; // Prevent scrolling
        } else {
            document.body.style.overflow = 'unset';
        }

        return () => { document.body.style.overflow = 'unset'; };
    }, [isOpen]);

    // Click outside to close
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                onClose();
            }
        };
        const handleKeyDown = (event) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
            document.addEventListener('keydown', handleKeyDown);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [isOpen, onClose]);

    // Cleanup AbortController on unmount
    useEffect(() => {
        return () => {
            if (controllerRef.current) controllerRef.current.abort();
        };
    }, []);

    const handleSearch = useDebouncedCallback(async (kw) => {
        const trimmedKeyword = kw.trim();
        if (trimmedKeyword.length < 2) {
            setResults({ doctors: [], clinics: [], specialties: [], handbooks: [] });
            setIsLoading(false);
            return;
        }

        if (controllerRef.current) controllerRef.current.abort();
        controllerRef.current = new AbortController();

        try {
            setIsLoading(true);
            setError('');
            const res = await searchGlobal(trimmedKeyword, controllerRef.current.signal);
            if (res && res.errCode === 0) {
                setResults(res.data);
            }
        } catch (err) {
            if (axios.isCancel(err)) return; // Bị abort chủ động
            setError('Có lỗi xảy ra, vui lòng thử lại.');
        } finally {
            setIsLoading(false);
        }
    }, 300);

    const onChangeInput = (e) => {
        const value = e.target.value;
        setKeyword(value);
        if (!isComposingRef.current) {
            if (value.trim().length >= 2) setIsLoading(true);
            handleSearch(value);
        }
    };

    const handleResultClick = (type, item) => {
        onClose();
        if (type === 'doctor') {
            navigate(`/detail-doctor/${item.id}`);
        } else if (type === 'clinic') {
            navigate(`/detail-clinic/${item.id}`);
        } else if (type === 'specialty') {
            navigate(`/detail-specialty/${item.id}`);
        } else if (type === 'handbook') {
            navigate(`/detail-handbook/${item.id}`);
        }
    };

    if (!isOpen) return null;

    const isEmpty = !isLoading && keyword.trim().length >= 2 &&
        results.doctors.length === 0 &&
        results.clinics.length === 0 &&
        results.specialties.length === 0 &&
        results.handbooks.length === 0;

    return (
        <div className="global-search-container" ref={searchRef}>
            <div className="search-header">
                <i className="fas fa-search search-icon"></i>
                <input
                    ref={inputRef}
                    type="text"
                    placeholder="Search by keyword or phrase"
                    value={keyword}
                    onChange={onChangeInput}
                    onCompositionStart={() => isComposingRef.current = true}
                    onCompositionEnd={(e) => {
                        isComposingRef.current = false;
                        onChangeInput(e);
                    }}
                />
                {isLoading && <i className="fas fa-spinner fa-spin loading-icon"></i>}
                <button className="close-btn" onClick={onClose}><i className="fas fa-times"></i></button>
            </div>

            {(error || isEmpty || (!isEmpty && keyword.trim().length >= 2)) && keyword.trim().length >= 2 && (
                <div className="search-dropdown">
                    <div className="search-results">
                        {error && <div className="error-state">{error}</div>}

                        {isEmpty && !error && (
                            <div className="empty-state">
                                <i className="far fa-folder-open"></i>
                                <p>Không tìm thấy kết quả cho "{keyword}"</p>
                            </div>
                        )}

                        {!isEmpty && (
                            <div className="results-list">
                            {results.specialties.length > 0 && (
                                <div className="result-group">
                                    <div className="group-title">Chuyên khoa</div>
                                    {results.specialties.map(item => (
                                        <div key={item.id} className="result-item" onClick={() => handleResultClick('specialty', item)}>
                                            <div className="item-img" style={{ backgroundImage: `url(${item.image})` }}></div>
                                            <div className="item-info">
                                                <div className="item-name">{item.name}</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {results.clinics.length > 0 && (
                                <div className="result-group">
                                    <div className="group-title">Phòng khám</div>
                                    {results.clinics.map(item => (
                                        <div key={item.id} className="result-item" onClick={() => handleResultClick('clinic', item)}>
                                            <div className="item-img" style={{ backgroundImage: `url(${item.image})` }}></div>
                                            <div className="item-info">
                                                <div className="item-name">{item.name}</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {results.doctors.length > 0 && (
                                <div className="result-group">
                                    <div className="group-title">Bác sĩ</div>
                                    {results.doctors.map(item => (
                                        <div key={item.id} className="result-item" onClick={() => handleResultClick('doctor', item)}>
                                            <div className="item-img doctor-img" style={{ backgroundImage: `url(${item.image})` }}></div>
                                            <div className="item-info">
                                                <div className="item-name">{item.lastName} {item.firstName}</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {results.handbooks.length > 0 && (
                                <div className="result-group">
                                    <div className="group-title">Cẩm nang</div>
                                    {results.handbooks.map(item => (
                                        <div key={item.id} className="result-item" onClick={() => handleResultClick('handbook', item)}>
                                            <div className="item-img" style={{ backgroundImage: `url(${item.image})` }}></div>
                                            <div className="item-info">
                                                <div className="item-name">{item.name}</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default GlobalSearch;

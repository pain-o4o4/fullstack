import React, { Component, createRef } from 'react';
import { searchGlobal } from '../../services/userService';
import './GlobalSearch.scss';
import { withRouter } from '../Navigator';

class GlobalSearch extends Component {
    constructor(props) {
        super(props);
        this.state = {
            keyword: '',
            results: { doctors: [], clinics: [], specialties: [], handbooks: [] },
            isLoading: false,
            error: '',
            searchedKeyword: '' // Lưu từ khóa thực tế đã gọi API xong
        };
        this.searchRef = createRef();
        this.inputRef = createRef();
        this.controllerRef = null;
        this.debounceTimer = null;
    }

    // ─── Lifecycle ─────────────────────────────────────────────────────────────

    componentDidMount() {
        document.addEventListener('mousedown', this.handleClickOutside);
        document.addEventListener('keydown', this.handleKeyDown);
    }

    componentDidUpdate(prevProps) {
        // Focus input khi mở
        if (!prevProps.isOpen && this.props.isOpen) {
            if (this.inputRef.current) this.inputRef.current.focus();
            document.body.style.overflow = 'hidden';
        }

        // Restore scroll khi đóng
        if (prevProps.isOpen && !this.props.isOpen) {
            document.body.style.overflow = 'unset';
            this.setState({
                keyword: '',
                results: { doctors: [], clinics: [], specialties: [], handbooks: [] },
                isLoading: false,
                error: '',
                searchedKeyword: ''
            });
        }
    }

    componentWillUnmount() {
        document.removeEventListener('mousedown', this.handleClickOutside);
        document.removeEventListener('keydown', this.handleKeyDown);
        document.body.style.overflow = 'unset';
        if (this.controllerRef) this.controllerRef.abort();
        if (this.debounceTimer) clearTimeout(this.debounceTimer);
    }

    // ─── Event Handlers ────────────────────────────────────────────────────────

    handleClickOutside = (event) => {
        if (this.searchRef.current && !this.searchRef.current.contains(event.target)) {
            if (this.props.onClose) {
                this.props.onClose();
            } else if (this.props.isHero) {
                this.setState({
                    keyword: '',
                    results: { doctors: [], clinics: [], specialties: [], handbooks: [] },
                    searchedKeyword: ''
                });
            }
        }
    };

    handleKeyDown = (event) => {
        if (event.key === 'Escape') {
            if (this.props.onClose) {
                this.props.onClose();
            } else if (this.props.isHero) {
                this.setState({
                    keyword: '',
                    results: { doctors: [], clinics: [], specialties: [], handbooks: [] },
                    searchedKeyword: ''
                });
            }
        }
    };

    onChangeInput = (e) => {
        const value = e.target.value;
        this.setState({ keyword: value });

        if (value.trim().length >= 2) this.setState({ isLoading: true });
        this.runDebouncedSearch(value);
    };

    runDebouncedSearch = (value) => {
        if (this.debounceTimer) clearTimeout(this.debounceTimer);
        this.debounceTimer = setTimeout(() => {
            this.handleSearch(value);
        }, 300);
    };

    handleSearch = async (kw) => {
        const trimmedKeyword = kw.trim();
        if (trimmedKeyword.length < 2) {
            this.setState({
                results: { doctors: [], clinics: [], specialties: [], handbooks: [] },
                isLoading: false,
                searchedKeyword: ''
            });
            return;
        }

        if (this.controllerRef) this.controllerRef.abort();
        this.controllerRef = new AbortController();

        try {
            this.setState({ isLoading: true, error: '' });
            const res = await searchGlobal(trimmedKeyword, this.controllerRef.signal);
            if (res && res.errCode === 0) {
                // Lọc handbook ra khỏi kết quả tìm kiếm
                const handbooks = (res.data.handbooks || []).filter(item =>
                    item.name !== 'Chính sách bảo mật' && item.name !== 'Điều khoản sử dụng'
                );
                this.setState({
                    results: { ...res.data, handbooks },
                    isLoading: false,
                    searchedKeyword: trimmedKeyword
                });
            }
        } catch (err) {
            if (err && (err.name === 'AbortError' || err.name === 'CanceledError')) return;
            this.setState({ error: 'Có lỗi xảy ra, vui lòng thử lại.', isLoading: false });
        }
    };

    handleResultClick = (type, item) => {
        if (this.props.onClose) this.props.onClose();
        if (type === 'doctor') {
            this.props.navigate(`/detail-doctor/${item.id}`);
        } else if (type === 'clinic') {
            this.props.navigate(`/detail-clinic/${item.id}`);
        } else if (type === 'specialty') {
            this.props.navigate(`/detail-specialty/${item.id}`);
        } else if (type === 'handbook') {
            this.props.navigate(`/detail-handbook/${item.id}`);
        }
    };

    // ─── Render ────────────────────────────────────────────────────────────────

    render() {
        const { isHero, onClose } = this.props;
        const { keyword, results, isLoading, error, searchedKeyword } = this.state;

        if (!isHero && !this.props.isOpen) return null;

        const isEmpty = !isLoading &&
            keyword.trim().length >= 2 &&
            keyword.trim().toLowerCase() === searchedKeyword.toLowerCase() && // Chỉ rỗng khi từ khóa gõ trùng khớp với từ khóa đã được API trả về kết quả
            results.doctors.length === 0 &&
            results.clinics.length === 0 &&
            results.specialties.length === 0 &&
            results.handbooks.length === 0;

        const hasResults = !isEmpty && keyword.trim().length >= 2;
        const showDropdown = keyword.trim().length >= 2;

        return (
            <div className={`global-search-container ${isHero ? 'hero-mode' : ''}`} ref={this.searchRef}>
                <div className="search-header">
                    <i className="fas fa-search search-icon"></i>
                    <input
                        ref={this.inputRef}
                        type="text"
                        placeholder="Tìm kiếm theo từ khóa hoặc cụm từ"
                        value={keyword}
                        onChange={this.onChangeInput}
                    />
                    {isLoading && <i className="fas fa-spinner fa-spin loading-icon"></i>}
                    {!isHero && (
                        <button className="close-btn" onClick={onClose}>
                            <i className="fas fa-times"></i>
                        </button>
                    )}
                </div>

                {showDropdown && (
                    <div className="search-dropdown">
                        <div className="search-results">
                            {error && <div className="error-state">{error}</div>}

                            {isEmpty && !error && (
                                <div className="empty-state">
                                    <i className="far fa-folder-open"></i>
                                    <p>Không tìm thấy kết quả cho "{keyword}"</p>
                                </div>
                            )}

                            {hasResults && (
                                <div className="results-list">
                                    {results.specialties.length > 0 && (
                                        <div className="result-group">
                                            <div className="group-title">Chuyên khoa</div>
                                            {results.specialties.map(item => (
                                                <div key={item.id} className="result-item" onClick={() => this.handleResultClick('specialty', item)}>
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
                                            <div className="group-title">Bệnh viện</div>
                                            {results.clinics.map(item => (
                                                <div key={item.id} className="result-item" onClick={() => this.handleResultClick('clinic', item)}>
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
                                                <div key={item.id} className="result-item" onClick={() => this.handleResultClick('doctor', item)}>
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
                                                <div key={item.id} className="result-item" onClick={() => this.handleResultClick('handbook', item)}>
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
    }
}

export default withRouter(GlobalSearch);

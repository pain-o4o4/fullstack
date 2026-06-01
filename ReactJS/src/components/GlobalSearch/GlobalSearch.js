import React, { Component, createRef } from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import { searchGlobal, saveSearchHistoryApi, getSearchHistoryApi, deleteSearchHistoryItemApi, clearSearchHistoryApi } from '../../services/adminSystemService';
import { getAllSpecialtyService } from '../../services/specialtyService';
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
            searchedKeyword: '',
            isMobile: window.innerWidth <= 1024,
            categories: [],
            categoriesLoading: false,
            searchHistory: [],
            historyLoading: false,
            isFocused: false
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
        window.addEventListener('resize', this.handleResize);
        this.loadCategories();
        this.loadSearchHistory();
    }

    loadCategories = async () => {
        this.setState({ categoriesLoading: true });
        try {
            const res = await getAllSpecialtyService();
            if (res && res.errCode === 0 && Array.isArray(res.data)) {
                this.setState({ categories: res.data.slice(0, 6), categoriesLoading: false });
            } else {
                this.setState({ categoriesLoading: false });
            }
        } catch {
            this.setState({ categoriesLoading: false });
        }
    };

    componentDidUpdate(prevProps) {
        if (!prevProps.isOpen && this.props.isOpen) {
            if (this.inputRef.current) this.inputRef.current.focus();
            if (this.state.isMobile) document.body.style.overflow = 'hidden';
            this.loadSearchHistory();
        }
        if (prevProps.isOpen && !this.props.isOpen) {
            document.body.style.overflow = 'unset';
            this.setState({
                keyword: '',
                results: { doctors: [], clinics: [], specialties: [], handbooks: [] },
                isLoading: false,
                error: '',
                searchedKeyword: '',
                isFocused: false
            });
        }
        if (prevProps.userInfo !== this.props.userInfo) {
            this.loadSearchHistory();
        }
    }

    componentWillUnmount() {
        document.removeEventListener('mousedown', this.handleClickOutside);
        document.removeEventListener('keydown', this.handleKeyDown);
        window.removeEventListener('resize', this.handleResize);
        document.body.style.overflow = 'unset';
        if (this.controllerRef) this.controllerRef.abort();
        if (this.debounceTimer) clearTimeout(this.debounceTimer);
    }

    handleResize = () => {
        this.setState({ isMobile: window.innerWidth <= 1024 });
    };

    // ─── Search History Functions ────────────────────────────────────────────────

    loadSearchHistory = async () => {
        const { userInfo } = this.props;
        if (!userInfo || !userInfo.id) return;
        this.setState({ historyLoading: true });
        try {
            const res = await getSearchHistoryApi(userInfo.id);
            if (res && res.errCode === 0) {
                this.setState({ searchHistory: res.data || [], historyLoading: false });
            } else {
                this.setState({ historyLoading: false });
            }
        } catch (e) {
            console.error("Lỗi tải lịch sử tìm kiếm:", e);
            this.setState({ historyLoading: false });
        }
    };

    saveSearch = async (kw) => {
        const { userInfo } = this.props;
        if (!userInfo || !userInfo.id || !kw || !kw.trim()) return;
        try {
            await saveSearchHistoryApi(userInfo.id, kw.trim());
            this.loadSearchHistory();
        } catch (e) {
            console.error("Lỗi lưu lịch sử tìm kiếm:", e);
        }
    };

    handleDeleteHistory = async (e, id) => {
        e.stopPropagation();
        const { userInfo } = this.props;
        if (!userInfo || !userInfo.id) return;
        try {
            const res = await deleteSearchHistoryItemApi(userInfo.id, id);
            if (res && res.errCode === 0) {
                this.loadSearchHistory();
            }
        } catch (err) {
            console.error("Lỗi xóa lịch sử tìm kiếm:", err);
        }
    };

    handleClearHistory = async (e) => {
        e.stopPropagation();
        const { userInfo } = this.props;
        if (!userInfo || !userInfo.id) return;
        try {
            const res = await clearSearchHistoryApi(userInfo.id);
            if (res && res.errCode === 0) {
                this.setState({ searchHistory: [] });
            }
        } catch (err) {
            console.error("Lỗi xóa toàn bộ lịch sử:", err);
        }
    };

    handleHistoryClick = (kw) => {
        this.setState({ keyword: kw, isFocused: false });
        this.setState({ isLoading: true });
        this.handleSearch(kw);
        this.saveSearch(kw);
    };

    // ─── Event Handlers ────────────────────────────────────────────────────────

    handleClickOutside = (event) => {
        if (this.searchRef.current && !this.searchRef.current.contains(event.target)) {
            this.setState({ isFocused: false });
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
            this.setState({ isFocused: false });
            if (this.props.onClose) this.props.onClose();
            else if (this.props.isHero) {
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
        if (this.state.keyword.trim()) {
            this.saveSearch(this.state.keyword);
        }
        if (this.props.onClose) this.props.onClose();
        if (type === 'doctor') this.props.navigate(`/detail-doctor/${item.id}`);
        else if (type === 'clinic') this.props.navigate(`/detail-clinic/${item.id}`);
        else if (type === 'specialty') this.props.navigate(`/detail-specialty/${item.id}`);
        else if (type === 'handbook') this.props.navigate(`/detail-handbook/${item.id}`);
    };

    handleClose = () => {
        document.body.style.overflow = 'unset';
        this.setState({ isFocused: false });
        if (this.props.onClose) this.props.onClose();
    };

    // ─── Render helpers ────────────────────────────────────────────────────────

    renderSearchHistory() {
        const { searchHistory, historyLoading } = this.state;
        if (historyLoading) return null;
        if (!searchHistory || searchHistory.length === 0) return null;

        return (
            <div className="gs-history-section">
                <div className="gs-history-header">
                    <span className="gs-history-title"><i className="far fa-clock"></i> Lịch sử tìm kiếm</span>
                    <button className="gs-clear-all-btn" onClick={this.handleClearHistory}>Xóa tất cả</button>
                </div>
                <div className="gs-history-list">
                    {searchHistory.map(item => (
                        <div key={item.id} className="gs-history-item" onClick={() => this.handleHistoryClick(item.keyword)}>
                            <span className="gs-history-text">{item.keyword}</span>
                            <button className="gs-delete-item-btn" onClick={(e) => this.handleDeleteHistory(e, item.id)}>
                                <i className="fas fa-times"></i>
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    renderCategoriesSection() {
        const { categories, categoriesLoading } = this.state;
        return (
            <div className="gs-section">
                <div className="gs-section-title">Chuyên khoa phổ biến</div>
                <div className="gs-categories-grid">
                    {categoriesLoading ? (
                        // Skeleton loading
                        Array(6).fill(null).map((_, idx) => (
                            <div key={idx} className="gs-category-card gs-skeleton">
                                <div className="gs-cat-skeleton-img"></div>
                                <div className="gs-cat-skeleton-text"></div>
                            </div>
                        ))
                    ) : (
                        categories.map((cat) => (
                            <div
                                key={cat.id}
                                className="gs-category-card"
                                onClick={() => {
                                    if (this.props.onClose) this.props.onClose();
                                    this.props.navigate(`/detail-specialty/${cat.id}`);
                                }}
                            >
                                {cat.image ? (
                                    <div
                                        className="gs-cat-img"
                                        style={{ backgroundImage: `url(${cat.image})` }}
                                    ></div>
                                ) : (
                                    <div className="gs-cat-icon">
                                        <i className="fas fa-notes-medical"></i>
                                    </div>
                                )}
                                <span>{cat.name}</span>
                            </div>
                        ))
                    )}
                </div>
            </div>
        );
    }

    renderMobileEmptyState() {
        return (
            <div className="gs-mobile-empty">
                {/* Hiển thị Lịch sử tìm kiếm ở mobile */}
                {this.renderSearchHistory()}
                {this.renderCategoriesSection()}
            </div>
        );
    }

    renderResults() {
        const { keyword, results, isLoading, error, searchedKeyword, isMobile } = this.state;

        if (keyword.trim().length < 2) {
            if (isMobile) {
                return (
                    <div className="gs-mobile-empty">
                        {this.renderSearchHistory()}
                        {this.renderCategoriesSection()}
                    </div>
                );
            } else {
                return (
                    <div className="search-results">
                        <div className="gs-mobile-empty">
                            {this.renderSearchHistory()}
                            {this.renderCategoriesSection()}
                        </div>
                    </div>
                );
            }
        }

        const hasData = results.doctors.length > 0 ||
            results.clinics.length > 0 ||
            results.specialties.length > 0 ||
            results.handbooks.length > 0;

        const isEmpty = !isLoading &&
            keyword.trim().length >= 2 &&
            keyword.trim().toLowerCase() === searchedKeyword.toLowerCase() &&
            !hasData;

        return (
            <div className="search-results">
                {error && <div className="error-state">{error}</div>}

                {isLoading && (
                    <div className="gs-loading-state">
                        <i className="fas fa-spinner fa-spin"></i>
                        <span>Đang tìm kiếm...</span>
                    </div>
                )}

                {isEmpty && !error && !isLoading && (
                    <div className="empty-state">
                        <i className="far fa-folder-open"></i>
                        <p>Không tìm thấy kết quả cho "{keyword}"</p>
                    </div>
                )}

                {hasData && (
                    <div className="results-list">
                        {results.specialties.length > 0 && (
                            <div className="result-group">
                                <div className="group-title">Chuyên khoa</div>
                                {results.specialties.map(item => (
                                    <div key={item.id} className="result-item" onClick={() => this.handleResultClick('specialty', item)}>
                                        <div className="item-img" style={{ backgroundImage: `url(${item.image})` }}></div>
                                        <div className="item-info"><div className="item-name">{item.name}</div></div>
                                        <i className="fas fa-chevron-right arrow-icon"></i>
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
                                        <div className="item-info"><div className="item-name">{item.name}</div></div>
                                        <i className="fas fa-chevron-right arrow-icon"></i>
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
                                        <div className="item-info"><div className="item-name">{item.lastName} {item.firstName}</div></div>
                                        <i className="fas fa-chevron-right arrow-icon"></i>
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
                                        <div className="item-info"><div className="item-name">{item.name}</div></div>
                                        <i className="fas fa-chevron-right arrow-icon"></i>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        );
    }

    // ─── Render ────────────────────────────────────────────────────────────────

    render() {
        const { isHero, onClose } = this.props;
        const { keyword, isMobile } = this.state;

        if (!isHero && !this.props.isOpen) return null;

        const showDropdown = keyword.trim().length >= 2 || this.state.isFocused;

        // Mobile / Tablet — full-screen takeover via Portal (bypass backdrop-filter stacking context)
        if (isMobile && !isHero) {
            const overlay = (
                <div className="gs-mobile-overlay" ref={this.searchRef}>
                    <div className="gs-mobile-header">
                        <div className="gs-mobile-search-bar">
                            <i className="fas fa-search"></i>
                            <input
                                ref={this.inputRef}
                                type="text"
                                placeholder="Tìm kiếm bác sĩ, bệnh viện..."
                                value={keyword}
                                onChange={this.onChangeInput}
                                onFocus={() => this.setState({ isFocused: true })}
                                autoFocus
                            />
                            {keyword.length > 0 && (
                                <button
                                    className="gs-clear-btn"
                                    onClick={() => this.setState({ keyword: '', results: { doctors: [], clinics: [], specialties: [], handbooks: [] }, searchedKeyword: '' })}
                                >
                                    <i className="fas fa-times-circle"></i>
                                </button>
                            )}
                        </div>
                        <button className="gs-cancel-btn" onClick={this.handleClose}>Hủy</button>
                    </div>

                    <div className="gs-mobile-body">
                        {showDropdown ? this.renderResults() : this.renderMobileEmptyState()}
                    </div>
                </div>
            );
            return ReactDOM.createPortal(overlay, document.body);
        }

        // Desktop — inline inside header
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
                        onFocus={() => this.setState({ isFocused: true })}
                    />
                    {this.state.isLoading && <i className="fas fa-spinner fa-spin loading-icon"></i>}
                    {!isHero && (
                        <button className="close-btn" onClick={onClose}>
                            <i className="fas fa-times"></i>
                        </button>
                    )}
                </div>

                {showDropdown && (
                    <div className="search-dropdown">
                        {this.renderResults()}
                    </div>
                )}
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        userInfo: state.user.userInfo
    };
};

export default connect(mapStateToProps)(withRouter(GlobalSearch));

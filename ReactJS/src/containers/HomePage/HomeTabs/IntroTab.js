import React, { Component } from 'react';
import { withRouter } from '../../../components/Navigator';
import { getAllDoctorsService, getAllClinicService, getAllUsers, getAllCodeService } from '../../../services/userService';
import './IntroTab.scss';



class IntroTab extends Component {
    constructor(props) {
        super(props);
        this.cardRefs = [];
        this.state = {
            numDoctors: 5000,
            numClinics: 50,
            numUsers: 200000,
            satisfaction: 99,
            listProvinces: ['HN', 'ĐN', 'HCM', 'HP', 'CT']
        };
    }

    async componentDidMount() {
        try {
            let [resDoctors, resClinics, resUsers, resProvinces] = await Promise.all([
                getAllDoctorsService(),
                getAllClinicService(),
                getAllUsers('ALL'),
                getAllCodeService('PROVINCE')
            ]);

            if (resDoctors && resDoctors.errCode === 0) {
                this.setState({ numDoctors: resDoctors.data.length });
            }

            if (resClinics && resClinics.errCode === 0) {
                this.setState({ numClinics: resClinics.data.length });
            }

            if (resUsers && resUsers.errCode === 0) {
                this.setState({ numUsers: resUsers.users.length });
            }

            if (resProvinces && resProvinces.errCode === 0 && resClinics && resClinics.errCode === 0) {
                const clinics = resClinics.data;
                const provincesData = resProvinces.data;

                // Lọc và đếm số lượng phòng khám thực tế ở từng tỉnh
                let provinces = provincesData.map(prov => {
                    let searchKeywords = [prov.valueVi];
                    if (prov.valueVi === 'Hồ Chí Minh') searchKeywords.push('TP.HCM', 'HCM', 'Hồ Chí Minh');
                    if (prov.valueVi === 'Hà Nội') searchKeywords.push('HN', 'Hà Nội');
                    if (prov.valueVi === 'Đà Nẵng') searchKeywords.push('ĐN', 'Đà Nẵng');

                    let count = clinics.filter(c => {
                        if (!c.address) return false;
                        return searchKeywords.some(kw => c.address.includes(kw));
                    }).length;

                    let label = prov.valueVi;
                    if (label === 'Hồ Chí Minh') label = 'HCM';
                    else if (label === 'Hà Nội') label = 'HN';
                    else if (label === 'Đà Nẵng') label = 'ĐN';
                    else if (label === 'Cần Thơ') label = 'CT';
                    else if (label === 'Hải Phòng') label = 'HP';
                    else {
                        // Lấy các chữ cái đầu tiên (Ví dụ: Bình Dương -> BD)
                        label = label.split(' ').map(w => w.charAt(0)).join('').toUpperCase();
                    }

                    return {
                        id: prov.keyMap,
                        label: label,
                        fullName: prov.valueVi,
                        count: count
                    };
                })
                    .filter(p => p.count > 0)
                    .sort((a, b) => b.count - a.count)
                    .slice(0, 6);

                this.setState({ listProvinces: provinces });
            }
        } catch (e) {
            console.error(e);
        }
    }

    formatNumber = (num, suffix = '+') => {
        if (num >= 1000) {
            return (num / 1000).toFixed(1) + 'K' + suffix;
        }
        return num + suffix;
    };

    handleMouseMove = (e, index) => {
        const card = this.cardRefs[index];
        if (!card) return;
        const rect = card.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width - 0.5) * 10;
        const y = ((e.clientY - rect.top) / rect.height - 0.5) * -10;
        card.style.transform = `perspective(900px) rotateX(${y}deg) rotateY(${x}deg) translateY(-6px)`;
    };

    handleMouseLeave = (index) => {
        const card = this.cardRefs[index];
        if (!card) return;
        card.style.transform = 'perspective(900px) rotateX(0deg) rotateY(0deg) translateY(0)';
    };

    render() {
        const { numDoctors, numClinics, numUsers, satisfaction, listProvinces } = this.state;

        const dynamicFeatures = [
            {
                tag: '24/7',
                title: 'Đặt lịch trực tuyến',
                desc: `Kết nối với hơn ${this.formatNumber(numDoctors, '')} bác sĩ chuyên khoa. Đặt lịch mọi lúc chỉ trong 60 giây.`,
                accent: '#0071e3',
            },
            {
                tag: 'Bảo mật',
                title: 'Mã hoá đầu cuối',
                desc: 'Hồ sơ sức khỏe điện tử được bảo vệ nghiêm ngặt theo tiêu chuẩn quốc tế ISO 27001.',
                accent: '#34c759',
            },
            {
                tag: 'Tức thì',
                title: 'Xác nhận lịch hẹn',
                desc: `Hỗ trợ ${this.formatNumber(numClinics, '')} bệnh viện. Nhận thông báo xác nhận tức thì qua SMS/Email.`,
                accent: '#ff9500',
            },
            {
                tag: 'AI',
                title: 'Trợ lý Gemini',
                desc: 'Tư vấn triệu chứng thông minh và gợi ý chuyên khoa phù hợp nhất dựa trên AI.',
                accent: '#7c3aed',
                isAI: true,
            },
        ];

        return (
            <div className="intro-tab">
                {/* Stats Row */}
                <div className="intro-stats-row">
                    <div className="intro-stat-item">
                        <div className="stat-number">{this.formatNumber(numDoctors)}</div>
                        <div className="stat-label">Bác sĩ chuyên khoa</div>
                    </div>
                    <div className="intro-stat-item">
                        <div className="stat-number">{this.formatNumber(numClinics)}</div>
                        <div className="stat-label">Bệnh viện đối tác</div>
                    </div>
                    <div className="intro-stat-item">
                        <div className="stat-number">{this.formatNumber(numUsers)}</div>
                        <div className="stat-label">Bệnh nhân tin dùng</div>
                    </div>
                    <div className="intro-stat-item">
                        <div className="stat-number">{satisfaction}%</div>
                        <div className="stat-label">Tỷ lệ hài lòng</div>
                    </div>
                </div>

                {/* Bento Grid */}
                <div className="intro-bento-grid">
                    {/* Hero card */}
                    <div className="bento-card bento-hero">
                        <div className="bento-hero-text">
                            {/* <div className="bento-hero-eyebrow">Nền tảng y tế số</div> */}
                            <h2>Chăm sóc sức khỏe<br />theo cách của bạn.</h2>
                            <p>Mạng lưới {numClinics} bệnh viện uy tín. Đặt lịch, tư vấn, theo dõi — tất cả trong một nơi.</p>
                            <button
                                className="bento-cta"
                                onClick={() => this.props.navigate('/select-service')}
                            >
                                Đặt lịch ngay <i className="fas fa-arrow-right"></i>
                            </button>
                        </div>
                        <div className="bento-hero-visual">
                            <div className="hero-ring ring-1"></div>
                            <div className="hero-ring ring-2"></div>
                            <div className="hero-ring ring-3"></div>
                            <div className="hero-core">
                                <i className="fas fa-plus-circle"></i>
                            </div>
                        </div>
                    </div>

                    {/* Feature Cards */}
                    {dynamicFeatures.map((feat, i) => (
                        <div
                            key={i}
                            className={`bento-card bento-feature${feat.isAI ? ' bento-feature--ai' : ''}`}
                            style={{ '--accent': feat.accent }}
                            ref={el => this.cardRefs[i] = feat.isAI ? null : el}
                            onMouseMove={feat.isAI ? undefined : e => this.handleMouseMove(e, i)}
                            onMouseLeave={feat.isAI ? undefined : () => this.handleMouseLeave(i)}
                            onClick={feat.isAI ? () => this.props.navigate('/ai-support') : undefined}
                            title={feat.isAI ? 'Mở trợ lý AI Gemini' : undefined}
                        >
                            <div className="feat-tag">
                                {feat.tag}
                            </div>
                            <div className="feat-title">{feat.title}</div>
                            <div className="feat-desc">{feat.desc}</div>
                            {feat.isAI && (
                                <div className="feat-ai-arrow">Thử ngay <i className="fas fa-arrow-right"></i></div>
                            )}
                        </div>
                    ))}

                    {/* Network Map card */}
                    <div className="bento-card bento-network">
                        <div className="bento-network-label">Mạng lưới</div>
                        <div className="bento-network-title">Toàn quốc</div>
                        <div className="network-nodes">
                            {listProvinces.map((city, i) => (
                                <div
                                    key={i}
                                    className="node"
                                    style={{ '--delay': `${i * 0.18}s` }}
                                    title={`${city.fullName}: ${city.count} cơ sở`}
                                >
                                    <div className="node-dot"></div>
                                    <div className="node-label">
                                        {city.label}
                                        <span className="node-count">{city.count}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default withRouter(IntroTab);

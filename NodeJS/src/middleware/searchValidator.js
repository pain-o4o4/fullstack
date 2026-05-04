const sanitizeKeyword = (keyword) => {
    if (typeof keyword !== 'string') return '';
    // Bắt buộc: escape %, _, \ trước khi đưa vào Op.like
    return keyword.trim().replace(/[%_\\]/g, '\\$&');
};

const validateSearch = (req, res, next) => {
    const { q } = req.query;
    const cleaned = sanitizeKeyword(q);

    if (cleaned.length < 2) {
        return res.json({ errCode: 0, data: { doctors: [], clinics: [], specialties: [], handbooks: [] } });
    }

    req.cleanedKeyword = cleaned; // Truyền xuống service qua req
    next();
};

export { validateSearch };

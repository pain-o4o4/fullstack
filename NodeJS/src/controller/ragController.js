import ragSyncService from "../services/ragSyncService";

const handleSyncRAG = async (req, res) => {
    try {
        let result = await ragSyncService.syncAllToPinecone();
        return res.status(200).json(result);
    } catch (error) {
        console.error(">>> [ragController] handleSyncRAG Error:", error);
        return res.status(500).json({
            errCode: -1,
            errMessage: 'Error from server'
        });
    }
};

export default {
    handleSyncRAG
};

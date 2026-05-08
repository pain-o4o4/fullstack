import chatService from "../services/chatService";

let handleSendMessage = async (req, res) => {
    try {
        let info = await chatService.sendMessage(req.body);

        if (info && info.errCode === 0) {
            let io = req.app.get('io');
            if (io) {
                let plainMessage = info.data.get({ plain: true });
                // Gửi tin nhắn tới cả người nhận và người gửi để cập nhật UI đồng bộ
                io.to(`user_room_${req.body.receiverId}`).emit('receive_message', plainMessage);
                io.to(`user_room_${req.body.senderId}`).emit('receive_message', plainMessage);

                // Yêu cầu cả 2 bên cập nhật lại lịch sử đoạn chat ở sidebar
                io.to(`user_room_${req.body.senderId}`).emit('update_chat_history');
                io.to(`user_room_${req.body.receiverId}`).emit('update_chat_history');
            }
        }

        return res.status(200).json(info);
    } catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        });
    }
};

let handleGetMessages = async (req, res) => {
    try {
        let info = await chatService.getMessages(req.query.senderId, req.query.receiverId);
        return res.status(200).json(info);
    } catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        });
    }
};

let handleGetChatHistorySidebar = async (req, res) => {
    try {
        let info = await chatService.getChatHistorySidebar(req.query.userId);
        return res.status(200).json(info);
    } catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        });
    }
};

let handleSearchUsersForChat = async (req, res) => {
    try {
        let info = await chatService.searchUsersForChat(req.query.userId, req.query.query);
        return res.status(200).json(info);
    } catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        });
    }
};

let handleDeleteConversation = async (req, res) => {
    try {
        let { userId, partnerId } = req.body;
        let info = await chatService.deleteConversation(userId, partnerId);
        
        if (info && info.errCode === 0) {
            let io = req.app.get('io');
            if (io) {
                // Yêu cầu cả 2 bên cập nhật lại lịch sử đoạn chat ở sidebar (để mất dòng chat đó)
                io.to(`user_room_${userId}`).emit('update_chat_history');
                io.to(`user_room_${partnerId}`).emit('update_chat_history');
            }
        }
        
        return res.status(200).json(info);
    } catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        });
    }
};

let handleMarkMessagesAsRead = async (req, res) => {
    try {
        let { userId, partnerId } = req.body;
        let info = await chatService.markMessagesAsRead(userId, partnerId);
        
        if (info && info.errCode === 0) {
            let io = req.app.get('io');
            if (io) {
                // Thông báo để bên kia biết mình đã xem (có thể hiện avatar nhỏ dưới tin nhắn)
                io.to(`user_room_${partnerId}`).emit('messages_marked_as_read', {
                    readerId: userId
                });
                // Cập nhật lại sidebar của mình để mất chấm xanh/số lượng chưa đọc
                io.to(`user_room_${userId}`).emit('update_chat_history');
            }
        }
        
        return res.status(200).json(info);
    } catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        });
    }
};

export default {
    handleSendMessage: handleSendMessage,
    handleGetMessages: handleGetMessages,
    handleGetChatHistorySidebar: handleGetChatHistorySidebar,
    handleSearchUsersForChat: handleSearchUsersForChat,
    handleDeleteConversation: handleDeleteConversation,
    handleMarkMessagesAsRead: handleMarkMessagesAsRead
};

const chatModel = require('../models/chat.Model');
const userModel = require("../models/user.model");
const { RtcTokenBuilder, RtcRole, RtmTokenBuilder, RtmRole } = require('agora-access-token');
exports.userChat = async (req, res) => {
    try {
        let userData = await userModel.findOne({ _id: req.userId });
        if (!userData) {
            return res.status(404).send({ message: "user not found" });
        } else {
            let viewUser = await userModel.findOne({ _id: req.query.userId, userType: userType.USER });
            if (!viewUser) {
                return res.status(404).send({ message: "not found" });
            } else {
                let chatData = await chatModel.findOne({ $and: [{ $or: [{ user1: userData._id }, { user1: viewUser._id }] }, { $or: [{ user2: viewUser._id }, { user2: userData._id }] }] });
                if (chatData) {
                    let messageDetail = {
                        sender: userData._id,
                        userName: userData.name,
                        Type: "TEXT",
                        message: req.query.message,
                        time: Date.now()
                    }
                    let saveChat = await chatModel.findByIdAndUpdate({ _id: chatData._id }, { $push: { messageDetail: messageDetail }, $set: { userName1: userData.name, userName2: viewUser.name, } }, { new: true })
                    if (saveChat) {
                        return res.status(200).send({ status: 200, message: "Message send successfully" });
                    }
                } else {
                    let messageDetail = {
                        sender: userData._id,
                        userName: userData.name,
                        Type: "TEXT",
                        message: req.query.message,
                        time: Date.now()
                    }
                    let obj = {
                        user1: userData._id,
                        user2: viewUser._id,
                        userName1: userData.name,
                        userName2: viewUser.name,
                        messageDetail: messageDetail,
                    }
                    let saveChat = await chatModel.create(obj);
                    if (saveChat) {
                        return res.status(200).send({ status: 200, message: "Message send successfully" });
                    }
                }
            }
        }
    } catch (error) {
        console.log(error);
        res.status(501).json({ status: 501, message: "Oops!!! Error Occurs" })
    }
};
exports.viewChat = async (req, res) => {
    try {
        let user = await userModel.findOne({ _id: req.userId });
        if (!user) {
            return res.status(404).send({ message: "user not found" });
        } else {
            var query = { status: "ACTIVE" };
            let newMessages = []
            return new Promise(async (resolve, reject) => {
                let view = await chatModel.findOne({ _id: req.query._id }).populate("user1 user2", "name").sort({ "messageDetail.time": -1 })
                if (!view) {
                    return res.status(404).send({ message: "not found" });
                } else {
                    view.messageDetail.map(o => {
                        if ((view.user2._id).toString() == user._id) {
                            o.messageStatus = "Read"
                        }
                        newMessages.push(o)
                    })
                    let update = await chatModel.findOneAndUpdate({ _id: view._id }, { $set: { messageDetail: newMessages } }, { new: true });
                    if (update) {
                        let chat = await chatModel.findOne(query).populate("user1 user2", "name").sort({ "messages.time": -1 })
                        return res.status(200).send({ status: 200, message: "Data found successfully" });
                    }
                }
            })
        }
    } catch (error) {
        console.log(error);
        response(res, ErrorCode.WENT_WRONG, { error }, ErrorMessage.SOMETHING_WRONG);
    }
};
exports.chattingHistory = async (req, res) => {
    try {
        let userData = await userModel.findOne({ _id: req.userId });
        if (!userData) {
            return res.status(404).send({ message: "user not found" });
        } else {
            let query = {};
            return new Promise((resolve, reject) => {
                if (req.query.userName != (null || undefined)) {
                    query.$or = [{ userName1: req.query.userName, user2: userData._id, deleteChat2: false }, { userName2: req.query.userName, user1: userData._id, deleteChat1: false }]
                } else {
                    query.$or = [{ user2: userData._id, deleteChat2: false }, { user1: userData._id, deleteChat1: false }]
                }
                let unRead = [];
                chatModel.find(query).sort({ "messages.createdAt": -1 }).populate("user1 user2", "name")
                    .exec((err, result) => {
                        if (err) {
                            response(res, ErrorCode.INTERNAL_ERROR, { err }, ErrorMessage.INTERNAL_ERROR);
                        }
                        else if (result.length == 0) {
                            return res.status(200).send({ status: 200, message: "Data found successfully" });
                        }
                        else {
                            result.map(o => {
                                let count = o.messageDetail.filter(obj => obj.messageStatus == "Unread" && ((o.user2._id).toString() == userData._id)).length
                                let ob = {
                                    status: o.status,
                                    _id: o._id,
                                    user1: o.user1,
                                    user2: o.user2,
                                    messageDetail: o.messageDetail,
                                    totalUnreadMsg: count,
                                    createdAt: o.createdAt,
                                    updatedAt: o.updatedAt,
                                    __v: o.__v
                                }
                                unRead.push(ob)
                            })
                            return res.status(200).send({ status: 200, data: unRead, message: "Data found successfully" });
                        }
                    })
            })
        }
    } catch (error) {
        console.log(error)
        res.status(501).json({ status: 501, message: "Oops!!! Error Occurs" })
    }
};
exports.deleteChat = async (req, res) => {
    try {
        let userData = await userModel.findOne({ _id: req.userId });
        if (!userData) {
            return res.status(404).send({ message: "user not found" });
        } else {
            let view = await chatModel.findOne({ _id: req.query._id });
            if (!view) {
                return res.status(404).send({ message: "not found" });
            } else {
                let deleteChat1, deleteChat2;
                if ((userData._id).toString() == (view.user1).toString()) {
                    deleteChat1 = true
                    deleteChat2 = view.deleteChat2
                }
                if ((userData._id).toString() == (view.user2).toString()) {
                    deleteChat2 = true
                    deleteChat1 = view.deleteChat1
                }
                if ((deleteChat1 == true) && (deleteChat2 == true)) {
                    let chatRes = await chatModel.findByIdAndDelete({ _id: view._id });
                    if (chatRes) {
                        return res.status(200).send({ status: 200, data: view, message: "Data found successfully" });

                    }
                }
                if ((deleteChat1 == true) && (deleteChat2 == false)) {
                    let messageDetail = [];
                    view.messageDetail.map(o => {
                        let messageClear1, messageClear2;
                        if ((userData._id).toString() == (view.user1).toString()) {
                            messageClear1 = true
                            messageClear2 = o.messageClear2
                        }
                        if ((userData._id).toString() == (view.user2).toString()) {
                            messageClear1 = o.messageClear1
                            messageClear2 = true
                        }
                        let obj = {
                            messageClear1: messageClear1,
                            messageClear2: messageClear2,
                            sender: o.sender,
                            userName: o.userName,
                            Type: o.Type,
                            message: o.message,
                            time: o.time,
                            messageStatus: o.messageStatus,
                            _id: o._id
                        }
                        messageDetail.push(obj)
                    });
                    let update = await chatModel.findByIdAndUpdate({ _id: view._id }, { $set: { messageDetail: messageDetail, deleteChat1: deleteChat1, deleteChat2: deleteChat2 } }, { new: true });
                    if (update) {
                        return res.status(200).send({ status: 200, data: update, message: "Data found successfully" });
                    }
                }
                if ((deleteChat1 == false) && (deleteChat2 == true)) {
                    let messageDetail = [];
                    view.messageDetail.map(o => {
                        let messageClear1, messageClear2;
                        if ((userData._id).toString() == (view.user1).toString()) {
                            messageClear1 = true
                            messageClear2 = o.messageClear2
                        }
                        if ((userData._id).toString() == (view.user2).toString()) {
                            messageClear1 = o.messageClear1
                            messageClear2 = true
                        }
                        let obj = {
                            messageClear1: messageClear1,
                            messageClear2: messageClear2,
                            sender: o.sender,
                            userName: o.userName,
                            Type: o.Type,
                            message: o.message,
                            time: o.time,
                            messageStatus: o.messageStatus,
                            _id: o._id
                        }
                        messageDetail.push(obj)
                    });
                    let update = await chatModel.findByIdAndUpdate({ _id: view._id }, { $set: { messageDetail: messageDetail, deleteChat1: deleteChat1, deleteChat2: deleteChat2 } }, { new: true });
                    if (update) {
                        return res.status(200).send({ status: 200, data: update, message: "Data found successfully" });
                    }
                }
            }
        }
    } catch (error) {
        console.log(error);
        res.status(501).json({ status: 501, message: "Oops!!! Error Occurs" })
    }
};
exports.clearChat = async (req, res) => {
    try {
        let userData = await userModel.findOne({ _id: req.userId });
        if (!userData) {
            return res.status(404).send({ message: "user not found" });
        } else {
            let view = await chatModel.findOne({ _id: req.query._id });
            if (!view) {
                return res.status(404).send({ message: "not found" });
            } else {
                let messageDetail = [];
                view.messageDetail.map(o => {
                    let messageClear1, messageClear2;
                    if ((userData._id).toString() == (view.user1).toString()) {
                        messageClear1 = true
                        messageClear2 = o.messageClear2
                    }
                    if ((userData._id).toString() == (view.user2).toString()) {
                        messageClear2 = true
                        messageClear1 = o.messageClear1
                    }
                    let obj = {
                        messageClear1: messageClear1,
                        messageClear2: messageClear2,
                        sender: o.sender,
                        userName: o.userName,
                        Type: o.Type,
                        message: o.message,
                        time: o.time,
                        messageStatus: o.messageStatus,
                        _id: o._id
                    }
                    messageDetail.push(obj)
                });
                let update = await chatModel.findByIdAndUpdate({ _id: view._id }, { $set: { messageDetail: messageDetail } }, { new: true });
                if (update) {
                    return res.status(200).send({ status: 200, data: update, message: "Data found successfully" });
                }
            }
        }
    } catch (error) {
        console.log(error);
        res.status(501).json({ status: 501, message: "Oops!!! Error Occurs" })
    }
};
exports.deleteAllChat = async (req, res) => {
    try {
        let userData = await userModel.findOne({ _id: req.userId });
        if (!userData) {
            return res.status(404).send({ message: "user not found" });
        } else {
            let view = await chatModel.find({ $or: [{ user2: userData._id, deleteChat2: false }, { user1: userData._id, deleteChat1: false }] });
            if (view.length == 0) {
                return res.status(404).send({ message: "not found" });
            } else {
                for (let i = 0; i < view.length; i++) {
                    let count = 0;
                    let deleteChat1, deleteChat2;
                    if ((userData._id).toString() == (view[i].user1).toString()) {
                        deleteChat1 = true
                        deleteChat2 = view[i].deleteChat2
                    }
                    if ((userData._id).toString() == (view[i].user2).toString()) {
                        deleteChat2 = true
                        deleteChat1 = view[i].deleteChat1
                    }
                    if ((deleteChat1 == true) && (deleteChat2 == true)) {
                        await chatModel.findByIdAndDelete({ _id: view[i]._id });
                        count++;
                    }
                    if ((deleteChat1 == true) && (deleteChat2 == false)) {
                        let messageDetail = [];
                        view[i].messageDetail.map(o => {
                            let messageClear1, messageClear2;
                            if ((userData._id).toString() == (view[i].user1).toString()) {
                                messageClear1 = true
                                messageClear2 = o.messageClear2
                            }
                            if ((userData._id).toString() == (view[i].user2).toString()) {
                                messageClear1 = o.messageClear1
                                messageClear2 = true
                            }
                            let obj = {
                                messageClear1: messageClear1,
                                messageClear2: messageClear2,
                                sender: o.sender,
                                userName: o.userName,
                                Type: o.Type,
                                message: o.message,
                                time: o.time,
                                messageStatus: o.messageStatus,
                                _id: o._id
                            }
                            messageDetail.push(obj)
                        });
                        let update = await chatModel.findByIdAndUpdate({ _id: view[i]._id }, { $set: { messageDetail: messageDetail, deleteChat1: deleteChat1, deleteChat2: deleteChat2 } }, { new: true });
                        count++;
                    }
                    if ((deleteChat1 == false) && (deleteChat2 == true)) {
                        let messageDetail = [];
                        view[i].messageDetail.map(o => {
                            let messageClear1, messageClear2;
                            if ((userData._id).toString() == (view[i].user1).toString()) {
                                messageClear1 = true
                                messageClear2 = o.messageClear2
                            }
                            if ((userData._id).toString() == (view[i].user2).toString()) {
                                messageClear1 = o.messageClear1
                                messageClear2 = true
                            }
                            let obj = {
                                messageClear1: messageClear1,
                                messageClear2: messageClear2,
                                sender: o.sender,
                                userName: o.userName,
                                Type: o.Type,
                                message: o.message,
                                time: o.time,
                                messageStatus: o.messageStatus,
                                _id: o._id
                            }
                            messageDetail.push(obj)
                        });
                        let update = await chatModel.findByIdAndUpdate({ _id: view[i]._id }, { $set: { messageDetail: messageDetail, deleteChat1: deleteChat1, deleteChat2: deleteChat2 } }, { new: true });
                        count++;
                    }
                    if (count == view.length) {
                        let view = await chatModel.find({ $or: [{ user2: userData._id, deleteChat2: true }, { user1: userData._id, deleteChat1: true }] });
                        if (view.length == 0) {
                            return res.status(404).send({ message: "not found" });
                        } else {
                            return res.status(200).send({ status: 200, data: view, message: "Data found successfully" });
                        }
                    }
                }

            }
        }
    } catch (error) {
        console.log(error)
        res.status(501).json({ status: 501, message: "Oops!!! Error Occurs" })
    }
};
const APP_ID = 'ee797299edb64b66a72191949804a7c9';
const APP_CERTIFICATE = '96172f4b8e8c45bea5ec75102372c0b9';
exports.generateRTCToken = async (req, res) => {
    const channelName = req.params.channel;
    if (!channelName) {
        return res.status(400).json({ 'error': 'channel is required' });
    }
    let uid = req.params.uid;
    if (!uid || uid === '') {
        return res.status(400).json({ 'error': 'uid is required' });
    }
    let role;
    if (req.params.role === 'publisher') {
        role = RtcRole.PUBLISHER;
    } else if (req.params.role === 'audience') {
        role = RtcRole.SUBSCRIBER
    } else {
        return res.status(400).json({ 'error': 'role is incorrect' });
    }
    let expireTime = req.query.expiry;
    if (!expireTime || expireTime === '') {
        expireTime = 3600;
    } else {
        expireTime = parseInt(expireTime, 10);
    }
    const currentTime = Math.floor(Date.now() / 1000);
    const privilegeExpireTime = currentTime + expireTime;
    let token;
    if (req.params.tokentype === 'userAccount') {
        token = RtcTokenBuilder.buildTokenWithAccount(APP_ID, APP_CERTIFICATE, channelName, uid, role, privilegeExpireTime);
    } else if (req.params.tokentype === 'uid') {
        token = RtcTokenBuilder.buildTokenWithUid(APP_ID, APP_CERTIFICATE, channelName, uid, role, privilegeExpireTime);
    } else {
        return res.status(400).json({ 'error': 'token type is invalid' });
    }
    return res.json({ 'rtcToken': token });
};
exports.generateRTMToken = async (req, res) => {
    let uid = req.params.uid;
    if (!uid || uid === '') {
        return res.status(400).json({ 'error': 'uid is required' });
    }
    let role = RtmRole.Rtm_User;
    let expireTime = req.query.expiry;
    if (!expireTime || expireTime === '') {
        expireTime = 3600;
    } else {
        expireTime = parseInt(expireTime, 10);
    }
    const currentTime = Math.floor(Date.now() / 1000);
    const privilegeExpireTime = currentTime + expireTime;
    const token = RtmTokenBuilder.buildToken(APP_ID, APP_CERTIFICATE, uid, role, privilegeExpireTime);
    return res.json({ 'rtmToken': token });
}
exports.generateRTEToken = async (req, res) => {
    const channelName = req.params.channel;
    if (!channelName) {
        return res.status(400).json({ 'error': 'channel is required' });
    }
    let uid = req.params.uid;
    if (!uid || uid === '') {
        return res.status(400).json({ 'error': 'uid is required' });
    }
    let role;
    if (req.params.role === 'publisher') {
        role = RtcRole.PUBLISHER;
    } else if (req.params.role === 'audience') {
        role = RtcRole.SUBSCRIBER
    } else {
        return res.status(400).json({ 'error': 'role is incorrect' });
    }
    let expireTime = req.query.expiry;
    if (!expireTime || expireTime === '') {
        expireTime = 3600;
    } else {
        expireTime = parseInt(expireTime, 10);
    }
    const currentTime = Math.floor(Date.now() / 1000);
    const privilegeExpireTime = currentTime + expireTime;
    const rtcToken = RtcTokenBuilder.buildTokenWithUid(APP_ID, APP_CERTIFICATE, channelName, uid, role, privilegeExpireTime);
    const rtmToken = RtmTokenBuilder.buildToken(APP_ID, APP_CERTIFICATE, uid, role, privilegeExpireTime);
    return res.json({ 'rtcToken': rtcToken, 'rtmToken': rtmToken });
}
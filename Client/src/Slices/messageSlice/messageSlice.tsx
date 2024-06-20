import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface SelectedMessage { 
    id: string;
    senderId: string;
    receiverId: string;
    message: string;
}

export interface MessageState {
    message: any;
    selectedmessage: SelectedMessage | null;
}

const initialState: MessageState = {
    message:[],
    selectedmessage: null,
};

const messageSlice = createSlice({
    name: "message",
    initialState,
    reducers: {
        setMessageInfo: (state, action: PayloadAction<SelectedMessage | null>) => {
            state.selectedmessage = action.payload;
        },
        addMessage: (state, action: PayloadAction<SelectedMessage>) => {
            state.message.push(action.payload);
        },
        setMessages: (state, action: PayloadAction<SelectedMessage[]>) => {
            state.message = action.payload;
        }
    }
});

export const { setMessageInfo, addMessage, setMessages } = messageSlice.actions;
export default messageSlice.reducer;

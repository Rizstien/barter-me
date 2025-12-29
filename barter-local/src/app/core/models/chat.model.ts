export interface ChatMessage {
    id: string;
    matchId: string;
    senderId: string;
    text: string;
    timestamp: Date;
    isSystem: boolean; // For system notifications like "Match created!"
}

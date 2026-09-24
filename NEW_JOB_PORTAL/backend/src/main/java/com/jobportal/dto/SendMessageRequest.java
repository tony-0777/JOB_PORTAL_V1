package com.jobportal.dto;

public class SendMessageRequest {
    private String clientMsgId;
    private String body;
    private String attachmentUrl;

    public SendMessageRequest() {}

    public SendMessageRequest(String clientMsgId, String body) {
        this.clientMsgId = clientMsgId;
        this.body = body;
    }

    public String getClientMsgId() { return clientMsgId; }
    public void setClientMsgId(String clientMsgId) { this.clientMsgId = clientMsgId; }

    public String getBody() { return body; }
    public void setBody(String body) { this.body = body; }

    public String getAttachmentUrl() { return attachmentUrl; }
    public void setAttachmentUrl(String attachmentUrl) { this.attachmentUrl = attachmentUrl; }
}

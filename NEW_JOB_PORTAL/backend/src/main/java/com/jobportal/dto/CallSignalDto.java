package com.jobportal.dto;

public class CallSignalDto {
    // Type: CALL_REQUEST, RINGING, CALL_ACCEPTED, CALL_DECLINED, CALL_ENDED, OFFER, ANSWER, ICE_CANDIDATE
    private String type;
    private Long callId;
    private Long conversationId;
    private ParticipantDto caller;
    private ParticipantDto callee;
    private String channelName;
    private String sdp;
    private String candidate;
    private boolean isVideo = false;

    public CallSignalDto() {}

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public Long getCallId() { return callId; }
    public void setCallId(Long callId) { this.callId = callId; }

    public Long getConversationId() { return conversationId; }
    public void setConversationId(Long conversationId) { this.conversationId = conversationId; }

    public ParticipantDto getCaller() { return caller; }
    public void setCaller(ParticipantDto caller) { this.caller = caller; }

    public ParticipantDto getCallee() { return callee; }
    public void setCallee(ParticipantDto callee) { this.callee = callee; }

    public String getChannelName() { return channelName; }
    public void setChannelName(String channelName) { this.channelName = channelName; }

    public String getSdp() { return sdp; }
    public void setSdp(String sdp) { this.sdp = sdp; }

    public String getCandidate() { return candidate; }
    public void setCandidate(String candidate) { this.candidate = candidate; }

    public boolean isVideo() { return isVideo; }
    public void setVideo(boolean video) { isVideo = video; }
}

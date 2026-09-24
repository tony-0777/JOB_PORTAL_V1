package com.jobportal;

import com.jobportal.util.ContactMaskingUtil;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

/**
 * Requirement FR-PV-02:
 * Tests that phone numbers and email addresses are masked to [contact hidden].
 */
public class ContactMaskingUtilTest {

    @Test
    void testEmailMasking() {
        String input = "Please write to me at alex.sharma@example.com or hr_desk@techcorp.in for queries.";
        String masked = ContactMaskingUtil.maskSensitiveContacts(input);
        
        assertFalse(masked.contains("alex.sharma@example.com"));
        assertFalse(masked.contains("hr_desk@techcorp.in"));
        assertTrue(masked.contains("[contact hidden]"));
    }

    @Test
    void testPhoneNumberMasking() {
        String input1 = "Call me at +91 9876543210 tomorrow.";
        String masked1 = ContactMaskingUtil.maskSensitiveContacts(input1);
        assertEquals("Call me at [contact hidden] tomorrow.", masked1);

        String input2 = "My WhatsApp number is 98765-43210.";
        String masked2 = ContactMaskingUtil.maskSensitiveContacts(input2);
        assertEquals("My WhatsApp number is [contact hidden].", masked2);

        String input3 = "Contact: 9876543210 or 09876543210.";
        String masked3 = ContactMaskingUtil.maskSensitiveContacts(input3);
        assertFalse(masked3.contains("9876543210"));
    }

    @Test
    void testNonContactNumbersPreserved() {
        String input = "I have 5 years of experience with Java 20 and over 100 completed projects in 2024.";
        String masked = ContactMaskingUtil.maskSensitiveContacts(input);
        assertEquals(input, masked);
    }
}

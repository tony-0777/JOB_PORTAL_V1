package com.jobportal;

import com.jobportal.dto.ParticipantDto;
import org.junit.jupiter.api.Test;

import java.lang.reflect.Field;
import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertFalse;

/**
 * Requirement FR-PV-01:
 * Verifies that ParticipantDto strictly contains zero phone or email fields.
 */
public class PrivacyDtoTest {

    @Test
    void testParticipantDtoExcludesPhoneAndEmail() {
        Field[] fields = ParticipantDto.class.getDeclaredFields();
        List<String> fieldNames = Arrays.stream(fields).map(Field::getName).map(String::toLowerCase).toList();

        assertFalse(fieldNames.contains("email"), "ParticipantDto must NOT contain an email field!");
        assertFalse(fieldNames.contains("phone"), "ParticipantDto must NOT contain a phone field!");
        assertFalse(fieldNames.contains("phonenumber"), "ParticipantDto must NOT contain a phoneNumber field!");
        assertFalse(fieldNames.contains("mobile"), "ParticipantDto must NOT contain a mobile field!");
    }
}

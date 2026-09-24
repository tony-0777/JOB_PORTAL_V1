package com.jobportal.util;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * Requirement FR-PV-02:
 * The system shall mask phone numbers and emails typed in chat messages.
 */
public class ContactMaskingUtil {

    public static final String MASK_REPLACEMENT = "[contact hidden]";

    // Matches standard and international email addresses
    private static final Pattern EMAIL_PATTERN = Pattern.compile(
            "[a-zA-Z0-9_+&*-]+(?:\\.[a-zA-Z0-9_+&*-]+)*@(?:[a-zA-Z0-9-]+\\.)+[a-zA-Z]{2,7}",
            Pattern.CASE_INSENSITIVE
    );

    // Matches various phone formats:
    // e.g., +91 9876543210, +91-9876543210, 9876543210, 98765-43210, 98765 43210, 987-654-3210, 09876543210, (123) 456-7890
    private static final Pattern PHONE_PATTERN = Pattern.compile(
            "(?:\\+?\\d{1,4}[\\s.-]?)?(?:\\(?\\d{2,5}\\)?[\\s.-]?){1,4}\\d{2,5}"
    );

    /**
     * Masks any phone numbers or email addresses in the provided text.
     *
     * @param input Raw text from user
     * @return Sanitized text with contacts replaced by [contact hidden]
     */
    public static String maskSensitiveContacts(String input) {
        if (input == null || input.isBlank()) {
            return input;
        }

        // 1. Mask email addresses first
        String masked = EMAIL_PATTERN.matcher(input).replaceAll(MASK_REPLACEMENT);

        // 2. Mask phone numbers
        Matcher phoneMatcher = PHONE_PATTERN.matcher(masked);
        StringBuilder sb = new StringBuilder();
        while (phoneMatcher.find()) {
            String match = phoneMatcher.group();
            // Check if the matched digits count is at least 7 to avoid masking short numbers (e.g. "year 2024", "job 100")
            long digitCount = match.chars().filter(Character::isDigit).count();
            if (digitCount >= 7) {
                phoneMatcher.appendReplacement(sb, Matcher.quoteReplacement(MASK_REPLACEMENT));
            } else {
                phoneMatcher.appendReplacement(sb, Matcher.quoteReplacement(match));
            }
        }
        phoneMatcher.appendTail(sb);

        return sb.toString();
    }

    /**
     * Returns true if input contains an email or phone number.
     */
    public static boolean containsContactInfo(String input) {
        if (input == null || input.isBlank()) {
            return false;
        }
        if (EMAIL_PATTERN.matcher(input).find()) {
            return true;
        }
        Matcher phoneMatcher = PHONE_PATTERN.matcher(input);
        while (phoneMatcher.find()) {
            String match = phoneMatcher.group();
            long digitCount = match.chars().filter(Character::isDigit).count();
            if (digitCount >= 7) {
                return true;
            }
        }
        return false;
    }
}

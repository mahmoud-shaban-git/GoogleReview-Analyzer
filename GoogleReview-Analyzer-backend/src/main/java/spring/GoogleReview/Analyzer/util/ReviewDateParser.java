package spring.GoogleReview.Analyzer.util;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;

public class ReviewDateParser {

    public static LocalDate parseRelativeDate(String relative) {

        relative = relative.toLowerCase().trim();

        LocalDate today = LocalDate.now();

        if (relative.contains("a week ago")) {
            return today.minusWeeks(1);
        }

        if (relative.contains("week ago") || relative.contains("weeks ago")) {
            int num = extractNumber(relative);
            return today.minusWeeks(num);
        }

        if (relative.contains("day ago") || relative.contains("days ago")) {
            int num = extractNumber(relative);
            return today.minusDays(num);
        }

        if (relative.contains("month ago") || relative.contains("months ago")) {
            int num = extractNumber(relative);
            return today.minusMonths(num);
        }

        // fallback → heutiges Datum
        return today;
    }

    private static int extractNumber(String text) {
        try {
            return Integer.parseInt(text.replaceAll("[^0-9]", ""));
        } catch (Exception e) {
            return 1;
        }
    }
}

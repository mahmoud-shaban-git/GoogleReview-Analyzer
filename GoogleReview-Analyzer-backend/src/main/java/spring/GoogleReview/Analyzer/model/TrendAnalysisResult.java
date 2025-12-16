package spring.GoogleReview.Analyzer.model;

import lombok.Data;

import java.time.LocalDate;
import java.util.Map;

@Data
public class TrendAnalysisResult {

    private Map<LocalDate, Double> averageRatingPerDate;
    private Map<LocalDate, Integer> reviewsCountPerDate;
    private String trendSummary;
}

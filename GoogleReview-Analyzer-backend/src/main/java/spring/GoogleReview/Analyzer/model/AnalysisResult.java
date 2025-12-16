package spring.GoogleReview.Analyzer.model;

import lombok.Data;
import java.util.List;
import java.util.Map;

@Data
public class AnalysisResult {

    private List<String> negative_keywords;
    private List<String> positive_keywords;
    private Map<String, Integer> top_keywords;

    private String summary;

    private Map<String, Map<String, Integer>> categories;

    private Map<String, Integer> monthly_trend;

    private List<FakeReviewEntry> fake_reviews;

    private List<FakeReviewDetail> fakeReviewDetails;
    private int reviewCount;
}


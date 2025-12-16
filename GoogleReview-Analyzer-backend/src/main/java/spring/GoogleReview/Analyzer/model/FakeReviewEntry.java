package spring.GoogleReview.Analyzer.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
public class FakeReviewEntry {

    @JsonProperty("review_id") // ← WICHTIG: mappt review_id → reviewId
    private Long reviewId;

    private double probability;
}

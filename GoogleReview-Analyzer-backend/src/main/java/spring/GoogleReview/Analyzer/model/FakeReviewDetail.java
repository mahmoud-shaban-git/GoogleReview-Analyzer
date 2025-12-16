package spring.GoogleReview.Analyzer.model;

import lombok.Data;

@Data
public class FakeReviewDetail {
    private Long id;
    private String author;
    private int rating;
    private String text;
    private String reviewDate;
    private double probability;
}

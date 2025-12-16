package spring.GoogleReview.Analyzer.controllers;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import spring.GoogleReview.Analyzer.model.Review;
import spring.GoogleReview.Analyzer.repository.ReviewRepository;
import spring.GoogleReview.Analyzer.service.SerpApiReviewService;

import java.util.List;
import java.util.Map;
import java.util.Objects;
@RestController
@RequestMapping("/api/reviews")
@RequiredArgsConstructor
public class ReviewImportController {

    private final SerpApiReviewService serpApiReviewService;
    private final ReviewRepository reviewRepository;

    @PostMapping("/import/{placeId}")
    public List<Review> importReviews(@PathVariable String placeId) {

        List<Map<String, Object>> rawReviews = serpApiReviewService.fetchReviews(placeId);

        List<Review> reviews = rawReviews.stream().map(r -> {

                    Map<String, Object> user = (Map<String, Object>) r.get("user");

                    String externalId = (String) r.get("review_id");

                    if (externalId != null && reviewRepository.existsByExternalId(externalId)) {
                        return null;
                    }

                    Review review = new Review();
                    review.setPlaceId(placeId);
                    review.setExternalId(externalId);

                    review.setAuthor(user != null ? (String) user.get("name") : "Unknown");

                    Object ratingObj = r.get("rating");
                    int rating = (ratingObj instanceof Double d) ? d.intValue() :
                            (ratingObj instanceof Integer i) ? i : 0;

                    review.setRating(rating);
                    review.setText((String) r.getOrDefault("snippet", ""));
                    review.setReviewDate((String) r.getOrDefault("date", "unknown"));

                    return review;

                })
                .filter(Objects::nonNull)
                .toList();

        return reviewRepository.saveAll(reviews);
    }
}

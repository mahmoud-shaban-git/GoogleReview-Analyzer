package spring.GoogleReview.Analyzer.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import spring.GoogleReview.Analyzer.model.Review;
import spring.GoogleReview.Analyzer.repository.ReviewRepository;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class ReviewService {

    private final SerpApiReviewService serpApiReviewService;
    private final ReviewRepository reviewRepository;

    /**
     * Lädt Reviews von der SerpAPI und speichert sie in der Datenbank.
     */
    @Transactional
    public List<Review> fetchAndSaveReviews(String placeId) {
        List<Map<String, Object>> apiReviews = serpApiReviewService.fetchReviews(placeId);

        if (apiReviews == null || apiReviews.isEmpty()) {
            return new ArrayList<>();
        }

        List<Review> savedReviews = new ArrayList<>();

        for (Map<String, Object> apiReview : apiReviews) {
            Review review = mapToReview(apiReview, placeId);

            List<Review> existing = reviewRepository.findByPlaceId(placeId)
                    .stream()
                    .filter(r -> r.getAuthor().equals(review.getAuthor()) &&
                            r.getText().equals(review.getText()))
                    .toList();

            if (existing.isEmpty()) {
                savedReviews.add(reviewRepository.save(review));
            }
        }

        return savedReviews;
    }


    public List<Review> getReviewsFromDb(String placeId) {
        return reviewRepository.findByPlaceId(placeId);
    }


    private Review mapToReview(Map<String, Object> apiReview, String placeId) {
        Review review = new Review();

        review.setPlaceId(placeId);
        review.setAuthor((String) apiReview.getOrDefault("user", "Unknown"));
        review.setRating((int) apiReview.getOrDefault("rating", 0));
        review.setText((String) apiReview.getOrDefault("snippet", ""));
        review.setReviewDate((String) apiReview.getOrDefault("date", ""));

        return review;
    }
}

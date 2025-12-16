package spring.GoogleReview.Analyzer.controllers;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import spring.GoogleReview.Analyzer.model.Review;
import spring.GoogleReview.Analyzer.repository.ReviewRepository;
import spring.GoogleReview.Analyzer.service.SerpApiReviewService;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/reviews")
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewRepository reviewRepository;

    @GetMapping("/{placeId}")
    public List<Review> getReviews(
            @PathVariable String placeId,
            @RequestParam(required = false) String category) {

        List<Review> reviews = reviewRepository.findByPlaceId(placeId);

        if (category == null || category.isBlank())
            return reviews;

        return reviews.stream()
                .filter(r -> matchesCategory(r.getText(), category))
                .toList();
    }

    private boolean matchesCategory(String text, String category) {

        if (text == null) return false;
        text = text.toLowerCase();

        return switch (category) {
            case "service" ->
                    text.contains("service") || text.contains("personal") || text.contains("freund");
            case "food" ->
                    text.contains("essen") || text.contains("lecker") ||
                            text.contains("shawarma") || text.contains("gericht");
            case "price" ->
                    text.contains("preis") || text.contains("teuer") || text.contains("günstig");
            case "ambience" ->
                    text.contains("ambiente") || text.contains("sauber") || text.contains("gemütlich");
            default -> false;
        };
    }
}

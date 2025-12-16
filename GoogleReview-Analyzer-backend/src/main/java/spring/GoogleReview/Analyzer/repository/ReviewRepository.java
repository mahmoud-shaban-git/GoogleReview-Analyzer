package spring.GoogleReview.Analyzer.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import spring.GoogleReview.Analyzer.model.Review;

import java.util.List;

public interface ReviewRepository extends JpaRepository<Review, Long> {

    List<Review> findByPlaceId(String placeId);
    boolean existsByExternalId(String externalId);

}

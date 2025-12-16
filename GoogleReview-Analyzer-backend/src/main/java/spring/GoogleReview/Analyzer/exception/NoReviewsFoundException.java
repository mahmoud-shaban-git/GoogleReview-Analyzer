package spring.GoogleReview.Analyzer.exception;

public class NoReviewsFoundException extends RuntimeException {
    public NoReviewsFoundException(String placeId) {
        super("Keine Reviews gefunden für Place-ID: " + placeId);
    }
}

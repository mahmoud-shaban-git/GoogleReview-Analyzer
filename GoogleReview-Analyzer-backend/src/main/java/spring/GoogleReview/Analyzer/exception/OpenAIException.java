package spring.GoogleReview.Analyzer.exception;

public class OpenAIException extends RuntimeException {
    public OpenAIException(String message) {
        super(message);
    }
}

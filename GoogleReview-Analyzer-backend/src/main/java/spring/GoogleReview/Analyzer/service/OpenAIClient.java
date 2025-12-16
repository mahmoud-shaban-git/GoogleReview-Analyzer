package spring.GoogleReview.Analyzer.service;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.Map;

@Service
@RequiredArgsConstructor
public class OpenAIClient {

    private final WebClient webClient = WebClient.builder()
            .baseUrl("https://api.openai.com/v1")
            .build();

    @Value("${openai.api.key}")
    private String apiKey;

    public String analyze(String prompt) {

        Map<String, Object> requestBody = Map.of(
                "model", "gpt-4.1-mini",
                "messages", new Object[]{
                        Map.of("role", "user", "content", prompt)
                }
        );

        return webClient.post()
                .uri("/chat/completions")
                .header("Authorization", "Bearer " + apiKey)
                .header("Content-Type", "application/json")
                .bodyValue(requestBody)
                .retrieve()
                .bodyToMono(String.class)
                .block();  // synchron
    }
}

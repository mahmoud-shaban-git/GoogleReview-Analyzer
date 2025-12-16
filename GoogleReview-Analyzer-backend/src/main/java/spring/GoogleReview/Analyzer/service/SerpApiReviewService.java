package spring.GoogleReview.Analyzer.service;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
@Service
@RequiredArgsConstructor
public class SerpApiReviewService {

    @Value("${serpapi.key}")
    private String apiKey;

    private static final String BASE_URL =
            "https://serpapi.com/search.json?engine=google_maps_reviews";

    public List<Map<String, Object>> fetchReviews(String placeId) {

        RestTemplate rest = new RestTemplate();
        List<Map<String, Object>> allReviews = new ArrayList<>();

        String nextPageToken = null;

        do {
            String url = BASE_URL +
                    "&place_id=" + placeId +
                    "&hl=de" +
                    "&gl=de" +
                    "&api_key=" + apiKey;

            if (nextPageToken != null) {
                url += "&next_page_token=" + nextPageToken;
            }

            Map response = rest.getForObject(url, Map.class);

            if (response == null || !response.containsKey("reviews")) {
                break;
            }

            List<Map<String, Object>> reviews =
                    (List<Map<String, Object>>) response.get("reviews");

            allReviews.addAll(reviews);

            nextPageToken = response.containsKey("serpapi_pagination")
                    ? (String) ((Map) response.get("serpapi_pagination")).get("next_page_token")
                    : null;

        } while (nextPageToken != null);

        return allReviews;
    }
}





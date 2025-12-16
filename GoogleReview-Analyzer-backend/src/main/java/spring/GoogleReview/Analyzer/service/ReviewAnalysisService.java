package spring.GoogleReview.Analyzer.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import spring.GoogleReview.Analyzer.exception.NoReviewsFoundException;
import spring.GoogleReview.Analyzer.model.*;
import spring.GoogleReview.Analyzer.repository.ReviewRepository;
import spring.GoogleReview.Analyzer.util.ReviewDateParser;

import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReviewAnalysisService {

    private final ReviewRepository reviewRepository;
    private final OpenAIClient openAIClient;

    // -------------------------------------------------------
    // 🔥 TREND ANALYSE
    // -------------------------------------------------------
    public TrendAnalysisResult analyzeTrends(String placeId) {

        List<Review> reviews = reviewRepository.findByPlaceId(placeId);

        if (reviews.isEmpty()) {
            throw new NoReviewsFoundException(placeId);
        }

        Map<LocalDate, List<Review>> grouped = reviews.stream()
                .collect(Collectors.groupingBy(
                        r -> ReviewDateParser.parseRelativeDate(r.getReviewDate())
                ));

        Map<LocalDate, Double> avgRating = grouped.entrySet().stream()
                .collect(Collectors.toMap(
                        Map.Entry::getKey,
                        e -> e.getValue().stream().mapToInt(Review::getRating).average().orElse(0)
                ));

        Map<LocalDate, Integer> count = grouped.entrySet().stream()
                .collect(Collectors.toMap(
                        Map.Entry::getKey,
                        e -> e.getValue().size()
                ));

        String trendSummary = summarizeTrend(avgRating);

        TrendAnalysisResult result = new TrendAnalysisResult();
        result.setAverageRatingPerDate(avgRating);
        result.setReviewsCountPerDate(count);
        result.setTrendSummary(trendSummary);

        return result;
    }

    private String summarizeTrend(Map<LocalDate, Double> data) {

        if (data.size() < 2) return "Nicht genug Daten für Trendanalyse";

        List<Map.Entry<LocalDate, Double>> sorted = data.entrySet().stream()
                .sorted(Map.Entry.comparingByKey())
                .toList();

        double first = sorted.get(0).getValue();
        double last = sorted.get(sorted.size() - 1).getValue();

        if (last > first) return "🔥 Bewertungen steigen";
        if (last < first) return "⚠️ Bewertungen fallen";
        return "➖ Stabil";
    }


    // -------------------------------------------------------
    // 🔥 REVIEW ANALYSE (mit stabiler ID-Zuordnung)
    // -------------------------------------------------------
    public AnalysisResult analyzeReviews(String placeId) throws Exception {

        List<Review> reviews = reviewRepository.findByPlaceId(placeId);

        if (reviews.isEmpty()) {
            throw new NoReviewsFoundException(placeId);
        }

        // -------------------------------------------------------
        // ⭐ WICHTIG: Wir senden OpenAI Reviews MIT ID!
        // -------------------------------------------------------
        StringBuilder sb = new StringBuilder();

        for (Review r : reviews) {
            sb.append("{\"id\": ").append(r.getId())
                    .append(", \"rating\": ").append(r.getRating())
                    .append(", \"text\": \"")
                    .append(r.getText().replace("\"", "'"))
                    .append("\"}\n");
        }

        // -------------------------------------------------------
        // ⭐ OPENAI PROMPT – IDs MÜSSEN GENUTZT WERDEN
        // -------------------------------------------------------
        String prompt = """
Du bist ein professioneller Review-Analyst.

Hier sind die Reviews im Format:
{id: NUMMER, rating: ZAHL, text: "INHALT"}

Du MUSST diese IDs verwenden — du darfst KEINE eigene ID erfinden.

Antworte IMMER als valides JSON:

{
  "negative_keywords": [],
  "positive_keywords": [],
  "top_keywords": {},
  "summary": "",
  "categories": {
    "food": {"positive": 0, "negative": 0},
    "service": {"positive": 0, "negative": 0},
    "ambience": {"positive": 0, "negative": 0},
    "price": {"positive": 0, "negative": 0}
  },
  "monthly_trend": {},
  "fake_reviews": [
    { "review_id": 12, "probability": 0.87 }
  ]
}

#############################################################
### WICHTIGE ANWEISUNGEN — STRIKT EINHALTEN! ###
#############################################################

SUMMARY-REGELN:
- Die Summary muss **zuerst** eine Bewertung der Gesamtsituation enthalten.
- Danach MUSST du eine **NEUE ZEILE** machen.
- Danach MUSST du die Überschrift schreiben:
  "Verbesserungsvorschläge:"
- Direkt darunter MUSST du mindestens **2 Bullet Points** liefern.
- Beispiel (FORMAT IST PFLICHT):
  
  "Verbesserungsvorschläge:
   • Wartezeiten reduzieren
   • Speisekarte erweitern"

KEIN ANDERES FORMAT IST ERLAUBT.

FAKE REVIEW ERKENNUNG:
Markiere nur Reviews als Fake, wenn mehrere klare Spam- oder KI-Muster gleichzeitig auftreten:
- extrem generische Inhalte
- Copy/Paste ähnliche Formulierungen
- widersprüchliche Inhalte
- Werbung oder Spam-Anmutung
- KI-typische Floskeln
- realitätsferne Behauptungen
- nur schlechte Bewertung  ohne Begründungen 

WICHTIG:
- Normale positive Bewertungen dürfen NICHT als Fake markiert werden.
- Nur eindeutige Fälle markieren.
- probability realistisch zwischen 0.50 und 0.90.
- Ein Review ohne Text (nur Sterne) darf NICHT als Fake markiert werden,
  außer es existiert ein klarer Spam-Verdacht (z. B. viele identische Bewertungen
  in sehr kurzer Zeit). Wenn kein Text vorhanden ist, probability = 0.


AUSGABE:
- Nur JSON, keine Erklärungen.
- Keine zusätzlichen Felder.

Reviews:
""" + sb;



        String aiResponse = openAIClient.analyze(prompt);


        String cleanJson = extractJson(aiResponse);

        AnalysisResult result = new ObjectMapper().readValue(cleanJson, AnalysisResult.class);

        List<FakeReviewDetail> details = new ArrayList<>();

        if (result.getFake_reviews() != null) {
            for (FakeReviewEntry entry : result.getFake_reviews()) {

                Review match = reviews.stream()
                        .filter(r -> Objects.equals(r.getId(), entry.getReviewId()))
                        .findFirst()
                        .orElse(null);

                if (match != null) {
                    FakeReviewDetail d = new FakeReviewDetail();
                    d.setId(match.getId());
                    d.setAuthor(match.getAuthor());
                    d.setRating(match.getRating());
                    d.setText(match.getText());
                    d.setReviewDate(match.getReviewDate());
                    d.setProbability(entry.getProbability());
                    details.add(d);
                }
            }
        }

        result.setFakeReviewDetails(details);

        result.setReviewCount(reviews.size());

        return result;
    }


    private String extractJson(String aiResponse) {
        try {
            ObjectMapper mapper = new ObjectMapper();
            var tree = mapper.readTree(aiResponse);
            String content = tree.get("choices").get(0)
                    .get("message").get("content").asText();
            return content.replace("```json", "")
                    .replace("```", "")
                    .trim();
        } catch (Exception e) {
            throw new RuntimeException("Konnte JSON aus AI-Antwort nicht extrahieren:\n" + aiResponse, e);
        }
    }

}

package spring.GoogleReview.Analyzer.controllers;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import spring.GoogleReview.Analyzer.model.AnalysisResult;
import spring.GoogleReview.Analyzer.model.TrendAnalysisResult;
import spring.GoogleReview.Analyzer.service.ReviewAnalysisService;

import javax.validation.constraints.NotBlank;

@RestController
@RequestMapping("/api/analysis")
@RequiredArgsConstructor
public class AnalysisController {

    private final ReviewAnalysisService analysisService;

    @GetMapping("/{placeId}")
    public AnalysisResult analyze(
            @PathVariable
            @NotBlank(message = "Place-ID darf nicht leer sein")
            String placeId
    ) throws Exception {
        return analysisService.analyzeReviews(placeId);
    }

    @GetMapping("/{placeId}/trends")
    public TrendAnalysisResult getTrends(
            @PathVariable
            @NotBlank(message = "Place-ID darf nicht leer sein")
            String placeId
    ) {
        return analysisService.analyzeTrends(placeId);
    }



}

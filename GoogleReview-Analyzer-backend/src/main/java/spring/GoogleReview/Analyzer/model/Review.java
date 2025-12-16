package spring.GoogleReview.Analyzer.model;

import jakarta.persistence.*; // <- WICHTIG: die richtige Annotation
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Review {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String placeId;
    private String author;
    private int rating;

    @Column(columnDefinition = "TEXT")
    private String text;

    private String reviewDate;
    @Column(unique = true)
    private String externalId;
}
